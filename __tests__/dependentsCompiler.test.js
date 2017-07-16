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

import { compileDependencies, compileSchema } from '../src/SchemaCompiler';

const cast = <T>(value: any): T => (value: T);

test("Dependencies Compiler", function() {
  const deps1 = [];
  const cd1 = compileDependencies(deps1);
  const expected1 = {};
  expect(cd1).toEqual(expected1);

  const deps2 = [
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["A", "E"],
    ["A", "F"]
  ];
  const cd2 = compileDependencies(deps2);
  const expected2 = {
    "A": ["B", "C", "D", "E", "F"],
    "B": ["C", "D"],
    "C": ["D"],
  };
  expect(cd2).toEqual(expected2);

  const deps3 = [
    ["A", "A"],
  ];
  const cd3 = () => compileDependencies(deps3);
  const expected3 = "Dependency loop: A,A";
  expect(cd3).toThrow(expected3);

  const deps4 = [
    ["B", "A"],
    ["A", "B"],
  ];
  const cd4 = () => compileDependencies(deps4);
  const expected4 = "Dependency loop: B,A,B";
  expect(cd4).toThrow(expected4);

  const deps5 = [
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["D", "B"],
  ];
  const cd5 = () => compileDependencies(deps5);
  const expected5 = "Dependency loop: A,B,C,D,B";
  expect(cd5).toThrow(expected5);

  const deps6 = [
    ["A", "B"],
    ["B", "C"],
    ["C", "D"],
    ["A", "E"],
    ["A", "F"],
    ["Z", "B"],
    ["Z", "A"],
  ];
  const cd6 = compileDependencies(deps6);
  const expected6 = {
    "A": ["B", "C", "D", "E", "F"],
    "B": ["C", "D"],
    "C": ["D"],
    "Z": ["A", "B", "C", "D", "E", "F"],
  };
  expect(cd6).toEqual(expected6);
});

test("Simple Schema Compiler", function() {
  const schema:Schema = {
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq
    },
    'todosViewCnt': {
      type: 'view',
      sourceName: 'todosView',
      props: [],
      recipe: (seq) => seq
    },
  };

  const cs:CompiledSchema = compileSchema(schema);
  const csExpected:CompiledSchema = {
    "names": {
      "todos": {
        "name": "todos",
        "type": "collection",
        namePrefix: "",
        path: ["todos"],
        schemaPath: [],
        subPath: ["todos"],
        schemaEntry: schema.todos,
        dependents: ["todosView", "todosViewCnt"]
      },
      "todosView": {
        "name": "todosView",
        "type": "view",
        namePrefix: "",
        path: ["todosView"],
        schemaPath: [],
        subPath: ["todosView"],
        schemaEntry: schema.todosView,
        dependents: ["todosViewCnt"]
      },
      "todosViewCnt": {
        "name": "todosViewCnt",
        "type": "view",
        namePrefix: "",
        path: ["todosViewCnt"],
        schemaPath: [],
        subPath: ["todosViewCnt"],
        schemaEntry: schema.todosViewCnt,
        dependents: []
      }
    },
    "actions": {
    },
    "initState": cast(fromJS({
      _state: {
        todos: {paused: false}
      },
      todos: {},
      todosView: {},
      todosViewCnt: {}
    })),
    "allDependents": ["todosView", "todosViewCnt"],
  };
  expect(cs).toEqual(csExpected);
});
