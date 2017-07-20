'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Copyright (c) 2017, Applitopia, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  This source code is licensed under the MIT-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _immutableSorted = require('immutable-sorted');

var _SchemaCompiler = require('./SchemaCompiler');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cast = function cast(value) {
  return value;
};
var ensure = function ensure(value) {
  return cast((0, _immutableSorted.fromJS)(value));
};

var CommonEngine = function () {
  function CommonEngine(schema) {
    _classCallCheck(this, CommonEngine);

    this.compiledSchema = (0, _SchemaCompiler.compileSchema)(schema);
    this.listeners = [];
  }

  _createClass(CommonEngine, [{
    key: '_getNameType',
    value: function _getNameType(name) {
      var cs = this.compiledSchema;

      var cn = cs.names[name];

      if (!cn) {
        throw new Error("Missing name in schema: " + name);
      }

      return cn.type;
    }
  }, {
    key: '_verifyName',
    value: function _verifyName(name, type) {
      var cs = this.compiledSchema;

      var cn = cs.names[name];

      if (!cn) {
        throw new Error("Missing name in schema: " + name);
      }

      if (cn.type !== type) {
        throw new Error("Not a " + type + ": " + name);
      }
    }
  }, {
    key: '_verifyCollection',
    value: function _verifyCollection(collName) {
      this._verifyName(collName, 'collection');
    }
  }, {
    key: '_verifyValueName',
    value: function _verifyValueName(valueName) {
      this._verifyName(valueName, 'value');
    }
  }, {
    key: '_verifyCustomValueName',
    value: function _verifyCustomValueName(valueName) {
      this._verifyName(valueName, 'customValue');
    }
  }, {
    key: '_verifyCustomName',
    value: function _verifyCustomName(customName) {
      this._verifyName(customName, 'custom');
    }

    // Dispatch an action to listeners

  }, {
    key: '_action',
    value: function _action(action) {
      for (var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        listener(action);
      }
    }
  }, {
    key: '_getCompiledName',
    value: function _getCompiledName(name) {
      var cn = this.compiledSchema.names[name];

      if (!cn) {
        throw new Error("Name not found in schema: " + name);
      }

      return cn;
    }

    // Extract a value from state

  }, {
    key: 'get',
    value: function get(state, name) {
      var cn = this._getCompiledName(name);
      return state.getIn(cn.path);
    }

    //
    // Subscribe to all actions created by this engine
    //
    // Returns a function to unsubscribe
    //

  }, {
    key: 'subscribe',
    value: function subscribe(listener) {
      var _this = this;

      if (typeof listener !== 'function') {
        throw new Error('Listener must be a function.');
      }

      var stillSubscribed = true;

      this.listeners.push(listener);

      return function () {
        if (stillSubscribed) {
          stillSubscribed = false;
          var index = _this.listeners.indexOf(listener);
          _this.listeners.splice(index, 1);
        }
      };
    }

    //
    // Remove all internal items from the state
    //

  }, {
    key: 'printableState',
    value: function printableState(state) {
      return state.withMutations(function (mutableState) {
        mutableState.delete("_state");
      });
    }
  }, {
    key: 'persistableState',
    value: function persistableState(state) {
      var _this2 = this;

      return (0, _immutableSorted.Map)().withMutations(function (mutableState) {
        for (var name in _this2.compiledSchema.names) {
          var cn = _this2._getCompiledName(name);
          switch (cn.type) {
            case 'value':
            case 'collection':
              {
                mutableState.setIn(cn.path, state.getIn(cn.path));
                break;
              }
            default:
              {
                // ignore
                break;
              }
          }
        }
      });
    }

    //
    // Action creators
    //

  }, {
    key: 'batch',
    value: function batch(collName, actions) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_BATCH',
        collName: collName,
        actions: (0, _immutableSorted.List)(actions)
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'insert',
    value: function insert(collName, id, doc) {
      this._verifyCollection(collName);
      id = ensure(id);
      doc = ensure(doc);
      var action = {
        type: 'DUXEN_INSERT',
        collName: collName,
        id: id,
        doc: doc
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'update',
    value: function update(collName, id, doc) {
      this._verifyCollection(collName);
      id = ensure(id);
      doc = ensure(doc);
      var action = {
        type: 'DUXEN_UPDATE',
        collName: collName,
        id: id,
        doc: doc
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'remove',
    value: function remove(collName, id) {
      this._verifyCollection(collName);
      id = ensure(id);
      var action = {
        type: 'DUXEN_REMOVE',
        collName: collName,
        id: id
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'reset',
    value: function reset(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_RESET',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'pause',
    value: function pause(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_PAUSE',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'resume',
    value: function resume(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_RESUME',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'save',
    value: function save(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_SAVE',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'restore',
    value: function restore(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_RESTORE',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'saveOriginals',
    value: function saveOriginals(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_SAVE_ORIGINALS',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'retrieveOriginals',
    value: function retrieveOriginals(collName) {
      this._verifyCollection(collName);
      var action = {
        type: 'DUXEN_RETRIEVE_ORIGINALS',
        collName: collName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var action = {
        type: 'DUXEN_REFRESH'
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'value',
    value: function value(valueName, _value) {
      this._verifyValueName(valueName);

      _value = ensure(_value);
      var action = {
        type: 'DUXEN_VALUE',
        valueName: valueName,
        value: _value
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'customValue',
    value: function customValue(valueName, value) {
      this._verifyCustomValueName(valueName);

      var cs = this.compiledSchema;
      var cn = cs.names[valueName];
      var valueEntry = cast(cn.schemaEntry);
      var actionType = valueEntry.actionType;

      if (!actionType) {
        throw new Error("Missing actionType in value schema: " + JSON.stringify(valueEntry));
      }

      if (valueEntry.action) {
        var _action2 = valueEntry.action(value);
        this._action(_action2);
        return _action2;
      }

      value = ensure(value);

      var action = {
        type: cn.namePrefix + actionType,
        value: value
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'custom',
    value: function custom(customName) {
      this._verifyCustomName(customName);
      var cs = this.compiledSchema;
      var cn = cs.names[customName];
      var customEntry = cast(cn.schemaEntry);
      var actionType = customEntry.actionType;

      if (!actionType) {
        throw new Error("Missing actionType in custom schema: " + JSON.stringify(customEntry));
      }

      if (!customEntry.action) {
        throw new Error("Missing action in custom schema: " + JSON.stringify(customEntry));
      }

      var action = customEntry.action();

      if (action.type !== undefined && action.type !== actionType) {
        throw new Error("Inconsistent custom action type: " + JSON.stringify(action.type) + " vs " + actionType);
      }
      action.type = cn.namePrefix + actionType;
      this._action(action);
      return action;
    }

    //
    // Compile the reducer
    //

  }, {
    key: 'reducer',
    value: function reducer() {
      throw new Error("Reducer is not implemented in CommonEngine");
    }
  }]);

  return CommonEngine;
}();

exports.default = CommonEngine;