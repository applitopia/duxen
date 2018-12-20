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

test("Reducer insert, update remove", function() {
  const schema: Schema = {
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
      recipe: (seq) => seq,
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const repoReducer: RepoReducer = engine.repoReducer();

  const state0: Repo = repoReducer(undefined, {type: "INIT"});
  const expected0 ={
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"}
        ],
        "currentIndex": 0,
        "live": true,
        "states": [
          {"_state": {"todos": {"paused": false}},
          "todos": {},
          "todosFilter": "Get milk",
          "todosView": {}}
        ]
      }
    },
    "currentBranch": "master",
    "options": {"history": 1000},
    "version": 0
  };
  expect(state0.toJS()).toEqual(expected0);

  expect(engine.currentBranch(state0)).toEqual("master");

  const expectedHead0 = {
    "_state": {"todos": {"paused": false}},
    "todos": {},
    "todosFilter": "Get milk",
    "todosView": {}
  };

  expect(engine.head(state0).toJS()).toEqual(expectedHead0);

  const action0: Action = engine.actionFactory().insert("todos", "id1", {"text": "Get tickets"});

  const state1: Repo = repoReducer(state0, action0);
  const expected1 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       }
     },
     "currentBranch": "master",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state1.toJS()).toEqual(expected1);

  expect(engine.currentBranch(state1)).toEqual("master");

  const expectedHead1 = {
    "_state": {"todos": {"paused": false}},
    "todos": {"id1": {"text": "Get tickets"}},
    "todosFilter": "Get milk",
    "todosView": {"id1": {"text": "Get tickets"}}
  };

  expect(engine.head(state1).toJS()).toEqual(expectedHead1);

  const action1: Action = engine.actionFactory().createBranch("test");

  const state2: Repo = repoReducer(state1, action1);
  const expected2 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "test": {
         "actions": [],
         "currentIndex": -1,
         "live": true,
         "states": []
       }
     },
     "currentBranch": "master",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state2.toJS()).toEqual(expected2);

  expect(engine.currentBranch(state2)).toEqual("master");

  const expectedHead2 = {
    "_state": {"todos": {"paused": false}},
    "todos": {"id1": {"text": "Get tickets"}},
    "todosFilter": "Get milk",
    "todosView": {"id1": {"text": "Get tickets"}}
  };

  expect(engine.head(state1).toJS()).toEqual(expectedHead2);

  const action2: Action = engine.actionFactory().switchBranch("hello");
  expect(() => repoReducer(state2, action2)).toThrow("the branch does not exist: hello");
  const state3: Repo = state2;

  const action3: Action = engine.actionFactory().createBranch("test");
  expect(() => repoReducer(state3, action3)).toThrow("the branch already exists: test");
  const state4: Repo = state3;

  const action4: Action = engine.actionFactory().saveBranch("backup");
  const state5: Repo = repoReducer(state4, action4);
  const expected5 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "backup": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 1,
         "live": true,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       },
       "test": {
         "actions": [],
         "currentIndex": -1,
         "live": true,
         "states": []
       }
     },
     "currentBranch": "master",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state5.toJS()).toEqual(expected5);

  expect(engine.currentBranch(state5)).toEqual("master");

  const expectedHead5 = {
    "_state": {"todos": {"paused": false}},
    "todos": {"id1": {"text": "Get tickets"}},
    "todosFilter": "Get milk",
    "todosView": {"id1": {"text": "Get tickets"}}
  };

  expect(engine.head(state5).toJS()).toEqual(expectedHead5);

  const action5: Action = engine.actionFactory().switchBranch("test");
  const state6: Repo = repoReducer(state5, action5);
  const expected6 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "backup": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 1,
         "live": true,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       },
       "test": {
         "actions": [],
         "currentIndex": -1,
         "live": true,
         "states": []
       }
     },
     "currentBranch": "test",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state6.toJS()).toEqual(expected6);

  expect(engine.currentBranch(state6)).toEqual("test");

  const expectedHead6 = undefined;

  expect(engine.head(state6)).toEqual(expectedHead6);

  const action6: Action = engine.actionFactory().resetBranch("master");
  const state7: Repo = repoReducer(state6, action6);
  const expected7 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "backup": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 1,
         "live": true,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       },
       "test": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 1,
         "live": true,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       }
     },
     "currentBranch": "test",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state7.toJS()).toEqual(expected7);

  expect(engine.currentBranch(state7)).toEqual("test");

  const expectedHead7 = {
    "_state": {"todos": {"paused": false}},
    "todos": {"id1": {"text": "Get tickets"}},
    "todosFilter": "Get milk",
    "todosView": {"id1": {"text": "Get tickets"}}
  };

  expect(engine.head(state7).toJS()).toEqual(expectedHead7);

  const action7: Action = engine.actionFactory().removeBranch("test");
  expect(() => repoReducer(state7, action7)).toThrow("cannot remove branch that is current");
  const state8: Repo = state7;

  const action8: Action = engine.actionFactory().removeBranch("backup");
  const state9: Repo = repoReducer(state8, action8);
  const expected9 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "test": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 1,
         "live": true,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       }
     },
     "currentBranch": "test",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state9.toJS()).toEqual(expected9);

  expect(engine.currentBranch(state9)).toEqual("test");

  const expectedHead9 = {
    "_state": {"todos": {"paused": false}},
    "todos": {"id1": {"text": "Get tickets"}},
    "todosFilter": "Get milk",
    "todosView": {"id1": {"text": "Get tickets"}}
  };

  expect(engine.head(state9).toJS()).toEqual(expectedHead9);

  const action9: Action = engine.actionFactory().goBack(1);
  const state10: Repo = repoReducer(state9, action9);
  const expected10 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "test": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 0,
         "live": false,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       }
     },
     "currentBranch": "test",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state10.toJS()).toEqual(expected10);

  expect(engine.currentBranch(state10)).toEqual("test");

  const expectedHead10 = {
    "_state": {"todos": {"paused": false}},
     "todos": {},
     "todosFilter": "Get milk", "todosView": {}
  };

  expect(engine.head(state10).toJS()).toEqual(expectedHead10);

  const action10: Action = engine.actionFactory().goLive();
  const state11: Repo = repoReducer(state10, action10);
  const expected11 = {
    "branches": {
      "master": {
        "actions": [
          {"type": "INIT"},
          {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
        ],
        "currentIndex": 1,
        "live": true,
        "states": [
          {
            "_state": {"todos": {"paused": false}},
             "todos": {},
             "todosFilter": "Get milk", "todosView": {}
           },
           {
             "_state": {"todos": {"paused": false}},
             "todos": {"id1": {"text": "Get tickets"}},
             "todosFilter": "Get milk",
             "todosView": {"id1": {"text": "Get tickets"}}
           }
         ]
       },
       "test": {
         "actions": [
           {"type": "INIT"},
           {"collName": "todos", "doc": {"text": "Get tickets"}, "id": "id1", "type": "DUXEN_INSERT"}
         ],
         "currentIndex": 1,
         "live": true,
         "states": [
           {
             "_state": {"todos": {"paused": false}},
              "todos": {},
              "todosFilter": "Get milk", "todosView": {}
            },
            {
              "_state": {"todos": {"paused": false}},
              "todos": {"id1": {"text": "Get tickets"}},
              "todosFilter": "Get milk",
              "todosView": {"id1": {"text": "Get tickets"}}
            }
          ]
       }
     },
     "currentBranch": "test",
     "options": {"history": 1000},
     "version": 0
  };
  expect(state11.toJS()).toEqual(expected11);

  expect(engine.currentBranch(state11)).toEqual("test");

  const expectedHead11 = {
    "_state": {"todos": {"paused": false}},
    "todos": {"id1": {"text": "Get tickets"}},
    "todosFilter": "Get milk",
    "todosView": {"id1": {"text": "Get tickets"}}
  };

  expect(engine.head(state11).toJS()).toEqual(expectedHead11);

});
