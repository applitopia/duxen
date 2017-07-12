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

test("Reducer insert, update remove", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}};
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}}
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}}
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}
  };
  expect(state4.toJS()).toEqual(expected4);

});

test("Reducer reset", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {},
    todosView: {}};
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {id1: {"text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}}
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    }
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    }
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.reset("todos");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {
    },
    todosView: {
    }
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Reducer pause, resume", function() {
  const schema:Schema = {
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todos: {},
    todosView: {}
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.pause("todos");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {},
    _state: {todos: {paused: true}},
    todos: {},
    todosView: {}
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {},
    _state: {todos: {paused: true}},
    todos: {id1: {"text": "Get tickets"}},
    todosView: {}
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {},
    _state: {todos: {paused: true}},
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosView: {}
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {},
    _state: {todos: {paused: true}},
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {}
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.resume("todos");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    }
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Reducer save, restore", function() {
  const schema:Schema = {
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {"todosView": {}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.save("todos");
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        paused: false,
        "saved": {
          "id1": {"text": "Get tickets"}
        }
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        paused: false,
        "saved": {
          "id1": {"text": "Get tickets"}
        }
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        paused: false,
        "saved": {
          "id1": {"text": "Get tickets"}
        }
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.restore("todos");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    }
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Reducer saveOriginals, insert, retrieveOriginals", function() {
  const schema:Schema = {
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {"todosView": {}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.saveOriginals("todos");
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        "originals": {},
        paused: false,
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        "originals": {
          id2: undefined,
        },
        paused: false,
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        "originals": {
          id2: undefined,
          id3: undefined,
        },
        paused: false,
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.retrieveOriginals("todos");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        paused: false,
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
  };
  expect(state5.toJS()).toEqual(expected5);

});


test("Reducer saveOriginals, insert, update, remove, retrieveOriginals", function() {
  const schema:Schema = {
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {"todosView": {}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.saveOriginals("todos");
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        "originals": {},
        paused: false,
      }
    },
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.update("todos", "id1", ensure({"text": "Get milk"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        "originals": {
          id1: {"text": "Get tickets"},
        },
        paused: false,
      }
    },
    todos: {
      id1: {"text": "Get milk"},
    },
    todosView: {
      id1: {"text": "Get milk"},
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        "originals": {
          id1: {"text": "Get tickets"},
        },
        paused: false,
      }
    },
    todos: {},
    todosView: {},
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.retrieveOriginals("todos");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {"todosView": {}},
    _state: {
      todos: {
        paused: false,
      }
    },
    todos: {},
    todosView: {},
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Reducer batch", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {},
      recipe: (seq) => seq,
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));

  const action3 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));

  const action4 = engine.batch("todos", List([action1, action2, action3]));
  const state4 = reducer(state0, action4);
  const expected4 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosView: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    }
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = engine.reset("todos");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    todosFilter: "Get sugar",
    todos: {
    },
    todosView: {
    }
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Reducer props", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
    },
    'todosView': {
      type: 'view',
      sourceName: 'todos',
      props: {
        filter: (state) => state.getIn(['todosFilter']),
      },
      recipe: (seq, props) => seq.filter(v=>v.get('text').indexOf(props.filter) >= 0),
    },
  };

  const engine:EngineInterface = new createEngine(schema);
  const reducer:Reducer = engine.reducer();

  const state0:State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _props: {},
    _state: {todos: {paused: false}},
    todosFilter: "Get milk",
    todos: {},
    todosView: {}};
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {"todosView": {"filter": "Get milk"}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
    },
    todosFilter: "Get milk",
    todosView: {
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id2", ensure({"text": "Get milk"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {"todosView": {"filter": "Get milk"}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
    },
    todosFilter: "Get milk",
    todosView: {
      id2: {"text": "Get milk"},
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.insert("todos", "id3", ensure({"text": "Get sugar"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {"todosView": {"filter": "Get milk"}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosFilter: "Get milk",
    todosView: {
      id2: {"text": "Get milk"},
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.value("todosFilter", "sugar");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {"todosView": {"filter": "sugar"}},
    _state: {todos: {paused: false}},
    todos: {
      id1: {"text": "Get tickets"},
      id2: {"text": "Get milk"},
      id3: {"text": "Get sugar"},
    },
    todosFilter: "sugar",
    todosView: {
      id3: {"text": "Get sugar"},
    },
  };
  expect(state4.toJS()).toEqual(expected4);

});
