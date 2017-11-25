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
import { List, fromJS } from 'immutable-sorted';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: any): T => cast(fromJS(value));

test("common engine", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:StateReducer = engine.stateReducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}
  };
  expect(state0.toJS()).toEqual(expected0);

  const state1 = engine.get(state0, "todosFilter");
  const expected1 = "Get milk";
  expect(state1).toEqual(expected1);

  const action2 = engine.actionFactory().insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state0, action2);
  const expected2 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    }
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.actionFactory().insert("todos", "id2", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    }
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.actionFactory().insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state4 = reducer(state3, action4);
  const expected4 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    }
  };
  expect(state4.toJS()).toEqual(expected4);

  const state5:State = engine.get(state4, "todos");
  const expected5 = {
    id1: {"text": "Get tickets"},
    id2: {"text": "Get milk"},
    id3: {"text": "Get sugar"},
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("action subscribe", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
    'todos': {
      type: 'collection',
    },
    'customPageNumber': {
      type: 'customValue',
      actionType: 'CUSTOM_PAGE_NUMBER',
      initValue: 1,
      action: (pageNo) => ({type: 'CUSTOM_PAGE_NUMBER', value: pageNo}),
      // eslint-disable-next-line no-unused-vars
      reducer: (mutableState: State, action: Action): void => {
        const customAction:CustomAction = cast(action);
        const pageNo:number = cast(customAction).pageNo;
        mutableState.setIn(["pager", "pageNo"], pageNo);
      }
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
  };

  const engine:EngineInterface = createEngine(schema);

  const receivedActions = {

  };

  const unsubscribeHandle:()=>void = engine.subscribe((action: Action) => {
      receivedActions[action.type] = true;
  });

  const insertAction:InsertAction = engine.actionFactory().insert("todos", "id1", ensure({"text": "Get tickets"}));
  expect(insertAction).toEqual({"type": "DUXEN_INSERT", "collName": "todos", "id": "id1", "doc": fromJS({"text": "Get tickets"})});

  const updateAction:UpdateAction = engine.actionFactory().update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  expect(updateAction).toEqual({"type": "DUXEN_UPDATE", "collName": "todos", "id": "id1", "doc": fromJS({"text": "Get tickets to concert"})});

  const removeAction:RemoveAction = engine.actionFactory().remove("todos", "id1");
  expect(removeAction).toEqual({"type": "DUXEN_REMOVE", "collName": "todos", "id": "id1"});

  const resetAction:ResetAction = engine.actionFactory().reset("todos");
  expect(resetAction).toEqual({"type": "DUXEN_RESET", "collName": "todos"});

  const pauseAction:PauseAction = engine.actionFactory().pause("todos");
  expect(pauseAction).toEqual({"type": "DUXEN_PAUSE", "collName": "todos"});

  const resumeAction:ResumeAction = engine.actionFactory().resume("todos");
  expect(resumeAction).toEqual({"type": "DUXEN_RESUME", "collName": "todos"});

  const saveAction:SaveAction = engine.actionFactory().save("todos");
  expect(saveAction).toEqual({"type": "DUXEN_SAVE", "collName": "todos"});

  const restoreAction:RestoreAction = engine.actionFactory().restore("todos");
  expect(restoreAction).toEqual({"type": "DUXEN_RESTORE", "collName": "todos"});

  const saveOriginalsAction:SaveOriginalsAction = engine.actionFactory().saveOriginals("todos");
  expect(saveOriginalsAction).toEqual({"type": "DUXEN_SAVE_ORIGINALS", "collName": "todos"});

  const retrieveOriginalsAction:RetrieveOriginalsAction = engine.actionFactory().retrieveOriginals("todos");
  expect(retrieveOriginalsAction).toEqual({"type": "DUXEN_RETRIEVE_ORIGINALS", "collName": "todos"});

  const actions:List<CollAction> = List([insertAction, updateAction, removeAction]);
  const batchAction:BatchAction = engine.actionFactory().batch("todos", actions);
  expect(batchAction).toEqual({"type": "DUXEN_BATCH", "collName": "todos", actions});

  const refreshAction:RefreshAction = engine.actionFactory().refresh();
  expect(refreshAction).toEqual({"type": "DUXEN_REFRESH"});

  const valueAction:ValueAction = engine.actionFactory().value("todosFilter", "Get sugar");
  expect(valueAction).toEqual({"type": "DUXEN_VALUE", "valueName": "todosFilter", "value": "Get sugar"});

  const customValueAction:CustomValueAction = engine.actionFactory().customValue("customPageNumber", 127);
  expect(customValueAction).toEqual({"type": "CUSTOM_PAGE_NUMBER", "value": 127});

  const customAction:CustomAction = engine.actionFactory().custom("customNextPage");
  expect(customAction).toEqual({"type": "CUSTOM_NEXT_PAGE"});

  const expectedReceivedActions = {
    "DUXEN_INSERT": true,
    "DUXEN_UPDATE": true,
    "DUXEN_REMOVE": true,
    "DUXEN_RESET": true,
    "DUXEN_PAUSE": true,
    "DUXEN_RESUME": true,
    "DUXEN_SAVE": true,
    "DUXEN_RESTORE": true,
    "DUXEN_SAVE_ORIGINALS": true,
    "DUXEN_RETRIEVE_ORIGINALS": true,
    "DUXEN_BATCH": true,
    "DUXEN_REFRESH": true,
    "DUXEN_VALUE": true,
    "CUSTOM_PAGE_NUMBER": true,
    "CUSTOM_NEXT_PAGE": true
  };

  unsubscribeHandle();

  expect(receivedActions).toEqual(expectedReceivedActions);
});
