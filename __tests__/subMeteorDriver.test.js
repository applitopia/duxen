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

test("Sub Meteor Driver - dispatch, insert, update, remove", function() {
  const meteor:Schema = {
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

  const schema:Schema = {
    'meteor': {
      type: 'schema',
      schema: meteor,
    }
  };

  const engine:EngineInterface = new createEngine(schema);
  const subEngine:EngineInterface = engine.subEngine('meteor');
  const reducer:StateReducer = engine.stateReducer();
  const store = createStore(reducer);
  const meteorDriver:MeteorDriver = new MeteorDriver(subEngine, store.dispatch, store.getState);
  const meteorCollection:MeteorCollection = meteorDriver.open("todos", {});

  const state0:State = subEngine.get(store.getState());
  const expected0 = {
    todosFilter: "Get milk",
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = subEngine.actionFactory().value("todosFilter", "Get sugar");
  meteorCollection.dispatch(action1)
  const state1:State = subEngine.get(store.getState());
  const expected1 = {
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}};
  expect(state1.toJS()).toEqual(expected1);

  meteorCollection.insert({_id: "id1", "text": "Get tickets"});
  const state2:State = subEngine.get(store.getState());
  const expected2 = {
    todosFilter: "Get sugar",
    todos: {id1: {_id: "id1", "text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}}
  };
  expect(state2.toJS()).toEqual(expected2);

  meteorCollection.update({_id: "id1"}, {$set: {"text": "Get tickets to concert"}});
  const state3:State = subEngine.get(store.getState());
  const expected3 = {
    todosFilter: "Get sugar",
    todos: {id1: {_id: "id1", "text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}}
  };
  expect(state3.toJS()).toEqual(expected3);

  meteorCollection.remove({_id: "id1"});
  const state4:State = subEngine.get(store.getState());
  const expected4 = {
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}
  };
  expect(state4.toJS()).toEqual(expected4);

});
