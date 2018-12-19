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

export default class BoundActionFactory implements ActionFactoryInterface {

  _dispatch: (Action)=>Action;
  _actionFactory: ActionFactoryInterface;

  constructor(dispatch: (Action)=>Action, actionFactory: ActionFactoryInterface) {
    this._dispatch = dispatch;
    this._actionFactory = actionFactory;
  }

  //
  // Action creators
  //
  batch(actions: List<Action>): BatchAction {
    const action: BatchAction = this._actionFactory.batch(actions);
    this._dispatch(action);
    return action;
  }

  insert(collName: string, id: StateKey, doc: CollDocument): InsertAction {
    const action: InsertAction = this._actionFactory.insert(collName, id, doc);
    this._dispatch(action);
    return action;
  }

  update(collName: string, id: StateKey, doc: CollDocument): UpdateAction {
    const action: UpdateAction = this._actionFactory.update(collName, id, doc);
    this._dispatch(action);
    return action;
  }

  remove(collName: string, id: StateKey): RemoveAction {
    const action: RemoveAction = this._actionFactory.remove(collName, id);
    this._dispatch(action);
    return action;
  }

  reset(collName: string): ResetAction {
    const action: ResetAction = this._actionFactory.reset(collName);
    this._dispatch(action);
    return action;
  }

  pause(collName: string): PauseAction {
    const action: PauseAction = this._actionFactory.pause(collName);
    this._dispatch(action);
    return action;
  }

  resume(collName: string): ResumeAction {
    const action: ResumeAction = this._actionFactory.resume(collName);
    this._dispatch(action);
    return action;
  }

  save(collName: string): SaveAction {
    const action: SaveAction = this._actionFactory.save(collName);
    this._dispatch(action);
    return action;
  }

  restore(collName: string): RestoreAction {
    const action: RestoreAction = this._actionFactory.restore(collName);
    this._dispatch(action);
    return action;
  }

  saveOriginals(collName: string): SaveOriginalsAction {
    const action: SaveOriginalsAction = this._actionFactory.saveOriginals(collName);
    this._dispatch(action);
    return action;
  }

  retrieveOriginals(collName: string): RetrieveOriginalsAction {
    const action: RetrieveOriginalsAction = this._actionFactory.retrieveOriginals(collName);
    this._dispatch(action);
    return action;
  }

  refresh(): RefreshAction {
    const action: RefreshAction = this._actionFactory.refresh();
    this._dispatch(action);
    return action;
  }

  value(valueName: string, value: StateValue): ValueAction {
    const action: ValueAction = this._actionFactory.value(valueName, value);
    this._dispatch(action);
    return action;
  }

  customValue(valueName: string, value: StateValue): CustomValueAction {
    const action: CustomValueAction = this._actionFactory.customValue(valueName, value);
    this._dispatch(action);
    return action;
  }

  custom(customName: string): CustomAction {
    const action: CustomAction = this._actionFactory.custom(customName);
    this._dispatch(action);
    return action;
  }

  //
  // Repo Actions
  //

  createBranch(branchName: string): CreateBranchAction {
    const action: CreateBranchAction = this._actionFactory.createBranch(branchName);
    this._dispatch(action);
    return action;
  }

  switchBranch(branchName: string): SwitchBranchAction {
    const action: SwitchBranchAction = this._actionFactory.switchBranch(branchName);
    this._dispatch(action);
    return action;
  }

  saveBranch(branchName: string): SaveBranchAction {
    const action: SaveBranchAction = this._actionFactory.saveBranch(branchName);
    this._dispatch(action);
    return action;
  }

  resetBranch(branchName: string): ResetBranchAction {
    const action: ResetBranchAction = this._actionFactory.resetBranch(branchName);
    this._dispatch(action);
    return action;
  }

  removeBranch(branchName: string): RemoveBranchAction {
    const action: RemoveBranchAction = this._actionFactory.removeBranch(branchName);
    this._dispatch(action);
    return action;
  }

  goForward(steps: number): GoForwardAction {
    const action: GoForwardAction = this._actionFactory.goForward(steps);
    this._dispatch(action);
    return action;
  }

  goBack(steps: number): GoBackAction {
    const action: GoBackAction = this._actionFactory.goBack(steps);
    this._dispatch(action);
    return action;
  }

  goLive(): GoLiveAction {
    const action: GoLiveAction = this._actionFactory.goLive();
    this._dispatch(action);
    return action;
  }

}
