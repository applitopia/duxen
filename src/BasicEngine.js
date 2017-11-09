/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { Map, List } from 'immutable-sorted';
import CommonEngine from './CommonEngine';

const cast = <T>(value: any): T => (value: T);

export default class BasicEngine extends CommonEngine implements EngineInterface {

  constructor(schema: Schema) {
    super(schema);
  }

  //
  // Compile the reducer
  //
  reducer(): Reducer {

    const cs:CompiledSchema = this._compiledSchema;

    const failed = (s: string) => {throw new Error("Schema compilation error: "+s)};

    const validateAction = (action: CollAction) => {
      if(!action.collName) {
        failed("Missing collName in action: "+action.toString());
      }

      if(this._getNameType(action.collName) !== 'collection') {
        failed("Unknown collection name: "+action.collName);
      }
    };

    const updateDependentsList = (mutableState: State, state: State, deps: Array<string>): void => {

      for(let i:number=0, length=deps.length; i < length; i++) {
        const depName: string = deps[i];
        const dcn:CompiledName = getCompiledName(depName);

        switch(dcn.type) {
          case 'formula': {
            const fcne: FormulaSchemaEntry = cast(dcn.schemaEntry);

            // Prepare props
            const props:Props = {};
            for(let pi:number = 0, len:number = fcne.props.length; pi < len; pi++) {
              const propName: string = fcne.props[pi];
              switch(typeof(propName)) {
                case 'string': {
                  const pcn:CompiledName = getCompiledName(dcn.namePrefix+propName);
                  props[propName] = mutableState.getIn(pcn.path);
                  break;
                }
                default: {
                  throw new Error("Invalid type of propName: "+typeof(propName));
                }
              }
            }
            const newValue: StateValue = fcne.recipe(props);
            mutableState.setIn(dcn.path, newValue);
            break;
          }
          case 'view': {
            const vcne: ViewSchemaEntry = cast(dcn.schemaEntry);
            const scn:CompiledName = getCompiledName(dcn.namePrefix+vcne.sourceName);

            // Prepare props
            const props:Props = {};
            for(let pi:number = 0, len:number = vcne.props.length; pi < len; pi++) {
              const propName: string = vcne.props[pi];
              switch(typeof(propName)) {
                case 'string': {
                  const pcn:CompiledName = getCompiledName(dcn.namePrefix+propName);
                  props[propName] = mutableState.getIn(pcn.path);
                  break;
                }
                default: {
                  throw new Error("Invalid type of propName: "+typeof(propName));
                }
              }
            }
            const newSourceData:CollData = mutableState.getIn(scn.path);

            if(dcn.seqen) {
              const newdata:CollData = dcn.seqen.process(newSourceData, props);

              mutableState.setIn(dcn.path, newdata);
            } else {
              throw new Error("Missing seqen for view: "+scn.name);
            }
            break;
          }
          default: {
            throw new Error("Dependent type not supported: "+dcn.type);
          }
        }
      }
    };

    const updateDependents = (mutableState: State, state: State, cn: CompiledName): void => {
      const isColl:boolean = cn.type == 'collection';
      const paused = isColl ? mutableState.getIn(["_state", cn.name, "paused"]) : false;

      if(paused === true) {
        return;
      }

      const deps:Array<string> =cn.dependents;

      if(!deps) {
        return;
      }

      updateDependentsList(mutableState, state, deps);
    };

    const refresh = (mutableState: State, state: State): void => {
      // Refresh all views
      updateDependentsList(mutableState, state, cs.allDependents);
    };

    const updateOriginals = (mutableState: State, collName: string, id: StateKey, doc?: CollDocument): void => {
      const collData: CollData = mutableState.getIn(["_state", collName, "originals"]);

      if(collData) {
        if(!collData.has(id)) {
          mutableState.setIn(["_state", collName, "originals", id], doc);
        }
      }
    };

    const getCompiledName = (name: string): CompiledName => {
      const cn:CompiledName = cs.names[name];

      if(!cn) {
        throw new Error("Name does not exist in schema: "+name);
      }

      return cn;
    }

    const reduce = (mutableState: State, state: State, action: Action) => {
      switch (action.type) {
        case 'DUXEN_BATCH': {
          const collAction:BatchAction = cast(action);
          const actions:List<CollAction> = collAction.actions;
          for(let i = 0, len = actions.size; i < len; i++) {
            reduce(mutableState, state, cast(actions.get(i)));
          }
          break;
        }

        case 'DUXEN_INSERT': {
          const collAction:InsertAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          const collData:CollData = cast(mutableState.getIn(cn.path));

          const newcollData:CollData = collData.set(collAction.id, collAction.doc);

          mutableState.setIn(cn.path, newcollData);

          updateOriginals(mutableState, collAction.collName, collAction.id);
          updateDependents(mutableState, state, cn);
          break;
        }

        case 'DUXEN_UPDATE': {
          const collAction:UpdateAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          const collData:CollData = cast(mutableState.getIn(cn.path));
          const id:StateKey = collAction.id;

          const doc:CollDocument | void = collData.get(id);
          if(!doc) {
            throw new Error("Updating document that does not exist: "+JSON.stringify(id));
          }

          const updDoc:CollDocument = collAction.doc;
          const setDoc:CollDocument = cast(updDoc.get("$set"));
          const unsetDoc:CollDocument = cast(updDoc.get("$unset"));
          const incDoc:CollDocument = cast(updDoc.get("$inc"));
          const mulDoc:CollDocument = cast(updDoc.get("$mul"));

          let newDoc:CollDocument;
          if(setDoc || unsetDoc || incDoc || mulDoc) {
            newDoc = doc.withMutations((mutableDoc: CollDocument): void => {
              if(setDoc) {
                setDoc.forEach((v, k) => mutableDoc.setIn(k.split('.'), v));
              }
              if(unsetDoc) {
                unsetDoc.forEach((v, k) => mutableDoc.deleteIn(k.split('.')));
              }
              if(incDoc) {
                incDoc.forEach((v, k) => {
                  const keyPath:Array<string> = k.split('.');
                  let val:StateValue = mutableDoc.getIn(keyPath);
                  if(typeof val === 'number') {
                    val += v;
                    mutableDoc.setIn(keyPath, val);
                  }
                });
              }
              if(mulDoc) {
                mulDoc.forEach((v, k) => {
                  const keyPath:Array<string> = k.split('.');
                  let val:StateValue = mutableDoc.getIn(keyPath);
                  if(typeof val === 'number') {
                    val *= v;
                    mutableDoc.setIn(keyPath, val);
                  }
                });
              }
            });
          } else {
            newDoc = updDoc;
          }

          const newcollData:CollData = collData.set(collAction.id, newDoc);
          mutableState.setIn(cn.path, newcollData);

          updateOriginals(mutableState, collAction.collName, id, doc);
          updateDependents(mutableState, state, cn);
          break;
        }

        case 'DUXEN_REMOVE': {
          const collAction:RemoveAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          const collData:CollData = cast(mutableState.getIn(cn.path));
          const id:StateKey = collAction.id;

          const doc:CollDocument | void = collData.get(id);
          if(doc) {
            // Removing a document that exists
            const newcollData:CollData = collData.remove(id);

            mutableState.setIn(cn.path, newcollData);

            updateOriginals(mutableState, collAction.collName, id, doc);
            updateDependents(mutableState, state, cn);
          }
          break;
        }

        case 'DUXEN_RESET': {
          const collAction:ResetAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          const newcollData:CollData = Map();

          mutableState.setIn(cn.path, newcollData);
          mutableState.deleteIn(["_state", collAction.collName, "originals"]);
          updateDependents(mutableState, state, cn);
          break;
        }

        case 'DUXEN_PAUSE': {
          const collAction:PauseAction = cast(action);
          mutableState.setIn(["_state", collAction.collName, "paused"], true);
          break;
        }

        case 'DUXEN_RESUME': {
          const collAction:PauseAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          mutableState.setIn(["_state", collAction.collName, "paused"], false);
          updateDependents(mutableState, state, cn);
          break;
        }

        case 'DUXEN_SAVE': {
          const collAction:PauseAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          const collData:CollData = cast(mutableState.getIn(cn.path));
          mutableState.setIn(["_state", collAction.collName, "saved"], collData);
          break;
        }

        case 'DUXEN_RESTORE': {
          const collAction:PauseAction = cast(action);
          const cn:CompiledName = getCompiledName(collAction.collName);
          const collData:CollData = cast(mutableState.getIn(["_state", collAction.collName, "saved"]));
          if(!collData) {
            throw new Error("Restore: nothing was saved")
          }
          mutableState.deleteIn(["_state", collAction.collName, "saved"]);
          mutableState.setIn(cn.path, collData);
          updateDependents(mutableState, state, cn);
          break;
        }

        case 'DUXEN_SAVE_ORIGINALS': {
          const collAction:SaveOriginalsAction = cast(action);
          const collData:CollData = cast(mutableState.getIn(["_state", collAction.collName, "originals"]));
          if(collData) {
            throw new Error("Save Originals: called twice without retrieve originals")
          }
          mutableState.setIn(["_state", collAction.collName, "originals"], Map());
          break;
        }

        case 'DUXEN_RETRIEVE_ORIGINALS': {
          const collAction:RetrieveOriginalsAction = cast(action);
          const collData:CollData = cast(mutableState.getIn(["_state", collAction.collName, "originals"]));
          if(!collData) {
            throw new Error("Retrieve Originals: called without save originals")
          }
          mutableState.deleteIn(["_state", collAction.collName, "originals"]);
          break;
        }

        case 'DUXEN_REFRESH': {
          refresh(mutableState, state);
          break;
        }

        case 'DUXEN_VALUE': {
          const valueAction:ValueAction = cast(action);
          const cn:CompiledName = getCompiledName(valueAction.valueName);
          const oldValue:?StateValue = state.getIn(cn.path);
          if(oldValue === undefined) {
            throw Error("Lost value in state:"+valueAction.valueName);
          }
          const newValue:StateValue = valueAction.value;
          if(oldValue !== newValue) {
            mutableState.setIn(cn.path, newValue);
            updateDependents(mutableState, state, cn);
          }
          break;
        }

        default: {
          //
          // Apply value or custom reducer
          //
          const compiledAction:CompiledAction = cs.actions[action.type];
          if(compiledAction) {
            const name:string = compiledAction.name;
            const cn:CompiledName = getCompiledName(name);

            switch(compiledAction.type) {
              case 'customValue': {
                const valueAction:ValueAction = cast(action);
                const oldValue:StateValue | void = state.getIn(cn.path);
                if(oldValue === undefined) {
                  throw Error("Lost value in state:"+name);
                }
                const reducer:ValueReducer = compiledAction.reducer;
                const newValue:StateValue = reducer(oldValue, valueAction);
                if(oldValue !== newValue) {
                  mutableState.setIn(cn.path, newValue);
                  updateDependents(mutableState, state, cn);
                }
                break;
              }
              case 'custom': {
                const customAction:CustomAction = cast(action);
                const reducer:CustomReducer = compiledAction.reducer;
                if(cn.path.length > 0) {
                  const subState:State = mutableState.getIn(cn.path);
                  if(!subState) {
                    throw new Error("Missing path in state:"+JSON.stringify(cn.path));
                  }
                  const mutableSubState:State = subState.asMutable();
                  reducer(mutableSubState, customAction);
                  mutableState.setIn(cn.path, mutableSubState);
                } else {
                  reducer(mutableState, customAction);
                }
                break;
              }
              default: {
                throw new Error("CompiledAction.type not supported: "+compiledAction.type);
              }
            }
          }
          break;
        }
      }
    };

    return (state: State, action: Action) => {
      if(state === undefined) {
        state = cs.initState;
        return state.withMutations((mutableState: State): void => {
          state = refresh(mutableState, state);
        });
      }

      if(action.collName) {
        validateAction(cast(action));
      }

      return state.withMutations((mutableState: State): void => {
        reduce(mutableState, state, action);
      });
    };
  }
}
