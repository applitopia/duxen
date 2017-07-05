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

  var compileValueSchemaEntry = function compileValueSchemaEntry(name, entry, namePrefix) {
    var actionType = entry.actionType;
    if (!actionType) {
      throw new Error("Missing actionType in value schema: " + JSON.stringify(entry));
    }
    actionType = namePrefix + actionType;
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
    if (entry.path) {
      throw new Error("Path is not allowed in custom schema: " + JSON.stringify(entry));
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

  var compile = function compile(schema, schemaName, schemaPathName) {

    for (var name in schema) {
      if (name.match(/^\$|\.|\0/)) {
        throw Error("Invalid name (can't start with $, can't contain '.' or '\0'): " + name);
      }

      var entry = schema[name];

      if (!entry) {
        throw Error("Improper definition in schema: " + name);
      }

      var schemaPath = schemaPathName ? schemaPathName.split('.') : [];
      var subPathName = (entry.path ? entry.path + '.' : "") + name;
      var subPath = subPathName.split('.');
      var pathNamePrefix = schemaPathName ? schemaPathName + '.' : "";
      var pathName = pathNamePrefix + subPathName;
      var path = pathName.split('.');

      if (entry.type === 'custom') {
        path = path.slice(0, path.length - 1);
        subPath = subPath.slice(0, subPath.length - 1);
      }

      var namePrefix = schemaName ? schemaName + '.' : "";
      name = namePrefix + name;

      var compiledName = cs.names[name];

      if (compiledName) {
        throw Error("Duplicate name in schema: " + name);
      }

      var cn = { name: name, type: entry.type, namePrefix: namePrefix, path: path, schemaPath: schemaPath, subPath: subPath, schemaEntry: entry };
      cs.names[name] = cn;

      switch (entry.type) {

        case 'value':
          {
            cn.initValue = entry.initValue;
            compileValueSchemaEntry(name, entry, namePrefix);
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
            var cva = cs.collViews[collName];
            if (!cva) {
              cva = cs.collViews[namePrefix + collName] = [];
            }
            var _cv = { viewName: name, collName: collName, props: entry.props, recipe: entry.recipe };
            cva.push(_cv);
            break;
          }

        case 'custom':
          {
            compileCustomSchemaEntry(name, entry, namePrefix);
            break;
          }

        case 'schema':
          {
            compile(entry.schema, name, pathName);
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
  var compileInitState = function compileInitState(schema, prefix, rootMap) {
    return (0, _immutableSorted.Map)().withMutations(function (map) {

      if (!rootMap) {
        rootMap = map;
        map.set('_props', (0, _immutableSorted.Map)());
        map.set('_state', (0, _immutableSorted.Map)());
      }
      for (var name in schema) {
        var entry = schema[name];

        if (map.get(name)) {
          throw new Error('duplicate name in schema: ' + name);
        }

        name = prefix + name;
        var cn = cs.names[name];

        switch (entry.type) {
          case 'value':
            {
              map.setIn(cn.subPath, cn.initValue);
              break;
            }
          case 'collection':
            {
              map.setIn(cn.subPath, (0, _immutableSorted.Map)());
              rootMap.setIn(["_state", name, "paused"], false);
              break;
            }
          case 'schema':
            {
              map.set(name, compileInitState(entry.schema, prefix + name + ".", rootMap));
              break;
            }
          case 'custom':
            {
              break;
            }
          case 'view':
            {
              map.setIn(cn.subPath, (0, _immutableSorted.Map)());
              break;
            }

          default:
            {
              throw new Error("Unexpected entry type: " + entry.type);
            }
        }
      }
    });
  };

  compile(schema, "", "");
  cs.initState = compileInitState(schema, "", undefined);

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