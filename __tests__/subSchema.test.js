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

test("Initial state - subschema value", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
    "calendarSchema": {
      type: 'schema',
      schema: {
        'currentMonth': {
          type: 'value',
          initValue: "2017-06",
        },
      },
    }
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();
  const state:State = reducer(undefined, {type: "INIT"});

  const expected = {
    "_state": {},
    "calendarSchema": {
      "currentMonth": "2017-06"
    },
    "todosFilter": "Get milk"
  };
  expect(state.toJS()).toEqual(expected);

  const expectedClean = {
    "calendarSchema": {
      "currentMonth": "2017-06"
    },
    "todosFilter": "Get milk"
  };
  expect(engine.printableState(state).toJS()).toEqual(expectedClean);
  expect(engine.persistableState(state).toJS()).toEqual(expectedClean);
});

test("Reducer - subschema value", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
    "calendarSchema": {
      type: 'schema',
      schema: {
        'currentMonth': {
          type: 'value',
          initValue: "2017-06",
        },
      },
    }
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    "_state": {},
    "calendarSchema": {
      "currentMonth": "2017-06"
    },
    "todosFilter": "Get milk"
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    "_state": {},
    "calendarSchema": {
      "currentMonth": "2017-06"
    },
    "todosFilter": "Get sugar",
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.value("calendarSchema.currentMonth", "2017-07");
  const state2 = reducer(state1, action2);
  const expected2 = {
    "_state": {},
    "calendarSchema": {
      "currentMonth": "2017-07"
    },
    "todosFilter": "Get sugar",
  };
  expect(state2.toJS()).toEqual(expected2);

});

test("Reducer - subschema custom", function() {
  const calendarSchema:Schema = {
    'customNextPage': {
      type: 'custom',
      actionType: 'CUSTOM_NEXT_PAGE',
      action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
      // eslint-disable-next-line no-unused-vars
      reducer: (mutableState: State, action: Action): void => {
          const pageNo:number = mutableState.getIn(["pager", "pageNo"], 0);
          mutableState.setIn(["pager", "pageNo"], pageNo+1);
      },
    },
  };

  const schema:Schema = {
    'customNextPage': calendarSchema.customNextPage,
    "calendarSchema": {
      type: 'schema',
      schema: calendarSchema,
    }
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    "_state": {},
    "calendarSchema": {
    },
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.custom('customNextPage');
  const state1 = reducer(state0, action1);
  const expected1 = {
    "_state": {},
    "calendarSchema": {
    },
    "pager": {"pageNo": 1},
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.custom('calendarSchema.customNextPage');
  const state2 = reducer(state0, action2);
  const expected2 = {
    "_state": {},
    "calendarSchema": {
      "pager": {"pageNo": 1},
    },
  };
  expect(state2.toJS()).toEqual(expected2);

});
