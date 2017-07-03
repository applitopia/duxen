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
    key: '_verifyCustomName',
    value: function _verifyCustomName(customName) {
      this._verifyName(customName, 'custom');
    }
  }, {
    key: '_action',
    value: function _action(action) {
      for (var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        listener(action);
      }
    }

    //
    // Subscribe to all action created by this engine
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
    key: 'cleanState',
    value: function cleanState(state) {
      var _this2 = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      return state.withMutations(function (mutableState) {
        mutableState.delete("_props");
        mutableState.delete("_state");
        mutableState.forEach(function (v, k) {
          if (_this2._getNameType(prefix + k) === 'schema') {
            mutableState.set(k, _this2.cleanState(cast(v), k + "."));
          }
        });
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
    key: 'value',
    value: function value(valueName, _value) {
      this._verifyValueName(valueName);

      var cs = this.compiledSchema;
      var cn = cs.names[valueName];
      var valueEntry = cast(cn.schemaEntry);
      var actionType = valueEntry.actionType;

      if (!actionType) {
        throw new Error("Missing actionType in value schema: " + JSON.stringify(valueEntry));
      }

      if (valueEntry.action) {
        return valueEntry.action(_value);
      }

      _value = ensure(_value);

      var action = {
        type: cn.prefix + actionType,
        value: _value
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

      if (action.type !== actionType) {
        throw new Error("Inconsistent custom action type: " + JSON.stringify(action.type) + " vs " + actionType);
      }
      action.type = cn.prefix + actionType;
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