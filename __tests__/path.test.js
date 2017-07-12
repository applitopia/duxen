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
import { fromJS } from 'immutable-sorted';

const cast = <T>(value: any): T => (value: T);
const ensure = <T>(value: any): T => cast(fromJS(value));

test("Reducer value is aware of path", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      path: 'a.b.c.todosFilter',
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
    a: {
      b: {
        c: {
          todosFilter: "Get milk",
        }
      }
    },
    todos: {},
    todosView: {}
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    todos: {},
    todosView: {}
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    todos: {id1: {"text": "Get tickets"}},
    todosView: {id1: {"text": "Get tickets"}}
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    todos: {id1: {"text": "Get tickets to concert"}},
    todosView: {id1: {"text": "Get tickets to concert"}}
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    todos: {},
    todosView: {}
  };
  expect(state4.toJS()).toEqual(expected4);

});

test("Reducer value, collection, view are aware of path", function() {
  const schema:Schema = {
    'todosFilter': {
      type: 'value',
      path: 'a.b.c.todosFilter',
      initValue: "Get milk",
      actionType: 'CHANGE_TODOS_FILTER',
    },
    'todos': {
      type: 'collection',
      path: 'x.y.z.todos',
    },
    'todosView': {
      type: 'view',
      path: 'views.are.here.todosView',
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
    a: {
      b: {
        c: {
          todosFilter: "Get milk",
        }
      }
    },
    x: {
      y: {
        z: {
          todos: {},
        }
      }
    },
    views: {
      are: {
        here: {
          todosView: {}
        }
      }
    },
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = engine.value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    x: {
      y: {
        z: {
          todos: {},
        }
      }
    },
    views: {
      are: {
        here: {
          todosView: {}
        }
      }
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = engine.insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    x: {
      y: {
        z: {
          todos: {id1: {"text": "Get tickets"}},
        }
      }
    },
    views: {
      are: {
        here: {
          todosView: {id1: {"text": "Get tickets"}},
        }
      }
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = engine.update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    x: {
      y: {
        z: {
          todos: {id1: {"text": "Get tickets to concert"}},
        }
      }
    },
    views: {
      are: {
        here: {
          todosView: {id1: {"text": "Get tickets to concert"}},
        }
      }
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = engine.remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _props: {todosView: {}},
    _state: {todos: {paused: false}},
    a: {
      b: {
        c: {
          todosFilter: "Get sugar",
        }
      }
    },
    x: {
      y: {
        z: {
          todos: {},
        }
      }
    },
    views: {
      are: {
        here: {
          todosView: {},
        }
      }
    },
  };
  expect(state4.toJS()).toEqual(expected4);

});
