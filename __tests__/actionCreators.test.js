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
import { List, fromJS } from 'immutable-sorted';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: any): T => cast(fromJS(value));

test("action creators", function() {
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
      // eslint-disable-next-line no-unused-vars
      reducer: (mutableState: State, action: Action): void => {
          const pageNo:number = mutableState.getIn(["pager", "pageNo"], 0);
          mutableState.setIn(["pager", "pageNo"], pageNo+1);
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

  const engine:EngineInterface = createEngine(schema);

  const insertAction:InsertAction = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  expect(insertAction).toEqual({"type": "DUXEN_INSERT", "collName": "todos", "id": "id1", "doc": fromJS({"text": "Get tickets"})});

  const updateAction:UpdateAction = engine.update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  expect(updateAction).toEqual({"type": "DUXEN_UPDATE", "collName": "todos", "id": "id1", "doc": fromJS({"text": "Get tickets to concert"})});

  const removeAction:RemoveAction = engine.remove("todos", "id1");
  expect(removeAction).toEqual({"type": "DUXEN_REMOVE", "collName": "todos", "id": "id1"});

  const resetAction:ResetAction = engine.reset("todos");
  expect(resetAction).toEqual({"type": "DUXEN_RESET", "collName": "todos"});

  const pauseAction:PauseAction = engine.pause("todos");
  expect(pauseAction).toEqual({"type": "DUXEN_PAUSE", "collName": "todos"});

  const resumeAction:ResumeAction = engine.resume("todos");
  expect(resumeAction).toEqual({"type": "DUXEN_RESUME", "collName": "todos"});

  const saveAction:SaveAction = engine.save("todos");
  expect(saveAction).toEqual({"type": "DUXEN_SAVE", "collName": "todos"});

  const restoreAction:RestoreAction = engine.restore("todos");
  expect(restoreAction).toEqual({"type": "DUXEN_RESTORE", "collName": "todos"});

  const saveOriginalsAction:SaveOriginalsAction = engine.saveOriginals("todos");
  expect(saveOriginalsAction).toEqual({"type": "DUXEN_SAVE_ORIGINALS", "collName": "todos"});

  const retrieveOriginalsAction:RetrieveOriginalsAction = engine.retrieveOriginals("todos");
  expect(retrieveOriginalsAction).toEqual({"type": "DUXEN_RETRIEVE_ORIGINALS", "collName": "todos"});

  const actions:List<CollAction> = List([insertAction, updateAction, removeAction]);
  const batchAction:BatchAction = engine.batch("todos", actions);
  expect(batchAction).toEqual({"type": "DUXEN_BATCH", "collName": "todos", actions});

  const refreshAction:refreshAction = engine.refresh();
  expect(refreshAction).toEqual({"type": "DUXEN_REFRESH"});

  const valueAction:ValueAction = engine.value("todosFilter", "Get sugar");
  expect(valueAction).toEqual({"type": "CHANGE_TODOS_FILTER", "value": "Get sugar"});

  const customAction:CustomAction = engine.custom("customNextPage");
  expect(customAction).toEqual({"type": "CUSTOM_NEXT_PAGE"});

});

test("SubSchema Action creators", function() {
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
        'customNextPage': {
          type: 'custom',
          actionType: 'CUSTOM_NEXT_PAGE',
          action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
          // eslint-disable-next-line no-unused-vars
          reducer: (mutableState: State, action: Action): void => {
            const pageNo:number = mutableState.getIn(["pager", "pageNo"], 0);
            mutableState.setIn(["pager", "pageNo"], pageNo+1);
          }
        },
      },
    }
  };

  const engine:EngineInterface = new createEngine(schema);

  const valueAction:ValueAction = engine.value("todosFilter", "Get sugar");
  expect(valueAction).toEqual({"type": "CHANGE_TODOS_FILTER", "value": "Get sugar"});

  const valueAction2:ValueAction = engine.value("calendarSchema.currentMonth", "2017-07");
  expect(valueAction2).toEqual({"type": "calendarSchema.CHANGE_CURRENT_MONTH", "value": "2017-07"});

  const customAction:CustomAction = engine.custom("calendarSchema.customNextPage");
  expect(customAction).toEqual({"type": "calendarSchema.CUSTOM_NEXT_PAGE"});

});

test("SubSchema Coll Action creators", function() {
  const schema:Schema = {
    'todoSchema': {
      type: "schema",
      schema: {
        'todos': {
          type: 'collection',
          path: "a.b.c",
        },
      }
    }
  };

  const engine:EngineInterface = new createEngine(schema);

  const insertAction:InsertAction = engine.insert("todoSchema.todos", "id1", {text: "Get sugar"});
  expect(insertAction).toEqual({"type": "DUXEN_INSERT", collName: "todoSchema.todos", id: "id1", doc: fromJS({text: "Get sugar"})});

});
