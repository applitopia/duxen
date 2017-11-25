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
import CommonEngine from './CommonEngine';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: T): T => cast(fromJS(value));

export default class ActionFactory implements ActionFactoryInterface {

  engine: CommonEngine;

  constructor(engine: CommonEngine) {
    this.engine = engine;
  }

  _verifyName(name: string, type: SchemaEntryType) {
    const cs:CompiledSchema = this.engine._compiledSchema;

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

  _verifyCustomValueName(valueName: string) {
    this._verifyName(valueName, 'customValue');
  }

  _verifyCustomName(customName: string) {
    this._verifyName(customName, 'custom');
  }

  // Dispatch an action to listeners
  _action(action: Action): void {
    // Make action immutable
    Object.freeze(action);

    const listeners: Array<(Action) => void> = this.engine._listeners;
    for(let i = 0; i < listeners.length; i++) {
      const listener:Action=>void = listeners[i];
      listener(action);
    }
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

  refresh(): RefreshAction {
    const action:RefreshAction = {
      type: 'DUXEN_REFRESH',
    };
    this._action(action);
    return action;
  }

  value(valueName: string, value: StateValue): ValueAction {
    this._verifyValueName(valueName);

    value = ensure(value);
    const action:ValueAction = {
      type: 'DUXEN_VALUE',
      valueName,
      value,
    };
    this._action(action);
    return action;
  }

  customValue(valueName: string, value: StateValue): CustomValueAction {
    this._verifyCustomValueName(valueName);

    const cs:CompiledSchema = this.engine._compiledSchema;
    const cn:CompiledName = cs.names[valueName];
    const valueEntry:CustomValueSchemaEntry = cast(cn.schemaEntry);
    const actionType: CustomActionType = valueEntry.actionType;

    if(!actionType) {
      throw new Error("Missing actionType in value schema: "+JSON.stringify(valueEntry));
    }

    if(valueEntry.action) {
      const action:CustomValueAction = valueEntry.action(value);
      this._action(action);
      return action;
    }

    value = ensure(value);

    const action:CustomValueAction = {
      type: cn.namePrefix+actionType,
      value,
    };
    this._action(action);
    return action;
  }

  custom(customName: string): CustomAction {
    this._verifyCustomName(customName);
    const cs:CompiledSchema = this.engine._compiledSchema;
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

    if(action.type !== undefined && action.type !== actionType) {
      throw new Error("Inconsistent custom action type: "+JSON.stringify(action.type)+" vs "+actionType);
    }
    action.type = cn.namePrefix+actionType;
    this._action(action);
    return action;
  }

  //
  // Repo Actions
  //

  createBranch(branchName: string): CreateBranchAction {
    const action:CreateBranchAction = {
      type: 'DUXEN_CREATE_BRANCH',
      branchName: branchName,
    };
    this._action(action);
    return action;
  }

  switchBranch(branchName: string): SwitchBranchAction {
    const action:SwitchBranchAction = {
      type: 'DUXEN_SWITCH_BRANCH',
      branchName: branchName,
    };
    this._action(action);
    return action;
  }

  saveBranch(branchName: string): SaveBranchAction {
    const action:SaveBranchAction = {
      type: 'DUXEN_SAVE_BRANCH',
      branchName: branchName,
    };
    this._action(action);
    return action;
  }

  resetBranch(branchName: string): ResetBranchAction {
    const action:ResetBranchAction = {
      type: 'DUXEN_RESET_BRANCH',
      branchName: branchName,
    };
    this._action(action);
    return action;
  }

  removeBranch(branchName: string): RemoveBranchAction {
    const action:RemoveBranchAction = {
      type: 'DUXEN_REMOVE_BRANCH',
      branchName: branchName,
    };
    this._action(action);
    return action;
  }

  goForward(steps: number): GoForwardAction {
    const action:GoForwardAction = {
      type: 'DUXEN_GO_FORWARD',
      steps: steps,
    };
    this._action(action);
    return action;
  }

  goBack(steps: number): GoBackAction {
    const action:GoBackAction = {
      type: 'DUXEN_GO_BACK',
      steps: steps,
    };
    this._action(action);
    return action;
  }

  goLive(): GoLiveAction {
    const action:GoLiveAction = {
      type: 'DUXEN_GO_LIVE',
    };
    this._action(action);
    return action;
  }

}
