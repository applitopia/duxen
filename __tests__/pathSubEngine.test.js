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

test("Subschema and value, collection, view with path", function() {
  const todosAppSchema: Schema = {
    'todosFilter': {
      type: 'value',
      path: 'a.b.c.todosFilter',
      initValue: "Get milk",
    },
    'todos': {
      type: 'collection',
      path: 'x.y.z.todos',
    },
    'todosView': {
      type: 'view',
      path: 'views.are.here.todosView',
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq,
    },
    'customNextPage': {
      type: 'custom',
      actionType: 'CUSTOM_NEXT_PAGE',
      action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
      // eslint-disable-next-line no-unused-vars
      reducer: (mutableState: State, action: Action): void => {
          const pageNo: number = mutableState.getIn(["pager", "pageNo"], 0);
          mutableState.setIn(["pager", "pageNo"], pageNo+1);
      },
    },
  };

  const schema: Schema = {
    'todosApp': {
      type: 'schema',
      schema: todosAppSchema,
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const subEngine: EngineInterface = engine.subEngine("todosApp");
  const reducer: StateReducer = engine.stateReducer();

  const state0: State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    "todosApp": {
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
    },
  };
  expect(state0.toJS()).toEqual(expected0);

  const action1 = subEngine.actionFactory().value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    "todosApp": {
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
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const action2 = subEngine.actionFactory().insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    "todosApp": {
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
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = subEngine.actionFactory().update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    "todosApp": {
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
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = subEngine.actionFactory().remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    "todosApp": {
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
    },
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = subEngine.actionFactory().remove("todos", "id1");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    "todosApp": {
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
    },
  };
  expect(state5.toJS()).toEqual(expected5);

});

test("Subschema with path, and value, collection, view with path", function() {
  const todosAppSchema: Schema = {
    'todosFilter': {
      type: 'value',
      path: 'a.b.c.todosFilter',
      initValue: "Get milk",
    },
    'todos': {
      type: 'collection',
      path: 'x.y.z.todos',
    },
    'todosView': {
      type: 'view',
      path: 'views.are.here.todosView',
      sourceName: 'todos',
      props: [],
      recipe: (seq) => seq,
    },
    'customNextPage': {
      type: 'custom',
      actionType: 'CUSTOM_NEXT_PAGE',
      action: () => ({type: 'CUSTOM_NEXT_PAGE'}),
      // eslint-disable-next-line no-unused-vars
      reducer: (mutableState: State, action: Action): void => {
          const pageNo: number = mutableState.getIn(["pager", "pageNo"], 0);
          mutableState.setIn(["pager", "pageNo"], pageNo+1);
      },
    },
  };

  const schema: Schema = {
    'todosApp': {
      type: 'schema',
      schema: todosAppSchema,
      path: 'coffee.burger.pizza.poker.todosApp',
    },
  };

  const engine: EngineInterface = new createEngine(schema);
  const subEngine: EngineInterface = engine.subEngine("todosApp");
  const reducer: StateReducer = engine.stateReducer();

  const state0: State = reducer(undefined, {type: "INIT"});
  const expected0 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    coffee: {
      burger: {
        pizza: {
          poker: {
            "todosApp": {
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
            },
          }
        }
      }
    },
  };
  expect(state0.toJS()).toEqual(expected0);

  const state0s: State = subEngine.get(state0, "todosFilter");
  const expected0s = "Get milk";
  expect(state0s).toEqual(expected0s);

  const action1 = subEngine.actionFactory().value("todosFilter", "Get sugar");
  const state1 = reducer(state0, action1);
  const expected1 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    coffee: {
      burger: {
        pizza: {
          poker: {
            "todosApp": {
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
            },
          }
        }
      }
    },
  };
  expect(state1.toJS()).toEqual(expected1);

  const state1s = subEngine.get(state1, "todosFilter");
  const expected1s = "Get sugar";
  expect(state1s).toEqual(expected1s);

  const action2 = subEngine.actionFactory().insert("todos", "id1", ensure({"text": "Get tickets"}));
  const state2 = reducer(state1, action2);
  const expected2 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    coffee: {
      burger: {
        pizza: {
          poker: {
            "todosApp": {
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
            },
          }
        }
      }
    },
  };
  expect(state2.toJS()).toEqual(expected2);

  const action3 = subEngine.actionFactory().update("todos", "id1", ensure({"text": "Get tickets to concert"}));
  const state3 = reducer(state2, action3);
  const expected3 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    coffee: {
      burger: {
        pizza: {
          poker: {
            "todosApp": {
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
            },
          }
        }
      }
    },
  };
  expect(state3.toJS()).toEqual(expected3);

  const action4 = subEngine.actionFactory().remove("todos", "id1");
  const state4 = reducer(state3, action4);
  const expected4 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    coffee: {
      burger: {
        pizza: {
          poker: {
            "todosApp": {
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
            },
          }
        }
      }
    },
  };
  expect(state4.toJS()).toEqual(expected4);

  const action5 = subEngine.actionFactory().remove("todos", "id1");
  const state5 = reducer(state4, action5);
  const expected5 = {
    _state: {
      "todosApp.todos": {paused: false}
    },
    coffee: {
      burger: {
        pizza: {
          poker: {
            "todosApp": {
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
            },
          }
        }
      }
    },
  };
  expect(state5.toJS()).toEqual(expected5);

});
