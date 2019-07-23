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
  const schema: Schema = {
    'todosFilter': {
      type: 'value',
      persistent: true,
      initValue: "Get milk",
    },
    "calendarSchema": {
      type: 'schema',
      schema: {
        'currentMonth': {
          type: 'value',
          persistent: true,
          initValue: "2017-06",
        },
        'calendarFilterSchema': {
          type: 'schema',
          schema: {
            'calendarFilter': {
              type: 'value',
              persistent: true,
              initValue: "Sunday",
            },        
          }
        },
      },
    }
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();
  const state: State = reducer(undefined, {type: "INIT"});

  const expected = {
    "_state": {},
    "calendarSchema": {
      "calendarFilterSchema": {
        "calendarFilter": "Sunday",
      },
      "currentMonth": "2017-06",
    },
    "todosFilter": "Get milk"
  };
  expect(state.toJS()).toEqual(expected);

  const expectedClean = {
    "calendarSchema": {
      "calendarFilterSchema": {
        "calendarFilter": "Sunday",
      },
      "currentMonth": "2017-06",
    },
    "todosFilter": "Get milk"
  };
  expect(engine.printableState(state).toJS()).toEqual(expectedClean);
  expect(engine.persistableState(state).toJS()).toEqual(expectedClean);
});
