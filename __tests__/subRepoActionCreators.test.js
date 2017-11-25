/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { createEngine } from '../src';

test("SubEngine repo action creators", function() {
  const todos:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
    'customNextPage': {
      type: 'custom',
      actionType: 'CUSTOM_NEXT_PAGE',
      action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
      // eslint-disable-next-line no-unused-vars
      reducer: (mutableState: State, action: Action): void => {
          const pageNo:number = mutableState.getIn(["pager", "pageNo"], 0);
          mutableState.setIn(["pager", "pageNo"], pageNo+1);
      }
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq
    },
  };

  const schema:Schema = {
    'todosApp': {
      type: 'schema',
      schema: todos,
    }
  };

  const engine:EngineInterface = createEngine(schema);
  const subEngine:EngineInterface = engine.subEngine('todosApp');
  const actionFactory:ActionFactoryInterface = subEngine.actionFactory();

  const createBranchAction:CreateBranchAction = actionFactory.createBranch("test");
  expect(createBranchAction).toEqual({"type": "DUXEN_CREATE_BRANCH", "branchName": "test"});

  const switchBranchAction:SwitchBranchAction = actionFactory.switchBranch("test");
  expect(switchBranchAction).toEqual({"type": "DUXEN_SWITCH_BRANCH", "branchName": "test"});

  const saveBranchAction:SaveBranchAction = actionFactory.saveBranch("test");
  expect(saveBranchAction).toEqual({"type": "DUXEN_SAVE_BRANCH", "branchName": "test"});

  const resetBranchAction:ResetBranchAction = actionFactory.resetBranch("test");
  expect(resetBranchAction).toEqual({"type": "DUXEN_RESET_BRANCH", "branchName": "test"});

  const removeBranchAction:RemoveBranchAction = actionFactory.removeBranch("test");
  expect(removeBranchAction).toEqual({"type": "DUXEN_REMOVE_BRANCH", "branchName": "test"});

  const goForwardAction:GoForwardAction = actionFactory.goForward(7);
  expect(goForwardAction).toEqual({"type": "DUXEN_GO_FORWARD", "steps": 7});

  const goBackAction:GoBackAction = actionFactory.goBack(7);
  expect(goBackAction).toEqual({"type": "DUXEN_GO_BACK", "steps": 7});

  const goLiveAction:GoLiveAction = actionFactory.goLive();
  expect(goLiveAction).toEqual({"type": "DUXEN_GO_LIVE"});

});
