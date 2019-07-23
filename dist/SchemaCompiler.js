"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileSchema = exports.compileDependencies = void 0;

var _immutableSorted = require("immutable-sorted");

var _seqen = require("seqen");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var cast = function cast(value) {
  return value;
}; // deps is array of [sourceName, dependentName]


var compileDependencies = function compileDependencies(deps) {
  // dt is dependecy table
  var dt = {}; // cd is compiled dependency table

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
  }; // eliminate duplicates in arrays (keep the last reference)


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
  }; // Expand arrays, identify loops, eliminate duplicates


  for (var _sourceName in dt) {
    var ea = [];
    var stackTable = {};
    var stack = [];
    expand(_sourceName, ea, stackTable, stack);
    var dea = dedupe(ea);
    cd[_sourceName] = dea;
  }

  return cd;
};

exports.compileDependencies = compileDependencies;

var compileSchema = function compileSchema(schema) {
  // Compiled Schema
  var cs = {
    names: {},
    actions: {},
    initState: (0, _immutableSorted.Map)(),
    allDependents: []
  };

  var verifyNames = function verifyNames(name, namePrefix) {
    if (typeof name !== 'string') {
      throw new Error("wrong name: " + name);
    }

    if (name.length === 0) {
      throw new Error("empty name");
    }

    if (typeof namePrefix !== 'string') {
      throw new Error("wrong namePrefix: " + namePrefix);
    }
  };

  var verifyProps = function verifyProps(props) {
    if (!Array.isArray(props)) {
      throw new Error("Props are not in Array");
    }

    for (var pi = 0, len = props.length; pi < len; pi++) {
      var propName = props[pi];

      switch (_typeof(propName)) {
        case 'string':
          {
            break;
          }

        default:
          {
            throw new Error("Invalid type of propName: " + _typeof(propName));
          }
      }
    }
  };

  var compileValue = function compileValue(name, entry, namePrefix) {
    verifyNames(name, namePrefix);
  };

  var compileCustomValue = function compileCustomValue(name, entry, namePrefix) {
    verifyNames(name, namePrefix);
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

    cs.actions[actionType] = {
      type: "customValue",
      name: name,
      actionType: actionType,
      reducer: reducer
    };
  };

  var compileFormula = function compileFormula(name, entry, namePrefix) {
    verifyNames(name, namePrefix);
    verifyProps(entry.props);

    if (!entry.props) {
      throw new Error("missing props: " + name);
    }
  };

  var compileCollection = function compileCollection(name, entry, namePrefix) {
    verifyNames(name, namePrefix);
  };

  var compileView = function compileView(name, entry, namePrefix) {
    verifyNames(name, namePrefix);
    verifyProps(entry.props);
    var sourceName = entry.sourceName;

    if (!sourceName) {
      throw new Error("missing sourceName in view schema: " + name);
    }
  };

  var compileCustom = function compileCustom(name, entry, prefix) {
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

    cs.actions[actionType] = {
      type: "custom",
      name: name,
      actionType: actionType,
      reducer: reducer
    };
  };

  var compile = function compile(schema, schemaName, schemaPathName) {
    for (var name in schema) {
      if (name.match(/^[$_]|\.|\0/)) {
        throw Error("Invalid name (can't start with $ or _, can't contain '.' or '\0'): " + name);
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

      var cn = {
        name: name,
        type: entry.type,
        persistent: false,
        namePrefix: namePrefix,
        path: path,
        schemaPath: schemaPath,
        subPath: subPath,
        schemaEntry: entry,
        dependents: []
      };
      cs.names[name] = cn;

      switch (entry.type) {
        case 'value':
          {
            cn.initValue = entry.initValue;

            if (entry.persistent === true) {
              cn.persistent = entry.persistent;
            }

            compileValue(name, entry, namePrefix);
            break;
          }

        case 'customValue':
          {
            cn.initValue = entry.initValue;

            if (entry.persistent === true) {
              cn.persistent = entry.persistent;
            }

            compileCustomValue(name, entry, namePrefix);
            break;
          }

        case 'formula':
          {
            compileFormula(name, entry, namePrefix);
            break;
          }

        case 'collection':
          {
            if (entry.persistent === true) {
              cn.persistent = entry.persistent;
            }

            compileCollection(name, entry, namePrefix);
            break;
          }

        case 'view':
          {
            var vse = cast(entry);
            cn.seqen = new _seqen.Seqen(vse.recipe);
            compileView(name, entry, namePrefix);
            break;
          }

        case 'custom':
          {
            compileCustom(name, entry, namePrefix);
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
    } // Build dependents


    var deps = [];
    var allDeps = [];

    for (var _name in cs.names) {
      var _cn = cs.names[_name];
      var cnse = _cn.schemaEntry;

      switch (cnse.type) {
        case 'formula':
          {
            // Add props to the dependencies as well
            for (var i = 0, len = cnse.props.length; i < len; i++) {
              deps.push([_cn.namePrefix + cnse.props[i], _name]);
            }

            allDeps.push(["allDeps", _name]);
            break;
          }

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
            allDeps.push(["allDeps", _name]); // Add props to the dependencies as well

            for (var _i4 = 0, _len = cnse.props.length; _i4 < _len; _i4++) {
              deps.push([_cn.namePrefix + cnse.props[_i4], _name]);
            }

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

      if (!_sn) {
        throw new Error("Missing compiled name: " + _name2);
      }

      _sn.dependents = a;
    }

    var allDepsCombined = allDeps.concat(deps);
    var allCd = compileDependencies(allDepsCombined);

    if (allCd.allDeps) {
      cs.allDependents = allCd.allDeps;
    }
  }; //
  // Initial state
  //


  var compileInitState = function compileInitState(schema, prefix, rootMap) {
    return (0, _immutableSorted.Map)().withMutations(function (map) {
      if (!rootMap) {
        rootMap = map;
        map.set('_state', (0, _immutableSorted.Map)());
      }

      for (var name in schema) {
        var entry = schema[name];
        name = prefix + name;
        var cn = cs.names[name];

        if (!cn) {
          throw new Error('unknown name: ' + name);
        }

        if (cn.type !== 'custom' && map.getIn(cast(cn.subPath))) {
          throw new Error('duplicate name in schema: ' + name);
        }

        switch (entry.type) {
          case 'value':
            {
              map.setIn(cast(cn.subPath), cn.initValue);
              break;
            }

          case 'customValue':
            {
              map.setIn(cast(cn.subPath), cn.initValue);
              break;
            }

          case 'collection':
            {
              map.setIn(cast(cn.subPath), (0, _immutableSorted.Map)());
              rootMap.setIn(["_state", name, "paused"], false);
              break;
            }

          case 'schema':
            {
              map.setIn(cast(cn.subPath), compileInitState(entry.schema, name + ".", rootMap));
              break;
            }

          case 'custom':
            {
              break;
            }

          case 'view':
            {
              map.setIn(cast(cn.subPath), (0, _immutableSorted.Map)());
              break;
            }

          case 'formula':
            {
              map.setIn(cast(cn.subPath), undefined);
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

exports.compileSchema = compileSchema;