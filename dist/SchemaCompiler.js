"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileSchema = exports.compileDependencies = undefined;

var _immutableSorted = require("immutable-sorted");

// deps is array of [sourceName, dependentName]
var compileDependencies = exports.compileDependencies = function compileDependencies(deps) {
  // dt is dependecy table
  var dt = {};

  // cd is compiled dependency table
  var cd = {};

  for (var i = 0; i < deps.length; i++) {
    var dep = deps[i];
    var sourceName = dep[0];
    var depName = dep[1];

    var dtDep = dt[sourceName];

    if (!dtDep) {
      dtDep = [];
      dt[sourceName] = dtDep;
    }
    dtDep.push(depName);
  }

  var expand = function expand(s, output, stackTable, stack) {
    stack.push(s);

    if (stackTable[s]) {
      throw new Error("Dependency loop: " + stack.toString());
    }

    stackTable[s] = true;

    var a = dt[s];

    if (a) for (var _i = 0; _i < a.length; _i++) {
      var si = a[_i];
      output.push(si);
      expand(si, output, stackTable, stack);
    }

    stack.pop();
    delete stackTable[s];
  };

  // eliminate duplicates in arrays (keep the last reference)
  var dedupe = function dedupe(a) {
    var t = {};

    for (var _i2 = a.length - 1; _i2 >= 0; _i2--) {
      var s = a[_i2];

      if (t[s] === undefined) {
        t[s] = _i2;
      }
    }

    var r = [];
    for (var _i3 = 0; _i3 < a.length; _i3++) {
      var _s = a[_i3];

      if (t[_s] === _i3) {
        r.push(_s);
      }
    }

    return r;
  };

  // Expand arrays, identify loops, eliminate duplicates
  for (var _sourceName in dt) {
    var ea = [];
    var stackTable = {};
    var stack = [];

    expand(_sourceName, ea, stackTable, stack);
    var dea = dedupe(ea);

    cd[_sourceName] = dea;
  }

  return cd;
}; /**
    *  Copyright (c) 2017, Applitopia, Inc.
    *  All rights reserved.
    *
    *  This source code is licensed under the MIT-style license found in the
    *  LICENSE file in the root directory of this source tree.
    *
    *  
    */

var compileSchema = exports.compileSchema = function compileSchema(schema) {

  // Compiled Schema
  var cs = {
    names: {},
    actions: {},
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
      var subPathName = entry.path ? entry.path : name;
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

      var cn = { name: name, type: entry.type, namePrefix: namePrefix, path: path, schemaPath: schemaPath, subPath: subPath, schemaEntry: entry, dependents: [] };
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
            break;
          }

        case 'view':
          {
            var sourceName = entry.sourceName;
            if (!sourceName) {
              throw new Error("missing sourceName in view schema: " + name);
            }
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

    // Build dependents
    var deps = [];
    for (var _name in cs.names) {
      var _cn = cs.names[_name];
      var cnse = _cn.schemaEntry;

      switch (cnse.type) {
        case 'view':
          {
            if (!cnse.sourceName) {
              throw new Error("Source collection or view name is not specified for: " + _name);
            }

            var srcName = _cn.namePrefix + cnse.sourceName;
            var sn = cs.names[srcName];
            if (!sn) {
              throw new Error("Source name not found in schema: " + srcName);
            }
            deps.push([srcName, _name]);
            break;
          }
        default:
          {
            break;
          }
      }
    }
    var cd = compileDependencies(deps);
    for (var _name2 in cd) {
      var a = cd[_name2];
      var _sn = cs.names[_name2];
      _sn.dependents = a;
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
              map.setIn(cn.subPath, compileInitState(entry.schema, prefix + name + ".", rootMap));
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
};