"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileSchema = undefined;

var _immutableSorted = require("immutable-sorted");

var compileSchema = exports.compileSchema = function compileSchema(schema) {

  // Compiled Schema
  var cs = {
    names: {},
    actions: {},
    collViews: {},
    initState: (0, _immutableSorted.Map)()
  };

  var compileValueSchemaEntry = function compileValueSchemaEntry(name, entry, prefix) {
    var actionType = entry.actionType;
    if (!actionType) {
      throw new Error("Missing actionType in value schema: " + JSON.stringify(entry));
    }
    actionType = prefix + actionType;
    if (cs.actions[actionType]) {
      throw new Error("Duplicate actionType in value schema: " + JSON.stringify(entry));
    }

    var reducer = function reducer(value, action) {
      switch (action.type) {
        case actionType:
          return entry.reducer ? entry.reducer(value, action) : action.value;
        default:
          return value;
      }
    };

    cs.actions[actionType] = { type: "value", name: name, actionType: actionType, reducer: reducer };
  };

  var compileCustomSchemaEntry = function compileCustomSchemaEntry(name, entry, prefix) {
    var actionType = entry.actionType;
    if (!actionType) {
      throw new Error("Missing actionType in custom schema: " + JSON.stringify(entry));
    }
    actionType = prefix + actionType;
    if (cs.actions[actionType]) {
      throw new Error("Duplicate actionType in custom schema: " + JSON.stringify(entry));
    }
    if (!entry.reducer) {
      throw new Error("Missing reducer in custom schema: " + JSON.stringify(entry));
    }

    var reducer = function reducer(state, action) {
      switch (action.type) {
        case actionType:
          {
            return state.withMutations(function (mutableState) {
              entry.reducer(mutableState, action);
            });
          }
        default:
          {
            return state;
          }
      }
    };

    cs.actions[actionType] = { type: "custom", name: name, actionType: actionType, reducer: reducer };
  };

  var compile = function compile(schema, prefix) {
    for (var name in schema) {
      var entry = schema[name];

      if (!entry) {
        throw Error("Can't find name in schema: " + name);
      }

      var path = prefix.split('.');
      path[path.length - 1] = name;

      if (entry.type === 'custom') {
        path = path.slice(0, path.length - 1);
      }

      name = prefix + name;

      var compiledName = cs.names[name];

      if (compiledName) {
        throw Error("Duplicate name in schema: " + name);
      }

      cs.names[name] = { name: name, type: entry.type, prefix: prefix, path: path, schemaEntry: entry };

      switch (entry.type) {

        case 'value':
          {
            compileValueSchemaEntry(name, entry, prefix);
            break;
          }

        case 'collection':
          {
            var cv = cs.collViews[name];
            if (!cv) {
              cs.collViews[name] = [];
            }
            break;
          }

        case 'view':
          {
            var collName = entry.collName;
            if (!collName) {
              throw new Error("missing collName in view schema: " + name);
            }
            var _cv = cs.collViews[collName];
            if (!_cv) {
              _cv = cs.collViews[collName] = [];
            }
            var newView = { viewName: name, collName: collName, props: entry.props, recipe: entry.recipe };
            _cv.push(newView);
            break;
          }

        case 'custom':
          {
            compileCustomSchemaEntry(name, entry, prefix);
            break;
          }

        case 'schema':
          {
            compile(entry.schema, prefix + name + ".");
            break;
          }

        default:
          {
            throw new Error("Invalid SchemaEntry type: " + entry.type);
          }
      }
    }
  };

  //
  // Initial state
  //
  var compileInitState = function compileInitState(schema) {
    return (0, _immutableSorted.Map)().withMutations(function (map) {
      map.set('_props', (0, _immutableSorted.Map)());
      map.set('_state', (0, _immutableSorted.Map)());
      for (var name in schema) {
        var entry = schema[name];
        if (map.get(name)) {
          throw new Error('duplicate name in schema: ' + name);
        }

        switch (entry.type) {
          case 'value':
            {
              map.set(name, (0, _immutableSorted.fromJS)(entry.initValue));
              break;
            }
          case 'collection':
            {
              map.setIn(["_state", name, "paused"], false);
              map.set(name, (0, _immutableSorted.Map)());
              break;
            }
          case 'schema':
            {
              map.set(name, compileInitState(entry.schema));
              break;
            }
          case 'custom':
            {
              break;
            }
          case 'view':
          default:
            {
              map.set(name, (0, _immutableSorted.Map)());
              break;
            }
        }
      }
    });
  };

  compile(schema, "");
  cs.initState = compileInitState(schema);

  return cs;
}; /**
    *  Copyright (c) 2017, Applitopia, Inc.
    *  All rights reserved.
    *
    *  This source code is licensed under the MIT-style license found in the
    *  LICENSE file in the root directory of this source tree.
    *
    *  
    */