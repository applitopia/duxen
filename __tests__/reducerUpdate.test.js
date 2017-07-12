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
import { is, fromJS } from 'immutable-sorted';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: any): T => cast(fromJS(value));

test("Reducer update, replace, $set, $inc", function() {
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
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}};
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", {"text": "Get tickets", cnt: 0});
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets", cnt: 0}},
    todosView: {id1: {"text": "Get tickets", cnt: 0}}
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.update("todos", "id1", {"text": "Get tickets to concert", cnt: 0});
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert", cnt: 0}},
    todosView: {id1: {"text": "Get tickets to concert", cnt: 0}}
  };
  expect(state3.toJS()).toEqual(expected3);
  expect(is(state3.get('todos').get('id1'), ensure({"text": "Get tickets to concert", cnt: 0}))).toBe(true);
  expect(is(state3.get('todosView').get('id1'), ensure({"text": "Get tickets to concert", cnt: 0}))).toBe(true);

  const action4 = engine.update("todos", "id1", {$set: {cnt: 5}});
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert", cnt: 5}},
    todosView: {id1: {"text": "Get tickets to concert", cnt: 5}}
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.update("todos", "id1", {$inc: {cnt: 1}});
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert", cnt: 6}},
    todosView: {id1: {"text": "Get tickets to concert", cnt: 6}}
  };
  expect(state5.toJS()).toEqual(expected5);

  const action6 = engine.update("todos", "id1", {$mul: {cnt: 2}});
  const state6 = reducer(state5, action6);
  const expected6 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert", cnt: 12}},
    todosView: {id1: {"text": "Get tickets to concert", cnt: 12}}
  };
  expect(state6.toJS()).toEqual(expected6);

  const action100 = engine.update("todos", "id1", {$unset: {cnt: true}});
  const state100 = reducer(state6, action100);
  const expected100 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}}
  };
  expect(state100.toJS()).toEqual(expected100);

});
