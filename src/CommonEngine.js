/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { List, fromJS } from 'immutable-sorted';
import { compileSchema } from './SchemaCompiler';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: T): T => cast(fromJS(value));

export default class CommonEngine implements EngineInterface {
  compiledSchema: CompiledSchema;
  listeners: Array<(Action)=>void>;

  constructor(schema: Schema) {
    this.compiledSchema = compileSchema(schema);
    this.listeners = [];
  }

  _getNameType(name: string): SchemaEntryType {
    const cs:CompiledSchema = this.compiledSchema;

    const cn:CompiledName = cs.names[name];

    if(!cn) {
      throw new Error("Missing name in schema: "+name);
    }

    return cn.type;
  }

  _verifyName(name: string, type: SchemaEntryType) {
    const cs:CompiledSchema = this.compiledSchema;

    const cn:CompiledName = cs.names[name];

    if(!cn) {
      throw new Error("Missing name in schema: "+name);
    }

    if(cn.type !== type) {
      throw new Error("Not a "+type+": "+name);
    }
  }

  _verifyCollection(collName: string) {
    this._verifyName(collName, 'collection');
  }

  _verifyValueName(valueName: string) {
    this._verifyName(valueName, 'value');
  }

  _verifyCustomName(customName: string) {
    this._verifyName(customName, 'custom');
  }

  _action(action: Action): void {
    for(let i = 0; i < this.listeners.length; i++) {
      const listener:(Action)=>void = this.listeners[i];
      listener(action);
    }
  }

  //
  // Subscribe to all action created by this engine
  //
  // Returns a function to unsubscribe
  //
  subscribe(listener: (Action)=>void): ()=>void {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function.')
    }

    let stillSubscribed = true;

    this.listeners.push(listener);

    return () => {
      if(stillSubscribed) {
        stillSubscribed = false;
        const index:number = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
      }
    };
  }

  //
  // Remove all internal items from the state
  //
  cleanState(state: State, prefix: string = ""): State {
    return state.withMutations((mutableState: State): void => {
      mutableState.delete("_props");
      mutableState.delete("_state");
      mutableState.forEach((v: StateValue, k: string): void => {
        if(this._getNameType(prefix+k) === 'schema') {
          mutableState.set(k, this.cleanState(cast(v), k+"."));
        }
      });
    });
  }

  //
  // Action creators
  //
  batch(collName: string, actions: List<CollAction>): BatchAction {
    this._verifyCollection(collName);
    const action:BatchAction = {
      type: 'DUXEN_BATCH',
      collName,
      actions: List(actions)
    };
    this._action(action);
    return action;
  }

  insert(collName: string, id: StateKey, doc: CollDocument): InsertAction {
    this._verifyCollection(collName);
    id = ensure(id);
    doc = ensure(doc);
    const action:InsertAction = {
      type: 'DUXEN_INSERT',
      collName,
      id,
      doc
    };
    this._action(action);
    return action;
  }

  update(collName: string, id: StateKey, doc: CollDocument): UpdateAction {
    this._verifyCollection(collName);
    id = ensure(id);
    doc = ensure(doc);
    const action:UpdateAction = {
      type: 'DUXEN_UPDATE',
      collName,
      id,
      doc,
    };
    this._action(action);
    return action;
  }

  remove(collName: string, id: StateKey): RemoveAction {
    this._verifyCollection(collName);
    id = ensure(id);
    const action:RemoveAction = {
      type: 'DUXEN_REMOVE',
      collName,
      id,
    };
    this._action(action);
    return action;
  }

  reset(collName: string): ResetAction {
    this._verifyCollection(collName);
    const action:ResetAction = {
      type: 'DUXEN_RESET',
      collName,
    };
    this._action(action);
    return action;
  }

  pause(collName: string): PauseAction {
    this._verifyCollection(collName);
    const action:PauseAction = {
      type: 'DUXEN_PAUSE',
      collName,
    };
    this._action(action);
    return action;
  }

  resume(collName: string): ResumeAction {
    this._verifyCollection(collName);
    const action:ResumeAction = {
      type: 'DUXEN_RESUME',
      collName,
    };
    this._action(action);
    return action;
  }

  save(collName: string): SaveAction {
    this._verifyCollection(collName);
    const action:SaveAction = {
      type: 'DUXEN_SAVE',
      collName,
    };
    this._action(action);
    return action;
  }

  restore(collName: string): RestoreAction {
    this._verifyCollection(collName);
    const action:RestoreAction = {
      type: 'DUXEN_RESTORE',
      collName,
    };
    this._action(action);
    return action;
  }

  saveOriginals(collName: string): SaveOriginalsAction {
    this._verifyCollection(collName);
    const action:SaveOriginalsAction = {
      type: 'DUXEN_SAVE_ORIGINALS',
      collName,
    };
    this._action(action);
    return action;
  }

  retrieveOriginals(collName: string): RetrieveOriginalsAction {
    this._verifyCollection(collName);
    const action:RetrieveOriginalsAction = {
      type: 'DUXEN_RETRIEVE_ORIGINALS',
      collName,
    };
    this._action(action);
    return action;
  }

  value(valueName: string, value: StateValue): ValueAction {
    this._verifyValueName(valueName);

    const cs:CompiledSchema = this.compiledSchema;
    const cn:CompiledName = cs.names[valueName];
    const valueEntry:ValueSchemaEntry = cast(cn.schemaEntry);
    const actionType: CustomActionType = valueEntry.actionType;

    if(!actionType) {
      throw new Error("Missing actionType in value schema: "+JSON.stringify(valueEntry));
    }

    if(valueEntry.action) {
      return valueEntry.action(value);
    }

    value = ensure(value);

    const action:ValueAction = {
      type: cn.prefix+actionType,
      value,
    };
    this._action(action);
    return action;
  }

  custom(customName: string): CustomAction {
    this._verifyCustomName(customName);
    const cs:CompiledSchema = this.compiledSchema;
    const cn:CompiledName = cs.names[customName];
    const customEntry: CustomSchemaEntry = cast(cn.schemaEntry);
    const actionType: CustomActionType = customEntry.actionType;

    if(!actionType) {
      throw new Error("Missing actionType in custom schema: "+JSON.stringify(customEntry));
    }

    if(!customEntry.action) {
      throw new Error("Missing action in custom schema: "+JSON.stringify(customEntry));
    }

    const action:CustomAction = customEntry.action();

    if(action.type !== actionType) {
      throw new Error("Inconsistent custom action type: "+JSON.stringify(action.type)+" vs "+actionType);
    }
    action.type = cn.prefix+actionType;
    this._action(action);
    return action;
  }

  //
  // Compile the reducer
  //
  reducer(): Reducer { throw new Error("Reducer is not implemented in CommonEngine"); }
}
