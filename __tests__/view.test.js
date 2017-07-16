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
import { Seq, fromJS } from 'immutable-sorted';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: any): T => cast(fromJS(value));

test("view on view", function() {
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
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq,
    },
    'todosViewCnt': {
      type: 'view',
      sourceName: 'todosView',
      props: [],
      recipe: (seq) => Seq({cnt: seq.count()}),
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}},
    todosViewCnt: {cnt: 1},
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}},
    todosViewCnt: {cnt: 1},
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state4.toJS()).toEqual(expected4);

});
