/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { createStore } from 'redux';
import { createEngine } from '../src';
import { MeteorDriver, MeteorCollection } from '../src/MeteorDriver';
import { Map } from 'immutable-sorted';

test("Meteor Driver - dispatch, insert, update, remove", function() {
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
      recipe: (seq) => seq.map((v)=>v.delete("_id")),
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:StateReducer = engine.stateReducer();
  const store = createStore(reducer);
  const meteorDriver:MeteorDriver = new MeteorDriver(engine, store.dispatch, store.getState);
  const meteorCollection:MeteorCollection = meteorDriver.open("todos", {});

  const state0:State = store.getState();
  const expected0 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.actionFactory().value("todosFilter", "Get sugar");
  meteorCollection.dispatch(action1)
  const state1 = store.getState();
  const expected1 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}};
  expect(state1.toJS()).toEqual(expected1);

  meteorCollection.insert({_id: "id1", "text": "Get tickets"});
  const state2 = store.getState();
  const expected2 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {_id: "id1", "text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}}
  };
  expect(state2.toJS()).toEqual(expected2);

  meteorCollection.update({_id: "id1"}, {$set: {"text": "Get tickets to concert"}});
  const state3 = store.getState();
  const expected3 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {_id: "id1", "text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}}
  };
  expect(state3.toJS()).toEqual(expected3);

  meteorCollection.remove({_id: "id1"});
  const state4 = store.getState();
  const expected4 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}
  };
  expect(state4.toJS()).toEqual(expected4);

  meteorCollection.remove({});
  const state5 = store.getState();
  const expected5 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Meteor Driver - dispatch, insert, update, remove", function() {
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
      recipe: (seq) => seq.map((v)=>v.delete("_id")),
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:StateReducer = engine.stateReducer();
  const store = createStore(reducer);
  const meteorDriver:MeteorDriver = new MeteorDriver(engine, store.dispatch, store.getState);
  const meteorCollection:MeteorCollection = meteorDriver.open("todos", {});

  const state0:State = store.getState();
  const expected0 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.actionFactory().value("todosFilter", "Get sugar");
  meteorCollection.dispatch(action1)
  const state1 = store.getState();
  const expected1 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}
  };
  expect(state1.toJS()).toEqual(expected1);

  meteorCollection.insert({_id: "id1", "text": "Get tickets"});
  const state2 = store.getState();
  const expected2 = {
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {_id: "id1", "text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}}
  };
  expect(state2.toJS()).toEqual(expected2);

  const result3_1:boolean = meteorCollection.findOne({_id: "id1"});
  expect(result3_1).toBe(true);
  const result3_2:boolean = meteorCollection.findOne("id1");
  expect(result3_2).toBe(true);
  const result3_3:boolean = meteorCollection.findOne({_id: "id2"});
  expect(result3_3).toBe(false);
  const result3_4:boolean = meteorCollection.findOne("id2");
  expect(result3_4).toBe(false);
  const result3_5:State = meteorCollection.findOne({_id: "id1"}, {fetch: true});
  expect(result3_5.toJS()).toEqual({"_id": "id1", "text": "Get tickets"});
  expect(()=>meteorCollection.findOne({})).toThrow("Selector not supported:");

  meteorCollection.pauseObservers();
  meteorCollection.resumeObservers();
  meteorCollection.saveOriginals();
  const originals:Seq<StateKey, mixed> = meteorCollection.retrieveOriginals();
  expect(originals.toMap()).toEqual(Map());
});
