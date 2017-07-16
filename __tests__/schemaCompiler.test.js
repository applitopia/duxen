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

test("Does not allow $ and . in names", function() {
  const schema1:Schema = {
    'todos.Filter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
  };

  expect(() => compileSchema(schema1)).toThrow("Invalid name (can't start with $ or _, can't contain '.' or '\0')");

  const schema2:Schema = {
    '$todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
  };

  expect(() => compileSchema(schema2)).toThrow("Invalid name (can't start with $ or _, can't contain '.' or '\0')");

  const schema3:Schema = {
    'todos\0Filter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
  };

  expect(() => compileSchema(schema3)).toThrow("Invalid name (can't start with $ or _, can't contain '.' or '\0')");

  // $ in the middle of the string is all right
  const schema4:Schema = {
    'todos$Filter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
  };
  const compiledSchema4:CompiledSchema = compileSchema(schema4);
  expect(compiledSchema4).toMatchObject({actions: {}, names: {}});

  const schema5:Schema = {
    '_todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
  };

  expect(() => compileSchema(schema5)).toThrow("Invalid name (can't start with $ or _, can't contain '.' or '\0')");

});

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
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq
    },
  };

  const cs:CompiledSchema = compileSchema(schema);
  const csExpected:CompiledSchema = {
    "names": {
      "customNextPage": {"name": "customNextPage", "type": "custom", namePrefix: "", path: [], schemaPath: [], subPath: [], schemaEntry: schema.customNextPage, dependents: []},
      "todos": {"name": "todos", "type": "collection", namePrefix: "", path: ["todos"], schemaPath: [], subPath: ["todos"], schemaEntry: schema.todos, dependents: ["todosView"]},
      "todosFilter": {"name": "todosFilter", "type": "value", "initValue": "Get milk", namePrefix: "", path: ["todosFilter"], schemaPath: [], subPath: ["todosFilter"], schemaEntry: schema.todosFilter, dependents: []},
      "todosView": {"name": "todosView", "type": "view", namePrefix: "", path: ["todosView"], schemaPath: [], subPath: ["todosView"], schemaEntry: schema.todosView, dependents: []}
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
      _state: {
        todos: {paused: false}
      },
      todosFilter: "Get milk",
      todos: {},
      todosView: {}
    })),
    "allDependents": ["todosView"],
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
    "names": {
      "calendarSchema": {"name": "calendarSchema", "type": "schema", namePrefix: "", path: ["calendarSchema"], schemaPath: [], subPath: ["calendarSchema"], schemaEntry: schema.calendarSchema, dependents: []},
      "calendarSchema.currentMonth": {"name": "calendarSchema.currentMonth", "type": "value", "initValue": "2017-06", namePrefix: "calendarSchema.", path: ["calendarSchema", "currentMonth"], schemaPath: ["calendarSchema"], subPath: ["currentMonth"], schemaEntry: cast(schema["calendarSchema"]).schema.currentMonth, dependents: []},
      "todosFilter": {"name": "todosFilter", "type": "value", "initValue": "Get milk", namePrefix: "", path: ["todosFilter"], schemaPath: [], subPath: ["todosFilter"], schemaEntry: schema.todosFilter, dependents: []}
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
      _state: {},
      todosFilter: "Get milk",
      calendarSchema: {
        currentMonth: "2017-06"
      }
    })),
    "allDependents": [],
  };
  expect(cs).toEqual(csExpected);
});
