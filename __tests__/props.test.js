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

test("props", function() {
  const schema: Schema = {
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
      props: ["todosFilter"],
      recipe: (seq, props) => seq.filter(v=>v.get('text').indexOf(props.todosFilter) >= 0),
    },
    'todosViewCnt': {
      type: 'view',
      sourceName: 'todosView',
      props: [],
      recipe: (seq) => Seq({cnt: seq.count()}),
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();

  const state0: State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.actionFactory().value("todosFilter", "concert");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _state: {todos: {paused: false}},
    todosFilter: "concert",
    todos: {},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.actionFactory().insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _state: {todos: {paused: false}},
    todosFilter: "concert",
    todos: {id1: {"text": "Get tickets"}},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.actionFactory().update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _state: {todos: {paused: false}},
    todosFilter: "concert",
    todos: {id1: {"text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}},
    todosViewCnt: {cnt: 1},
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.actionFactory().remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _state: {todos: {paused: false}},
    todosFilter: "concert",
    todos: {},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.actionFactory().insert("todos", "id1", ensure({"text": "Get milk"}));
  const state5 = reducer(state4, action5);
  const expected5 = {
    _state: {todos: {paused: false}},
    todosFilter: "concert",
    todos: {id1: {"text": "Get milk"}},
    todosView: {},
    todosViewCnt: {cnt: 0},
  };
  expect(state5.toJS()).toEqual(expected5);

  const action6 = engine.actionFactory().value("todosFilter", "milk");
  const state6 = reducer(state5, action6);
  const expected6 = {
    _state: {todos: {paused: false}},
    todosFilter: "milk",
    todos: {id1: {"text": "Get milk"}},
    todosView: {id1: {"text": "Get milk"}},
    todosViewCnt: {cnt: 1},
  };
  expect(state6.toJS()).toEqual(expected6);

});
