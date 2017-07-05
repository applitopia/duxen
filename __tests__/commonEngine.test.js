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
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      collName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}
  };
  expect(state0.toJS()).toEqual(expected0);

  const state1 = engine.get(state0, "todosFilter");
  const expected1 = "Get milk";
  expect(state1).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state0, action2);
  const expected2 = {
    _props: {"todosView": {}},
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

  const action3 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {"todosView": {}},
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

  const action4 = engine.insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {"todosView": {}},
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
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
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

  const insertAction:InsertAction = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  expect(insertAction).toEqual({"type": "DUXEN_INSERT", "collName": "todos", "id": "id1", "doc": fromJS({"text": "Get tickets"})});

  const updateAction:UpdateAction = engine.update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  expect(updateAction).toEqual({"type": "DUXEN_UPDATE", "collName": "todos", "id": "id1", "doc": fromJS({"text": "Get tickets to concert"})});

  const removeAction:RemoveAction = engine.remove("todos", "id1");
  expect(removeAction).toEqual({"type": "DUXEN_REMOVE", "collName": "todos", "id": "id1"});

  const resetAction:ResetAction = engine.reset("todos");
  expect(resetAction).toEqual({"type": "DUXEN_RESET", "collName": "todos"});

  const pauseAction:PauseAction = engine.pause("todos");
  expect(pauseAction).toEqual({"type": "DUXEN_PAUSE", "collName": "todos"});

  const resumeAction:ResumeAction = engine.resume("todos");
  expect(resumeAction).toEqual({"type": "DUXEN_RESUME", "collName": "todos"});

  const saveAction:SaveAction = engine.save("todos");
  expect(saveAction).toEqual({"type": "DUXEN_SAVE", "collName": "todos"});

  const restoreAction:RestoreAction = engine.restore("todos");
  expect(restoreAction).toEqual({"type": "DUXEN_RESTORE", "collName": "todos"});

  const saveOriginalsAction:SaveOriginalsAction = engine.saveOriginals("todos");
  expect(saveOriginalsAction).toEqual({"type": "DUXEN_SAVE_ORIGINALS", "collName": "todos"});

  const retrieveOriginalsAction:RetrieveOriginalsAction = engine.retrieveOriginals("todos");
  expect(retrieveOriginalsAction).toEqual({"type": "DUXEN_RETRIEVE_ORIGINALS", "collName": "todos"});

  const actions:List<CollAction> = List([insertAction, updateAction, removeAction]);
  const batchAction:BatchAction = engine.batch("todos", actions);
  expect(batchAction).toEqual({"type": "DUXEN_BATCH", "collName": "todos", actions});

  const valueAction:ValueAction = engine.value("todosFilter", "Get sugar");
  expect(valueAction).toEqual({"type": "CHANGE_TODOS_FILTER", "value": "Get sugar"});

  const customAction:CustomAction = engine.custom("customNextPage");
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
    "CHANGE_TODOS_FILTER": true,
    "CUSTOM_NEXT_PAGE": true
  };

  unsubscribeHandle();

  expect(receivedActions).toEqual(expectedReceivedActions);
});
