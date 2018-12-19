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

test("formula", function() {
  const schema: Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
    },
    'todosFilterUp': {
      type: 'formula',
      props: ['todosFilter'],
      recipe: (props: Props): StateValue => cast(props.todosFilter).toUpperCase()
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const reducer: StateReducer = engine.stateReducer();

  const state0: State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _state: {},
    todosFilter: "Get milk",
    todosFilterUp: "GET MILK",
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.actionFactory().value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _state: {},
    todosFilter: "Get sugar",
    todosFilterUp: "GET SUGAR",
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.actionFactory().value("todosFilter", "Get cookies");
  const state2 = reducer(state1, action2);
  const expected2 = {
    _state: {},
    todosFilter: "Get cookies",
    todosFilterUp: "GET COOKIES",
  };
  expect(state2.toJS()).toEqual(expected2);
});
