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

var _SubEngine = require('./SubEngine');

var _SubEngine2 = _interopRequireDefault(_SubEngine);

var _ActionFactory = require('./ActionFactory');

var _ActionFactory2 = _interopRequireDefault(_ActionFactory);

var _BoundActionFactory = require('./BoundActionFactory');

var _BoundActionFactory2 = _interopRequireDefault(_BoundActionFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommonEngine = function () {
  _createClass(CommonEngine, [{
    key: '_verifyName',
    value: function _verifyName(name, type) {
      var cs = this._compiledSchema;

      var cn = cs.names[name];

      if (!cn) {
        throw new Error("Missing name in schema: " + name);
      }

      if (cn.type !== type) {
        throw new Error("Not a " + type + ": " + name);
      }
    }
  }]);

  function CommonEngine(schema) {
    _classCallCheck(this, CommonEngine);

    this._compiledSchema = (0, _SchemaCompiler.compileSchema)(schema);
    this._actionFactory = new _ActionFactory2.default(this);
    this._listeners = [];
  }

  _createClass(CommonEngine, [{
    key: '_getCompiledName',
    value: function _getCompiledName(name) {
      var cn = this._compiledSchema.names[name];

      if (!cn) {
        throw new Error("Name not found in schema: " + name);
      }

      return cn;
    }
  }, {
    key: '_getNameType',
    value: function _getNameType(name) {
      var cs = this._compiledSchema;

      var cn = cs.names[name];

      if (!cn) {
        throw new Error("Missing name in schema: " + name);
      }

      return cn.type;
    }

    // Extract a value from state

  }, {
    key: 'get',
    value: function get(state, name) {
      if (!name) {
        return state;
      }
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

      this._listeners.push(listener);

      return function () {
        if (stillSubscribed) {
          stillSubscribed = false;
          var index = _this._listeners.indexOf(listener);
          _this._listeners.splice(index, 1);
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
        for (var name in _this2._compiledSchema.names) {
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

    // SubEngine

  }, {
    key: 'subEngine',
    value: function subEngine(subSchemaPath) {
      this._verifyName(subSchemaPath, 'schema');
      return new _SubEngine2.default(this, subSchemaPath);
    }

    // ActionFactory

  }, {
    key: 'actionFactory',
    value: function actionFactory() {
      return this._actionFactory;
    }
  }, {
    key: 'boundActionFactory',
    value: function boundActionFactory(dispatch) {
      return new _BoundActionFactory2.default(dispatch, this.actionFactory());
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