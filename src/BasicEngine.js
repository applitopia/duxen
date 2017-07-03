/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { Map, List, fromJS, is } from 'immutable-sorted';
import CommonEngine from './CommonEngine';

const cast = <T>(value: any): T => (value: T);

export default class SimpleEngine extends CommonEngine implements EngineInterface {

  constructor(schema: Schema) {
    super(schema);
  }

  //
  // Compile the reducer
  //
  reducer(): Reducer {

    const cs:CompiledSchema = this.compiledSchema;

    const failed = (s: string) => {throw new Error("Schema compilation error: "+s)};

    const validateAction = (action: CollAction) => {
      if(!action.collName) {
        failed("Missing collName in action: "+action.toString());
      }

      if(this._getNameType(action.collName) !== 'collection' || !cs.collViews[action.collName]) {
        failed("Unknown collection name: "+action.collName);
      }
    };

    const updateViews = (mutableState: State, state: State, collName: string, collData: CollData): void => {
      const paused = mutableState.getIn(["_state", collName, "paused"]);

      if(paused === true) {
        return;
      }

      const va = cs.collViews[collName];

      for(let i:number=0, length=va.length; i < length; i++) {
        const v = va[i];

        // Prepare props
        const props = {};
        for(let p:string in v.props) {
          const propFn = v.props[p];
          props[p] = propFn(mutableState);
        }
        const oldProps = mutableState.getIn(['_props', v.viewName]);
        const newProps = fromJS(props);
        const oldData = state.get(collName);
        const oldPaused = state.getIn(["_state", collName, "paused"]);
        if(collData !== oldData || !is(oldProps, newProps) || oldPaused !== paused) {
          const newdata = v.recipe(cast(collData.toSeq()), props);

          mutableState.setIn(['_props', v.viewName], newProps);
          mutableState.set(v.viewName, newdata);
        }
      }
    };

    const updateOriginals = (mutableState: State, collName: string, id: StateKey, doc?: CollDocument): void => {
      const collData: CollData = mutableState.getIn(["_state", collName, "originals"]);

      if(collData) {
        if(!collData.has(id)) {
          mutableState.setIn(["_state", collName, "originals", id], doc);
        }
      }
    };

    const reduce = (mutableState: State, state: State, action: Action) => {
      switch (action.type) {
        case 'DUXEN_BATCH': {
          const collAction:BatchAction = cast(action);
          const actions: List<CollAction> = collAction.actions;
          for(let i = 0, len = actions.size; i < len; i++) {
            reduce(mutableState, state, cast(actions.get(i)));
          }
          break;
        }

        case 'DUXEN_INSERT': {
          const collAction:InsertAction = cast(action);
          const collData:CollData = cast(mutableState.get(collAction.collName));

          const newcollData:CollData = collData.set(collAction.id, collAction.doc);

          mutableState.set(collAction.collName, newcollData);

          updateOriginals(mutableState, collAction.collName, collAction.id);
          updateViews(mutableState, state, collAction.collName, newcollData);
          break;
        }

        case 'DUXEN_UPDATE': {
          const collAction:UpdateAction = cast(action);
          const collData:CollData = cast(mutableState.get(collAction.collName));
          const id:StateKey = collAction.id;

          const doc:CollDocument | void = collData.get(id);
          if(!doc) {
            throw new Error("Updating document that does not exist: "+JSON.stringify(id));
          }

          const updDoc:CollDocument = collAction.doc;
          const setDoc:CollDocument = cast(updDoc.get("$set"));
          const unsetDoc:CollDocument = cast(updDoc.get("$unset"));

          let newDoc:CollDocument;
          if(setDoc || unsetDoc) {
            newDoc = doc.withMutations((mutableDoc: CollDocument): void => {
              if(setDoc) {
                setDoc.forEach((v, k) => mutableDoc.set(k, v));
              }
              if(unsetDoc) {
                unsetDoc.forEach((v, k) => mutableDoc.delete(k));
              }
            });
          } else {
            newDoc = updDoc;
          }

          const newcollData:CollData = collData.set(collAction.id, newDoc);
          mutableState.set(collAction.collName, newcollData);

          updateOriginals(mutableState, collAction.collName, id, doc);
          updateViews(mutableState, state, collAction.collName, newcollData);
          break;
        }

        case 'DUXEN_REMOVE': {
          const collAction:RemoveAction = cast(action);
          const collData:CollData = cast(mutableState.get(collAction.collName));
          const id:StateKey = collAction.id;

          const doc:CollDocument | void = collData.get(id);
          if(!doc) {
            throw new Error("Updating document that does not exist: "+JSON.stringify(id));
          }

          const newcollData:CollData = collData.remove(collAction.id);

          mutableState.set(collAction.collName, newcollData);

          updateOriginals(mutableState, collAction.collName, id, doc);
          updateViews(mutableState, state, collAction.collName, newcollData);
          break;
        }

        case 'DUXEN_RESET': {
          const collAction:ResetAction = cast(action);
          const newcollData:CollData = Map();

          mutableState.set(collAction.collName, newcollData);
          mutableState.deleteIn(["_state", collAction.collName, "originals"]);
          updateViews(mutableState, state, collAction.collName, newcollData);
          break;
        }

        case 'DUXEN_PAUSE': {
          const collAction:PauseAction = cast(action);
          mutableState.setIn(["_state", collAction.collName, "paused"], true);
          break;
        }

        case 'DUXEN_RESUME': {
          const collAction:PauseAction = cast(action);
          mutableState.setIn(["_state", collAction.collName, "paused"], false);
          const collData:CollData = cast(mutableState.get(collAction.collName));
          updateViews(mutableState, state, collAction.collName, collData);
          break;
        }

        case 'DUXEN_SAVE': {
          const collAction:PauseAction = cast(action);
          const collData:CollData = cast(mutableState.get(collAction.collName));
          mutableState.setIn(["_state", collAction.collName, "saved"], collData);
          break;
        }

        case 'DUXEN_RESTORE': {
          const collAction:PauseAction = cast(action);
          const collData:CollData = cast(mutableState.getIn(["_state", collAction.collName, "saved"]));
          if(!collData) {
            throw new Error("Restore: nothing was saved")
          }
          mutableState.deleteIn(["_state", collAction.collName, "saved"]);
          mutableState.set(collAction.collName, collData);
          updateViews(mutableState, state, collAction.collName, collData);
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

        default: {
          //
          // Apply value or custom reducer
          //
          let changed:boolean = false;
          const compiledAction:CompiledAction = cs.actions[action.type];
          if(compiledAction) {
            const name:string = compiledAction.name;
            const compiledName:CompiledName = cs.names[name];

            if(!compiledName) {
              throw new Error("Unknown name in action: "+JSON.stringify(action));
            }

            switch(compiledAction.type) {
              case 'value': {
                const valueAction:ValueAction = cast(action);
                const oldValue:StateValue | void = state.getIn(compiledName.path);
                if(oldValue === undefined) {
                  throw Error("Lost value in state:"+name);
                }
                const reducer:ValueReducer = compiledAction.reducer;
                const newValue:StateValue = reducer(oldValue, valueAction);
                if(oldValue !== newValue) {
                  mutableState.setIn(compiledName.path, newValue);
                  changed = true;
                }
                break;
              }
              case 'custom': {
                const customAction:CustomAction = cast(action);
                const reducer:CustomReducer = compiledAction.reducer;
                if(compiledName.path.length > 0) {
                  const subState:State = mutableState.getIn(compiledName.path);
                  if(!subState) {
                    throw new Error("Missing path in state:"+JSON.stringify(compiledName.path));
                  }
                  const mutableSubState:State = subState.asMutable();
                  reducer(mutableSubState, customAction);
                  mutableState.setIn(compiledName.path, mutableSubState);
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

          if(changed)
          for(let name:string in cs.collViews) {
            const collData: CollData = cast(state.get(name));
            updateViews(mutableState, state, name, collData);
          }
          break;
        }
      }
    };

    return (state: State=cs.initState, action: Action) => {
      if(action.collName) {
        validateAction(cast(action));
      }

      return state.withMutations((mutableState: State): void => {
        reduce(mutableState, state, action);
      });
    };
  }
}
