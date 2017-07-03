/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { fromJS } from 'immutable-sorted';

import { compileSchema } from '../src/SchemaCompiler';

const cast = <T>(value: any): T => (value: T);

test("Simple Schema Compiler", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'customNextPage': {
      type: 'custom',
      actionType: 'CUSTOM_NEXT_PAGE',
      action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
      reducer: (state: State, action: Action): State => {
        switch(action.type) {
        case 'CUSTOM_NEXT_PAGE': {
          return state.withMutations((mutableState: State) => {
            const pageNo:number = mutableState.getIn(["pager", "pageNo"], 0);
            mutableState.setIn(["pager", "pageNo"], pageNo+1);
          });
        }
        default:
          return state;
        }
      }
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      collName: 'todos',
      props: {},
      recipe: (seq) => seq
    },
  };

  const cs:CompiledSchema = compileSchema(schema);
  const csExpected:CompiledSchema = {
    "collViews": {
      "todos": [
        {
          "collName": "todos",
          "props": {},
          "recipe": cast(cs.collViews["todos"][0].recipe),
          "viewName": "todosView"
        }
      ]
    },
    "names": {
      "customNextPage": {"name": "customNextPage", "type": "custom", prefix: "", path: [], schemaEntry: schema.customNextPage},
      "todos": {"name": "todos", "type": "collection", prefix: "", path: ["todos"], schemaEntry: schema.todos},
      "todosFilter": {"name": "todosFilter", "type": "value", prefix: "", path: ["todosFilter"], schemaEntry: schema.todosFilter},
      "todosView": {"name": "todosView", "type": "view", prefix: "", path: ["todosView"], schemaEntry: schema.todosView}
    },
    "actions": {
      "CHANGE_TODOS_FILTER": {
        "type": "value",
        "name": "todosFilter",
        "actionType": "CHANGE_TODOS_FILTER",
        "reducer": cast(cs.actions["CHANGE_TODOS_FILTER"].reducer)
      },
      "CUSTOM_NEXT_PAGE": {
        "type": "custom",
        "name": "customNextPage",
        "actionType": "CUSTOM_NEXT_PAGE",
        "reducer": cast(cs.actions["CUSTOM_NEXT_PAGE"].reducer)
      }
    },
    "initState": cast(fromJS({
      _props: {},
      _state: {
        todos: {paused: false}
      },
      todosFilter: "Get milk",
      todos: {},
      todosView: {}
    }))
  };
  expect(cs).toEqual(csExpected);
});

test("SubSchema Compiler", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    "calendarSchema": {
      type: 'schema',
      schema: {
        'currentMonth': {
          type: 'value',
          initValue: "2017-06",
          actionType: 'CHANGE_CURRENT_MONTH',
        },
      },
    }
  };

  const cs:CompiledSchema = compileSchema(schema);
  const csExpected:CompiledSchema = {
    "collViews": {},
    "names": {
      "calendarSchema": {"name": "calendarSchema", "type": "schema", prefix: "", path: ["calendarSchema"], schemaEntry: schema.calendarSchema},
      "calendarSchema.currentMonth": {"name": "calendarSchema.currentMonth", "type": "value", prefix: "calendarSchema.", path: ["calendarSchema", "currentMonth"], schemaEntry: cast(schema["calendarSchema"]).schema.currentMonth},
      "todosFilter": {"name": "todosFilter", "type": "value", prefix: "", path: ["todosFilter"], schemaEntry: schema.todosFilter}
    },
    "actions": {
      "calendarSchema.CHANGE_CURRENT_MONTH": {
        "type": "value",
        "name": "calendarSchema.currentMonth",
        "actionType": "calendarSchema.CHANGE_CURRENT_MONTH",
        "reducer": cast(cs.actions["calendarSchema.CHANGE_CURRENT_MONTH"].reducer)
      },
      "CHANGE_TODOS_FILTER": {
        "type": "value",
        "name": "todosFilter",
        "actionType": "CHANGE_TODOS_FILTER",
        "reducer": cast(cs.actions["CHANGE_TODOS_FILTER"].reducer)
      }
    },
    "initState": cast(fromJS({
      _props: {},
      _state: {},
      todosFilter: "Get milk",
      calendarSchema: {
        _props: {},
        _state: {},
        currentMonth: "2017-06"
      }
    }))
  };
  expect(cs).toEqual(csExpected);
});
