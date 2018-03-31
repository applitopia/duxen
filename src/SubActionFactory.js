/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { List } from 'immutable-sorted';

export default class SubActionFactory implements ActionFactoryInterface {

  _actionFactory: ActionFactoryInterface;
  _subSchemaPath: string;
  _prefix: string;

  constructor(actionFactory: ActionFactoryInterface, subSchemaPath: string) {
    this._actionFactory = actionFactory;
    this._subSchemaPath = subSchemaPath;
    this._prefix = subSchemaPath+'.';
  }

  //
  // Action creators
  //
  batch(actions: List<CollAction>): BatchAction {
    const action:BatchAction = this._actionFactory.batch(actions);
    return action;
  }

  insert(collName: string, id: StateKey, doc: CollDocument): InsertAction {
    collName = this._prefix+collName;
    const action:InsertAction = this._actionFactory.insert(collName, id, doc);
    return action;
  }

  update(collName: string, id: StateKey, doc: CollDocument): UpdateAction {
    collName = this._prefix+collName;
    const action:UpdateAction = this._actionFactory.update(collName, id, doc);
    return action;
  }

  remove(collName: string, id: StateKey): RemoveAction {
    collName = this._prefix+collName;
    const action:RemoveAction = this._actionFactory.remove(collName, id);
    return action;
  }

  reset(collName: string): ResetAction {
    collName = this._prefix+collName;
    const action:ResetAction = this._actionFactory.reset(collName);
    return action;
  }

  pause(collName: string): PauseAction {
    collName = this._prefix+collName;
    const action:PauseAction = this._actionFactory.pause(collName);
    return action;
  }

  resume(collName: string): ResumeAction {
    collName = this._prefix+collName;
    const action:ResumeAction = this._actionFactory.resume(collName);
    return action;
  }

  save(collName: string): SaveAction {
    collName = this._prefix+collName;
    const action:SaveAction = this._actionFactory.save(collName);
    return action;
  }

  restore(collName: string): RestoreAction {
    collName = this._prefix+collName;
    const action:RestoreAction = this._actionFactory.restore(collName);
    return action;
  }

  saveOriginals(collName: string): SaveOriginalsAction {
    collName = this._prefix+collName;
    const action:SaveOriginalsAction = this._actionFactory.saveOriginals(collName);
    return action;
  }

  retrieveOriginals(collName: string): RetrieveOriginalsAction {
    collName = this._prefix+collName;
    const action:RetrieveOriginalsAction = this._actionFactory.retrieveOriginals(collName);
    return action;
  }

  refresh(): RefreshAction {
    const action:RefreshAction = this._actionFactory.refresh();
    return action;
  }

  value(valueName: string, value: StateValue): ValueAction {
    valueName = this._prefix+valueName;
    const action:ValueAction = this._actionFactory.value(valueName, value);
    return action;
  }

  customValue(valueName: string, value: StateValue): CustomValueAction {
    valueName = this._prefix+valueName;
    const action:CustomValueAction = this._actionFactory.customValue(valueName, value);
    return action;
  }

  custom(customName: string): CustomAction {
    customName = this._prefix+customName;
    const action:CustomAction = this._actionFactory.custom(customName);
    return action;
  }

  //
  // Repo Actions
  //

  createBranch(branchName: string): CreateBranchAction {
    const action:CreateBranchAction = this._actionFactory.createBranch(branchName);
    return action;
  }

  switchBranch(branchName: string): SwitchBranchAction {
    const action:SwitchBranchAction = this._actionFactory.switchBranch(branchName);
    return action;
  }

  saveBranch(branchName: string): SaveBranchAction {
    const action:SaveBranchAction = this._actionFactory.saveBranch(branchName);
    return action;
  }

  resetBranch(branchName: string): ResetBranchAction {
    const action:ResetBranchAction = this._actionFactory.resetBranch(branchName);
    return action;
  }

  removeBranch(branchName: string): RemoveBranchAction {
    const action:RemoveBranchAction = this._actionFactory.removeBranch(branchName);
    return action;
  }

  goForward(steps: number): GoForwardAction {
    const action:GoForwardAction = this._actionFactory.goForward(steps);
    return action;
  }

  goBack(steps: number): GoBackAction {
    const action:GoBackAction = this._actionFactory.goBack(steps);
    return action;
  }

  goLive(): GoLiveAction {
    const action:GoLiveAction = this._actionFactory.goLive();
    return action;
  }

}
