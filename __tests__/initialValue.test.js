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

const cast = <T>(value: any): T => (value: T);

test("Initial state - value", function() {
  const schema: Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();
  const state: State = reducer(undefined, {type: "INIT"});

  expect(state.toJS()).toEqual({
    '_state': {},
    "todosFilter": "Get milk"
  });
});

test("Initial state - collection", function() {
  const schema: Schema = {
    'todos': {
      type: 'collection',
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();
  const state: State = reducer(undefined, {type: "INIT"});

  expect(state.toJS()).toEqual({
    "_state": {"todos": {"paused": false}},
    "todos": {}
  });
});

test("Initial state - view", function() {
  const schema: Schema = {
    'todos': {
      type: 'collection'
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();
  const state: State = reducer(undefined, {type: "INIT"});

  expect(state.toJS()).toEqual({
    '_state': {"todos": {"paused": false}},
    "todos": {},
    "todosView": {}
  });
});

test("Initial state - custom", function() {
  const schema: Schema = {
    'customNextPage': {
      type: 'custom',
      actionType: 'CUSTOM_NEXT_PAGE',
      action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
      reducer: (state: State, action: Action): State => {
        switch(action.type) {
        case 'CUSTOM_NEXT_PAGE': {
          return state.withMutations((mutableState: State) => {
            const pageNo: number = mutableState.getIn(["pager", "pageNo"], 0);
            mutableState.setIn(["pager", "pageNo"], pageNo+1);
          });
        }
        default: 
          return state;
        }
      }
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();
  const state: State = reducer(undefined, {type: "INIT"});

  expect(state.toJS()).toEqual({
    '_state': {}
  });

  const state2: State = reducer(state, cast(schema['customNextPage']).action());

  expect(state2.toJS()).toEqual({
    '_state': {},
    "pager": {"pageNo": 1}
  });
});
