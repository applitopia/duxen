(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

var _CommonEngine = require('./CommonEngine');

var _CommonEngine2 = _interopRequireDefault(_CommonEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cast = function cast(value) {
  return value;
};
var ensure = function ensure(value) {
  return cast((0, _immutableSorted.fromJS)(value));
};

var ActionFactory = function () {
  function ActionFactory(engine) {
    _classCallCheck(this, ActionFactory);

    this.engine = engine;
  }

  _createClass(ActionFactory, [{
    key: '_verifyName',
    value: function _verifyName(name, type) {
      var cs = this.engine._compiledSchema;

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
      // Make action immutable
      Object.freeze(action);

      var listeners = this.engine._listeners;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener(action);
      }
    }

    //
    // Action creators
    //

  }, {
    key: 'batch',
    value: function batch(actions) {
      var action = {
        type: 'DUXEN_BATCH',
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

      var cs = this.engine._compiledSchema;
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
      var cs = this.engine._compiledSchema;
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
    // Repo Actions
    //

  }, {
    key: 'createBranch',
    value: function createBranch(branchName) {
      var action = {
        type: 'DUXEN_CREATE_BRANCH',
        branchName: branchName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'switchBranch',
    value: function switchBranch(branchName) {
      var action = {
        type: 'DUXEN_SWITCH_BRANCH',
        branchName: branchName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'saveBranch',
    value: function saveBranch(branchName) {
      var action = {
        type: 'DUXEN_SAVE_BRANCH',
        branchName: branchName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'resetBranch',
    value: function resetBranch(branchName) {
      var action = {
        type: 'DUXEN_RESET_BRANCH',
        branchName: branchName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'removeBranch',
    value: function removeBranch(branchName) {
      var action = {
        type: 'DUXEN_REMOVE_BRANCH',
        branchName: branchName
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'goForward',
    value: function goForward(steps) {
      var action = {
        type: 'DUXEN_GO_FORWARD',
        steps: steps
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'goBack',
    value: function goBack(steps) {
      var action = {
        type: 'DUXEN_GO_BACK',
        steps: steps
      };
      this._action(action);
      return action;
    }
  }, {
    key: 'goLive',
    value: function goLive() {
      var action = {
        type: 'DUXEN_GO_LIVE'
      };
      this._action(action);
      return action;
    }
  }]);

  return ActionFactory;
}();

exports.default = ActionFactory;
},{"./CommonEngine":3,"immutable-sorted":11}],2:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoundActionFactory = function () {
  function BoundActionFactory(dispatch, actionFactory) {
    _classCallCheck(this, BoundActionFactory);

    this._dispatch = dispatch;
    this._actionFactory = actionFactory;
  }

  //
  // Action creators
  //


  _createClass(BoundActionFactory, [{
    key: 'batch',
    value: function batch(actions) {
      var action = this._actionFactory.batch(actions);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'insert',
    value: function insert(collName, id, doc) {
      var action = this._actionFactory.insert(collName, id, doc);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'update',
    value: function update(collName, id, doc) {
      var action = this._actionFactory.update(collName, id, doc);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'remove',
    value: function remove(collName, id) {
      var action = this._actionFactory.remove(collName, id);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'reset',
    value: function reset(collName) {
      var action = this._actionFactory.reset(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'pause',
    value: function pause(collName) {
      var action = this._actionFactory.pause(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'resume',
    value: function resume(collName) {
      var action = this._actionFactory.resume(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'save',
    value: function save(collName) {
      var action = this._actionFactory.save(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'restore',
    value: function restore(collName) {
      var action = this._actionFactory.restore(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'saveOriginals',
    value: function saveOriginals(collName) {
      var action = this._actionFactory.saveOriginals(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'retrieveOriginals',
    value: function retrieveOriginals(collName) {
      var action = this._actionFactory.retrieveOriginals(collName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var action = this._actionFactory.refresh();
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'value',
    value: function value(valueName, _value) {
      var action = this._actionFactory.value(valueName, _value);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'customValue',
    value: function customValue(valueName, value) {
      var action = this._actionFactory.customValue(valueName, value);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'custom',
    value: function custom(customName) {
      var action = this._actionFactory.custom(customName);
      this._dispatch(action);
      return action;
    }

    //
    // Repo Actions
    //

  }, {
    key: 'createBranch',
    value: function createBranch(branchName) {
      var action = this._actionFactory.createBranch(branchName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'switchBranch',
    value: function switchBranch(branchName) {
      var action = this._actionFactory.switchBranch(branchName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'saveBranch',
    value: function saveBranch(branchName) {
      var action = this._actionFactory.saveBranch(branchName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'resetBranch',
    value: function resetBranch(branchName) {
      var action = this._actionFactory.resetBranch(branchName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'removeBranch',
    value: function removeBranch(branchName) {
      var action = this._actionFactory.removeBranch(branchName);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'goForward',
    value: function goForward(steps) {
      var action = this._actionFactory.goForward(steps);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'goBack',
    value: function goBack(steps) {
      var action = this._actionFactory.goBack(steps);
      this._dispatch(action);
      return action;
    }
  }, {
    key: 'goLive',
    value: function goLive() {
      var action = this._actionFactory.goLive();
      this._dispatch(action);
      return action;
    }
  }]);

  return BoundActionFactory;
}();

exports.default = BoundActionFactory;
},{"immutable-sorted":11}],3:[function(require,module,exports){
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
      if (!state) {
        return state;
      }
      return state.withMutations(function (mutableState) {
        mutableState.delete("_state");
      });
    }
  }, {
    key: 'persistableState',
    value: function persistableState(state) {
      var _this2 = this;

      if (!state) {
        return state;
      }
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

    //
    // Repo Functions
    //

  }, {
    key: 'currentBranch',
    value: function currentBranch(repo) {
      if (!repo) {
        throw Error("repo not defined");
      }
      var currentBranch = repo.get("currentBranch");
      return currentBranch;
    }
  }, {
    key: 'head',
    value: function head(repo) {
      if (!repo) {
        return undefined;
      }
      var currentBranch = repo.get("currentBranch");
      var branches = repo.get("branches");
      var branch = branches.get(currentBranch);
      var currentIndex = branch.get("currentIndex");
      if (currentIndex < 0) {
        return undefined;
      }
      var states = branch.get("states");
      var state = states.get(currentIndex);
      return state;
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
    key: 'stateReducer',
    value: function stateReducer() {
      throw new Error("Reducer is not implemented in CommonEngine");
    }
  }, {
    key: 'repoReducer',
    value: function repoReducer() {
      throw new Error("RepoReducer is not implemented in CommonEngine");
    }
  }]);

  return CommonEngine;
}();

exports.default = CommonEngine;
},{"./ActionFactory":1,"./BoundActionFactory":2,"./SchemaCompiler":6,"./SubEngine":9,"immutable-sorted":11}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeteorDriver = exports.MeteorCollection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               *  Copyright (c) 2017, Applitopia, Inc.
                                                                                                                                                                                                                                                                               *  All rights reserved.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               *  This source code is licensed under the MIT-style license found in the
                                                                                                                                                                                                                                                                               *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               *  
                                                                                                                                                                                                                                                                               */

var _immutableSorted = require('immutable-sorted');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cast = function cast(value) {
  return value;
};

var isEmptyObject = function isEmptyObject(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    return false;
  }

  for (var x in obj) {
    return false;
  }

  return true;
};

var getMongoID = function getMongoID(selector) {
  if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object' && selector._id !== undefined) {
    return selector._id;
  } else if (isEmptyObject(selector)) {
    return undefined;
  }
  return cast(selector);
};

var MeteorCollection = exports.MeteorCollection = function () {
  function MeteorCollection(name, engine, dispatch, getData, getOriginals) {
    _classCallCheck(this, MeteorCollection);

    this._name = name;
    this._engine = engine;
    this._actionFactory = engine.actionFactory();
    this._dispatch = dispatch;
    this._getData = getData;
    this._getOriginals = getOriginals;
    this._paused = false;
    this._pending = [];
    this._ids = (0, _immutableSorted.Set)().asMutable();
  }

  _createClass(MeteorCollection, [{
    key: 'dispatch',
    value: function dispatch(action) {
      if (this._paused) {
        this._pending.push(action);
      } else {
        this._dispatch(action);
      }

      return action;
    }
  }, {
    key: 'flush',
    value: function flush() {
      if (this._pending.length > 0) {
        var batch = this._actionFactory.batch(this._pending);
        this._dispatch(batch);
        this._pending = [];
      }
    }
  }, {
    key: 'remove',
    value: function remove(selector) {
      var mongoId = getMongoID(selector);
      if (!mongoId) {
        this._ids = (0, _immutableSorted.Set)().asMutable();
        this._pending = [];
        var action = this._actionFactory.reset(this._name);
        this._dispatch(action);
      } else {
        this._ids.remove(mongoId);
        var _action = this._actionFactory.remove(this._name, mongoId);
        this.dispatch(_action);
      }
    }
  }, {
    key: 'insert',
    value: function insert(replace) {
      var mongoId = replace._id;
      if (!mongoId) {
        throw new Error("Empty mongoID: " + JSON.stringify(replace));
      }
      this._ids.add(mongoId);
      var action = this._actionFactory.insert(this._name, mongoId, replace);
      this.dispatch(action);
    }
  }, {
    key: 'update',
    value: function update(selector, replace) {
      var mongoId = getMongoID(selector);
      if (!mongoId) {
        throw new Error("Selector not supported:" + JSON.stringify(selector));
      }
      var action = this._actionFactory.update(this._name, mongoId, replace);
      this.dispatch(action);
    }
  }, {
    key: 'findOne',
    value: function findOne(selector, options) {
      var mongoId = getMongoID(selector);
      if (!mongoId) {
        throw new Error("Selector not supported:" + JSON.stringify(selector));
      }
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options.fetch === true) {
        return this.fetchOne(mongoId);
      }
      return this._ids.has(mongoId);
    }
  }, {
    key: 'fetchOne',
    value: function fetchOne(selector) {
      var mongoId = getMongoID(selector);
      if (!mongoId) {
        throw new Error("Selector not supported:" + JSON.stringify(selector));
      }
      this.flush();
      return this._getData().get(mongoId);
    }
  }, {
    key: 'pauseObservers',
    value: function pauseObservers() {
      this._paused = true;
      this._pending = [];
      var action = this._actionFactory.pause(this._name);
      this.dispatch(action);
    }
  }, {
    key: 'resumeObservers',
    value: function resumeObservers() {
      this.flush();
      this._paused = false;
      var action = this._actionFactory.resume(this._name);
      this.dispatch(action);
    }
  }, {
    key: 'saveOriginals',
    value: function saveOriginals() {
      var action = this._actionFactory.saveOriginals(this._name);
      this.dispatch(action);
    }
  }, {
    key: 'retrieveOriginals',
    value: function retrieveOriginals() {
      this.flush();
      var collData = this._getOriginals();
      var action = this._actionFactory.retrieveOriginals(this._name);
      this.dispatch(action);
      if (collData) {
        return (0, _immutableSorted.Seq)(collData).map(function (v) {
          return v ? v.toJS() : v;
        });
      }
      return collData;
    }
  }]);

  return MeteorCollection;
}();

var MeteorDriver = exports.MeteorDriver = function () {
  function MeteorDriver(engine, dispatch, getState) {
    _classCallCheck(this, MeteorDriver);

    this._engine = engine;
    this._dispatch = dispatch;
    this._getState = getState;
  }

  _createClass(MeteorDriver, [{
    key: 'open',
    value: function open(name, connection) {
      var _this = this;

      // eslint-disable-line no-unused-vars
      var getData = function getData() {
        return _this._engine.get(_this._getState(), name);
      };
      var getOriginals = function getOriginals() {
        return _this._getState().getIn(['_state', name, "originals"]);
      };
      return new MeteorCollection(name, this._engine, this._dispatch, getData, getOriginals);
    }
  }]);

  return MeteorDriver;
}();
},{"immutable-sorted":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _immutableSorted = require('immutable-sorted');

var _StateEngine2 = require('./StateEngine');

var _StateEngine3 = _interopRequireDefault(_StateEngine2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2017, Applitopia, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the MIT-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var cast = function cast(value) {
  return value;
};

var RepoEngine = function (_StateEngine) {
  _inherits(RepoEngine, _StateEngine);

  function RepoEngine(schema) {
    _classCallCheck(this, RepoEngine);

    return _possibleConstructorReturn(this, (RepoEngine.__proto__ || Object.getPrototypeOf(RepoEngine)).call(this, schema));
  }

  _createClass(RepoEngine, [{
    key: 'repoReducer',
    value: function repoReducer() {
      var stateReducer = _get(RepoEngine.prototype.__proto__ || Object.getPrototypeOf(RepoEngine.prototype), 'stateReducer', this).call(this);

      var repoOptionsProps = {
        history: 100
      };

      var repoBranchProps = {
        currentIndex: -1,
        live: true,
        states: [],
        actions: []
      };

      var repoProps = {
        version: 0,
        options: repoOptionsProps,
        currentBranch: 'master',
        branches: { 'master': repoBranchProps }
      };

      var initialRepo = (0, _immutableSorted.fromJS)(repoProps);

      var verifyBranch = function verifyBranch(repo, branchName) {
        var branches = repo.get("branches");
        if (!branches.has(branchName)) {
          throw Error("the branch does not exist: " + branchName);
        }
      };

      var stateReduce = function stateReduce(mutableRepo, repo, action) {
        if (!Object.isFrozen()) {
          throw new Error("Action object is not frozen");
        }
        var options = mutableRepo.get("options");
        var history = options.get("history");
        var currentBranch = mutableRepo.get("currentBranch");
        verifyBranch(repo, currentBranch);
        var branches = mutableRepo.get("branches");
        var branch = branches.get(currentBranch);

        var newBranch = branch.withMutations(function (mutableBranch) {
          var currentIndex = mutableBranch.get("currentIndex");
          var live = mutableBranch.get("live");
          var states = mutableBranch.get("states");
          var actions = mutableBranch.get("actions");
          var state = states.get(states.size - 1);
          var newState = stateReducer(state, action);
          var newStates = states.withMutations(function (mutableStates) {
            mutableStates.push(newState);
            while (mutableStates.size > history) {
              mutableStates.shift();
              if (currentIndex > 0) {
                currentIndex--;
              }
            }
          });
          var newActions = actions.withMutations(function (mutableActions) {
            var actionCopy = action;
            mutableActions.push(actionCopy);
            while (mutableActions.size > history) {
              mutableActions.shift();
            }
          });
          if (live) {
            currentIndex = newStates.size - 1;
          }
          mutableBranch.set("currentIndex", currentIndex);
          mutableBranch.set("states", newStates);
          mutableBranch.set("actions", newActions);
        });
        var newBranches = branches.set(currentBranch, newBranch);

        mutableRepo.set("branches", newBranches);
      };

      var repoReduceMutable = function repoReduceMutable(mutableRepo, repo, action) {
        switch (action.type) {
          case 'DUXEN_CREATE_BRANCH':
            {
              var repoAction = cast(action);
              var branches = repo.get("branches");
              if (branches.has(repoAction.branchName)) {
                throw Error("the branch already exists: " + repoAction.branchName);
              }
              var newBranch = initialRepo.getIn(["branches", "master"]);
              var newBranches = branches.set(repoAction.branchName, newBranch);
              mutableRepo.set("branches", newBranches);
              break;
            }

          case 'DUXEN_SWITCH_BRANCH':
            {
              var _repoAction = cast(action);
              verifyBranch(repo, _repoAction.branchName);
              mutableRepo.set("currentBranch", _repoAction.branchName);
              break;
            }

          case 'DUXEN_SAVE_BRANCH':
            {
              var _repoAction2 = cast(action);
              var currentBranch = mutableRepo.get("currentBranch");
              var _branches = repo.get("branches");
              var branch = _branches.get(currentBranch);
              var currentIndex = branch.get("currentIndex");
              var _newBranch = branch.withMutations(function (mutableBranch) {
                var newStates = mutableBranch.get("states").slice(0, currentIndex + 1);
                mutableBranch.set("states", newStates);
                var newActions = mutableBranch.get("actions").slice(0, currentIndex + 1);
                mutableBranch.set("actions", newActions);
                mutableBranch.set("currentIndex", currentIndex);
              });
              var _newBranches = _branches.set(_repoAction2.branchName, _newBranch);
              mutableRepo.set("branches", _newBranches);
              break;
            }

          case 'DUXEN_RESET_BRANCH':
            {
              var _repoAction3 = cast(action);
              verifyBranch(repo, _repoAction3.branchName);
              var _currentBranch = mutableRepo.get("currentBranch");
              var _branches2 = repo.get("branches");
              var _branch = _branches2.get(_repoAction3.branchName);
              var _currentIndex = _branch.get("currentIndex");
              var _newBranch2 = _branch.withMutations(function (mutableBranch) {
                var newStates = mutableBranch.get("states").slice(0, _currentIndex + 1);
                mutableBranch.set("states", newStates);
                var newActions = mutableBranch.get("actions").slice(0, _currentIndex + 1);
                mutableBranch.set("actions", newActions);
                mutableBranch.set("currentIndex", _currentIndex);
              });
              var _newBranches2 = _branches2.set(_currentBranch, _newBranch2);
              mutableRepo.set("branches", _newBranches2);
              break;
            }

          case 'DUXEN_REMOVE_BRANCH':
            {
              var _repoAction4 = cast(action);
              verifyBranch(repo, _repoAction4.branchName);
              var _currentBranch2 = mutableRepo.get("currentBranch");
              if (_currentBranch2 === _repoAction4.branchName) {
                throw Error("cannot remove branch that is current");
              }
              var _branches3 = repo.get("branches");
              var _newBranches3 = _branches3.remove(_repoAction4.branchName);
              mutableRepo.set("branches", _newBranches3);
              break;
            }

          case 'DUXEN_GO_FORWARD':
            {
              var _repoAction5 = cast(action);
              var _currentBranch3 = mutableRepo.get("currentBranch");
              var _branches4 = repo.get("branches");
              var _branch2 = _branches4.get(_currentBranch3);
              var _currentIndex2 = _branch2.get("currentIndex");
              var states = _branch2.get("states");
              var steps = _repoAction5.steps;
              var _newBranch3 = _branch2.withMutations(function (mutableBranch) {
                var newCurrentIndex = _currentIndex2 + steps;
                if (newCurrentIndex < 0) {
                  newCurrentIndex = 0;
                } else if (newCurrentIndex >= states.size) {
                  newCurrentIndex = states.size - 1;
                }
                mutableBranch.set("currentIndex", newCurrentIndex);
                mutableBranch.set("live", false);
              });
              var _newBranches4 = _branches4.set(_currentBranch3, _newBranch3);
              mutableRepo.set("branches", _newBranches4);
              break;
            }

          case 'DUXEN_GO_BACK':
            {
              var _repoAction6 = cast(action);
              var _currentBranch4 = mutableRepo.get("currentBranch");
              var _branches5 = repo.get("branches");
              var _branch3 = _branches5.get(_currentBranch4);
              var _currentIndex3 = _branch3.get("currentIndex");
              var _states = _branch3.get("states");
              var _steps = _repoAction6.steps;
              var _newBranch4 = _branch3.withMutations(function (mutableBranch) {
                var newCurrentIndex = _currentIndex3 - _steps;
                if (newCurrentIndex < 0) {
                  newCurrentIndex = 0;
                } else if (newCurrentIndex >= _states.size) {
                  newCurrentIndex = _states.size - 1;
                }
                mutableBranch.set("currentIndex", newCurrentIndex);
                mutableBranch.set("live", false);
              });
              var _newBranches5 = _branches5.set(_currentBranch4, _newBranch4);
              mutableRepo.set("branches", _newBranches5);
              break;
            }

          case 'DUXEN_GO_LIVE':
            {
              var _currentBranch5 = mutableRepo.get("currentBranch");
              var _branches6 = repo.get("branches");
              var _branch4 = _branches6.get(_currentBranch5);
              var _states2 = _branch4.get("states");
              var _newBranch5 = _branch4.withMutations(function (mutableBranch) {
                var newCurrentIndex = _states2.size - 1;
                mutableBranch.set("currentIndex", newCurrentIndex);
                mutableBranch.set("live", true);
              });
              var _newBranches6 = _branches6.set(_currentBranch5, _newBranch5);
              mutableRepo.set("branches", _newBranches6);
              break;
            }

          default:
            {
              stateReduce(mutableRepo, repo, action);
              break;
            }
        }
      };

      var repoReduce = function repoReduce(repo, action) {
        if (repo === undefined) {
          repo = initialRepo;
        }

        return repo.withMutations(function (mutableRepo) {
          repoReduceMutable(mutableRepo, repo, action);
        });
      };

      return repoReduce;
    }
  }]);

  return RepoEngine;
}(_StateEngine3.default);

exports.default = RepoEngine;
},{"./StateEngine":7,"immutable-sorted":11}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileSchema = exports.compileDependencies = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               *  Copyright (c) 2017, Applitopia, Inc.
                                                                                                                                                                                                                                                                               *  All rights reserved.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               *  This source code is licensed under the MIT-style license found in the
                                                                                                                                                                                                                                                                               *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               *  
                                                                                                                                                                                                                                                                               */

var _immutableSorted = require('immutable-sorted');

var _seqen = require('seqen');

var cast = function cast(value) {
  return value;
};

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
};

var compileSchema = exports.compileSchema = function compileSchema(schema) {

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
      switch (typeof propName === 'undefined' ? 'undefined' : _typeof(propName)) {
        case 'string':
          {
            break;
          }
        default:
          {
            throw new Error("Invalid type of propName: " + (typeof propName === 'undefined' ? 'undefined' : _typeof(propName)));
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

    cs.actions[actionType] = { type: "customValue", name: name, actionType: actionType, reducer: reducer };
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

    cs.actions[actionType] = { type: "custom", name: name, actionType: actionType, reducer: reducer };
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
            compileValue(name, entry, namePrefix);
            break;
          }

        case 'customValue':
          {
            cn.initValue = entry.initValue;
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
    }

    // Build dependents
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
            allDeps.push(["allDeps", _name]);

            // Add props to the dependencies as well
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
  };

  //
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

        if (map.get(name)) {
          throw new Error('duplicate name in schema: ' + name);
        }

        name = prefix + name;
        var cn = cs.names[name];

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
              map.setIn(cast(cn.subPath), compileInitState(entry.schema, prefix + name + ".", rootMap));
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
},{"immutable-sorted":11,"seqen":14}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutableSorted = require('immutable-sorted');

var _CommonEngine2 = require('./CommonEngine');

var _CommonEngine3 = _interopRequireDefault(_CommonEngine2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2017, Applitopia, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the MIT-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var cast = function cast(value) {
  return value;
};

var StateEngine = function (_CommonEngine) {
  _inherits(StateEngine, _CommonEngine);

  function StateEngine(schema) {
    _classCallCheck(this, StateEngine);

    return _possibleConstructorReturn(this, (StateEngine.__proto__ || Object.getPrototypeOf(StateEngine)).call(this, schema));
  }

  //
  // Compile the reducer
  //


  _createClass(StateEngine, [{
    key: 'stateReducer',
    value: function stateReducer() {
      var _this2 = this;

      var cs = this._compiledSchema;

      var failed = function failed(s) {
        throw new Error("Schema compilation error: " + s);
      };

      var validateAction = function validateAction(action) {
        if (!action.collName) {
          failed("Missing collName in action: " + action.toString());
        }

        if (_this2._getNameType(action.collName) !== 'collection') {
          failed("Unknown collection name: " + action.collName);
        }
      };

      var updateDependentsList = function updateDependentsList(mutableState, state, deps) {

        for (var i = 0, length = deps.length; i < length; i++) {
          var depName = deps[i];
          var dcn = getCompiledName(depName);

          switch (dcn.type) {
            case 'formula':
              {
                var fcne = cast(dcn.schemaEntry);

                // Prepare props
                var props = {};
                for (var pi = 0, len = fcne.props.length; pi < len; pi++) {
                  var propName = fcne.props[pi];
                  switch (typeof propName === 'undefined' ? 'undefined' : _typeof(propName)) {
                    case 'string':
                      {
                        var pcn = getCompiledName(dcn.namePrefix + propName);
                        props[propName] = mutableState.getIn(pcn.path);
                        break;
                      }
                    default:
                      {
                        throw new Error("Invalid type of propName: " + (typeof propName === 'undefined' ? 'undefined' : _typeof(propName)));
                      }
                  }
                }
                var newValue = fcne.recipe(props);
                mutableState.setIn(dcn.path, newValue);
                break;
              }
            case 'view':
              {
                var vcne = cast(dcn.schemaEntry);
                var scn = getCompiledName(dcn.namePrefix + vcne.sourceName);

                // Prepare props
                var _props = {};
                for (var _pi = 0, _len = vcne.props.length; _pi < _len; _pi++) {
                  var _propName = vcne.props[_pi];
                  switch (typeof _propName === 'undefined' ? 'undefined' : _typeof(_propName)) {
                    case 'string':
                      {
                        var _pcn = getCompiledName(dcn.namePrefix + _propName);
                        _props[_propName] = mutableState.getIn(_pcn.path);
                        break;
                      }
                    default:
                      {
                        throw new Error("Invalid type of propName: " + (typeof _propName === 'undefined' ? 'undefined' : _typeof(_propName)));
                      }
                  }
                }
                var newSourceData = mutableState.getIn(scn.path);

                if (dcn.seqen) {
                  var newdata = dcn.seqen.process(newSourceData, _props);

                  mutableState.setIn(dcn.path, newdata);
                } else {
                  throw new Error("Missing seqen for view: " + scn.name);
                }
                break;
              }
            default:
              {
                throw new Error("Dependent type not supported: " + dcn.type);
              }
          }
        }
      };

      var updateDependents = function updateDependents(mutableState, state, cn) {
        var isColl = cn.type == 'collection';
        var paused = isColl ? mutableState.getIn(["_state", cn.name, "paused"]) : false;

        if (paused === true) {
          return;
        }

        var deps = cn.dependents;

        if (!deps) {
          return;
        }

        updateDependentsList(mutableState, state, deps);
      };

      var refresh = function refresh(mutableState, state) {
        // Refresh all views
        updateDependentsList(mutableState, state, cs.allDependents);
      };

      var updateOriginals = function updateOriginals(mutableState, collName, id, doc) {
        var collData = mutableState.getIn(["_state", collName, "originals"]);

        if (collData) {
          if (!collData.has(id)) {
            mutableState.setIn(["_state", collName, "originals", id], doc);
          }
        }
      };

      var getCompiledName = function getCompiledName(name) {
        var cn = cs.names[name];

        if (!cn) {
          throw new Error("Name does not exist in schema: " + name);
        }

        return cn;
      };

      var reduceMutable = function reduceMutable(mutableState, state, action) {
        switch (action.type) {
          case 'DUXEN_BATCH':
            {
              var collAction = cast(action);
              var actions = collAction.actions;
              for (var i = 0, len = actions.size; i < len; i++) {
                reduceMutable(mutableState, state, cast(actions.get(i)));
              }
              break;
            }

          case 'DUXEN_INSERT':
            {
              var _collAction = cast(action);
              var cn = getCompiledName(_collAction.collName);
              var collData = cast(mutableState.getIn(cn.path));

              var newcollData = collData.set(_collAction.id, _collAction.doc);

              mutableState.setIn(cn.path, newcollData);

              updateOriginals(mutableState, _collAction.collName, _collAction.id);
              updateDependents(mutableState, state, cn);
              break;
            }

          case 'DUXEN_UPDATE':
            {
              var _collAction2 = cast(action);
              var _cn = getCompiledName(_collAction2.collName);
              var _collData = cast(mutableState.getIn(_cn.path));
              var id = _collAction2.id;

              var doc = _collData.get(id);
              if (!doc) {
                throw new Error("Updating document that does not exist: " + JSON.stringify(id));
              }

              var updDoc = _collAction2.doc;
              var setDoc = cast(updDoc.get("$set"));
              var unsetDoc = cast(updDoc.get("$unset"));
              var incDoc = cast(updDoc.get("$inc"));
              var mulDoc = cast(updDoc.get("$mul"));

              var newDoc = void 0;
              if (setDoc || unsetDoc || incDoc || mulDoc) {
                newDoc = doc.withMutations(function (mutableDoc) {
                  if (setDoc) {
                    setDoc.forEach(function (v, k) {
                      return mutableDoc.setIn(k.split('.'), v);
                    });
                  }
                  if (unsetDoc) {
                    unsetDoc.forEach(function (v, k) {
                      return mutableDoc.deleteIn(k.split('.'));
                    });
                  }
                  if (incDoc) {
                    incDoc.forEach(function (v, k) {
                      var keyPath = k.split('.');
                      var val = mutableDoc.getIn(keyPath);
                      if (typeof val === 'number') {
                        val += v;
                        mutableDoc.setIn(keyPath, val);
                      }
                    });
                  }
                  if (mulDoc) {
                    mulDoc.forEach(function (v, k) {
                      var keyPath = k.split('.');
                      var val = mutableDoc.getIn(keyPath);
                      if (typeof val === 'number') {
                        val *= v;
                        mutableDoc.setIn(keyPath, val);
                      }
                    });
                  }
                });
              } else {
                newDoc = updDoc;
              }

              var _newcollData = _collData.set(_collAction2.id, newDoc);
              mutableState.setIn(_cn.path, _newcollData);

              updateOriginals(mutableState, _collAction2.collName, id, doc);
              updateDependents(mutableState, state, _cn);
              break;
            }

          case 'DUXEN_REMOVE':
            {
              var _collAction3 = cast(action);
              var _cn2 = getCompiledName(_collAction3.collName);
              var _collData2 = cast(mutableState.getIn(_cn2.path));
              var _id = _collAction3.id;

              var _doc = _collData2.get(_id);
              if (_doc) {
                // Removing a document that exists
                var _newcollData2 = _collData2.remove(_id);

                mutableState.setIn(_cn2.path, _newcollData2);

                updateOriginals(mutableState, _collAction3.collName, _id, _doc);
                updateDependents(mutableState, state, _cn2);
              }
              break;
            }

          case 'DUXEN_RESET':
            {
              var _collAction4 = cast(action);
              var _cn3 = getCompiledName(_collAction4.collName);
              var _newcollData3 = (0, _immutableSorted.Map)();

              mutableState.setIn(_cn3.path, _newcollData3);
              mutableState.deleteIn(["_state", _collAction4.collName, "originals"]);
              updateDependents(mutableState, state, _cn3);
              break;
            }

          case 'DUXEN_PAUSE':
            {
              var _collAction5 = cast(action);
              mutableState.setIn(["_state", _collAction5.collName, "paused"], true);
              break;
            }

          case 'DUXEN_RESUME':
            {
              var _collAction6 = cast(action);
              var _cn4 = getCompiledName(_collAction6.collName);
              mutableState.setIn(["_state", _collAction6.collName, "paused"], false);
              updateDependents(mutableState, state, _cn4);
              break;
            }

          case 'DUXEN_SAVE':
            {
              var _collAction7 = cast(action);
              var _cn5 = getCompiledName(_collAction7.collName);
              var _collData3 = cast(mutableState.getIn(_cn5.path));
              mutableState.setIn(["_state", _collAction7.collName, "saved"], _collData3);
              break;
            }

          case 'DUXEN_RESTORE':
            {
              var _collAction8 = cast(action);
              var _cn6 = getCompiledName(_collAction8.collName);
              var _collData4 = cast(mutableState.getIn(["_state", _collAction8.collName, "saved"]));
              if (!_collData4) {
                throw new Error("Restore: nothing was saved");
              }
              mutableState.deleteIn(["_state", _collAction8.collName, "saved"]);
              mutableState.setIn(_cn6.path, _collData4);
              updateDependents(mutableState, state, _cn6);
              break;
            }

          case 'DUXEN_SAVE_ORIGINALS':
            {
              var _collAction9 = cast(action);
              var _collData5 = cast(mutableState.getIn(["_state", _collAction9.collName, "originals"]));
              if (_collData5) {
                throw new Error("Save Originals: called twice without retrieve originals");
              }
              mutableState.setIn(["_state", _collAction9.collName, "originals"], (0, _immutableSorted.Map)());
              break;
            }

          case 'DUXEN_RETRIEVE_ORIGINALS':
            {
              var _collAction10 = cast(action);
              var _collData6 = cast(mutableState.getIn(["_state", _collAction10.collName, "originals"]));
              if (!_collData6) {
                throw new Error("Retrieve Originals: called without save originals");
              }
              mutableState.deleteIn(["_state", _collAction10.collName, "originals"]);
              break;
            }

          case 'DUXEN_REFRESH':
            {
              refresh(mutableState, state);
              break;
            }

          case 'DUXEN_VALUE':
            {
              var valueAction = cast(action);
              var _cn7 = getCompiledName(valueAction.valueName);
              var oldValue = state.getIn(_cn7.path);
              if (oldValue === undefined) {
                throw Error("Lost value in state:" + valueAction.valueName);
              }
              var newValue = valueAction.value;
              if (oldValue !== newValue) {
                mutableState.setIn(_cn7.path, newValue);
                updateDependents(mutableState, state, _cn7);
              }
              break;
            }

          default:
            {
              //
              // Apply value or custom reducer
              var compiledAction = cs.actions[action.type];
              if (compiledAction) {
                var name = compiledAction.name;
                var _cn8 = getCompiledName(name);

                switch (compiledAction.type) {
                  case 'customValue':
                    {
                      var _valueAction = cast(action);
                      var _oldValue = state.getIn(_cn8.path);
                      if (_oldValue === undefined) {
                        throw Error("Lost value in state:" + name);
                      }
                      var reducer = compiledAction.reducer;
                      var _newValue = reducer(_oldValue, _valueAction);
                      if (_oldValue !== _newValue) {
                        mutableState.setIn(_cn8.path, _newValue);
                        updateDependents(mutableState, state, _cn8);
                      }
                      break;
                    }
                  case 'custom':
                    {
                      var customAction = cast(action);
                      var _reducer = compiledAction.reducer;
                      if (_cn8.path.length > 0) {
                        var subState = mutableState.getIn(_cn8.path);
                        if (!subState) {
                          throw new Error("Missing path in state:" + JSON.stringify(_cn8.path));
                        }
                        var mutableSubState = subState.asMutable();
                        _reducer(mutableSubState, customAction);
                        mutableState.setIn(_cn8.path, mutableSubState);
                      } else {
                        _reducer(mutableState, customAction);
                      }
                      break;
                    }
                  default:
                    {
                      throw new Error("CompiledAction.type not supported: " + compiledAction.type);
                    }
                }
              }
              break;
            }
        }
      };

      var reduce = function reduce(state, action) {
        if (state === undefined) {
          state = cs.initState;
          return state.withMutations(function (mutableState) {
            state = refresh(mutableState, state);
          });
        }

        if (action.collName) {
          validateAction(cast(action));
        }

        return state.withMutations(function (mutableState) {
          reduceMutable(mutableState, state, action);
        });
      };

      return reduce;
    }
  }]);

  return StateEngine;
}(_CommonEngine3.default);

exports.default = StateEngine;
},{"./CommonEngine":3,"immutable-sorted":11}],8:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubActionFactory = function () {
  function SubActionFactory(actionFactory, subSchemaPath) {
    _classCallCheck(this, SubActionFactory);

    this._actionFactory = actionFactory;
    this._subSchemaPath = subSchemaPath;
    this._prefix = subSchemaPath + '.';
  }

  //
  // Action creators
  //


  _createClass(SubActionFactory, [{
    key: 'batch',
    value: function batch(actions) {
      var action = this._actionFactory.batch(actions);
      return action;
    }
  }, {
    key: 'insert',
    value: function insert(collName, id, doc) {
      collName = this._prefix + collName;
      var action = this._actionFactory.insert(collName, id, doc);
      return action;
    }
  }, {
    key: 'update',
    value: function update(collName, id, doc) {
      collName = this._prefix + collName;
      var action = this._actionFactory.update(collName, id, doc);
      return action;
    }
  }, {
    key: 'remove',
    value: function remove(collName, id) {
      collName = this._prefix + collName;
      var action = this._actionFactory.remove(collName, id);
      return action;
    }
  }, {
    key: 'reset',
    value: function reset(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.reset(collName);
      return action;
    }
  }, {
    key: 'pause',
    value: function pause(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.pause(collName);
      return action;
    }
  }, {
    key: 'resume',
    value: function resume(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.resume(collName);
      return action;
    }
  }, {
    key: 'save',
    value: function save(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.save(collName);
      return action;
    }
  }, {
    key: 'restore',
    value: function restore(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.restore(collName);
      return action;
    }
  }, {
    key: 'saveOriginals',
    value: function saveOriginals(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.saveOriginals(collName);
      return action;
    }
  }, {
    key: 'retrieveOriginals',
    value: function retrieveOriginals(collName) {
      collName = this._prefix + collName;
      var action = this._actionFactory.retrieveOriginals(collName);
      return action;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var action = this._actionFactory.refresh();
      return action;
    }
  }, {
    key: 'value',
    value: function value(valueName, _value) {
      valueName = this._prefix + valueName;
      var action = this._actionFactory.value(valueName, _value);
      return action;
    }
  }, {
    key: 'customValue',
    value: function customValue(valueName, value) {
      valueName = this._prefix + valueName;
      var action = this._actionFactory.customValue(valueName, value);
      return action;
    }
  }, {
    key: 'custom',
    value: function custom(customName) {
      customName = this._prefix + customName;
      var action = this._actionFactory.custom(customName);
      return action;
    }

    //
    // Repo Actions
    //

  }, {
    key: 'createBranch',
    value: function createBranch(branchName) {
      var action = this._actionFactory.createBranch(branchName);
      return action;
    }
  }, {
    key: 'switchBranch',
    value: function switchBranch(branchName) {
      var action = this._actionFactory.switchBranch(branchName);
      return action;
    }
  }, {
    key: 'saveBranch',
    value: function saveBranch(branchName) {
      var action = this._actionFactory.saveBranch(branchName);
      return action;
    }
  }, {
    key: 'resetBranch',
    value: function resetBranch(branchName) {
      var action = this._actionFactory.resetBranch(branchName);
      return action;
    }
  }, {
    key: 'removeBranch',
    value: function removeBranch(branchName) {
      var action = this._actionFactory.removeBranch(branchName);
      return action;
    }
  }, {
    key: 'goForward',
    value: function goForward(steps) {
      var action = this._actionFactory.goForward(steps);
      return action;
    }
  }, {
    key: 'goBack',
    value: function goBack(steps) {
      var action = this._actionFactory.goBack(steps);
      return action;
    }
  }, {
    key: 'goLive',
    value: function goLive() {
      var action = this._actionFactory.goLive();
      return action;
    }
  }]);

  return SubActionFactory;
}();

exports.default = SubActionFactory;
},{"immutable-sorted":11}],9:[function(require,module,exports){
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

var _SubActionFactory = require('./SubActionFactory');

var _SubActionFactory2 = _interopRequireDefault(_SubActionFactory);

var _BoundActionFactory = require('./BoundActionFactory');

var _BoundActionFactory2 = _interopRequireDefault(_BoundActionFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubEngine = function () {
  function SubEngine(engine, subSchemaPath) {
    _classCallCheck(this, SubEngine);

    this._engine = engine;
    this._subSchemaPath = subSchemaPath;
    this._prefix = subSchemaPath + '.';
    this._actionFactory = new _SubActionFactory2.default(this._engine.actionFactory(), this._subSchemaPath);
  }

  // Extract a value from state


  _createClass(SubEngine, [{
    key: 'get',
    value: function get(state, name) {
      if (!name) {
        return this._engine.get(state, this._subSchemaPath);
      }
      var prefix = this._prefix + name;
      return this._engine.get(state, prefix);
    }

    //
    // Subscribe to all actions created by this engine
    //
    // Returns a function to unsubscribe
    //

  }, {
    key: 'subscribe',
    value: function subscribe(listener) {
      return this._engine.subscribe(listener);
    }

    //
    // Remove all internal items from the state
    //

  }, {
    key: 'printableState',
    value: function printableState(state) {
      var subState = this.get(state, undefined);
      subState = this._engine.printableState(subState);
      return subState;
    }
  }, {
    key: 'persistableState',
    value: function persistableState(state) {
      var subState = this._engine.persistableState(state);
      subState = this.get(state, undefined);
      return subState;
    }

    //
    // Repo Functions
    //

  }, {
    key: 'currentBranch',
    value: function currentBranch(repo) {
      var currentBranch = repo.get("currentBranch");
      return currentBranch;
    }
  }, {
    key: 'head',
    value: function head(state) {
      var st = this._engine.head(state);
      return st;
    }

    // SubEngine

  }, {
    key: 'subEngine',
    value: function subEngine(subSchemaPath) {
      return this._engine.subEngine(this._prefix + subSchemaPath);
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
    key: 'stateReducer',
    value: function stateReducer() {
      throw new Error("Reducer is not implemented in SubEngine");
    }
  }, {
    key: 'repoReducer',
    value: function repoReducer() {
      throw new Error("RepoReducer is not implemented in SubEngine");
    }
  }]);

  return SubEngine;
}();

exports.default = SubEngine;
},{"./BoundActionFactory":2,"./SubActionFactory":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeteorDriver = exports.createEngine = undefined;

var _RepoEngine = require('./RepoEngine');

var _RepoEngine2 = _interopRequireDefault(_RepoEngine);

var _MeteorDriver = require('./MeteorDriver');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  
 */

var createEngine = function createEngine(schema) {
  return new _RepoEngine2.default(schema);
};

exports.createEngine = createEngine;
exports.MeteorDriver = _MeteorDriver.MeteorDriver;
exports.default = {
  createEngine: createEngine
};
},{"./MeteorDriver":4,"./RepoEngine":5}],11:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Immutable = {})));
}(this, (function (exports) { 'use strict';

// Used for setting prototype methods that IE8 chokes on.
var DELETE = 'delete';

// Constants describing the size of trie nodes.
var SHIFT = 5; // Resulted in best performance after ______?
var SIZE = 1 << SHIFT;
var MASK = SIZE - 1;

// A consistent shared value representing "not set" which equals nothing other
// than itself, and nothing that could be provided externally.
var NOT_SET = {};

// Boolean references, Rough equivalent of `bool &`.
var CHANGE_LENGTH = { value: false };
var DID_ALTER = { value: false };
var DID_MATCH = { value: false };

function MakeRef(ref) {
  ref.value = false;
  return ref;
}

function SetRef(ref) {
  ref && (ref.value = true);
}

function GetRef(ref) {
  return ref.value;
}

// A function which returns a value representing an "owner" for transient writes
// to tries. The return value will only ever equal itself, and will not equal
// the return of any subsequent call of this function.
function OwnerID() {}

function ensureSize(iter) {
  if (iter.size === undefined) {
    iter.size = iter.__iterate(returnTrue);
  }
  return iter.size;
}

function wrapIndex(iter, index) {
  // This implements "is array index" which the ECMAString spec defines as:
  //
  //     A String property name P is an array index if and only if
  //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
  //     to 2^32−1.
  //
  // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
  if (typeof index !== 'number') {
    var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
    if ('' + uint32Index !== index || uint32Index === 4294967295) {
      return NaN;
    }
    index = uint32Index;
  }
  return index < 0 ? ensureSize(iter) + index : index;
}

function returnTrue() {
  return true;
}

function wholeSlice(begin, end, size) {
  return (
    ((begin === 0 && !isNeg(begin)) ||
      (size !== undefined && begin <= -size)) &&
    (end === undefined || (size !== undefined && end >= size))
  );
}

function resolveBegin(begin, size) {
  return resolveIndex(begin, size, 0);
}

function resolveEnd(end, size) {
  return resolveIndex(end, size, size);
}

function resolveIndex(index, size, defaultIndex) {
  // Sanitize indices using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  return index === undefined
    ? defaultIndex
    : isNeg(index)
      ? size === Infinity ? size : Math.max(0, size + index) | 0
      : size === undefined || size === index
        ? index
        : Math.min(size, index) | 0;
}

function isNeg(value) {
  // Account for -0 which is negative, but not less than 0.
  return value < 0 || (value === 0 && 1 / value === -Infinity);
}

function isImmutable(maybeImmutable) {
  return isCollection(maybeImmutable) || isRecord(maybeImmutable);
}

function isCollection(maybeCollection) {
  return !!(maybeCollection && maybeCollection[IS_ITERABLE_SENTINEL]);
}

function isKeyed(maybeKeyed) {
  return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
}

function isIndexed(maybeIndexed) {
  return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
}

function isAssociative(maybeAssociative) {
  return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
}

function isOrdered(maybeOrdered) {
  return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
}

function isRecord(maybeRecord) {
  return !!(maybeRecord && maybeRecord[IS_RECORD_SENTINEL]);
}

function isValueObject(maybeValue) {
  return !!(
    maybeValue &&
    typeof maybeValue.equals === 'function' &&
    typeof maybeValue.hashCode === 'function'
  );
}

function isSorted(maybeSorted) {
  return !!(maybeSorted && maybeSorted[IS_SORTED_SENTINEL]);
}

var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
var IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@';
var IS_SORTED_SENTINEL = '@@__IMMUTABLE_SORTED__@@';

var Collection = function Collection(value) {
  return isCollection(value) ? value : Seq(value);
};

var KeyedCollection = (function (Collection) {
  function KeyedCollection(value) {
    return isKeyed(value) ? value : KeyedSeq(value);
  }

  if ( Collection ) KeyedCollection.__proto__ = Collection;
  KeyedCollection.prototype = Object.create( Collection && Collection.prototype );
  KeyedCollection.prototype.constructor = KeyedCollection;

  return KeyedCollection;
}(Collection));

var IndexedCollection = (function (Collection) {
  function IndexedCollection(value) {
    return isIndexed(value) ? value : IndexedSeq(value);
  }

  if ( Collection ) IndexedCollection.__proto__ = Collection;
  IndexedCollection.prototype = Object.create( Collection && Collection.prototype );
  IndexedCollection.prototype.constructor = IndexedCollection;

  return IndexedCollection;
}(Collection));

var SetCollection = (function (Collection) {
  function SetCollection(value) {
    return isCollection(value) && !isAssociative(value) ? value : SetSeq(value);
  }

  if ( Collection ) SetCollection.__proto__ = Collection;
  SetCollection.prototype = Object.create( Collection && Collection.prototype );
  SetCollection.prototype.constructor = SetCollection;

  return SetCollection;
}(Collection));

Collection.Keyed = KeyedCollection;
Collection.Indexed = IndexedCollection;
Collection.Set = SetCollection;

var ITERATE_KEYS = 0;
var ITERATE_VALUES = 1;
var ITERATE_ENTRIES = 2;

var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

var Iterator = function Iterator(next) {
  this.next = next;
};

Iterator.prototype.toString = function toString () {
  return '[Iterator]';
};

Iterator.KEYS = ITERATE_KEYS;
Iterator.VALUES = ITERATE_VALUES;
Iterator.ENTRIES = ITERATE_ENTRIES;

Iterator.prototype.inspect = Iterator.prototype.toSource = function() {
  return this.toString();
};
Iterator.prototype[ITERATOR_SYMBOL] = function() {
  return this;
};

function iteratorValue(type, k, v, iteratorResult) {
  var value = type === 0 ? k : type === 1 ? v : [k, v];
  iteratorResult
    ? (iteratorResult.value = value)
    : (iteratorResult = {
        value: value,
        done: false
      });
  return iteratorResult;
}

function iteratorDone() {
  return { value: undefined, done: true };
}

function hasIterator(maybeIterable) {
  return !!getIteratorFn(maybeIterable);
}

function isIterator(maybeIterator) {
  return maybeIterator && typeof maybeIterator.next === 'function';
}

function getIterator(iterable) {
  var iteratorFn = getIteratorFn(iterable);
  return iteratorFn && iteratorFn.call(iterable);
}

function getIteratorFn(iterable) {
  var iteratorFn =
    iterable &&
    ((REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isArrayLike(value) {
  return value && typeof value.length === 'number';
}

var Seq = (function (Collection$$1) {
  function Seq(value) {
    return value === null || value === undefined
      ? emptySequence()
      : isImmutable(value) ? value.toSeq() : seqFromValue(value);
  }

  if ( Collection$$1 ) Seq.__proto__ = Collection$$1;
  Seq.prototype = Object.create( Collection$$1 && Collection$$1.prototype );
  Seq.prototype.constructor = Seq;

  Seq.prototype.toSeq = function toSeq () {
    return this;
  };

  Seq.prototype.toString = function toString () {
    return this.__toString('Seq {', '}');
  };

  Seq.prototype.cacheResult = function cacheResult () {
    if (!this._cache && this.__iterateUncached) {
      this._cache = this.entrySeq().toArray();
      this.size = this._cache.length;
    }
    return this;
  };

  // abstract __iterateUncached(fn, reverse)

  Seq.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var cache = this._cache;
    if (cache) {
      var size = cache.length;
      var i = 0;
      while (i !== size) {
        var entry = cache[reverse ? size - ++i : i++];
        if (fn(entry[1], entry[0], this$1) === false) {
          break;
        }
      }
      return i;
    }
    return this.__iterateUncached(fn, reverse);
  };

  // abstract __iteratorUncached(type, reverse)

  Seq.prototype.__iterator = function __iterator (type, reverse) {
    var cache = this._cache;
    if (cache) {
      var size = cache.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }
        var entry = cache[reverse ? size - ++i : i++];
        return iteratorValue(type, entry[0], entry[1]);
      });
    }
    return this.__iteratorUncached(type, reverse);
  };

  return Seq;
}(Collection));

var KeyedSeq = (function (Seq) {
  function KeyedSeq(value) {
    return value === null || value === undefined
      ? emptySequence().toKeyedSeq()
      : isCollection(value)
        ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq()
        : isRecord(value) ? value.toSeq() : keyedSeqFromValue(value);
  }

  if ( Seq ) KeyedSeq.__proto__ = Seq;
  KeyedSeq.prototype = Object.create( Seq && Seq.prototype );
  KeyedSeq.prototype.constructor = KeyedSeq;

  KeyedSeq.prototype.toKeyedSeq = function toKeyedSeq () {
    return this;
  };

  return KeyedSeq;
}(Seq));

var IndexedSeq = (function (Seq) {
  function IndexedSeq(value) {
    return value === null || value === undefined
      ? emptySequence()
      : isCollection(value)
        ? isKeyed(value) ? value.entrySeq() : value.toIndexedSeq()
        : isRecord(value)
          ? value.toSeq().entrySeq()
          : indexedSeqFromValue(value);
  }

  if ( Seq ) IndexedSeq.__proto__ = Seq;
  IndexedSeq.prototype = Object.create( Seq && Seq.prototype );
  IndexedSeq.prototype.constructor = IndexedSeq;

  IndexedSeq.of = function of (/*...values*/) {
    return IndexedSeq(arguments);
  };

  IndexedSeq.prototype.toIndexedSeq = function toIndexedSeq () {
    return this;
  };

  IndexedSeq.prototype.toString = function toString () {
    return this.__toString('Seq [', ']');
  };

  return IndexedSeq;
}(Seq));

var SetSeq = (function (Seq) {
  function SetSeq(value) {
    return (isCollection(value) && !isAssociative(value)
      ? value
      : IndexedSeq(value)
    ).toSetSeq();
  }

  if ( Seq ) SetSeq.__proto__ = Seq;
  SetSeq.prototype = Object.create( Seq && Seq.prototype );
  SetSeq.prototype.constructor = SetSeq;

  SetSeq.of = function of (/*...values*/) {
    return SetSeq(arguments);
  };

  SetSeq.prototype.toSetSeq = function toSetSeq () {
    return this;
  };

  return SetSeq;
}(Seq));

Seq.isSeq = isSeq;
Seq.Keyed = KeyedSeq;
Seq.Set = SetSeq;
Seq.Indexed = IndexedSeq;

var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

Seq.prototype[IS_SEQ_SENTINEL] = true;

// #pragma Root Sequences

var ArraySeq = (function (IndexedSeq) {
  function ArraySeq(array) {
    this._array = array;
    this.size = array.length;
  }

  if ( IndexedSeq ) ArraySeq.__proto__ = IndexedSeq;
  ArraySeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
  ArraySeq.prototype.constructor = ArraySeq;

  ArraySeq.prototype.get = function get (index, notSetValue) {
    return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
  };

  ArraySeq.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var array = this._array;
    var size = array.length;
    var i = 0;
    while (i !== size) {
      var ii = reverse ? size - ++i : i++;
      if (fn(array[ii], ii, this$1) === false) {
        break;
      }
    }
    return i;
  };

  ArraySeq.prototype.__iterator = function __iterator (type, reverse) {
    var array = this._array;
    var size = array.length;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }
      var ii = reverse ? size - ++i : i++;
      return iteratorValue(type, ii, array[ii]);
    });
  };

  return ArraySeq;
}(IndexedSeq));

var ObjectSeq = (function (KeyedSeq) {
  function ObjectSeq(object) {
    var keys = Object.keys(object);
    this._object = object;
    this._keys = keys;
    this.size = keys.length;
  }

  if ( KeyedSeq ) ObjectSeq.__proto__ = KeyedSeq;
  ObjectSeq.prototype = Object.create( KeyedSeq && KeyedSeq.prototype );
  ObjectSeq.prototype.constructor = ObjectSeq;

  ObjectSeq.prototype.get = function get (key, notSetValue) {
    if (notSetValue !== undefined && !this.has(key)) {
      return notSetValue;
    }
    return this._object[key];
  };

  ObjectSeq.prototype.has = function has (key) {
    return hasOwnProperty.call(this._object, key);
  };

  ObjectSeq.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var object = this._object;
    var keys = this._keys;
    var size = keys.length;
    var i = 0;
    while (i !== size) {
      var key = keys[reverse ? size - ++i : i++];
      if (fn(object[key], key, this$1) === false) {
        break;
      }
    }
    return i;
  };

  ObjectSeq.prototype.__iterator = function __iterator (type, reverse) {
    var object = this._object;
    var keys = this._keys;
    var size = keys.length;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }
      var key = keys[reverse ? size - ++i : i++];
      return iteratorValue(type, key, object[key]);
    });
  };

  return ObjectSeq;
}(KeyedSeq));
ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;

var CollectionSeq = (function (IndexedSeq) {
  function CollectionSeq(collection) {
    this._collection = collection;
    this.size = collection.length || collection.size;
  }

  if ( IndexedSeq ) CollectionSeq.__proto__ = IndexedSeq;
  CollectionSeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
  CollectionSeq.prototype.constructor = CollectionSeq;

  CollectionSeq.prototype.__iterateUncached = function __iterateUncached (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var collection = this._collection;
    var iterator = getIterator(collection);
    var iterations = 0;
    if (isIterator(iterator)) {
      var step;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this$1) === false) {
          break;
        }
      }
    }
    return iterations;
  };

  CollectionSeq.prototype.__iteratorUncached = function __iteratorUncached (type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var collection = this._collection;
    var iterator = getIterator(collection);
    if (!isIterator(iterator)) {
      return new Iterator(iteratorDone);
    }
    var iterations = 0;
    return new Iterator(function () {
      var step = iterator.next();
      return step.done ? step : iteratorValue(type, iterations++, step.value);
    });
  };

  return CollectionSeq;
}(IndexedSeq));

var IteratorSeq = (function (IndexedSeq) {
  function IteratorSeq(iterator) {
    this._iterator = iterator;
    this._iteratorCache = [];
  }

  if ( IndexedSeq ) IteratorSeq.__proto__ = IndexedSeq;
  IteratorSeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
  IteratorSeq.prototype.constructor = IteratorSeq;

  IteratorSeq.prototype.__iterateUncached = function __iterateUncached (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var iterator = this._iterator;
    var cache = this._iteratorCache;
    var iterations = 0;
    while (iterations < cache.length) {
      if (fn(cache[iterations], iterations++, this$1) === false) {
        return iterations;
      }
    }
    var step;
    while (!(step = iterator.next()).done) {
      var val = step.value;
      cache[iterations] = val;
      if (fn(val, iterations++, this$1) === false) {
        break;
      }
    }
    return iterations;
  };

  IteratorSeq.prototype.__iteratorUncached = function __iteratorUncached (type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = this._iterator;
    var cache = this._iteratorCache;
    var iterations = 0;
    return new Iterator(function () {
      if (iterations >= cache.length) {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        cache[iterations] = step.value;
      }
      return iteratorValue(type, iterations, cache[iterations++]);
    });
  };

  return IteratorSeq;
}(IndexedSeq));

// # pragma Helper functions

function isSeq(maybeSeq) {
  return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
}

var EMPTY_SEQ;

function emptySequence() {
  return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
}

function keyedSeqFromValue(value) {
  var seq = Array.isArray(value)
    ? new ArraySeq(value)
    : isIterator(value)
      ? new IteratorSeq(value)
      : hasIterator(value) ? new CollectionSeq(value) : undefined;
  if (seq) {
    return seq.fromEntrySeq();
  }
  if (typeof value === 'object') {
    return new ObjectSeq(value);
  }
  throw new TypeError(
    'Expected Array or collection object of [k, v] entries, or keyed object: ' +
      value
  );
}

function indexedSeqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);
  if (seq) {
    return seq;
  }
  throw new TypeError(
    'Expected Array or collection object of values: ' + value
  );
}

function seqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);
  if (seq) {
    return seq;
  }
  if (typeof value === 'object') {
    return new ObjectSeq(value);
  }
  throw new TypeError(
    'Expected Array or collection object of values, or keyed object: ' + value
  );
}

function maybeIndexedSeqFromValue(value) {
  return isArrayLike(value)
    ? new ArraySeq(value)
    : isIterator(value)
      ? new IteratorSeq(value)
      : hasIterator(value) ? new CollectionSeq(value) : undefined;
}

/**
 * An extension of the "same-value" algorithm as [described for use by ES6 Map
 * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
 *
 * NaN is considered the same as NaN, however -0 and 0 are considered the same
 * value, which is different from the algorithm described by
 * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 *
 * This is extended further to allow Objects to describe the values they
 * represent, by way of `valueOf` or `equals` (and `hashCode`).
 *
 * Note: because of this extension, the key equality of Immutable.Map and the
 * value equality of Immutable.Set will differ from ES6 Map and Set.
 *
 * ### Defining custom values
 *
 * The easiest way to describe the value an object represents is by implementing
 * `valueOf`. For example, `Date` represents a value by returning a unix
 * timestamp for `valueOf`:
 *
 *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
 *     var date2 = new Date(1234567890000);
 *     date1.valueOf(); // 1234567890000
 *     assert( date1 !== date2 );
 *     assert( Immutable.is( date1, date2 ) );
 *
 * Note: overriding `valueOf` may have other implications if you use this object
 * where JavaScript expects a primitive, such as implicit string coercion.
 *
 * For more complex types, especially collections, implementing `valueOf` may
 * not be performant. An alternative is to implement `equals` and `hashCode`.
 *
 * `equals` takes another object, presumably of similar type, and returns true
 * if it is equal. Equality is symmetrical, so the same result should be
 * returned if this and the argument are flipped.
 *
 *     assert( a.equals(b) === b.equals(a) );
 *
 * `hashCode` returns a 32bit integer number representing the object which will
 * be used to determine how to store the value object in a Map or Set. You must
 * provide both or neither methods, one must not exist without the other.
 *
 * Also, an important relationship between these methods must be upheld: if two
 * values are equal, they *must* return the same hashCode. If the values are not
 * equal, they might have the same hashCode; this is called a hash collision,
 * and while undesirable for performance reasons, it is acceptable.
 *
 *     if (a.equals(b)) {
 *       assert( a.hashCode() === b.hashCode() );
 *     }
 *
 * All Immutable collections are Value Objects: they implement `equals()`
 * and `hashCode()`.
 */
function is(valueA, valueB) {
  if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
    return true;
  }
  if (!valueA || !valueB) {
    return false;
  }
  if (
    typeof valueA.valueOf === 'function' &&
    typeof valueB.valueOf === 'function'
  ) {
    valueA = valueA.valueOf();
    valueB = valueB.valueOf();
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
  }
  return !!(
    isValueObject(valueA) &&
    isValueObject(valueB) &&
    valueA.equals(valueB)
  );
}

var imul =
  typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2
    ? Math.imul
    : function imul(a, b) {
        a |= 0; // int
        b |= 0; // int
        var c = a & 0xffff;
        var d = b & 0xffff;
        // Shift by 0 fixes the sign on the high part.
        return (c * d + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0)) | 0; // int
      };

// v8 has an optimization for storing 31-bit signed numbers.
// Values which have either 00 or 11 as the high order bits qualify.
// This function drops the highest order bit in a signed number, maintaining
// the sign bit.
function smi(i32) {
  return ((i32 >>> 1) & 0x40000000) | (i32 & 0xbfffffff);
}

function hash(o) {
  if (o === false || o === null || o === undefined) {
    return 0;
  }
  if (typeof o.valueOf === 'function') {
    o = o.valueOf();
    if (o === false || o === null || o === undefined) {
      return 0;
    }
  }
  if (o === true) {
    return 1;
  }
  var type = typeof o;
  if (type === 'number') {
    if (o !== o || o === Infinity) {
      return 0;
    }
    var h = o | 0;
    if (h !== o) {
      h ^= o * 0xffffffff;
    }
    while (o > 0xffffffff) {
      o /= 0xffffffff;
      h ^= o;
    }
    return smi(h);
  }
  if (type === 'string') {
    return o.length > STRING_HASH_CACHE_MIN_STRLEN
      ? cachedHashString(o)
      : hashString(o);
  }
  if (typeof o.hashCode === 'function') {
    // Drop any high bits from accidentally long hash codes.
    return smi(o.hashCode());
  }
  if (type === 'object') {
    return hashJSObj(o);
  }
  if (typeof o.toString === 'function') {
    return hashString(o.toString());
  }
  throw new Error('Value type ' + type + ' cannot be hashed.');
}

function cachedHashString(string) {
  var hashed = stringHashCache[string];
  if (hashed === undefined) {
    hashed = hashString(string);
    if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
      STRING_HASH_CACHE_SIZE = 0;
      stringHashCache = {};
    }
    STRING_HASH_CACHE_SIZE++;
    stringHashCache[string] = hashed;
  }
  return hashed;
}

// http://jsperf.com/hashing-strings
function hashString(string) {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  var hashed = 0;
  for (var ii = 0; ii < string.length; ii++) {
    hashed = (31 * hashed + string.charCodeAt(ii)) | 0;
  }
  return smi(hashed);
}

function hashJSObj(obj) {
  var hashed;
  if (usingWeakMap) {
    hashed = weakMap.get(obj);
    if (hashed !== undefined) {
      return hashed;
    }
  }

  hashed = obj[UID_HASH_KEY];
  if (hashed !== undefined) {
    return hashed;
  }

  if (!canDefineProperty) {
    hashed = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
    if (hashed !== undefined) {
      return hashed;
    }

    hashed = getIENodeHash(obj);
    if (hashed !== undefined) {
      return hashed;
    }
  }

  hashed = ++objHashUID;
  if (objHashUID & 0x40000000) {
    objHashUID = 0;
  }

  if (usingWeakMap) {
    weakMap.set(obj, hashed);
  } else if (isExtensible !== undefined && isExtensible(obj) === false) {
    throw new Error('Non-extensible objects are not allowed as keys.');
  } else if (canDefineProperty) {
    Object.defineProperty(obj, UID_HASH_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: hashed
    });
  } else if (
    obj.propertyIsEnumerable !== undefined &&
    obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable
  ) {
    // Since we can't define a non-enumerable property on the object
    // we'll hijack one of the less-used non-enumerable properties to
    // save our hash on it. Since this is a function it will not show up in
    // `JSON.stringify` which is what we want.
    obj.propertyIsEnumerable = function() {
      return this.constructor.prototype.propertyIsEnumerable.apply(
        this,
        arguments
      );
    };
    obj.propertyIsEnumerable[UID_HASH_KEY] = hashed;
  } else if (obj.nodeType !== undefined) {
    // At this point we couldn't get the IE `uniqueID` to use as a hash
    // and we couldn't use a non-enumerable property to exploit the
    // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
    // itself.
    obj[UID_HASH_KEY] = hashed;
  } else {
    throw new Error('Unable to set a non-enumerable property on object.');
  }

  return hashed;
}

// Get references to ES5 object methods.
var isExtensible = Object.isExtensible;

// True if Object.defineProperty works as expected. IE8 fails this test.
var canDefineProperty = (function() {
  try {
    Object.defineProperty({}, '@', {});
    return true;
  } catch (e) {
    return false;
  }
})();

// IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
// and avoid memory leaks from the IE cloneNode bug.
function getIENodeHash(node) {
  if (node && node.nodeType > 0) {
    switch (node.nodeType) {
      case 1: // Element
        return node.uniqueID;
      case 9: // Document
        return node.documentElement && node.documentElement.uniqueID;
    }
  }
}

// If possible, use a WeakMap.
var usingWeakMap = typeof WeakMap === 'function';
var weakMap;
if (usingWeakMap) {
  weakMap = new WeakMap();
}

var objHashUID = 0;

var UID_HASH_KEY = '__immutablehash__';
if (typeof Symbol === 'function') {
  UID_HASH_KEY = Symbol(UID_HASH_KEY);
}

var STRING_HASH_CACHE_MIN_STRLEN = 16;
var STRING_HASH_CACHE_MAX_SIZE = 255;
var STRING_HASH_CACHE_SIZE = 0;
var stringHashCache = {};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//
// Floyd-Rivest algorithm according to wikipedia
// https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm
//

var swap = function (array, i, j) {
  var tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
};

var sampleThreshold = 1000;
var sampleReach = 0.5;

// partition the elements between inclusive left and right around t
var quickSelectRange = function (array, left, right, k, comparator) {
  // k is outside of range, no need to sort out anything
  if (k < left || k > right) {
    return;
  }
  while (right > left) {
    // use select recursively to sample a smaller set of size s
    // the arbitrary constants 600 and 0.5 are used in the original
    // version to minimize execution time
    if (right - left > sampleThreshold) {
      var n = right - left + 1;
      var i = k - left + 1;
      var z = Math.log(n);
      var s = sampleReach * Math.exp(2 * z / 3);
      var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * Math.sign(i - n / 2);
      var newLeft = Math.max(left, Math.floor(k - i * s / n + sd));
      var newRight = Math.min(right, Math.floor(k + (n - i) * s / n + sd));
      quickSelectRange(array, newLeft, newRight, k, comparator);
    }

    var t = array[k];
    var i$1 = left;
    var j = right;
    swap(array, left, k);
    if (comparator(array[right], t) > 0) {
      swap(array, right, left);
    }
    while (i$1 < j) {
      swap(array, i$1++, j--);
      while (comparator(array[i$1], t) < 0) {
        i$1++;
      }
      while (comparator(array[j], t) > 0) {
        j--;
      }
    }
    if (array[left] === t) {
      swap(array, left, j);
    } else {
      swap(array, ++j, right);
    }
    // adjust left and right towards the boundaries of the subset
    // containing the (k - left + 1)th smallest element
    if (j <= k) {
      left = j + 1;
    }
    if (k <= j) {
      right = j - 1;
    }
  }
};

var quickSelect = function (array, k, comparator) {
  if (!comparator) {
    comparator = function (a, b) { return (a > b ? 1 : a < b ? -1 : 0); };
  }
  quickSelectRange(array, 0, array.length - 1, k, comparator);
};

var ToKeyedSequence = (function (KeyedSeq$$1) {
  function ToKeyedSequence(indexed, useKeys) {
    this._iter = indexed;
    this._useKeys = useKeys;
    this.size = indexed.size;
  }

  if ( KeyedSeq$$1 ) ToKeyedSequence.__proto__ = KeyedSeq$$1;
  ToKeyedSequence.prototype = Object.create( KeyedSeq$$1 && KeyedSeq$$1.prototype );
  ToKeyedSequence.prototype.constructor = ToKeyedSequence;

  ToKeyedSequence.prototype.get = function get (key, notSetValue) {
    return this._iter.get(key, notSetValue);
  };

  ToKeyedSequence.prototype.has = function has (key) {
    return this._iter.has(key);
  };

  ToKeyedSequence.prototype.valueSeq = function valueSeq () {
    return this._iter.valueSeq();
  };

  ToKeyedSequence.prototype.reverse = function reverse () {
    var this$1 = this;

    var reversedSequence = reverseFactory(this, true);
    if (!this._useKeys) {
      reversedSequence.valueSeq = function () { return this$1._iter.toSeq().reverse(); };
    }
    return reversedSequence;
  };

  ToKeyedSequence.prototype.map = function map (mapper, context) {
    var this$1 = this;

    var mappedSequence = mapFactory(this, mapper, context);
    if (!this._useKeys) {
      mappedSequence.valueSeq = function () { return this$1._iter.toSeq().map(mapper, context); };
    }
    return mappedSequence;
  };

  ToKeyedSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._iter.__iterate(function (v, k) { return fn(v, k, this$1); }, reverse);
  };

  ToKeyedSequence.prototype.__iterator = function __iterator (type, reverse) {
    return this._iter.__iterator(type, reverse);
  };

  return ToKeyedSequence;
}(KeyedSeq));
ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;

var ToIndexedSequence = (function (IndexedSeq$$1) {
  function ToIndexedSequence(iter) {
    this._iter = iter;
    this.size = iter.size;
  }

  if ( IndexedSeq$$1 ) ToIndexedSequence.__proto__ = IndexedSeq$$1;
  ToIndexedSequence.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
  ToIndexedSequence.prototype.constructor = ToIndexedSequence;

  ToIndexedSequence.prototype.includes = function includes (value) {
    return this._iter.includes(value);
  };

  ToIndexedSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var i = 0;
    reverse && ensureSize(this);
    return this._iter.__iterate(
      function (v) { return fn(v, reverse ? this$1.size - ++i : i++, this$1); },
      reverse
    );
  };

  ToIndexedSequence.prototype.__iterator = function __iterator (type, reverse) {
    var this$1 = this;

    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
    var i = 0;
    reverse && ensureSize(this);
    return new Iterator(function () {
      var step = iterator.next();
      return step.done
        ? step
        : iteratorValue(
            type,
            reverse ? this$1.size - ++i : i++,
            step.value,
            step
          );
    });
  };

  return ToIndexedSequence;
}(IndexedSeq));

var ToSetSequence = (function (SetSeq$$1) {
  function ToSetSequence(iter) {
    this._iter = iter;
    this.size = iter.size;
  }

  if ( SetSeq$$1 ) ToSetSequence.__proto__ = SetSeq$$1;
  ToSetSequence.prototype = Object.create( SetSeq$$1 && SetSeq$$1.prototype );
  ToSetSequence.prototype.constructor = ToSetSequence;

  ToSetSequence.prototype.has = function has (key) {
    return this._iter.includes(key);
  };

  ToSetSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._iter.__iterate(function (v) { return fn(v, v, this$1); }, reverse);
  };

  ToSetSequence.prototype.__iterator = function __iterator (type, reverse) {
    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
    return new Iterator(function () {
      var step = iterator.next();
      return step.done
        ? step
        : iteratorValue(type, step.value, step.value, step);
    });
  };

  return ToSetSequence;
}(SetSeq));

var FromEntriesSequence = (function (KeyedSeq$$1) {
  function FromEntriesSequence(entries) {
    this._iter = entries;
    this.size = entries.size;
  }

  if ( KeyedSeq$$1 ) FromEntriesSequence.__proto__ = KeyedSeq$$1;
  FromEntriesSequence.prototype = Object.create( KeyedSeq$$1 && KeyedSeq$$1.prototype );
  FromEntriesSequence.prototype.constructor = FromEntriesSequence;

  FromEntriesSequence.prototype.entrySeq = function entrySeq () {
    return this._iter.toSeq();
  };

  FromEntriesSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._iter.__iterate(function (entry) {
      // Check if entry exists first so array access doesn't throw for holes
      // in the parent iteration.
      if (entry) {
        validateEntry(entry);
        var indexedCollection = isCollection(entry);
        return fn(
          indexedCollection ? entry.get(1) : entry[1],
          indexedCollection ? entry.get(0) : entry[0],
          this$1
        );
      }
    }, reverse);
  };

  FromEntriesSequence.prototype.__iterator = function __iterator (type, reverse) {
    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
    return new Iterator(function () {
      while (true) {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedCollection = isCollection(entry);
          return iteratorValue(
            type,
            indexedCollection ? entry.get(0) : entry[0],
            indexedCollection ? entry.get(1) : entry[1],
            step
          );
        }
      }
    });
  };

  return FromEntriesSequence;
}(KeyedSeq));

ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;

function flipFactory(collection) {
  var flipSequence = makeSequence(collection);
  flipSequence._iter = collection;
  flipSequence.size = collection.size;
  flipSequence.flip = function () { return collection; };
  flipSequence.reverse = function() {
    var reversedSequence = collection.reverse.apply(this); // super.reverse()
    reversedSequence.flip = function () { return collection.reverse(); };
    return reversedSequence;
  };
  flipSequence.has = function (key) { return collection.includes(key); };
  flipSequence.includes = function (key) { return collection.has(key); };
  flipSequence.cacheResult = cacheResultThrough;
  flipSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    return collection.__iterate(function (v, k) { return fn(k, v, this$1) !== false; }, reverse);
  };
  flipSequence.__iteratorUncached = function(type, reverse) {
    if (type === ITERATE_ENTRIES) {
      var iterator = collection.__iterator(type, reverse);
      return new Iterator(function () {
        var step = iterator.next();
        if (!step.done) {
          var k = step.value[0];
          step.value[0] = step.value[1];
          step.value[1] = k;
        }
        return step;
      });
    }
    return collection.__iterator(
      type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
      reverse
    );
  };
  return flipSequence;
}

function mapFactory(collection, mapper, context) {
  var mappedSequence = makeSequence(collection);
  mappedSequence.size = collection.size;
  mappedSequence.has = function (key) { return collection.has(key); };
  mappedSequence.get = function (key, notSetValue) {
    var v = collection.get(key, NOT_SET);
    return v === NOT_SET
      ? notSetValue
      : mapper.call(context, v, key, collection);
  };
  mappedSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    return collection.__iterate(
      function (v, k, c) { return fn(mapper.call(context, v, k, c), k, this$1) !== false; },
      reverse
    );
  };
  mappedSequence.__iteratorUncached = function(type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    return new Iterator(function () {
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      var key = entry[0];
      return iteratorValue(
        type,
        key,
        mapper.call(context, entry[1], key, collection),
        step
      );
    });
  };
  return mappedSequence;
}

function reverseFactory(collection, useKeys) {
  var this$1 = this;

  var reversedSequence = makeSequence(collection);
  reversedSequence._iter = collection;
  reversedSequence.size = collection.size;
  reversedSequence.reverse = function () { return collection; };
  if (collection.flip) {
    reversedSequence.flip = function() {
      var flipSequence = flipFactory(collection);
      flipSequence.reverse = function () { return collection.flip(); };
      return flipSequence;
    };
  }
  reversedSequence.get = function (key, notSetValue) { return collection.get(useKeys ? key : -1 - key, notSetValue); };
  reversedSequence.has = function (key) { return collection.has(useKeys ? key : -1 - key); };
  reversedSequence.includes = function (value) { return collection.includes(value); };
  reversedSequence.cacheResult = cacheResultThrough;
  reversedSequence.__iterate = function(fn, reverse) {
    var this$1 = this;

    var i = 0;
    reverse && ensureSize(collection);
    return collection.__iterate(
      function (v, k) { return fn(v, useKeys ? k : reverse ? this$1.size - ++i : i++, this$1); },
      !reverse
    );
  };
  reversedSequence.__iterator = function (type, reverse) {
    var i = 0;
    reverse && ensureSize(collection);
    var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);
    return new Iterator(function () {
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      return iteratorValue(
        type,
        useKeys ? entry[0] : reverse ? this$1.size - ++i : i++,
        entry[1],
        step
      );
    });
  };
  return reversedSequence;
}

function filterFactory(collection, predicate, context, useKeys) {
  var filterSequence = makeSequence(collection);
  if (useKeys) {
    filterSequence.has = function (key) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && !!predicate.call(context, v, key, collection);
    };
    filterSequence.get = function (key, notSetValue) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && predicate.call(context, v, key, collection)
        ? v
        : notSetValue;
    };
  }
  filterSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    var iterations = 0;
    collection.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1);
      }
    }, reverse);
    return iterations;
  };
  filterSequence.__iteratorUncached = function(type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    var iterations = 0;
    return new Iterator(function () {
      while (true) {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        var value = entry[1];
        if (predicate.call(context, value, key, collection)) {
          return iteratorValue(type, useKeys ? key : iterations++, value, step);
        }
      }
    });
  };
  return filterSequence;
}

function countByFactory(collection, grouper, context) {
  var groups = Map().asMutable();
  collection.__iterate(function (v, k) {
    groups.update(grouper.call(context, v, k, collection), 0, function (a) { return a + 1; });
  });
  return groups.asImmutable();
}

function groupByFactory(collection, grouper, context) {
  var isKeyedIter = isKeyed(collection);
  var groups = (isOrdered(collection) ? OrderedMap() : Map()).asMutable();
  collection.__iterate(function (v, k) {
    groups.update(
      grouper.call(context, v, k, collection),
      function (a) { return ((a = a || []), a.push(isKeyedIter ? [k, v] : v), a); }
    );
  });
  var coerce = collectionClass(collection);
  return groups.map(function (arr) { return reify(collection, coerce(arr)); });
}

function sliceFactory(collection, begin, end, useKeys) {
  var originalSize = collection.size;

  if (wholeSlice(begin, end, originalSize)) {
    return collection;
  }

  var resolvedBegin = resolveBegin(begin, originalSize);
  var resolvedEnd = resolveEnd(end, originalSize);

  // begin or end will be NaN if they were provided as negative numbers and
  // this collection's size is unknown. In that case, cache first so there is
  // a known size and these do not resolve to NaN.
  if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
    return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
  }

  // Note: resolvedEnd is undefined when the original sequence's length is
  // unknown and this slice did not supply an end and should contain all
  // elements after resolvedBegin.
  // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
  var resolvedSize = resolvedEnd - resolvedBegin;
  var sliceSize;
  if (resolvedSize === resolvedSize) {
    sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
  }

  var sliceSeq = makeSequence(collection);

  // If collection.size is undefined, the size of the realized sliceSeq is
  // unknown at this point unless the number of items to slice is 0
  sliceSeq.size =
    sliceSize === 0 ? sliceSize : (collection.size && sliceSize) || undefined;

  if (!useKeys && isSeq(collection) && sliceSize >= 0) {
    sliceSeq.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      return index >= 0 && index < sliceSize
        ? collection.get(index + resolvedBegin, notSetValue)
        : notSetValue;
    };
  }

  sliceSeq.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    if (sliceSize === 0) {
      return 0;
    }
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var skipped = 0;
    var isSkipping = true;
    var iterations = 0;
    collection.__iterate(function (v, k) {
      if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
        iterations++;
        return (
          fn(v, useKeys ? k : iterations - 1, this$1) !== false &&
          iterations !== sliceSize
        );
      }
    });
    return iterations;
  };

  sliceSeq.__iteratorUncached = function(type, reverse) {
    if (sliceSize !== 0 && reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    // Don't bother instantiating parent iterator if taking 0.
    if (sliceSize === 0) {
      return new Iterator(iteratorDone);
    }
    var iterator = collection.__iterator(type, reverse);
    var skipped = 0;
    var iterations = 0;
    return new Iterator(function () {
      while (skipped++ < resolvedBegin) {
        iterator.next();
      }
      if (++iterations > sliceSize) {
        return iteratorDone();
      }
      var step = iterator.next();
      if (useKeys || type === ITERATE_VALUES || step.done) {
        return step;
      }
      if (type === ITERATE_KEYS) {
        return iteratorValue(type, iterations - 1, undefined, step);
      }
      return iteratorValue(type, iterations - 1, step.value[1], step);
    });
  };

  return sliceSeq;
}

function takeWhileFactory(collection, predicate, context) {
  var takeSequence = makeSequence(collection);
  takeSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var iterations = 0;
    collection.__iterate(
      function (v, k, c) { return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$1); }
    );
    return iterations;
  };
  takeSequence.__iteratorUncached = function(type, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    var iterating = true;
    return new Iterator(function () {
      if (!iterating) {
        return iteratorDone();
      }
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      var k = entry[0];
      var v = entry[1];
      if (!predicate.call(context, v, k, this$1)) {
        iterating = false;
        return iteratorDone();
      }
      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };
  return takeSequence;
}

function skipWhileFactory(collection, predicate, context, useKeys) {
  var skipSequence = makeSequence(collection);
  skipSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var isSkipping = true;
    var iterations = 0;
    collection.__iterate(function (v, k, c) {
      if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1);
      }
    });
    return iterations;
  };
  skipSequence.__iteratorUncached = function(type, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    var skipping = true;
    var iterations = 0;
    return new Iterator(function () {
      var step;
      var k;
      var v;
      do {
        step = iterator.next();
        if (step.done) {
          if (useKeys || type === ITERATE_VALUES) {
            return step;
          }
          if (type === ITERATE_KEYS) {
            return iteratorValue(type, iterations++, undefined, step);
          }
          return iteratorValue(type, iterations++, step.value[1], step);
        }
        var entry = step.value;
        k = entry[0];
        v = entry[1];
        skipping && (skipping = predicate.call(context, v, k, this$1));
      } while (skipping);
      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };
  return skipSequence;
}

function concatFactory(collection, values) {
  var isKeyedCollection = isKeyed(collection);
  var iters = [collection]
    .concat(values)
    .map(function (v) {
      if (!isCollection(v)) {
        v = isKeyedCollection
          ? keyedSeqFromValue(v)
          : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedCollection) {
        v = KeyedCollection(v);
      }
      return v;
    })
    .filter(function (v) { return v.size !== 0; });

  if (iters.length === 0) {
    return collection;
  }

  if (iters.length === 1) {
    var singleton = iters[0];
    if (
      singleton === collection ||
      (isKeyedCollection && isKeyed(singleton)) ||
      (isIndexed(collection) && isIndexed(singleton))
    ) {
      return singleton;
    }
  }

  var concatSeq = new ArraySeq(iters);
  if (isKeyedCollection) {
    concatSeq = concatSeq.toKeyedSeq();
  } else if (!isIndexed(collection)) {
    concatSeq = concatSeq.toSetSeq();
  }
  concatSeq = concatSeq.flatten(true);
  concatSeq.size = iters.reduce(function (sum, seq) {
    if (sum !== undefined) {
      var size = seq.size;
      if (size !== undefined) {
        return sum + size;
      }
    }
  }, 0);
  return concatSeq;
}

function flattenFactory(collection, depth, useKeys) {
  var flatSequence = makeSequence(collection);
  flatSequence.__iterateUncached = function(fn, reverse) {
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var iterations = 0;
    var stopped = false;
    function flatDeep(iter, currentDepth) {
      iter.__iterate(function (v, k) {
        if ((!depth || currentDepth < depth) && isCollection(v)) {
          flatDeep(v, currentDepth + 1);
        } else {
          iterations++;
          if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
            stopped = true;
          }
        }
        return !stopped;
      }, reverse);
    }
    flatDeep(collection, 0);
    return iterations;
  };
  flatSequence.__iteratorUncached = function(type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = collection.__iterator(type, reverse);
    var stack = [];
    var iterations = 0;
    return new Iterator(function () {
      while (iterator) {
        var step = iterator.next();
        if (step.done !== false) {
          iterator = stack.pop();
          continue;
        }
        var v = step.value;
        if (type === ITERATE_ENTRIES) {
          v = v[1];
        }
        if ((!depth || stack.length < depth) && isCollection(v)) {
          stack.push(iterator);
          iterator = v.__iterator(type, reverse);
        } else {
          return useKeys ? step : iteratorValue(type, iterations++, v, step);
        }
      }
      return iteratorDone();
    });
  };
  return flatSequence;
}

function flatMapFactory(collection, mapper, context) {
  var coerce = collectionClass(collection);
  return collection
    .toSeq()
    .map(function (v, k) { return coerce(mapper.call(context, v, k, collection)); })
    .flatten(true);
}

function interposeFactory(collection, separator) {
  var interposedSequence = makeSequence(collection);
  interposedSequence.size = collection.size && collection.size * 2 - 1;
  interposedSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    var iterations = 0;
    collection.__iterate(
      function (v) { return (!iterations || fn(separator, iterations++, this$1) !== false) &&
        fn(v, iterations++, this$1) !== false; },
      reverse
    );
    return iterations;
  };
  interposedSequence.__iteratorUncached = function(type, reverse) {
    var iterator = collection.__iterator(ITERATE_VALUES, reverse);
    var iterations = 0;
    var step;
    return new Iterator(function () {
      if (!step || iterations % 2) {
        step = iterator.next();
        if (step.done) {
          return step;
        }
      }
      return iterations % 2
        ? iteratorValue(type, iterations++, separator)
        : iteratorValue(type, iterations++, step.value, step);
    });
  };
  return interposedSequence;
}

function sortFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }
  var isKeyedCollection = isKeyed(collection);
  var index = 0;
  var entries = collection
    .toSeq()
    .map(function (v, k) { return [k, v, index++, mapper ? mapper(v, k, collection) : v]; })
    .valueSeq()
    .toArray();
  entries.sort(function (a, b) { return comparator(a[3], b[3]) || a[2] - b[2]; }).forEach(
    isKeyedCollection
      ? function (v, i) {
          entries[i].length = 2;
        }
      : function (v, i) {
          entries[i] = v[1];
        }
  );
  return isKeyedCollection
    ? KeyedSeq(entries)
    : isIndexed(collection) ? IndexedSeq(entries) : SetSeq(entries);
}

function partialSortFactory(collection, n, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }
  var isKeyedCollection = isKeyed(collection);
  var index = 0;
  var entries = collection
    .toSeq()
    .map(function (v, k) { return [k, v, index++, mapper ? mapper(v, k, collection) : v]; })
    .valueSeq()
    .toArray();
  var cmp = function (a, b) { return comparator(a[3], b[3]) || a[2] - b[2]; };
  quickSelect(entries, n, cmp);
  entries = entries.slice(0, n);
  entries.sort(cmp).forEach(
    isKeyedCollection
      ? function (v, i) {
          entries[i].length = 2;
        }
      : function (v, i) {
          entries[i] = v[1];
        }
  );
  return isKeyedCollection
    ? KeyedSeq(entries)
    : isIndexed(collection) ? IndexedSeq(entries) : SetSeq(entries);
}

function incSortFactory(collection, comparator, mapper, useKeys) {
  if (!comparator) {
    comparator = defaultComparator;
  }

  var index = 0;
  var entriesSeq = collection
    .toSeq()
    .map(function (v, k) { return [k, v, index++, mapper ? mapper(v, k, collection) : v]; })
    .valueSeq();

  var sequence = makeSequence(collection);
  sequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    var entries = entriesSeq.toArray();
    var rcmp = reverse ? function (a, b) { return comparator(b, a); } : comparator;
    var cmp = function (a, b) { return rcmp(a[3], b[3]) || a[2] - b[2]; };

    var nextn = entries.length >> 10;
    nextn = Math.min(entries.length, 10);

    var from = 0;
    var to = -1;
    var n = 0;
    var i = 0;
    var sortedEntries;

    function nextBatch() {
      from = to + 1;
      to = Math.min(to + nextn, entries.length - 1);
      n = to - from + 1;
      i = 0;
      nextn <<= 2;

      quickSelectRange(entries, from, entries.length - 1, to, cmp);
      sortedEntries = entries.slice(from, to + 1);
      sortedEntries.sort(cmp).forEach(function (v, i) {
        sortedEntries[i].length = 2;
      });
    }

    function nextEntry() {
      if (i >= n) {
        nextBatch();
      }
      return sortedEntries[i++];
    }

    var iterations = 0;
    while (iterations < entries.length) {
      var entry = nextEntry();
      if (fn(entry[1], useKeys ? entry[0] : iterations, this$1) === false) {
        break;
      }
      iterations++;
    }
    return iterations;
  };

  sequence.__iteratorUncached = function(type, reverse) {
    var entries = entriesSeq.toArray();
    var rcmp = reverse ? function (a, b) { return comparator(b, a); } : comparator;
    var cmp = function (a, b) { return rcmp(a[3], b[3]) || a[2] - b[2]; };

    var nextn = entries.length >> 10;
    nextn = Math.min(entries.length, 10);

    var from = 0;
    var to = -1;
    var n = 0;
    var i = 0;
    var sortedEntries;

    function nextBatch() {
      from = to + 1;
      to = Math.min(to + nextn, entries.length - 1);
      n = to - from + 1;
      i = 0;
      nextn <<= 2;

      quickSelectRange(entries, from, entries.length - 1, to, cmp);
      sortedEntries = entries.slice(from, to + 1);
      sortedEntries.sort(cmp).forEach(function (v, i) {
        sortedEntries[i].length = 2;
      });
    }

    function nextEntry() {
      if (i >= n) {
        nextBatch();
      }
      return sortedEntries[i++];
    }

    var iterations = 0;
    return new Iterator(function () {
      if (iterations >= entries.length) {
        return iteratorDone();
      }
      iterations++;
      var entry = nextEntry(cmp);
      return iteratorValue(type, useKeys ? entry[0] : iterations, entry[1]);
    });
  };
  return sequence;
}

function maxFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }
  if (mapper) {
    var entry = collection
      .toSeq()
      .map(function (v, k) { return [v, mapper(v, k, collection)]; })
      .reduce(function (a, b) { return (maxCompare(comparator, a[1], b[1]) ? b : a); });
    return entry && entry[0];
  }
  return collection.reduce(function (a, b) { return (maxCompare(comparator, a, b) ? b : a); });
}

function maxCompare(comparator, a, b) {
  var comp = comparator(b, a);
  // b is considered the new max if the comparator declares them equal, but
  // they are not equal and b is in fact a nullish value.
  return (
    (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) ||
    comp > 0
  );
}

function zipWithFactory(keyIter, zipper, iters, zipAll) {
  var zipSequence = makeSequence(keyIter);
  var sizes = new ArraySeq(iters).map(function (i) { return i.size; });
  zipSequence.size = zipAll ? sizes.max() : sizes.min();
  // Note: this a generic base implementation of __iterate in terms of
  // __iterator which may be more generically useful in the future.
  zipSequence.__iterate = function(fn, reverse) {
    var this$1 = this;

    /* generic:
    var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
    var step;
    var iterations = 0;
    while (!(step = iterator.next()).done) {
      iterations++;
      if (fn(step.value[1], step.value[0], this) === false) {
        break;
      }
    }
    return iterations;
    */
    // indexed:
    var iterator = this.__iterator(ITERATE_VALUES, reverse);
    var step;
    var iterations = 0;
    while (!(step = iterator.next()).done) {
      if (fn(step.value, iterations++, this$1) === false) {
        break;
      }
    }
    return iterations;
  };
  zipSequence.__iteratorUncached = function(type, reverse) {
    var iterators = iters.map(
      function (i) { return ((i = Collection(i)), getIterator(reverse ? i.reverse() : i)); }
    );
    var iterations = 0;
    var isDone = false;
    return new Iterator(function () {
      var steps;
      if (!isDone) {
        steps = iterators.map(function (i) { return i.next(); });
        isDone = zipAll ? steps.every(function (s) { return s.done; }) : steps.some(function (s) { return s.done; });
      }
      if (isDone) {
        return iteratorDone();
      }
      return iteratorValue(
        type,
        iterations++,
        zipper.apply(null, steps.map(function (s) { return s.value; }))
      );
    });
  };
  return zipSequence;
}

// #pragma Helper Functions

function reify(iter, seq) {
  return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
}

function validateEntry(entry) {
  if (entry !== Object(entry)) {
    throw new TypeError('Expected [K, V] tuple: ' + entry);
  }
}

function collectionClass(collection) {
  return isKeyed(collection)
    ? KeyedCollection
    : isIndexed(collection) ? IndexedCollection : SetCollection;
}

function makeSequence(collection) {
  return Object.create(
    (isKeyed(collection)
      ? KeyedSeq
      : isIndexed(collection) ? IndexedSeq : SetSeq
    ).prototype
  );
}

function cacheResultThrough() {
  if (this._iter.cacheResult) {
    this._iter.cacheResult();
    this.size = this._iter.size;
    return this;
  }
  return Seq.prototype.cacheResult.call(this);
}

function defaultComparator(a, b) {
  if (a === undefined && b === undefined) {
    return 0;
  }

  if (a === undefined) {
    return 1;
  }

  if (b === undefined) {
    return -1;
  }

  return a > b ? 1 : a < b ? -1 : 0;
}

// http://jsperf.com/copy-array-inline
function arrCopy(arr, offset) {
  offset = offset || 0;
  var len = Math.max(0, arr.length - offset);
  var newArr = new Array(len);
  for (var ii = 0; ii < len; ii++) {
    newArr[ii] = arr[ii + offset];
  }
  return newArr;
}

function invariant(condition, error) {
  if (!condition) { throw new Error(error); }
}

function assertNotInfinite(size) {
  invariant(
    size !== Infinity,
    'Cannot perform this action with an infinite size.'
  );
}

function coerceKeyPath(keyPath) {
  if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
    return keyPath;
  }
  if (isOrdered(keyPath)) {
    return keyPath.toArray();
  }
  throw new TypeError(
    'Invalid keyPath: expected Ordered Collection or Array: ' + keyPath
  );
}

function isPlainObj(value) {
  return (
    value && (value.constructor === Object || value.constructor === undefined)
  );
}

/**
 * Returns true if the value is a potentially-persistent data structure, either
 * provided by Immutable.js or a plain Array or Object.
 */
function isDataStructure(value) {
  return isImmutable(value) || Array.isArray(value) || isPlainObj(value);
}

/**
 * Converts a value to a string, adding quotes if a string was provided.
 */
function quoteString(value) {
  try {
    return typeof value === 'string' ? JSON.stringify(value) : String(value);
  } catch (_ignoreError) {
    return JSON.stringify(value);
  }
}

function has(collection, key) {
  return isImmutable(collection)
    ? collection.has(key)
    : isDataStructure(collection) && hasOwnProperty.call(collection, key);
}

function get(collection, key, notSetValue) {
  return isImmutable(collection)
    ? collection.get(key, notSetValue)
    : !has(collection, key)
      ? notSetValue
      : typeof collection.get === 'function'
        ? collection.get(key)
        : collection[key];
}

function shallowCopy(from) {
  if (Array.isArray(from)) {
    return arrCopy(from);
  }
  var to = {};
  for (var key in from) {
    if (hasOwnProperty.call(from, key)) {
      to[key] = from[key];
    }
  }
  return to;
}

function remove(collection, key) {
  if (!isDataStructure(collection)) {
    throw new TypeError(
      'Cannot update non-data-structure value: ' + collection
    );
  }
  if (isImmutable(collection)) {
    if (!collection.remove) {
      throw new TypeError(
        'Cannot update immutable value without .remove() method: ' + collection
      );
    }
    return collection.remove(key);
  }
  if (!hasOwnProperty.call(collection, key)) {
    return collection;
  }
  var collectionCopy = shallowCopy(collection);
  if (Array.isArray(collectionCopy)) {
    collectionCopy.splice(key, 1);
  } else {
    delete collectionCopy[key];
  }
  return collectionCopy;
}

function set(collection, key, value) {
  if (!isDataStructure(collection)) {
    throw new TypeError(
      'Cannot update non-data-structure value: ' + collection
    );
  }
  if (isImmutable(collection)) {
    if (!collection.set) {
      throw new TypeError(
        'Cannot update immutable value without .set() method: ' + collection
      );
    }
    return collection.set(key, value);
  }
  if (hasOwnProperty.call(collection, key) && value === collection[key]) {
    return collection;
  }
  var collectionCopy = shallowCopy(collection);
  collectionCopy[key] = value;
  return collectionCopy;
}

function updateIn(collection, keyPath, notSetValue, updater) {
  if (!updater) {
    updater = notSetValue;
    notSetValue = undefined;
  }
  var updatedValue = updateInDeeply(
    isImmutable(collection),
    collection,
    coerceKeyPath(keyPath),
    0,
    notSetValue,
    updater
  );
  return updatedValue === NOT_SET ? notSetValue : updatedValue;
}

function updateInDeeply(
  inImmutable,
  existing,
  keyPath,
  i,
  notSetValue,
  updater
) {
  var wasNotSet = existing === NOT_SET;
  if (i === keyPath.length) {
    var existingValue = wasNotSet ? notSetValue : existing;
    var newValue = updater(existingValue);
    return newValue === existingValue ? existing : newValue;
  }
  if (!wasNotSet && !isDataStructure(existing)) {
    throw new TypeError(
      'Cannot update within non-data-structure value in path [' +
        keyPath.slice(0, i).map(quoteString) +
        ']: ' +
        existing
    );
  }
  var key = keyPath[i];
  var nextExisting = wasNotSet ? NOT_SET : get(existing, key, NOT_SET);
  var nextUpdated = updateInDeeply(
    nextExisting === NOT_SET ? inImmutable : isImmutable(nextExisting),
    nextExisting,
    keyPath,
    i + 1,
    notSetValue,
    updater
  );
  return nextUpdated === nextExisting
    ? existing
    : nextUpdated === NOT_SET
      ? remove(existing, key)
      : set(
          wasNotSet ? (inImmutable ? emptyMap() : {}) : existing,
          key,
          nextUpdated
        );
}

function setIn$1(collection, keyPath, value) {
  return updateIn(collection, keyPath, NOT_SET, function () { return value; });
}

function setIn$$1(keyPath, v) {
  return setIn$1(this, keyPath, v);
}

function removeIn(collection, keyPath) {
  return updateIn(collection, keyPath, function () { return NOT_SET; });
}

function deleteIn(keyPath) {
  return removeIn(this, keyPath);
}

function update$1(collection, key, notSetValue, updater) {
  return updateIn(collection, [key], notSetValue, updater);
}

function update$$1(key, notSetValue, updater) {
  return arguments.length === 1
    ? key(this)
    : update$1(this, key, notSetValue, updater);
}

function updateIn$1(keyPath, notSetValue, updater) {
  return updateIn(this, keyPath, notSetValue, updater);
}

function merge() {
  var iters = [], len = arguments.length;
  while ( len-- ) iters[ len ] = arguments[ len ];

  return mergeIntoKeyedWith(this, iters);
}

function mergeWith(merger) {
  var iters = [], len = arguments.length - 1;
  while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

  return mergeIntoKeyedWith(this, iters, merger);
}

function mergeIntoKeyedWith(collection, collections, merger) {
  var iters = [];
  for (var ii = 0; ii < collections.length; ii++) {
    var collection$1 = KeyedCollection(collections[ii]);
    if (collection$1.size !== 0) {
      iters.push(collection$1);
    }
  }
  if (iters.length === 0) {
    return collection;
  }
  if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
    return collection.constructor(iters[0]);
  }
  return collection.withMutations(function (collection) {
    var mergeIntoCollection = merger
      ? function (value, key) {
          update$1(
            collection,
            key,
            NOT_SET,
            function (oldVal) { return (oldVal === NOT_SET ? value : merger(oldVal, value, key)); }
          );
        }
      : function (value, key) {
          collection.set(key, value);
        };
    for (var ii = 0; ii < iters.length; ii++) {
      iters[ii].forEach(mergeIntoCollection);
    }
  });
}

function merge$1(collection) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  return mergeWithSources(collection, sources);
}

function mergeWith$1(merger, collection) {
  var sources = [], len = arguments.length - 2;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 2 ];

  return mergeWithSources(collection, sources, merger);
}

function mergeDeep$1(collection) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  return mergeDeepWithSources(collection, sources);
}

function mergeDeepWith$1(merger, collection) {
  var sources = [], len = arguments.length - 2;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 2 ];

  return mergeDeepWithSources(collection, sources, merger);
}

function mergeDeepWithSources(collection, sources, merger) {
  return mergeWithSources(collection, sources, deepMergerWith(merger));
}

function mergeWithSources(collection, sources, merger) {
  if (!isDataStructure(collection)) {
    throw new TypeError(
      'Cannot merge into non-data-structure value: ' + collection
    );
  }
  if (isImmutable(collection)) {
    return collection.mergeWith
      ? collection.mergeWith.apply(collection, [ merger ].concat( sources ))
      : collection.concat.apply(collection, sources);
  }
  var isArray = Array.isArray(collection);
  var merged = collection;
  var Collection$$1 = isArray ? IndexedCollection : KeyedCollection;
  var mergeItem = isArray
    ? function (value) {
        // Copy on write
        if (merged === collection) {
          merged = shallowCopy(merged);
        }
        merged.push(value);
      }
    : function (value, key) {
        var hasVal = hasOwnProperty.call(merged, key);
        var nextVal =
          hasVal && merger ? merger(merged[key], value, key) : value;
        if (!hasVal || nextVal !== merged[key]) {
          // Copy on write
          if (merged === collection) {
            merged = shallowCopy(merged);
          }
          merged[key] = nextVal;
        }
      };
  for (var i = 0; i < sources.length; i++) {
    Collection$$1(sources[i]).forEach(mergeItem);
  }
  return merged;
}

function deepMergerWith(merger) {
  function deepMerger(oldValue, newValue, key) {
    return isDataStructure(oldValue) && isDataStructure(newValue)
      ? mergeWithSources(oldValue, [newValue], deepMerger)
      : merger ? merger(oldValue, newValue, key) : newValue;
  }
  return deepMerger;
}

function mergeDeep() {
  var iters = [], len = arguments.length;
  while ( len-- ) iters[ len ] = arguments[ len ];

  return mergeDeepWithSources(this, iters);
}

function mergeDeepWith(merger) {
  var iters = [], len = arguments.length - 1;
  while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

  return mergeDeepWithSources(this, iters, merger);
}

function mergeIn(keyPath) {
  var iters = [], len = arguments.length - 1;
  while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

  return updateIn(this, keyPath, emptyMap(), function (m) { return mergeWithSources(m, iters); });
}

function mergeDeepIn(keyPath) {
  var iters = [], len = arguments.length - 1;
  while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

  return updateIn(this, keyPath, emptyMap(), function (m) { return mergeDeepWithSources(m, iters); }
  );
}

function withMutations(fn) {
  var mutable = this.asMutable();
  fn(mutable);
  return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
}

function asMutable() {
  return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
}

function asImmutable() {
  return this.__ensureOwner();
}

function wasAltered() {
  return this.__altered;
}

var Map = (function (KeyedCollection$$1) {
  function Map(value) {
    return value === null || value === undefined
      ? emptyMap()
      : isMap(value) && !isOrdered(value) && !isSorted(value)
        ? value
        : emptyMap().withMutations(function (map) {
            var iter = KeyedCollection$$1(value);
            assertNotInfinite(iter.size);
            iter.forEach(function (v, k) { return map.set(k, v); });
          });
  }

  if ( KeyedCollection$$1 ) Map.__proto__ = KeyedCollection$$1;
  Map.prototype = Object.create( KeyedCollection$$1 && KeyedCollection$$1.prototype );
  Map.prototype.constructor = Map;

  Map.of = function of () {
    var keyValues = [], len = arguments.length;
    while ( len-- ) keyValues[ len ] = arguments[ len ];

    return emptyMap().withMutations(function (map) {
      for (var i = 0; i < keyValues.length; i += 2) {
        if (i + 1 >= keyValues.length) {
          throw new Error('Missing value for key: ' + keyValues[i]);
        }
        map.set(keyValues[i], keyValues[i + 1]);
      }
    });
  };

  Map.prototype.toString = function toString () {
    return this.__toString('Map {', '}');
  };

  // @pragma Access

  Map.prototype.get = function get (k, notSetValue) {
    return this._root
      ? this._root.get(0, undefined, k, notSetValue)
      : notSetValue;
  };

  // @pragma Modification

  Map.prototype.set = function set (k, v) {
    return updateMap(this, k, v);
  };

  Map.prototype.remove = function remove (k) {
    return updateMap(this, k, NOT_SET);
  };

  Map.prototype.deleteAll = function deleteAll (keys) {
    var collection = Collection(keys);

    if (collection.size === 0) {
      return this;
    }

    return this.withMutations(function (map) {
      collection.forEach(function (key) { return map.remove(key); });
    });
  };

  Map.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._root = null;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return emptyMap();
  };

  // @pragma Composition

  Map.prototype.sort = function sort (comparator) {
    // Late binding
    return OrderedMap(sortFactory(this, comparator));
  };

  Map.prototype.sortBy = function sortBy (mapper, comparator) {
    // Late binding
    return OrderedMap(sortFactory(this, comparator, mapper));
  };

  // @pragma Mutability

  Map.prototype.__iterator = function __iterator (type, reverse) {
    return new MapIterator(this, type, reverse);
  };

  Map.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var iterations = 0;
    this._root &&
      this._root.iterate(function (entry) {
        iterations++;
        return fn(entry[1], entry[0], this$1);
      }, reverse);
    return iterations;
  };

  Map.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyMap();
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeMap(this.size, this._root, ownerID, this.__hash);
  };

  return Map;
}(KeyedCollection));

function isMap(maybeMap) {
  return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
}

Map.isMap = isMap;

var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

var MapPrototype = Map.prototype;
MapPrototype[IS_MAP_SENTINEL] = true;
MapPrototype[DELETE] = MapPrototype.remove;
MapPrototype.removeAll = MapPrototype.deleteAll;
MapPrototype.concat = MapPrototype.merge;
MapPrototype.setIn = setIn$$1;
MapPrototype.removeIn = MapPrototype.deleteIn = deleteIn;
MapPrototype.update = update$$1;
MapPrototype.updateIn = updateIn$1;
MapPrototype.merge = merge;
MapPrototype.mergeWith = mergeWith;
MapPrototype.mergeDeep = mergeDeep;
MapPrototype.mergeDeepWith = mergeDeepWith;
MapPrototype.mergeIn = mergeIn;
MapPrototype.mergeDeepIn = mergeDeepIn;
MapPrototype.withMutations = withMutations;
MapPrototype.wasAltered = wasAltered;
MapPrototype.asImmutable = asImmutable;
MapPrototype['@@transducer/init'] = MapPrototype.asMutable = asMutable;
MapPrototype['@@transducer/step'] = function(result, arr) {
  return result.set(arr[0], arr[1]);
};
MapPrototype['@@transducer/result'] = function(obj) {
  return obj.asImmutable();
};

// #pragma Trie Nodes

var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
  this.ownerID = ownerID;
  this.entries = entries;
};

ArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  var entries = this.entries;
  for (var ii = 0, len = entries.length; ii < len; ii++) {
    if (is(key, entries[ii][0])) {
      return entries[ii][1];
    }
  }
  return notSetValue;
};

ArrayMapNode.prototype.update = function update$$1 (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  var removed = value === NOT_SET;

  var entries = this.entries;
  var idx = 0;
  var len = entries.length;
  for (; idx < len; idx++) {
    if (is(key, entries[idx][0])) {
      break;
    }
  }
  var exists = idx < len;

  if (exists ? entries[idx][1] === value : removed) {
    return this;
  }

  SetRef(didAlter);
  (removed || !exists) && SetRef(didChangeSize);

  if (removed && entries.length === 1) {
    return; // undefined
  }

  if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
    return createNodes(ownerID, entries, key, value);
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newEntries = isEditable ? entries : arrCopy(entries);

  if (exists) {
    if (removed) {
      idx === len - 1
        ? newEntries.pop()
        : (newEntries[idx] = newEntries.pop());
    } else {
      newEntries[idx] = [key, value];
    }
  } else {
    newEntries.push([key, value]);
  }

  if (isEditable) {
    this.entries = newEntries;
    return this;
  }

  return new ArrayMapNode(ownerID, newEntries);
};

var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
  this.ownerID = ownerID;
  this.bitmap = bitmap;
  this.nodes = nodes;
};

BitmapIndexedNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
  var bitmap = this.bitmap;
  return (bitmap & bit) === 0
    ? notSetValue
    : this.nodes[popCount(bitmap & (bit - 1))].get(
        shift + SHIFT,
        keyHash,
        key,
        notSetValue
      );
};

BitmapIndexedNode.prototype.update = function update$$1 (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var bit = 1 << keyHashFrag;
  var bitmap = this.bitmap;
  var exists = (bitmap & bit) !== 0;

  if (!exists && value === NOT_SET) {
    return this;
  }

  var idx = popCount(bitmap & (bit - 1));
  var nodes = this.nodes;
  var node = exists ? nodes[idx] : undefined;
  var newNode = updateNode(
    node,
    ownerID,
    shift + SHIFT,
    keyHash,
    key,
    value,
    didChangeSize,
    didAlter
  );

  if (newNode === node) {
    return this;
  }

  if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
    return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
  }

  if (
    exists &&
    !newNode &&
    nodes.length === 2 &&
    isLeafNode(nodes[idx ^ 1])
  ) {
    return nodes[idx ^ 1];
  }

  if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
    return newNode;
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newBitmap = exists ? (newNode ? bitmap : bitmap ^ bit) : bitmap | bit;
  var newNodes = exists
    ? newNode
      ? setAt(nodes, idx, newNode, isEditable)
      : spliceOut(nodes, idx, isEditable)
    : spliceIn(nodes, idx, newNode, isEditable);

  if (isEditable) {
    this.bitmap = newBitmap;
    this.nodes = newNodes;
    return this;
  }

  return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
};

var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
  this.ownerID = ownerID;
  this.count = count;
  this.nodes = nodes;
};

HashArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var node = this.nodes[idx];
  return node
    ? node.get(shift + SHIFT, keyHash, key, notSetValue)
    : notSetValue;
};

HashArrayMapNode.prototype.update = function update$$1 (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var removed = value === NOT_SET;
  var nodes = this.nodes;
  var node = nodes[idx];

  if (removed && !node) {
    return this;
  }

  var newNode = updateNode(
    node,
    ownerID,
    shift + SHIFT,
    keyHash,
    key,
    value,
    didChangeSize,
    didAlter
  );
  if (newNode === node) {
    return this;
  }

  var newCount = this.count;
  if (!node) {
    newCount++;
  } else if (!newNode) {
    newCount--;
    if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
      return packNodes(ownerID, nodes, newCount, idx);
    }
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newNodes = setAt(nodes, idx, newNode, isEditable);

  if (isEditable) {
    this.count = newCount;
    this.nodes = newNodes;
    return this;
  }

  return new HashArrayMapNode(ownerID, newCount, newNodes);
};

var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
  this.ownerID = ownerID;
  this.keyHash = keyHash;
  this.entries = entries;
};

HashCollisionNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  var entries = this.entries;
  for (var ii = 0, len = entries.length; ii < len; ii++) {
    if (is(key, entries[ii][0])) {
      return entries[ii][1];
    }
  }
  return notSetValue;
};

HashCollisionNode.prototype.update = function update$$1 (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var removed = value === NOT_SET;

  if (keyHash !== this.keyHash) {
    if (removed) {
      return this;
    }
    SetRef(didAlter);
    SetRef(didChangeSize);
    return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
  }

  var entries = this.entries;
  var idx = 0;
  var len = entries.length;
  for (; idx < len; idx++) {
    if (is(key, entries[idx][0])) {
      break;
    }
  }
  var exists = idx < len;

  if (exists ? entries[idx][1] === value : removed) {
    return this;
  }

  SetRef(didAlter);
  (removed || !exists) && SetRef(didChangeSize);

  if (removed && len === 2) {
    return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newEntries = isEditable ? entries : arrCopy(entries);

  if (exists) {
    if (removed) {
      idx === len - 1
        ? newEntries.pop()
        : (newEntries[idx] = newEntries.pop());
    } else {
      newEntries[idx] = [key, value];
    }
  } else {
    newEntries.push([key, value]);
  }

  if (isEditable) {
    this.entries = newEntries;
    return this;
  }

  return new HashCollisionNode(ownerID, this.keyHash, newEntries);
};

var ValueNode = function ValueNode(ownerID, keyHash, entry) {
  this.ownerID = ownerID;
  this.keyHash = keyHash;
  this.entry = entry;
};

ValueNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
};

ValueNode.prototype.update = function update$$1 (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  var removed = value === NOT_SET;
  var keyMatch = is(key, this.entry[0]);
  if (keyMatch ? value === this.entry[1] : removed) {
    return this;
  }

  SetRef(didAlter);

  if (removed) {
    SetRef(didChangeSize);
    return; // undefined
  }

  if (keyMatch) {
    if (ownerID && ownerID === this.ownerID) {
      this.entry[1] = value;
      return this;
    }
    return new ValueNode(ownerID, this.keyHash, [key, value]);
  }

  SetRef(didChangeSize);
  return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
};

// #pragma Iterators

ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(
  fn,
  reverse
) {
  var entries = this.entries;
  for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
    if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
      return false;
    }
  }
};

BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(
  fn,
  reverse
) {
  var nodes = this.nodes;
  for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
    var node = nodes[reverse ? maxIndex - ii : ii];
    if (node && node.iterate(fn, reverse) === false) {
      return false;
    }
  }
};

// eslint-disable-next-line no-unused-vars
ValueNode.prototype.iterate = function(fn, reverse) {
  return fn(this.entry);
};

var MapIterator = (function (Iterator$$1) {
  function MapIterator(map, type, reverse) {
    this._type = type;
    this._reverse = reverse;
    this._stack = map._root && mapIteratorFrame(map._root);
  }

  if ( Iterator$$1 ) MapIterator.__proto__ = Iterator$$1;
  MapIterator.prototype = Object.create( Iterator$$1 && Iterator$$1.prototype );
  MapIterator.prototype.constructor = MapIterator;

  MapIterator.prototype.next = function next () {
    var this$1 = this;

    var type = this._type;
    var stack = this._stack;
    while (stack) {
      var node = stack.node;
      var index = stack.index++;
      var maxIndex = (void 0);
      if (node.entry) {
        if (index === 0) {
          return mapIteratorValue(type, node.entry);
        }
      } else if (node.entries) {
        maxIndex = node.entries.length - 1;
        if (index <= maxIndex) {
          return mapIteratorValue(
            type,
            node.entries[this$1._reverse ? maxIndex - index : index]
          );
        }
      } else {
        maxIndex = node.nodes.length - 1;
        if (index <= maxIndex) {
          var subNode = node.nodes[this$1._reverse ? maxIndex - index : index];
          if (subNode) {
            if (subNode.entry) {
              return mapIteratorValue(type, subNode.entry);
            }
            stack = this$1._stack = mapIteratorFrame(subNode, stack);
          }
          continue;
        }
      }
      stack = this$1._stack = this$1._stack.__prev;
    }
    return iteratorDone();
  };

  return MapIterator;
}(Iterator));

function mapIteratorValue(type, entry) {
  return iteratorValue(type, entry[0], entry[1]);
}

function mapIteratorFrame(node, prev) {
  return {
    node: node,
    index: 0,
    __prev: prev
  };
}

function makeMap(size, root, ownerID, hash$$1) {
  var map = Object.create(MapPrototype);
  map.size = size;
  map._root = root;
  map.__ownerID = ownerID;
  map.__hash = hash$$1;
  map.__altered = false;
  return map;
}

var EMPTY_MAP;
function emptyMap() {
  return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
}

function updateMap(map, k, v) {
  var newRoot;
  var newSize;
  if (!map._root) {
    if (v === NOT_SET) {
      return map;
    }
    newSize = 1;
    newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
  } else {
    var didChangeSize = MakeRef(CHANGE_LENGTH);
    var didAlter = MakeRef(DID_ALTER);
    newRoot = updateNode(
      map._root,
      map.__ownerID,
      0,
      undefined,
      k,
      v,
      didChangeSize,
      didAlter
    );
    if (!GetRef(didAlter)) {
      return map;
    }
    newSize = map.size + (GetRef(didChangeSize) ? (v === NOT_SET ? -1 : 1) : 0);
  }
  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__hash = undefined;
    map.__altered = true;
    return map;
  }
  return newRoot ? makeMap(newSize, newRoot) : emptyMap();
}

function updateNode(
  node,
  ownerID,
  shift,
  keyHash,
  key,
  value,
  didChangeSize,
  didAlter
) {
  if (!node) {
    if (value === NOT_SET) {
      return node;
    }
    SetRef(didAlter);
    SetRef(didChangeSize);
    return new ValueNode(ownerID, keyHash, [key, value]);
  }
  return node.update(
    ownerID,
    shift,
    keyHash,
    key,
    value,
    didChangeSize,
    didAlter
  );
}

function isLeafNode(node) {
  return (
    node.constructor === ValueNode || node.constructor === HashCollisionNode
  );
}

function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
  if (node.keyHash === keyHash) {
    return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
  }

  var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
  var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

  var newNode;
  var nodes =
    idx1 === idx2
      ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)]
      : ((newNode = new ValueNode(ownerID, keyHash, entry)),
        idx1 < idx2 ? [node, newNode] : [newNode, node]);

  return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
}

function createNodes(ownerID, entries, key, value) {
  if (!ownerID) {
    ownerID = new OwnerID();
  }
  var node = new ValueNode(ownerID, hash(key), [key, value]);
  for (var ii = 0; ii < entries.length; ii++) {
    var entry = entries[ii];
    node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
  }
  return node;
}

function packNodes(ownerID, nodes, count, excluding) {
  var bitmap = 0;
  var packedII = 0;
  var packedNodes = new Array(count);
  for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
    var node = nodes[ii];
    if (node !== undefined && ii !== excluding) {
      bitmap |= bit;
      packedNodes[packedII++] = node;
    }
  }
  return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
}

function expandNodes(ownerID, nodes, bitmap, including, node) {
  var count = 0;
  var expandedNodes = new Array(SIZE);
  for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
    expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
  }
  expandedNodes[including] = node;
  return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
}

function popCount(x) {
  x -= (x >> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
  x = (x + (x >> 4)) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
}

function setAt(array, idx, val, canEdit) {
  var newArray = canEdit ? array : arrCopy(array);
  newArray[idx] = val;
  return newArray;
}

function spliceIn(array, idx, val, canEdit) {
  var newLen = array.length + 1;
  if (canEdit && idx + 1 === newLen) {
    array[idx] = val;
    return array;
  }
  var newArray = new Array(newLen);
  var after = 0;
  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      newArray[ii] = val;
      after = -1;
    } else {
      newArray[ii] = array[ii + after];
    }
  }
  return newArray;
}

function spliceOut(array, idx, canEdit) {
  var newLen = array.length - 1;
  if (canEdit && idx === newLen) {
    array.pop();
    return array;
  }
  var newArray = new Array(newLen);
  var after = 0;
  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      after = 1;
    }
    newArray[ii] = array[ii + after];
  }
  return newArray;
}

var MAX_ARRAY_MAP_SIZE = SIZE / 4;
var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

var List = (function (IndexedCollection$$1) {
  function List(value) {
    var empty = emptyList();
    if (value === null || value === undefined) {
      return empty;
    }
    if (isList(value)) {
      return value;
    }
    var iter = IndexedCollection$$1(value);
    var size = iter.size;
    if (size === 0) {
      return empty;
    }
    assertNotInfinite(size);
    if (size > 0 && size < SIZE) {
      return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
    }
    return empty.withMutations(function (list) {
      list.setSize(size);
      iter.forEach(function (v, i) { return list.set(i, v); });
    });
  }

  if ( IndexedCollection$$1 ) List.__proto__ = IndexedCollection$$1;
  List.prototype = Object.create( IndexedCollection$$1 && IndexedCollection$$1.prototype );
  List.prototype.constructor = List;

  List.of = function of (/*...values*/) {
    return this(arguments);
  };

  List.prototype.toString = function toString () {
    return this.__toString('List [', ']');
  };

  // @pragma Access

  List.prototype.get = function get (index, notSetValue) {
    index = wrapIndex(this, index);
    if (index >= 0 && index < this.size) {
      index += this._origin;
      var node = listNodeFor(this, index);
      return node && node.array[index & MASK];
    }
    return notSetValue;
  };

  // @pragma Modification

  List.prototype.set = function set (index, value) {
    return updateList(this, index, value);
  };

  List.prototype.remove = function remove (index) {
    return !this.has(index)
      ? this
      : index === 0
        ? this.shift()
        : index === this.size - 1 ? this.pop() : this.splice(index, 1);
  };

  List.prototype.insert = function insert (index, value) {
    return this.splice(index, 0, value);
  };

  List.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = this._origin = this._capacity = 0;
      this._level = SHIFT;
      this._root = this._tail = null;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return emptyList();
  };

  List.prototype.push = function push (/*...values*/) {
    var values = arguments;
    var oldSize = this.size;
    return this.withMutations(function (list) {
      setListBounds(list, 0, oldSize + values.length);
      for (var ii = 0; ii < values.length; ii++) {
        list.set(oldSize + ii, values[ii]);
      }
    });
  };

  List.prototype.pop = function pop () {
    return setListBounds(this, 0, -1);
  };

  List.prototype.unshift = function unshift (/*...values*/) {
    var values = arguments;
    return this.withMutations(function (list) {
      setListBounds(list, -values.length);
      for (var ii = 0; ii < values.length; ii++) {
        list.set(ii, values[ii]);
      }
    });
  };

  List.prototype.shift = function shift () {
    return setListBounds(this, 1);
  };

  // @pragma Composition

  List.prototype.concat = function concat (/*...collections*/) {
    var arguments$1 = arguments;

    var seqs = [];
    for (var i = 0; i < arguments.length; i++) {
      var argument = arguments$1[i];
      var seq = IndexedCollection$$1(
        typeof argument !== 'string' && hasIterator(argument)
          ? argument
          : [argument]
      );
      if (seq.size !== 0) {
        seqs.push(seq);
      }
    }
    if (seqs.length === 0) {
      return this;
    }
    if (this.size === 0 && !this.__ownerID && seqs.length === 1) {
      return this.constructor(seqs[0]);
    }
    return this.withMutations(function (list) {
      seqs.forEach(function (seq) { return seq.forEach(function (value) { return list.push(value); }); });
    });
  };

  List.prototype.setSize = function setSize (size) {
    return setListBounds(this, 0, size);
  };

  // @pragma Iteration

  List.prototype.slice = function slice (begin, end) {
    var size = this.size;
    if (wholeSlice(begin, end, size)) {
      return this;
    }
    return setListBounds(
      this,
      resolveBegin(begin, size),
      resolveEnd(end, size)
    );
  };

  List.prototype.__iterator = function __iterator (type, reverse) {
    var index = reverse ? this.size : 0;
    var values = iterateList(this, reverse);
    return new Iterator(function () {
      var value = values();
      return value === DONE
        ? iteratorDone()
        : iteratorValue(type, reverse ? --index : index++, value);
    });
  };

  List.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var index = reverse ? this.size : 0;
    var values = iterateList(this, reverse);
    var value;
    while ((value = values()) !== DONE) {
      if (fn(value, reverse ? --index : index++, this$1) === false) {
        break;
      }
    }
    return index;
  };

  List.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyList();
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeList(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      ownerID,
      this.__hash
    );
  };

  return List;
}(IndexedCollection));

function isList(maybeList) {
  return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
}

List.isList = isList;

var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

var ListPrototype = List.prototype;
ListPrototype[IS_LIST_SENTINEL] = true;
ListPrototype[DELETE] = ListPrototype.remove;
ListPrototype.merge = ListPrototype.concat;
ListPrototype.setIn = setIn$$1;
ListPrototype.deleteIn = ListPrototype.removeIn = deleteIn;
ListPrototype.update = update$$1;
ListPrototype.updateIn = updateIn$1;
ListPrototype.mergeIn = mergeIn;
ListPrototype.mergeDeepIn = mergeDeepIn;
ListPrototype.withMutations = withMutations;
ListPrototype.wasAltered = wasAltered;
ListPrototype.asImmutable = asImmutable;
ListPrototype['@@transducer/init'] = ListPrototype.asMutable = asMutable;
ListPrototype['@@transducer/step'] = function(result, arr) {
  return result.push(arr);
};
ListPrototype['@@transducer/result'] = function(obj) {
  return obj.asImmutable();
};

var VNode = function VNode(array, ownerID) {
  this.array = array;
  this.ownerID = ownerID;
};

// TODO: seems like these methods are very similar

VNode.prototype.removeBefore = function removeBefore (ownerID, level, index) {
  if (index === level ? 1 << level : 0 || this.array.length === 0) {
    return this;
  }
  var originIndex = (index >>> level) & MASK;
  if (originIndex >= this.array.length) {
    return new VNode([], ownerID);
  }
  var removingFirst = originIndex === 0;
  var newChild;
  if (level > 0) {
    var oldChild = this.array[originIndex];
    newChild =
      oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
    if (newChild === oldChild && removingFirst) {
      return this;
    }
  }
  if (removingFirst && !newChild) {
    return this;
  }
  var editable = editableVNode(this, ownerID);
  if (!removingFirst) {
    for (var ii = 0; ii < originIndex; ii++) {
      editable.array[ii] = undefined;
    }
  }
  if (newChild) {
    editable.array[originIndex] = newChild;
  }
  return editable;
};

VNode.prototype.removeAfter = function removeAfter (ownerID, level, index) {
  if (index === (level ? 1 << level : 0) || this.array.length === 0) {
    return this;
  }
  var sizeIndex = ((index - 1) >>> level) & MASK;
  if (sizeIndex >= this.array.length) {
    return this;
  }

  var newChild;
  if (level > 0) {
    var oldChild = this.array[sizeIndex];
    newChild =
      oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
    if (newChild === oldChild && sizeIndex === this.array.length - 1) {
      return this;
    }
  }

  var editable = editableVNode(this, ownerID);
  editable.array.splice(sizeIndex + 1);
  if (newChild) {
    editable.array[sizeIndex] = newChild;
  }
  return editable;
};

var DONE = {};

function iterateList(list, reverse) {
  var left = list._origin;
  var right = list._capacity;
  var tailPos = getTailOffset(right);
  var tail = list._tail;

  return iterateNodeOrLeaf(list._root, list._level, 0);

  function iterateNodeOrLeaf(node, level, offset) {
    return level === 0
      ? iterateLeaf(node, offset)
      : iterateNode(node, level, offset);
  }

  function iterateLeaf(node, offset) {
    var array = offset === tailPos ? tail && tail.array : node && node.array;
    var from = offset > left ? 0 : left - offset;
    var to = right - offset;
    if (to > SIZE) {
      to = SIZE;
    }
    return function () {
      if (from === to) {
        return DONE;
      }
      var idx = reverse ? --to : from++;
      return array && array[idx];
    };
  }

  function iterateNode(node, level, offset) {
    var values;
    var array = node && node.array;
    var from = offset > left ? 0 : (left - offset) >> level;
    var to = ((right - offset) >> level) + 1;
    if (to > SIZE) {
      to = SIZE;
    }
    return function () {
      while (true) {
        if (values) {
          var value = values();
          if (value !== DONE) {
            return value;
          }
          values = null;
        }
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        values = iterateNodeOrLeaf(
          array && array[idx],
          level - SHIFT,
          offset + (idx << level)
        );
      }
    };
  }
}

function makeList(origin, capacity, level, root, tail, ownerID, hash) {
  var list = Object.create(ListPrototype);
  list.size = capacity - origin;
  list._origin = origin;
  list._capacity = capacity;
  list._level = level;
  list._root = root;
  list._tail = tail;
  list.__ownerID = ownerID;
  list.__hash = hash;
  list.__altered = false;
  return list;
}

var EMPTY_LIST;
function emptyList() {
  return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
}

function updateList(list, index, value) {
  index = wrapIndex(list, index);

  if (index !== index) {
    return list;
  }

  if (index >= list.size || index < 0) {
    return list.withMutations(function (list) {
      index < 0
        ? setListBounds(list, index).set(0, value)
        : setListBounds(list, 0, index + 1).set(index, value);
    });
  }

  index += list._origin;

  var newTail = list._tail;
  var newRoot = list._root;
  var didAlter = MakeRef(DID_ALTER);
  if (index >= getTailOffset(list._capacity)) {
    newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
  } else {
    newRoot = updateVNode(
      newRoot,
      list.__ownerID,
      list._level,
      index,
      value,
      didAlter
    );
  }

  if (!GetRef(didAlter)) {
    return list;
  }

  if (list.__ownerID) {
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }
  return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
}

function updateVNode(node, ownerID, level, index, value, didAlter) {
  var idx = (index >>> level) & MASK;
  var nodeHas = node && idx < node.array.length;
  if (!nodeHas && value === undefined) {
    return node;
  }

  var newNode;

  if (level > 0) {
    var lowerNode = node && node.array[idx];
    var newLowerNode = updateVNode(
      lowerNode,
      ownerID,
      level - SHIFT,
      index,
      value,
      didAlter
    );
    if (newLowerNode === lowerNode) {
      return node;
    }
    newNode = editableVNode(node, ownerID);
    newNode.array[idx] = newLowerNode;
    return newNode;
  }

  if (nodeHas && node.array[idx] === value) {
    return node;
  }

  SetRef(didAlter);

  newNode = editableVNode(node, ownerID);
  if (value === undefined && idx === newNode.array.length - 1) {
    newNode.array.pop();
  } else {
    newNode.array[idx] = value;
  }
  return newNode;
}

function editableVNode(node, ownerID) {
  if (ownerID && node && ownerID === node.ownerID) {
    return node;
  }
  return new VNode(node ? node.array.slice() : [], ownerID);
}

function listNodeFor(list, rawIndex) {
  if (rawIndex >= getTailOffset(list._capacity)) {
    return list._tail;
  }
  if (rawIndex < 1 << (list._level + SHIFT)) {
    var node = list._root;
    var level = list._level;
    while (node && level > 0) {
      node = node.array[(rawIndex >>> level) & MASK];
      level -= SHIFT;
    }
    return node;
  }
}

function setListBounds(list, begin, end) {
  // Sanitize begin & end using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  if (begin !== undefined) {
    begin |= 0;
  }
  if (end !== undefined) {
    end |= 0;
  }
  var owner = list.__ownerID || new OwnerID();
  var oldOrigin = list._origin;
  var oldCapacity = list._capacity;
  var newOrigin = oldOrigin + begin;
  var newCapacity =
    end === undefined
      ? oldCapacity
      : end < 0 ? oldCapacity + end : oldOrigin + end;
  if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
    return list;
  }

  // If it's going to end after it starts, it's empty.
  if (newOrigin >= newCapacity) {
    return list.clear();
  }

  var newLevel = list._level;
  var newRoot = list._root;

  // New origin might need creating a higher root.
  var offsetShift = 0;
  while (newOrigin + offsetShift < 0) {
    newRoot = new VNode(
      newRoot && newRoot.array.length ? [undefined, newRoot] : [],
      owner
    );
    newLevel += SHIFT;
    offsetShift += 1 << newLevel;
  }
  if (offsetShift) {
    newOrigin += offsetShift;
    oldOrigin += offsetShift;
    newCapacity += offsetShift;
    oldCapacity += offsetShift;
  }

  var oldTailOffset = getTailOffset(oldCapacity);
  var newTailOffset = getTailOffset(newCapacity);

  // New size might need creating a higher root.
  while (newTailOffset >= 1 << (newLevel + SHIFT)) {
    newRoot = new VNode(
      newRoot && newRoot.array.length ? [newRoot] : [],
      owner
    );
    newLevel += SHIFT;
  }

  // Locate or create the new tail.
  var oldTail = list._tail;
  var newTail =
    newTailOffset < oldTailOffset
      ? listNodeFor(list, newCapacity - 1)
      : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

  // Merge Tail into tree.
  if (
    oldTail &&
    newTailOffset > oldTailOffset &&
    newOrigin < oldCapacity &&
    oldTail.array.length
  ) {
    newRoot = editableVNode(newRoot, owner);
    var node = newRoot;
    for (var level = newLevel; level > SHIFT; level -= SHIFT) {
      var idx = (oldTailOffset >>> level) & MASK;
      node = node.array[idx] = editableVNode(node.array[idx], owner);
    }
    node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
  }

  // If the size has been reduced, there's a chance the tail needs to be trimmed.
  if (newCapacity < oldCapacity) {
    newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
  }

  // If the new origin is within the tail, then we do not need a root.
  if (newOrigin >= newTailOffset) {
    newOrigin -= newTailOffset;
    newCapacity -= newTailOffset;
    newLevel = SHIFT;
    newRoot = null;
    newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
  } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
    offsetShift = 0;

    // Identify the new top root node of the subtree of the old root.
    while (newRoot) {
      var beginIndex = (newOrigin >>> newLevel) & MASK;
      if ((beginIndex !== newTailOffset >>> newLevel) & MASK) {
        break;
      }
      if (beginIndex) {
        offsetShift += (1 << newLevel) * beginIndex;
      }
      newLevel -= SHIFT;
      newRoot = newRoot.array[beginIndex];
    }

    // Trim the new sides of the new root.
    if (newRoot && newOrigin > oldOrigin) {
      newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
    }
    if (newRoot && newTailOffset < oldTailOffset) {
      newRoot = newRoot.removeAfter(
        owner,
        newLevel,
        newTailOffset - offsetShift
      );
    }
    if (offsetShift) {
      newOrigin -= offsetShift;
      newCapacity -= offsetShift;
    }
  }

  if (list.__ownerID) {
    list.size = newCapacity - newOrigin;
    list._origin = newOrigin;
    list._capacity = newCapacity;
    list._level = newLevel;
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }
  return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
}

function getTailOffset(size) {
  return size < SIZE ? 0 : ((size - 1) >>> SHIFT) << SHIFT;
}

var OrderedMap = (function (Map$$1) {
  function OrderedMap(value) {
    return value === null || value === undefined
      ? emptyOrderedMap()
      : isOrderedMap(value)
        ? value
        : emptyOrderedMap().withMutations(function (map) {
            var iter = KeyedCollection(value);
            assertNotInfinite(iter.size);
            iter.forEach(function (v, k) { return map.set(k, v); });
          });
  }

  if ( Map$$1 ) OrderedMap.__proto__ = Map$$1;
  OrderedMap.prototype = Object.create( Map$$1 && Map$$1.prototype );
  OrderedMap.prototype.constructor = OrderedMap;

  OrderedMap.of = function of (/*...values*/) {
    return this(arguments);
  };

  OrderedMap.prototype.toString = function toString () {
    return this.__toString('OrderedMap {', '}');
  };

  // @pragma Access

  OrderedMap.prototype.get = function get (k, notSetValue) {
    var index = this._map.get(k);
    return index !== undefined ? this._list.get(index)[1] : notSetValue;
  };

  // @pragma Modification

  OrderedMap.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._map.clear();
      this._list.clear();
      return this;
    }
    return emptyOrderedMap();
  };

  OrderedMap.prototype.set = function set (k, v) {
    return updateOrderedMap(this, k, v);
  };

  OrderedMap.prototype.remove = function remove (k) {
    return updateOrderedMap(this, k, NOT_SET);
  };

  OrderedMap.prototype.wasAltered = function wasAltered () {
    return this._map.wasAltered() || this._list.wasAltered();
  };

  OrderedMap.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._list.__iterate(
      function (entry) { return entry && fn(entry[1], entry[0], this$1); },
      reverse
    );
  };

  OrderedMap.prototype.__iterator = function __iterator (type, reverse) {
    return this._list.fromEntrySeq().__iterator(type, reverse);
  };

  OrderedMap.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newMap = this._map.__ensureOwner(ownerID);
    var newList = this._list.__ensureOwner(ownerID);
    if (!ownerID) {
      if (this.size === 0) {
        return emptyOrderedMap();
      }
      this.__ownerID = ownerID;
      this._map = newMap;
      this._list = newList;
      return this;
    }
    return makeOrderedMap(newMap, newList, ownerID, this.__hash);
  };

  return OrderedMap;
}(Map));

function isOrderedMap(maybeOrderedMap) {
  return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
}

OrderedMap.isOrderedMap = isOrderedMap;

OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

function makeOrderedMap(map, list, ownerID, hash) {
  var omap = Object.create(OrderedMap.prototype);
  omap.size = map ? map.size : 0;
  omap._map = map;
  omap._list = list;
  omap.__ownerID = ownerID;
  omap.__hash = hash;
  return omap;
}

var EMPTY_ORDERED_MAP;
function emptyOrderedMap() {
  return (
    EMPTY_ORDERED_MAP ||
    (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()))
  );
}

function updateOrderedMap(omap, k, v) {
  var map = omap._map;
  var list = omap._list;
  var i = map.get(k);
  var has = i !== undefined;
  var newMap;
  var newList;
  if (v === NOT_SET) {
    // removed
    if (!has) {
      return omap;
    }
    if (list.size >= SIZE && list.size >= map.size * 2) {
      newList = list.filter(function (entry, idx) { return entry !== undefined && i !== idx; });
      newMap = newList
        .toKeyedSeq()
        .map(function (entry) { return entry[0]; })
        .flip()
        .toMap();
      if (omap.__ownerID) {
        newMap.__ownerID = newList.__ownerID = omap.__ownerID;
      }
    } else {
      newMap = map.remove(k);
      newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
    }
  } else if (has) {
    if (v === list.get(i)[1]) {
      return omap;
    }
    newMap = map;
    newList = list.set(i, [k, v]);
  } else {
    newMap = map.set(k, list.size);
    newList = list.set(list.size, [k, v]);
  }
  if (omap.__ownerID) {
    omap.size = newMap.size;
    omap._map = newMap;
    omap._list = newList;
    omap.__hash = undefined;
    return omap;
  }
  return makeOrderedMap(newMap, newList);
}

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * Original source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var SortedMapNode = function SortedMapNode(comparator, options, ownerID) {
  this.comparator = comparator;
  this.options = options;
  this.ownerID = ownerID;
};

SortedMapNode.prototype.getComparator = function getComparator () {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.get = function get (key, notSetValue) {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.upsert = function upsert (ownerID, key, value, didChangeSize, didAlter) {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.remove = function remove (ownerID, key, didChangeSize, didAlter) {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.fastRemove = function fastRemove (ownerID, key, didChangeSize, didAlter) {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.iterate = function iterate (fn, reverse) {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.print = function print (level, maxDepth) {};
// eslint-disable-next-lineno-unused-vars
SortedMapNode.prototype.checkConsistency = function checkConsistency (printFlag) {};

var SortedMapPacker = function SortedMapPacker () {};

SortedMapPacker.prototype.pack = function pack (comparator, options, ownerID, collection) {};

var SortedMapNodeFactory = function SortedMapNodeFactory () {};

SortedMapNodeFactory.prototype.createNode = function createNode (comparator, options, ownerID, entries, nodes) {};
SortedMapNodeFactory.prototype.createPacker = function createPacker () {};
// eslint-disable-next-lineno-unused-vars
SortedMapNodeFactory.prototype.createIterator = function createIterator (map, type, reverse) {};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * Original source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-else-return */

var DEFAULT_TYPE = 'btree';
var DEFAULT_BTREE_ORDER = 33;

// #pragma Trie Nodes

var SortedMapBtreeNode = (function (SortedMapNode$$1) {
  function SortedMapBtreeNode(comparator, options, ownerID, entries, nodes) {
    SortedMapNode$$1.call(this, comparator, options, ownerID);

    this.entries = entries;
    this.nodes = nodes;

    this.btreeOrder =
      options && options.btreeOrder ? options.btreeOrder : DEFAULT_BTREE_ORDER;
    this.btreeNodeSplitSize = Math.floor((this.btreeOrder - 1) / 2);
    return this;
  }

  if ( SortedMapNode$$1 ) SortedMapBtreeNode.__proto__ = SortedMapNode$$1;
  SortedMapBtreeNode.prototype = Object.create( SortedMapNode$$1 && SortedMapNode$$1.prototype );
  SortedMapBtreeNode.prototype.constructor = SortedMapBtreeNode;

  SortedMapBtreeNode.prototype.getComparator = function getComparator () {
    return this.comparator;
  };

  SortedMapBtreeNode.prototype.get = function get (key, notSetValue) {
    var entries = this.entries;
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    if (GetRef(didMatch)) {
      var value = entries[idx][1];
      return value === NOT_SET ? notSetValue : value;
    }

    var nodes = this.nodes;
    if (nodes) {
      var value$1 = nodes[idx].get(key, notSetValue);
      return value$1 === NOT_SET ? notSetValue : value$1;
    }
    return notSetValue;
  };

  // Returns first key in this subtree
  SortedMapBtreeNode.prototype.firstKey = function firstKey () {
    var nodes = this.nodes;
    if (nodes) {
      return nodes[0].firstKey();
    }

    var entries = this.entries;
    return entries[0][0];
  };

  // Returns last key in this subtree
  SortedMapBtreeNode.prototype.lastKey = function lastKey () {
    var nodes = this.nodes;
    if (nodes) {
      return nodes[nodes.length - 1].lastKey();
    }

    var entries = this.entries;
    return entries[entries.length - 1][0];
  };

  //
  // outKvn is out array with values [[key, value], node] i.e. [entry, node]
  // which can be consumed or returned by this operation
  //
  SortedMapBtreeNode.prototype.upsert = function upsert (ownerID, key, value, didChangeSize, didAlter, outKvn) {
    if (!outKvn) {
      // This must be a root case called from SortedMap
      var subKvn = [];

      var newRoot = this.upsert(
        ownerID,
        key,
        value,
        didChangeSize,
        didAlter,
        subKvn
      );

      if (subKvn[0]) {
        // Make a new root node
        var entries$1 = [subKvn[0]];
        var nodes$1 = [newRoot, subKvn[1]];
        newRoot = new SortedMapBtreeNode(
          this.comparator,
          this.options,
          ownerID,
          entries$1,
          nodes$1
        );
      }

      return newRoot;
    }

    var entries = this.entries;

    // Search keys
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    var exists = GetRef(didMatch);

    var nodes = this.nodes;
    var canEdit = ownerID && ownerID === this.ownerID;
    var newEntries;
    var newNodes;

    if (exists) {
      // Updating entries

      if (entries[idx][1] === value) {
        //
        // OPERATION: NONE, same value, no need to update
        //
        return this;
      } else {
        //
        // OPERATION: UPDATE entry value in entries
        //
        var entry = [key, value];

        SetRef(didAlter);
        newEntries = setIn$2(entries, idx, entry, canEdit);
        newNodes = nodes;
      }
    } else {
      // Inserting into entries or upserting nodes

      // eslint-disable-next-line no-lonely-if
      if (nodes) {
        //
        // RECURSIVE: UPSERT node recursively
        //
        var subKvn$1 = [];

        var updatedNode = nodes[idx].upsert(
          ownerID,
          key,
          value,
          didChangeSize,
          didAlter,
          subKvn$1
        );

        if (GetRef(didAlter)) {
          if (subKvn$1[0]) {
            //
            // Insert subKvn into this node
            //
            if (entries.length >= this.btreeOrder - 1) {
              return this.splitNode(
                idx,
                updatedNode,
                subKvn$1,
                outKvn,
                ownerID,
                canEdit
              );
            } else {
              //
              // Insert subKvn into entries and nodes
              //
              newEntries = spliceIn$1(entries, idx, subKvn$1[0], canEdit);
              newNodes = spliceIn$1(nodes, idx + 1, subKvn$1[1], canEdit);
              newNodes[idx] = updatedNode;
            }
          } else {
            //
            // No splitting, just setIn the updated subNode
            //
            newEntries = entries;
            newNodes = setIn$2(nodes, idx, updatedNode, canEdit);
          }
        } else {
          // Nothing changed
          return this;
        }
      } else {
        // Leaf node
        // Insert new entry into entries
        var entry$1 = [key, value];

        SetRef(didAlter);
        SetRef(didChangeSize);

        if (entries.length >= this.btreeOrder - 1) {
          return this.splitLeaf(idx, entry$1, outKvn, ownerID, canEdit);
        } else {
          //
          // OPERATION: INSERT new entry into entries
          //
          newEntries = spliceIn$1(entries, idx, entry$1, canEdit);
        }
      }
    }

    return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
  };

  // this version of remove doesn't do any rebalancing
  // it just sets the value in an entry to NOT_SET
  // this method would be preferable when removing large bulk
  // of entres from mutable SortedMap followed by pack()
  SortedMapBtreeNode.prototype.fastRemove = function fastRemove (ownerID, key, didChangeSize, didAlter) {
    var entries = this.entries;

    // Search keys
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    var exists = GetRef(didMatch);

    var nodes = this.nodes;
    var canEdit = ownerID && ownerID === this.ownerID;
    var newEntries;
    var newNodes;

    if (exists) {
      // Remove entry from entries
      if (entries[idx][1] === NOT_SET) {
        // the entry has been technically deleted already
        return this;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      var newEntry = [key, NOT_SET];
      newEntries = setIn$2(entries, idx, newEntry, canEdit);
      newNodes = nodes;
    } else {
      // Remove from node

      // eslint-disable-next-line no-lonely-if
      if (nodes) {
        // RECURSIVE: REMOVE from node recursively
        var updatedNode = nodes[idx].fastRemove(
          ownerID,
          key,
          didChangeSize,
          didAlter
        );

        if (GetRef(didAlter)) {
          //
          // No splitting, just setIn the updated subNode
          //
          newEntries = entries;
          newNodes = setIn$2(nodes, idx, updatedNode, canEdit);
        } else {
          // Nothing changed
          return this;
        }
      } else {
        // OPERATION: NONE, key to be removed doesn't exist
        return this;
      }
    }

    return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
  };

  //
  // outKvn is an output array with the following format
  //
  // [updatedEntry, updatedNode, updatedNodeIsLeft: boolean]
  //
  // The returned values can be:
  // - undefined - means the referenced item didn't change
  // - NOT_SET - means the referenced node was merged and has to be removed
  // - any other - the referenced item has to be updated with this value
  // outKvn[2] is boolean value indicating if node referenced in outKvnp[1]
  // is left (true) or right (false)
  //
  SortedMapBtreeNode.prototype.remove = function remove (ownerID, key, didChangeSize, didAlter, parent, parentIdx, outKvn) {
    var entries = this.entries;

    // Search keys
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    var exists = GetRef(didMatch);

    var nodes = this.nodes;
    var canEdit = ownerID && ownerID === this.ownerID;
    var newEntries;
    var newNodes;

    if (exists) {
      // Remove entry from entries
      if (nodes) {
        // OPERATION: MOVE some entries from neighbors or MERGE with a neighbor
        if (entries[idx][1] === NOT_SET) {
          // the entry has been technically deleted already
          return this;
        }
        // WORKAROUND: so far let's do the workaround and just update
        // the entry in place with NOT_SET
        SetRef(didAlter);
        SetRef(didChangeSize);
        var newEntry = [key, NOT_SET];
        newEntries = setIn$2(entries, idx, newEntry, canEdit);
        newNodes = nodes;
      } else {
        //
        // OPERATION: REMOVE entry from the LEAF
        //
        if (entries[idx][1] === NOT_SET) {
          // the entry has been technically deleted already
          return this;
        }
        SetRef(didAlter);
        SetRef(didChangeSize);
        if (entries.length <= this.btreeNodeSplitSize && parent) {
          // we don't have enough items in this leaf to just remove the entry
          // we should try borrow an entry from a neighbour or merge this mode with a neighbour
          // as a workaround we can just update a value in the entry to NOT_SET
          return this.consolidateLeaf(
            ownerID,
            idx,
            parent,
            parentIdx,
            canEdit,
            outKvn
          );
        }
        // it's ok to physically remove from the LEAF and no moves are needed
        // as the node will meet all the consistency rules
        newEntries = spliceOut$1(entries, idx, canEdit);
      }
    } else {
      // Remove from node

      // eslint-disable-next-line no-lonely-if
      if (nodes) {
        // RECURSIVE: REMOVE from node recursively
        var subKvn = [undefined, undefined, undefined];
        var updatedNode = nodes[idx].remove(
          ownerID,
          key,
          didChangeSize,
          didAlter,
          this,
          idx,
          subKvn
        );

        if (GetRef(didAlter)) {
          // take care of subKvn
          return this.spliceNode(
            ownerID,
            idx,
            updatedNode,
            parent,
            parentIdx,
            canEdit,
            subKvn,
            outKvn
          );
        } else {
          // Nothing changed
          return this;
        }
      } else {
        // OPERATION: NONE, key to be removed doesn't exist in this map
        return this;
      }
    }

    return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
  };

  SortedMapBtreeNode.prototype.makeNewNode = function makeNewNode (newEntries, newNodes, ownerID, canEdit) {
    if (newEntries.length === 0) {
      if (newNodes) {
        // Root node is turning into a leaf
        return newNodes[0];
      } else {
        // Root node leaf is turning into empty
        return;
      }
    }

    if (canEdit) {
      this.entries = newEntries;
      this.nodes = newNodes;
      return this;
    }
    return new SortedMapBtreeNode(
      this.comparator,
      this.options,
      ownerID,
      newEntries,
      newNodes
    );
  };

  SortedMapBtreeNode.prototype.print = function print (level, maxDepth) {
    function w(s) {
      process.stdout.write(s);
    }

    if (maxDepth && level >= maxDepth) {
      return;
    }

    var nodes = this.nodes;
    var entries = this.entries;

    if (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        w(indent(level));
        if (!node || !(node instanceof SortedMapNode$$1)) {
          w(
            '+ CORRUPT NODE[' +
              i +
              '] (L' +
              level +
              ') ' +
              JSON.stringify(node) +
              '\n'
          );
        } else {
          if (node.nodes) {
            w('+ NODE[' + i + '] (L' + level + ')\n');
          } else {
            w('+ LEAF[' + i + '] (L' + level + ')\n');
          }
          node.print(level + 1, maxDepth);
        }
        if (i < entries.length) {
          w(indent(level));
          var entry = entries[i];
          if (!entry) {
            w('- CORRUPT ENTRY[' + i + ']: ' + JSON.stringify(entry) + '\n');
          } else if (entry[1] === NOT_SET) {
            w('- REMOVED ENTRY[' + i + ']: ' + JSON.stringify(entry[0]) + '\n');
          } else {
            w('- ENTRY[' + i + ']: ' + JSON.stringify(entry[0]) + '\n');
          }
        }
      }
    } else {
      for (var i$1 = 0; i$1 < entries.length; i$1++) {
        w(indent(level));
        var entry$1 = entries[i$1];
        if (!entry$1) {
          w('- CORRUPT ENTRY[' + i$1 + ']: ' + JSON.stringify(entry$1) + '\n');
        } else if (entry$1[1] === NOT_SET) {
          w('- REMOVED ENTRY[' + i$1 + ']: ' + JSON.stringify(entry$1[0]) + '\n');
        } else {
          w('- ENTRY[' + i$1 + ']: ' + JSON.stringify(entry$1[0]) + '\n');
        }
      }
    }
  };

  SortedMapBtreeNode.prototype.checkConsistency = function checkConsistency (printFlag, level, n, leafLevel) {
    var this$1 = this;

    function w(f) {
      if (printFlag) {
        var s = f();
        if (s !== undefined) {
          process.stdout.write(indent(level));
          process.stdout.write(s);
        }
      }
    }

    if (!level) {
      level = 0;
    }
    if (!n) {
      n = 0;
    }
    if (!leafLevel) {
      leafLevel = [undefined];
    }

    if (this.nodes) {
      w(function () { return '+ Checking NODE[' + n + '] (L' + level + ')\n'; });
    } else {
      w(function () { return '+ Checking LEAF[' + n + '] (L' + level + ')\n'; });
      if (leafLevel[0] === undefined) {
        leafLevel[0] = level;
      } else if (leafLevel[0] !== level) {
        failed(112, 'leaves are not on the same level');
      }
    }

    function failed(code, msg) {
      var s = 'Consistency Check Failed with error code ' + code + ': ' + msg;
      if (printFlag) {
        w(function () { return s + '\n'; });
        return code;
      }

      throw new Error(s);
    }

    var entries = this.entries;
    var nodes = this.nodes;

    if (!entries) {
      return failed(101, 'empty entries in a node');
    }

    if (!(entries.length > 0 && entries.length < this.btreeOrder)) {
      return failed(
        102,
        'entries length is out of range from 0 to (btreeOrder-1)'
      );
    }

    if (level > 0 && !(this.btreeNodeSplitSize <= entries.length)) {
      return failed(103, 'entries length is shorter than btreeNodeSplitSize');
    }

    if (nodes && !(nodes.length === entries.length + 1)) {
      return failed(104, 'nodes length out of sync with entries length');
    }

    var loop = function ( i ) {
      var entry = entries[i];

      if (!entry) { return { v: failed(105, 'empty entry') }; }

      if (!(typeof entry === 'object' && entry instanceof Array))
        { return { v: failed(106, 'entry is not Array') }; }

      if (!(entry.length === 2)) { return { v: failed(107, 'entry is not Array[2]') }; }

      if (entry[1] === NOT_SET) {
        w(
          function () { return '    - Checking REMOVED ENTRY[' +
            i +
            ']: ' +
            JSON.stringify(entry[0]) +
            '\n'; }
        );
        if (!nodes) {
          failed(113, 'NOT_SET values are not allowed in leaves');
        }
      } else {
        w(
          function () { return '    - Checking ENTRY[' +
            i +
            ']: ' +
            JSON.stringify(entry[0]) +
            '\n'; }
        );
      }
    };

    for (var i = 0; i < entries.length; i++) {
      var returned = loop( i );

      if ( returned ) return returned.v;
    }

    // Check if all the keys are sorted
    for (var i$1 = 0; i$1 < entries.length - 1; i$1++) {
      if (!(this$1.comparator(entries[i$1][0], entries[i$1 + 1][0]) < 0)) {
        return failed(108, 'the entries are not sorted');
      }
    }

    if (nodes)
      { for (var i$2 = 0; i$2 < nodes.length; i$2++) {
        var node = nodes[i$2];

        if (!node || !(node instanceof SortedMapNode$$1))
          { return failed(109, 'empty or corrupt node'); }

        // Check the node recursively
        var code = node.checkConsistency(printFlag, level + 1, i$2, leafLevel);

        if (code !== 0) {
          return code;
        }

        if (
          i$2 > 0 &&
          !(this$1.comparator(entries[i$2 - 1][0], node.firstKey()) < 0)
        ) {
          return failed(110, 'the entry and right node not sorted');
        }

        if (
          i$2 < entries.length &&
          !(this$1.comparator(node.lastKey(), entries[i$2][0]) < 0)
        ) {
          return failed(111, 'the entry and left node not sorted');
        }
      } }

    return 0;
  };

  return SortedMapBtreeNode;
}(SortedMapNode)); // class

// #pragma Iterators

SortedMapBtreeNode.prototype.iterate = function(fn, reverse) {
  var entries = this.entries;
  var nodes = this.nodes;

  if (nodes) {
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex + 1 - ii : ii];
      if (node.iterate(fn, reverse) === false) {
        return false;
      }
      var entry = entries[reverse ? maxIndex - ii : ii];
      if (entry[1] === NOT_SET) {
        continue;
      }
      if (fn(entry) === false) {
        return false;
      }
    }

    // Iterate through the remaining last node
    var node$1 = nodes[reverse ? 0 : nodes.length - 1];
    if (node$1.iterate(fn, reverse) === false) {
      return false;
    }
  } else {
    for (var ii$1 = 0, maxIndex$1 = entries.length - 1; ii$1 <= maxIndex$1; ii$1++) {
      var entry$1 = entries[reverse ? maxIndex$1 - ii$1 : ii$1];
      if (entry$1[1] === NOT_SET) {
        continue;
      }
      if (fn(entry$1) === false) {
        return false;
      }
    }
  }
};

var SortedMapBtreeNodeIterator = (function (Iterator$$1) {
  function SortedMapBtreeNodeIterator(map, type, reverse) {
    this._type = type;
    this._reverse = reverse;
    this._stack = map._root && mapIteratorFrame$1(map._root);
  }

  if ( Iterator$$1 ) SortedMapBtreeNodeIterator.__proto__ = Iterator$$1;
  SortedMapBtreeNodeIterator.prototype = Object.create( Iterator$$1 && Iterator$$1.prototype );
  SortedMapBtreeNodeIterator.prototype.constructor = SortedMapBtreeNodeIterator;

  SortedMapBtreeNodeIterator.prototype.next = function next () {
    var this$1 = this;

    var type = this._type;
    var stack = this._stack;
    while (stack) {
      var node = stack.node;
      var index = stack.index++;
      if (node.nodes) {
        var maxIndex = node.entries.length + node.nodes.length - 1;
        if (index <= maxIndex) {
          if (index % 2 === 0) {
            index /= 2;
            var subNode =
              node.nodes[this$1._reverse ? node.nodes.length - 1 - index : index];
            if (subNode) {
              stack = this$1._stack = mapIteratorFrame$1(subNode, stack);
            }
            continue;
          } else {
            index = (index - 1) / 2;
            var entry =
              node.entries[
                this$1._reverse ? node.entries.length - 1 - index : index
              ];
            if (entry[1] === NOT_SET) {
              continue;
            }
            return mapIteratorValue$1(type, entry);
          }
        }
      } else {
        // node.entries
        var maxIndex$1 = node.entries.length - 1;
        if (index <= maxIndex$1) {
          var entry$1 = node.entries[this$1._reverse ? maxIndex$1 - index : index];
          if (entry$1[1] === NOT_SET) {
            continue;
          }
          return mapIteratorValue$1(type, entry$1);
        }
      }
      stack = this$1._stack = this$1._stack.__prev;
    }
    return iteratorDone();
  };

  return SortedMapBtreeNodeIterator;
}(Iterator));

function mapIteratorValue$1(type, entry) {
  return iteratorValue(type, entry[0], entry[1]);
}

function mapIteratorFrame$1(node, prev) {
  return {
    node: node,
    index: 0,
    __prev: prev
  };
}

//
// Array manipulation algorithms
//

function allocArray(n) {
  var a = new Array(n);
  return a;
}

var _indentStr = new Array(120).join(' ');

function indent(level) {
  var indentCnt = 4 * level;
  if (indentCnt > _indentStr.length) {
    indentCnt = _indentStr.length;
  }
  return _indentStr.substring(0, indentCnt);
}

function setIn$2(array, idx, val, canEdit) {
  if (canEdit) {
    array[idx] = val;
    return array;
  }

  var newLen = array.length;
  var newArray = allocArray(newLen);
  for (var ii = 0; ii < idx; ii++) {
    newArray[ii] = array[ii];
  }
  newArray[idx] = val;
  for (var ii$1 = idx + 1; ii$1 < newLen; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  return newArray;
}

function spliceIn$1(array, idx, val, canEdit) {
  var newLen = array.length + 1;

  if (canEdit) {
    // Have to shift items going backwards
    for (var ii = newLen - 1, stop = idx + 1; ii >= stop; ii--) {
      array[ii] = array[ii - 1];
    }
    array[idx] = val;
    return array;
  }

  var newArray = allocArray(newLen);
  for (var ii$1 = 0; ii$1 < idx; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  newArray[idx] = val;
  for (var ii$2 = idx + 1; ii$2 < newLen; ii$2++) {
    newArray[ii$2] = array[ii$2 - 1];
  }
  return newArray;
}

function spliceOut$1(array, idx, canEdit) {
  var newLen = array.length - 1;

  if (canEdit) {
    for (var ii = idx; ii < newLen; ii++) {
      array[ii] = array[ii + 1];
    }
    array.length = newLen;
    return array;
  }

  var newArray = allocArray(newLen);
  for (var ii$1 = 0; ii$1 < idx; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  for (var ii$2 = idx; ii$2 < newLen; ii$2++) {
    newArray[ii$2] = array[ii$2 + 1];
  }
  return newArray;
}

function spliceOutN(array, idx, n, canEdit) {
  var newLen = array.length - n;

  if (canEdit) {
    for (var ii = idx; ii < newLen; ii++) {
      array[ii] = array[ii + n];
    }
    array.length = newLen;
    return array;
  }

  var newArray = allocArray(newLen);
  for (var ii$1 = 0; ii$1 < idx; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  for (var ii$2 = idx; ii$2 < newLen; ii$2++) {
    newArray[ii$2] = array[ii$2 + n];
  }
  return newArray;
}

//
// Example: spliceOutShiftRightN(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3, 2, canEdit)
//
// removes item at index=3 ('d') and moves all remaining items in an awway right by 2 positions
//
// Result: [?, ?, 'a', 'b', 'c', 'f', 'g']
//
function spliceOutShiftRightN(array, idx, rightN, canEdit) {
  var newLen = array.length - 1 + rightN;
  var newArray;

  if (canEdit) {
    array.length = newLen;
    newArray = array;
  } else {
    newArray = allocArray(newLen);
  }

  for (var ii = newLen - 1, stop = idx + rightN; ii >= stop; ii--) {
    newArray[ii] = array[ii - rightN + 1];
  }
  for (var ii$1 = idx + rightN - 1; ii$1 >= rightN; ii$1--) {
    newArray[ii$1] = array[ii$1 - rightN];
  }
  return newArray;
}

//
// First: setIn(array, setInIdx, setInValue)
// Then: spliceOut(array, spliceOutIdx)
// Optimized, eliminating redundant copying
// Equivalent of setInSpliceOutN(array, setInIdx, setInValue, spliceOutIdx, 1, canEdit)
//
// Example: setInSpliceOut(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3, 'D', 1, canEdit)
//
// Result: ['a', 'c', 'D', 'f', 'g']
//
function setInSpliceOut(array, setInIdx, setInValue, spliceOutIdx, canEdit) {
  var newArray = spliceOut$1(array, spliceOutIdx, canEdit);

  // Now we can edit regardless of canEdit
  if (setInIdx < spliceOutIdx) {
    newArray[setInIdx] = setInValue;
  } else if (setInIdx > spliceOutIdx) {
    newArray[setInIdx - 1] = setInValue;
  }

  return newArray;
}

function binarySearch(comparator, entries, key, didMatch) {
  var first = 0;
  var range = entries.length;

  while (range > 0) {
    var half = Math.floor(range / 2);
    var entry = entries[first + half];
    var entryKey = entry[0];
    var cmp = comparator(key, entryKey);
    if (cmp === 0) {
      SetRef(didMatch);
      return first + half;
    }
    if (cmp > 0) {
      first += half + 1;
      range -= half + 1;
    } else {
      range = half;
    }
  }
  return first;
}

//
// Node Split algorithms
//
SortedMapBtreeNode.prototype.splitNode = function(
  idx,
  updatedNode,
  subKvn,
  outKvn,
  ownerID,
  canEdit
) {
  var entries = this.entries;
  var nodes = this.nodes;
  var medianIdx = this.btreeNodeSplitSize;

  var newEntries;
  var newNodes;

  if (idx < medianIdx) {
    var rightEntries = entries.slice(medianIdx, entries.length);
    var rightNodes = nodes.slice(medianIdx, nodes.length);
    var rightNode = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries,
      rightNodes
    );

    outKvn[0] = entries[medianIdx - 1];
    outKvn[1] = rightNode;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      nodes.length = medianIdx + 1;

      // shift the items right to make room for returned Kvn
      // and updatedNode (has to go backwards)
      for (var i = medianIdx - 1; i >= idx + 1; i--) {
        entries[i] = entries[i - 1];
        nodes[i + 1] = nodes[i];
      }

      // place returned Kvn and updated node into entries and nodes
      entries[idx] = subKvn[0];
      nodes[idx] = updatedNode;
      nodes[idx + 1] = subKvn[1];
      newEntries = entries;
      newNodes = nodes;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = allocArray(medianIdx);
      newNodes = allocArray(medianIdx + 1);

      // copy the items before idx into new arrays
      for (var i$1 = 0; i$1 < idx; i$1++) {
        newEntries[i$1] = entries[i$1];
        newNodes[i$1] = nodes[i$1];
      }

      // place returned Kvn and updated node into new arrays
      newEntries[idx] = subKvn[0];
      newNodes[idx] = updatedNode;
      newNodes[idx + 1] = subKvn[1];

      // copy remaining items after idx into new arrays
      for (var i$2 = idx + 1; i$2 < medianIdx; i$2++) {
        newEntries[i$2] = entries[i$2 - 1];
        newNodes[i$2 + 1] = nodes[i$2];
      }
    }
  } else if (idx === medianIdx) {
    // allocate the arrays for right node
    var rightEntries$1 = allocArray(entries.length - medianIdx);
    var rightNodes$1 = allocArray(nodes.length - medianIdx);

    // place subKvn to the beginning of right node arrays
    rightEntries$1[0] = entries[medianIdx];
    rightNodes$1[0] = subKvn[1];

    // copy the remaining items into the right node arrays
    for (var i$3 = 1, len = rightEntries$1.length; i$3 < len; i$3++) {
      rightEntries$1[i$3] = entries[medianIdx + i$3];
      rightNodes$1[i$3] = nodes[medianIdx + i$3];
    }
    // copy the last node item into rightNodes
    rightNodes$1[rightNodes$1.length - 1] = nodes[nodes.length - 1];

    var rightNode$1 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$1,
      rightNodes$1
    );

    outKvn[0] = subKvn[0];
    outKvn[1] = rightNode$1;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      nodes.length = medianIdx + 1;
      nodes[idx] = updatedNode;
      newEntries = entries;
      newNodes = nodes;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = allocArray(medianIdx);
      newNodes = allocArray(medianIdx + 1);

      // copy the items before idx into new arrays
      for (var i$4 = 0; i$4 < medianIdx; i$4++) {
        newEntries[i$4] = entries[i$4];
        newNodes[i$4] = nodes[i$4];
      }

      // place returned Kvn and updated node into new node arrays
      newNodes[idx] = updatedNode;
    }
  } else {
    // idx > medianIdx

    // allocate the arrays for right node
    var rightEntries$2 = allocArray(entries.length - medianIdx);
    var rightNodes$2 = allocArray(nodes.length - medianIdx);

    // copy the items into the beginning of right node arrays
    var idx0 = medianIdx + 1;
    var rightIdx = idx - idx0;
    for (var i$5 = 0, len$1 = rightIdx; i$5 < len$1; i$5++) {
      rightEntries$2[i$5] = entries[idx0 + i$5];
      rightNodes$2[i$5] = nodes[idx0 + i$5];
    }

    // place subKvn to the middle right node arrays
    rightEntries$2[rightIdx] = subKvn[0];
    rightNodes$2[rightIdx] = updatedNode;
    rightNodes$2[rightIdx + 1] = subKvn[1];

    // copy the remaining items into the right node arrays
    for (var i$6 = rightIdx + 1, len$2 = rightEntries$2.length; i$6 < len$2; i$6++) {
      rightEntries$2[i$6] = entries[medianIdx + i$6];
      rightNodes$2[i$6 + 1] = nodes[medianIdx + i$6 + 1];
    }

    var rightNode$2 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$2,
      rightNodes$2
    );

    outKvn[0] = entries[medianIdx];
    outKvn[1] = rightNode$2;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      nodes.length = medianIdx + 1;
      newEntries = entries;
      newNodes = nodes;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = entries.slice(0, medianIdx);
      newNodes = nodes.slice(0, medianIdx + 1);
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

SortedMapBtreeNode.prototype.splitLeaf = function(
  idx,
  entry,
  outKvn,
  ownerID,
  canEdit
) {
  var entries = this.entries;
  var medianIdx = this.btreeNodeSplitSize;

  var newEntries;
  var newNodes;

  if (idx < medianIdx) {
    var rightEntries = entries.slice(medianIdx, entries.length);
    var rightNode = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries
    );

    outKvn[0] = entries[medianIdx - 1];
    outKvn[1] = rightNode;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;

      // shift the items right to make room for returned Kvn
      // and updatedNode (has to go backwards)
      for (var i = medianIdx - 1; i >= idx + 1; i--) {
        entries[i] = entries[i - 1];
      }

      // place returned Kvn and updated node into entries and nodes
      entries[idx] = entry;
      newEntries = entries;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = allocArray(medianIdx);

      // copy the items before idx into new arrays
      for (var i$1 = 0; i$1 < idx; i$1++) {
        newEntries[i$1] = entries[i$1];
      }

      // place returned Kvn and updated node into new arrays
      newEntries[idx] = entry;

      // copy remaining items after idx into new arrays
      for (var i$2 = idx + 1; i$2 < medianIdx; i$2++) {
        newEntries[i$2] = entries[i$2 - 1];
      }
    }
  } else if (idx === medianIdx) {
    // allocate the arrays for right node
    var rightEntries$1 = allocArray(entries.length - medianIdx);

    // place subKvn to the beginning of right node arrays
    rightEntries$1[0] = entries[medianIdx];

    // copy the remaining items into the right node arrays
    for (var i$3 = 1, len = rightEntries$1.length; i$3 < len; i$3++) {
      rightEntries$1[i$3] = entries[medianIdx + i$3];
    }

    var rightNode$1 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$1
    );

    outKvn[0] = entry;
    outKvn[1] = rightNode$1;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      newEntries = entries;
    } else {
      // allocate new arrays for entries
      newEntries = allocArray(medianIdx);

      // copy the items before idx into new arrays
      for (var i$4 = 0; i$4 < medianIdx; i$4++) {
        newEntries[i$4] = entries[i$4];
      }
    }
  } else {
    // idx > medianIdx

    // allocate the arrays for right node
    var rightEntries$2 = allocArray(entries.length - medianIdx);

    // copy the items into the beginning of right node arrays
    var idx0 = medianIdx + 1;
    var rightIdx = idx - idx0;
    for (var i$5 = 0, len$1 = rightIdx; i$5 < len$1; i$5++) {
      rightEntries$2[i$5] = entries[idx0 + i$5];
    }

    // place subKvn to the middle right node arrays
    rightEntries$2[rightIdx] = entry;

    // copy the remaining items into the right node arrays
    for (var i$6 = rightIdx + 1, len$2 = rightEntries$2.length; i$6 < len$2; i$6++) {
      rightEntries$2[i$6] = entries[medianIdx + i$6];
    }

    var rightNode$2 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$2
    );

    outKvn[0] = entries[medianIdx];
    outKvn[1] = rightNode$2;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      newEntries = entries;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = entries.slice(0, medianIdx);
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

SortedMapBtreeNode.prototype.spliceNode = function(
  ownerID,
  idx,
  updatedNode,
  parent,
  parentIdx,
  canEdit,
  subKvn,
  outKvn
) {
  var entries = this.entries;
  var nodes = this.nodes;

  var newEntries;
  var newNodes;

  var updatedEntry = subKvn[0];
  var updatedNeighbor = subKvn[1];
  var updatedNeighborIsLeft = subKvn[2];

  if (updatedNeighbor === NOT_SET) {
    //
    // Removing entry and node
    //
    if (entries.length <= this.btreeNodeSplitSize && parent) {
      // Not enough room, consolidate this node
      if (updatedNeighborIsLeft) {
        // remove left node in newNodes
        return this.consolidateNode(
          ownerID,
          idx,
          updatedNode,
          idx - 1,
          idx - 1,
          parent,
          parentIdx,
          canEdit,
          outKvn
        );
      } else {
        // remove right node in newNodes
        return this.consolidateNode(
          ownerID,
          idx,
          updatedNode,
          idx,
          idx + 1,
          parent,
          parentIdx,
          canEdit,
          outKvn
        );
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (updatedNeighborIsLeft) {
        // update left node in newNodes
        newNodes = setInSpliceOut(nodes, idx, updatedNode, idx - 1, canEdit);
        newEntries = spliceOut$1(entries, idx - 1, canEdit);
      } else {
        // update right node in newNodes
        newNodes = setInSpliceOut(nodes, idx, updatedNode, idx + 1, canEdit);
        newEntries = spliceOut$1(entries, idx, canEdit);
      }
    }
  } else {
    //
    // Updating entry and node
    //
    newNodes = setIn$2(nodes, idx, updatedNode, canEdit);
    if (updatedNeighbor) {
      if (updatedNeighborIsLeft) {
        // update left node in newNodes
        newNodes[idx - 1] = updatedNeighbor;
        newEntries = setIn$2(entries, idx - 1, updatedEntry, canEdit);
      } else {
        // update right node in newNodes
        newNodes[idx + 1] = updatedNeighbor;
        newEntries = setIn$2(entries, idx, updatedEntry, canEdit);
      }
    } else if (updatedEntry) {
      newEntries = setIn$2(entries, idx, updatedEntry, canEdit);
    } else {
      newEntries = entries;
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

//
// We updating node at position idx, removing the entry at position removeEntryIdx,
// and removing a neighbor node at position removeNodeIdx
// (either on the left or right side of updated node). We know that we already have
// a minimum number of allowed entries in the node, so we have to either
// move some entries from a neighbor or merge with neighbour
//
SortedMapBtreeNode.prototype.consolidateNode = function(
  ownerID,
  idx,
  updatedNode,
  removeEntryIdx,
  removeNodeIdx,
  parent,
  parentIdx,
  canEdit,
  outKvn
) {
  var entries = this.entries;
  var nodes = this.nodes;

  var parentEntries = parent.entries;
  var parentNodes = parent.nodes;

  //
  // Decide if we are going to move entries or merge
  // and with which neighbor we are going to proceed
  //
  var donorNode;
  var mergeNode;
  var leftNode;
  var rightNode;
  if (parentIdx === 0) {
    // Only right node can be a host within a scope of this parent
    rightNode = parentNodes[parentIdx + 1];
    mergeNode = donorNode = rightNode;
  } else if (parentIdx === parentNodes.length - 1) {
    // Only left node can be a host within a scope of this parent
    leftNode = parentNodes[parentIdx - 1];
    mergeNode = donorNode = leftNode;
  } else {
    // Both left and right node could be a potential donor
    leftNode = parentNodes[parentIdx - 1];
    rightNode = parentNodes[parentIdx + 1];
    var leftAvail =
      (leftNode.entries.length - this.btreeNodeSplitSize + 1) / 2;
    var rightAvail =
      (rightNode.entries.length - this.btreeNodeSplitSize + 1) / 2;
    if (leftAvail >= rightAvail) {
      donorNode = leftNode;
      mergeNode = rightNode;
    } else {
      donorNode = rightNode;
      mergeNode = leftNode;
    }
  }

  var newEntries;
  var newNodes;

  //
  // Move from the LEFT node
  //
  function moveFromLeftNode(node, n, merge) {
    // allocate newEntries extended by n
    newEntries = spliceOutShiftRightN(entries, removeEntryIdx, n, canEdit);
    newNodes = spliceOutShiftRightN(nodes, removeNodeIdx, n, canEdit);

    // now set the updatedNode, adjust the index according to the shift above
    var uIdx = idx < removeNodeIdx ? idx + n : idx + n - 1;
    newNodes[uIdx] = updatedNode;

    // Then move an item from the parent node into newEntries
    var i = n - 1;
    newEntries[i] = parentEntries[parentIdx - 1];

    // And move rightest node from the neighbor into newNodes
    newNodes[i--] = node.nodes[node.nodes.length - 1];

    // Then copy the items from the node
    var j;
    for (j = node.entries.length - 1; i >= 0; i--, j--) {
      newEntries[i] = node.entries[j];
      newNodes[i] = node.nodes[j];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining entry from node to parent
      outKvn[0] = node.entries[j];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(
        node.entries,
        node.entries.length - n,
        n,
        canEdit
      );
      var newNodeNodes = spliceOutN(
        node.nodes,
        node.nodes.length - n,
        n,
        canEdit
      );

      outKvn[1] = node.makeNewNode(
        newNodeEntries,
        newNodeNodes,
        ownerID,
        canEdit
      );
    }
    outKvn[2] = true;
  }

  //
  // Move from the right node
  //
  function moveFromRightNode(node, n, merge) {
    newEntries = spliceOut$1(entries, removeEntryIdx, canEdit);
    newNodes = spliceOut$1(nodes, removeNodeIdx, canEdit);

    // Expand new entries
    var j = newEntries.length;
    newEntries.length += n;
    newNodes.length += n;

    // now set the updatedNode, adjust the index according to the shift above
    var uIdx = idx < removeNodeIdx ? idx : idx - 1;
    newNodes[uIdx] = updatedNode;

    // Then move an item from the parent node into newEntries
    newEntries[j++] = parentEntries[parentIdx];

    // Also copy the first item in right neighbor into newNodes
    newNodes[j] = node.nodes[0];

    // Then copy the items from the node
    for (var i = 0, iLimit = n - 1; i < iLimit; i++) {
      newEntries[j + i] = node.entries[i];
      newNodes[j + i + 1] = node.nodes[i + 1];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining item from node to parent
      outKvn[0] = node.entries[n - 1];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(node.entries, 0, n, canEdit);
      var newNodeNodes = spliceOutN(node.nodes, 0, n, canEdit);

      outKvn[1] = node.makeNewNode(
        newNodeEntries,
        newNodeNodes,
        ownerID,
        canEdit
      );
    }
    outKvn[2] = false;
  }

  var donorAvail = Math.floor(
    (donorNode.entries.length - this.btreeNodeSplitSize + 1) / 2
  );
  if (donorAvail > 0) {
    //
    // OPERATION: MOVE
    //
    // move donorAvail entries from donorNode to this leaf through parentNodes
    if (donorNode === leftNode) {
      moveFromLeftNode(donorNode, donorAvail);
    } else {
      moveFromRightNode(donorNode, donorAvail);
    }
  } else {
    //
    // OPERATION: MERGE
    //
    // neither neighbour has enough entries to donate
    // we gotta merge this node with mergeNode which has fewer entries available
    // eslint-disable-next-line no-lonely-if
    if (mergeNode === leftNode) {
      // Merge with the left node
      moveFromLeftNode(mergeNode, mergeNode.entries.length + 1, true);
    } else {
      // Merge with the right node
      moveFromRightNode(mergeNode, mergeNode.entries.length + 1, true);
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

// We are eliminating the entry at position idx and we know that we already
// have a minimum number of allowed entries in the node, so we have to either
// move some entries from a neighbor or merge with neighbour
SortedMapBtreeNode.prototype.consolidateLeaf = function(
  ownerID,
  idx,
  parent,
  parentIdx,
  canEdit,
  outKvn
) {
  var entries = this.entries;
  var parentEntries = parent.entries;
  var parentNodes = parent.nodes;

  //
  // Decide if we are going to move entries or merge
  // and with which neighbor we are going to proceed
  //
  var donorNode;
  var leftNode;
  // eslint-disable-next-line no-unused-vars
  var rightNode;
  if (parentIdx === 0) {
    // Only right node can be a host within a scope of this parent
    rightNode = parentNodes[parentIdx + 1];
    donorNode = rightNode;
  } else if (parentIdx === parentNodes.length - 1) {
    // Only left node can be a host within a scope of this parent
    leftNode = parentNodes[parentIdx - 1];
    donorNode = leftNode;
  } else {
    // Both left and right node could be a potential donor
    leftNode = parentNodes[parentIdx - 1];
    rightNode = parentNodes[parentIdx + 1];
    var leftAvail = leftNode.entries.length - this.btreeNodeSplitSize;
    var rightAvail = rightNode.entries.length - this.btreeNodeSplitSize;
    if (leftAvail >= rightAvail) {
      donorNode = leftNode;
    } else {
      donorNode = rightNode;
    }
  }

  var newEntries;
  //
  // Move from the LEFT node
  //
  // n - is the number of entries added to the target node
  //
  function moveFromLeftNode(node, n, merge) {
    // allocate newEntries extended by n
    newEntries = spliceOutShiftRightN(entries, idx, n, canEdit);

    // m is number of entries to be moved from donor node
    var m = n;
    if (!parentNotSet) {
      // Move an item from the parent node into newEntries
      newEntries[n - 1] = parentEntry;
      m--;
    }

    // Then copy the items from the node
    for (var i = 0; i < m; i++) {
      newEntries[i] = node.entries[node.entries.length - m + i];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining item from node to parent
      m++;
      outKvn[0] = node.entries[node.entries.length - m];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(
        node.entries,
        node.entries.length - m,
        m,
        canEdit
      );

      outKvn[1] = node.makeNewNode(newNodeEntries, undefined, ownerID, canEdit);
    }
    outKvn[2] = true;
  }

  //
  // Move from the right node
  //
  // n - is the number of entries added to the target node
  //
  function moveFromRightNode(node, n, merge) {
    newEntries = spliceOut$1(entries, idx, canEdit);
    // Expand new entries
    var j = newEntries.length;
    newEntries.length += n;

    // m is number of entries to be moved from donor node
    var m = n;
    if (!parentNotSet) {
      // Move an item from the parent node into newEntries
      newEntries[j++] = parentEntry;
      m--;
    }

    // Then copy the items from the node
    for (var i = 0; i < m; i++) {
      newEntries[j + i] = node.entries[i];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining item from node to parent
      outKvn[0] = node.entries[m++];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(node.entries, 0, m, canEdit);

      outKvn[1] = node.makeNewNode(newNodeEntries, undefined, ownerID, canEdit);
    }
    outKvn[2] = false;
  }

  var parentEntry =
    donorNode === leftNode
      ? parentEntries[parentIdx - 1]
      : parentEntries[parentIdx];
  var parentNotSet = parentEntry[1] === NOT_SET;
  var parentAdj = parentNotSet ? 1 : 0;
  var donorAvail =
    donorNode.entries.length - this.btreeNodeSplitSize - parentAdj;
  if (donorAvail > 0) {
    //
    // OPERATION: MOVE
    //
    // move donorAvail entries from donorNode to this leaf through parentNodes
    var n = Math.floor((donorAvail + 1) / 2);
    if (donorNode === leftNode) {
      moveFromLeftNode(donorNode, n);
    } else {
      moveFromRightNode(donorNode, n);
    }
  } else {
    //
    // OPERATION: MERGE
    //
    // neither neighbour has enough entries to donate
    // we gotta merge this node with donorNode
    var n$1 = donorNode.entries.length + 1 - parentAdj;
    if (donorNode === leftNode) {
      // Merge with the left node
      moveFromLeftNode(donorNode, n$1, true);
    } else {
      // Merge with the right node
      moveFromRightNode(donorNode, n$1, true);
    }
  }

  return this.makeNewNode(newEntries, undefined, ownerID, canEdit);
};

var SortedMapBtreeNodePacker = (function (SortedMapPacker$$1) {
  function SortedMapBtreeNodePacker () {
    SortedMapPacker$$1.apply(this, arguments);
  }

  if ( SortedMapPacker$$1 ) SortedMapBtreeNodePacker.__proto__ = SortedMapPacker$$1;
  SortedMapBtreeNodePacker.prototype = Object.create( SortedMapPacker$$1 && SortedMapPacker$$1.prototype );
  SortedMapBtreeNodePacker.prototype.constructor = SortedMapBtreeNodePacker;

  SortedMapBtreeNodePacker.prototype.calcPlanCnt = function calcPlanCnt (order, height) {
    if (height < 1 || height > 20) {
      throw new Error('Height is out of supported limit');
    }

    // The recursive algorithm would be:
    //
    // if(height <= 1) {
    // 	return order - 1;
    // }
    // return order * this.calcPlanCnt(order, height - 1) + (order - 1);

    var n = order - 1;

    for (var h = 1; h < height; h++) {
      n = n * order + (order - 1);
    }

    return n;
  };

  SortedMapBtreeNodePacker.prototype.prepareCachedPlan = function prepareCachedPlan (order, n) {
    var key = order.toString() + ' ' + n.toString();

    var cachedPlan = SortedMapBtreeNodePacker.cache[key];

    if (cachedPlan) {
      return cachedPlan;
    }

    var plan = this.preparePlan(order, n);
    this.verifyPlan(plan);

    if (
      order < 100 &&
      n <= 100 &&
      n >= order &&
      SortedMapBtreeNodePacker.cacheSize < 500
    ) {
      SortedMapBtreeNodePacker.cache[key] = plan;
      SortedMapBtreeNodePacker.cacheSize++;
    }

    return plan;
  };

  SortedMapBtreeNodePacker.prototype.preparePlan = function preparePlan (order, n) {
    //
    // First determine height of the tree we are building
    //
    var order1 = order - 1;
    var height = 1;
    var maxEntriesCnt = order1;
    var maxEntriesCnt1;
    while (maxEntriesCnt < n) {
      maxEntriesCnt1 = maxEntriesCnt;
      maxEntriesCnt = maxEntriesCnt * order + order1;
      height++;
    }

    if (maxEntriesCnt === n) {
      // Exact match for the full tree
      return {
        op: 'build',
        full: true,
        height: height,
        order: order,
        repeat: 1,
        total: n
      };
    }

    if (height === 1) {
      return {
        op: 'build',
        full: false,
        height: height,
        order: order,
        repeat: 1,
        total: n
      };
    }

    //
    // Number of entries in subtrees of (height - 1)
    //
    var planCnt1 = maxEntriesCnt1;

    //
    // Then determine the root order
    //
    var rootOrder = 1 + Math.floor(n / (planCnt1 + 1));

    if (rootOrder < 2) {
      throw new Error(
        'Something is wrong, the rootOrder is expected to be >= 2'
      );
    }

    if (rootOrder * planCnt1 + (rootOrder - 1) === n) {
      var repeat = rootOrder;
      var repPlan = [];
      var total$1 = repeat * planCnt1 + repeat - 1;
      repPlan.push({
        op: 'build',
        full: true,
        height: height - 1,
        order: order,
        repeat: rootOrder,
        total: total$1
      });
      return {
        op: 'assemble',
        height: height,
        order: order,
        total: total$1,
        items: repPlan
      };
    }

    // We have to adjust last two subtrees
    var plan = [];

    if (rootOrder > 2) {
      var repeat$1 = rootOrder - 2;
      var total$2 = repeat$1 * planCnt1 + repeat$1 - 1;
      var build = {
        op: 'build',
        full: true,
        height: height - 1,
        order: order,
        repeat: repeat$1,
        total: total$2
      };
      plan.push(build);
      n -= total$2;
      n--;
    }

    // Find feasible plan for 2 subtrees and n entries
    n--; // 1 more entry will be in between the two subtrees
    var n2 = Math.floor(n / 2);
    if (n - n2 > 0) {
      plan.push(this.prepareCachedPlan(order, n - n2));
    }
    if (n2 > 0) {
      plan.push(this.prepareCachedPlan(order, n2));
    }

    var total = 0;
    var ilen = plan.length;
    for (var i = 0; i < ilen; i++) {
      total += plan[i].total;
    }
    total += plan.length - 1;

    return {
      op: 'assemble',
      height: height,
      order: order,
      total: total,
      items: plan
    };
  };

  SortedMapBtreeNodePacker.prototype.verifyPlan = function verifyPlan (plan, level) {
    var this$1 = this;

    function failed(msg) {
      throw new Error(msg);
    }

    if (level === undefined) {
      level = 0;
    }

    if (plan.op === 'assemble') {
      var cnt = 0;

      var ilen = plan.items.length;
      for (var i = 0; i < ilen; i++) {
        var pl = plan.items[i];
        cnt += pl.total;
        if (pl.op === 'build') {
          if (!(pl.order >= pl.repeat)) {
            failed(
              'Plan verification test failed: pl.order >= pl.repeat: ' +
                JSON.stringify(pl)
            );
          }
        }
        if (!(plan.height === pl.height + 1)) {
          failed('Plan verification test failed: plan.height === pl.height+1');
        }
        this$1.verifyPlan(pl, level + 1);
      }
      cnt += plan.items.length - 1;
      if (!(plan.total === cnt)) {
        failed('Count mismatch: ' + plan.total + ' vs ' + cnt);
      }
    } else if (plan.op === 'build') {
      // Verify plan consistency
      var ec = this.calcPlanCnt(plan.order, plan.height);
      if (plan.full) {
        var cnt$1 = ec * plan.repeat + plan.repeat - 1;
        if (!(plan.total === cnt$1)) {
          failed('Plan verification test failed: plan.total === ec');
        }
      } else {
        if (!(plan.height === 1)) {
          failed(
            'Plan verification test failed: expected height 1, got instead ' +
              plan.height
          );
        }
        if (!(plan.total < ec)) {
          failed('Plan verification test failed: plan.total < ec');
        }
        var halfSize = Math.floor((plan.order - 1) / 2);
        if (level > 0 && !(plan.total >= halfSize)) {
          failed(
            'Plan verification test failed: plan.total >= halfSize: ' +
              plan.total +
              ', ' +
              halfSize
          );
        }
      }
    } else {
      failed('Plan verification test failed: invalid op: ' + plan.op);
    }
  };

  // Pack the map according to the plan
  // Return a new root
  //
  // Sample Plan:
  //   {
  //     "op": "assemble",
  //     "height": 2,
  //     "order": 7,
  //     "total": 10,
  //     "items": [
  //         {
  //             "op": "build",
  //             "full": false,
  //             "height": 1,
  //             "order": 7,
  //             "repeat": 1,
  //             "total": 5
  //         },
  //         {
  //             "op": "build",
  //             "full": false,
  //             "height": 1,
  //             "order": 7,
  //             "repeat": 1,
  //             "total": 4
  //         }
  //     ]
  // }
  //

  SortedMapBtreeNodePacker.prototype.runPlan = function runPlan (plan, iter) {
    var this$1 = this;

    function failed(msg) {
      msg = 'Packing Plan is corrupt: ' + msg;
      throw new Error(msg);
    }

    if (plan.op === 'assemble') {
      var ilen = plan.items.length;
      for (var i = 0; i < ilen; i++) {
        if (i > 0) {
          this$1.populate(iter, 1);
        }
        this$1.runPlan(plan.items[i], iter);
      }
    } else if (plan.op === 'build') {
      var n = (plan.total - plan.repeat + 1) / plan.repeat;
      for (var i$1 = 0; i$1 < plan.repeat; i$1++) {
        if (i$1 > 0) {
          this$1.populate(iter, 1);
        }
        this$1.populate(iter, n);
      }
    } else {
      failed('invalid op: ' + plan.op);
    }
    this.flush(plan.height);
  };

  SortedMapBtreeNodePacker.prototype.flush = function flush (height) {
    var this$1 = this;

    for (var i = 0; i < height; i++) {
      var level = i;
      if (this$1.stack[level]) {
        // flush this level
        this$1.prepareLevel(level + 1);
        this$1.addNode(level + 1, this$1.stack[level]);
        this$1.stack[level] = undefined;
        // next entry goes to parent
      }
    }
    this.stackLevel = height;
  };

  SortedMapBtreeNodePacker.prototype.populate = function populate (iter, n) {
    var this$1 = this;

    for (var i = 0; i < n; i++) {
      var next = iter.next();
      this$1.entriesCnt++;
      if (next.done) {
        throw new Error(
          'unexpected end of iterator at ' +
            this$1.entriesCnt +
            ' vs ' +
            iter.size
        );
      }
      var entry = next.value;

      var level = this$1.stackLevel;
      this$1.prepareLevel(level);
      this$1.addEntry(level, entry);

      if (level > 0) {
        // Node - go populate the subtree now
        this$1.stackLevel = 0;
      } else if (this$1.stackIndices[level] === this$1.order - 1) {
        // Leaf - we have filled all entries
        // flush the leaf
        this$1.prepareLevel(level + 1);
        this$1.addNode(level + 1, this$1.stack[level]);
        this$1.stack[level] = undefined;
        // next entry goes to parent
        this$1.stackLevel++;
      }
    }
  };

  SortedMapBtreeNodePacker.prototype.addEntry = function addEntry (level, entry) {
    this.stack[level].entries[this.stackIndices[level]++] = entry;
  };

  SortedMapBtreeNodePacker.prototype.addNode = function addNode (level, node) {
    this.stack[level].nodes[this.stackIndices[level]] = node;

    if (this.stackIndices[level] === this.order - 1) {
      // we filled the whole node
      // flush the node
      this.prepareLevel(level + 1);
      this.addNode(level + 1, this.stack[level]);
      this.stack[level] = undefined;
      // next entry goes to parent
      this.stackLevel++;
    }
  };

  SortedMapBtreeNodePacker.prototype.prepareLevel = function prepareLevel (level) {
    if (!this.stack[level]) {
      var entries = allocArray(this.order - 1);
      entries.length = 0;
      var nodes;
      if (level > 0) {
        nodes = allocArray(this.order);
        nodes.length = 0;
      }
      this.stack[level] = new SortedMapBtreeNode(
        this.comparator,
        this.options,
        this.ownerID,
        entries,
        nodes
      );
      this.stackIndices[level] = 0;
    }
  };

  SortedMapBtreeNodePacker.prototype.finish = function finish () {
    var level = this.stackLevel;
    if (level >= this.stack.length) {
      return undefined;
    }
    return this.stack[level].nodes[0];
  };

  // Will pack seq and storie it in the map
  SortedMapBtreeNodePacker.prototype.pack = function pack (comparator, options, ownerID, collection) {
    if (options && options.type && options.type !== DEFAULT_TYPE) {
      throw new Error('Unsuported type by btree factory: ' + options.type);
    }

    this.order =
      options && options.btreeOrder ? options.btreeOrder : DEFAULT_BTREE_ORDER;

    var kc = KeyedCollection(collection);
    assertNotInfinite(kc.size);

    var plan = this.preparePlan(this.order, kc.size);

    this.comparator = comparator;
    this.options = options;
    this.ownerID = ownerID;
    this.stack = [];
    this.stackIndices = [];
    this.stackLevel = 0;
    this.entriesCnt = 0;

    var iter = kc.entries();
    this.runPlan(plan, iter);

    if (!iter.next().done) {
      throw new Error('iterator did not end when expected');
    }

    return this.finish();
  };

  return SortedMapBtreeNodePacker;
}(SortedMapPacker));

SortedMapBtreeNodePacker.cache = {};
SortedMapBtreeNodePacker.cacheSize = 0;

var SortedMapBtreeNodeFactory = (function (SortedMapNodeFactory$$1) {
  function SortedMapBtreeNodeFactory () {
    SortedMapNodeFactory$$1.apply(this, arguments);
  }

  if ( SortedMapNodeFactory$$1 ) SortedMapBtreeNodeFactory.__proto__ = SortedMapNodeFactory$$1;
  SortedMapBtreeNodeFactory.prototype = Object.create( SortedMapNodeFactory$$1 && SortedMapNodeFactory$$1.prototype );
  SortedMapBtreeNodeFactory.prototype.constructor = SortedMapBtreeNodeFactory;

  SortedMapBtreeNodeFactory.prototype.createNode = function createNode (comparator, options, ownerID, entries, nodes) {
    return new SortedMapBtreeNode(comparator, options, ownerID, entries, nodes);
  };

  SortedMapBtreeNodeFactory.prototype.createPacker = function createPacker () {
    return new SortedMapBtreeNodePacker();
  };

  SortedMapBtreeNodeFactory.prototype.createIterator = function createIterator (map, type, reverse) {
    return new SortedMapBtreeNodeIterator(map, type, reverse);
  };

  return SortedMapBtreeNodeFactory;
}(SortedMapNodeFactory));

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * Original source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var SortedMap = (function (Map$$1) {
  function SortedMap(value, comparator, options) {
    if (!comparator) {
      if (this instanceof SortedMap) {
        comparator = this.getComparator();
      }
      if (!comparator) {
        comparator = SortedMap.defaultComparator;
      }
    }
    if (!options) {
      if (this instanceof SortedMap) {
        options = this.getOptions();
      }
      if (!options) {
        options = SortedMap.defaultOptions;
      }
    }

    return value === null || value === undefined
      ? emptySortedMap(comparator, options)
      : isSortedMap(value) &&
        value.getComparator() === comparator &&
        value.getOptions() === options
        ? value
        : emptySortedMap(comparator, options).withMutations(function (map) {
            map.pack(value);
          });
  }

  if ( Map$$1 ) SortedMap.__proto__ = Map$$1;
  SortedMap.prototype = Object.create( Map$$1 && Map$$1.prototype );
  SortedMap.prototype.constructor = SortedMap;

  SortedMap.of = function of () {
    var keyValues = [], len = arguments.length;
    while ( len-- ) keyValues[ len ] = arguments[ len ];

    return emptySortedMap().withMutations(function (map) {
      for (var i = 0; i < keyValues.length; i += 2) {
        if (i + 1 >= keyValues.length) {
          throw new Error('Missing value for key: ' + keyValues[i]);
        }
        map.set(keyValues[i], keyValues[i + 1]);
      }
    });
  };

  SortedMap.prototype.toString = function toString () {
    return this.__toString('SortedMap {', '}');
  };

  // @pragma Access

  SortedMap.prototype.getComparator = function getComparator () {
    return this._comparator;
  };

  SortedMap.prototype.getOptions = function getOptions () {
    return this._options;
  };

  SortedMap.prototype.get = function get (k, notSetValue) {
    return this._root ? this._root.get(k, notSetValue) : notSetValue;
  };

  // @pragma Modification

  SortedMap.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._root = null;
      this.__altered = true;
      return this;
    }
    return emptySortedMap(this._comparator, this._options);
  };

  SortedMap.prototype.pack = function pack (value) {
    var this$1 = this;

    var collection;
    if (value === undefined) {
      collection = this;
    } else {
      // Sort and deduplicate the entries
      var index = 0;
      var entries = KeyedCollection(value)
        .map(function (v, k) { return [k, v, index++]; })
        .valueSeq()
        .toArray();
      if (entries.length === 0) {
        if (this.__ownerID) {
          this._root = undefined;
          (this.size = 0), (this.__altered = true);
          return this;
        }
        return emptySortedMap(this._comparator, this._options);
      }
      entries.sort(function (a, b) { return this$1._comparator(a[0], b[0]) || a[2] - b[2]; });
      var result = [];
      for (var i = 0, stop = entries.length - 1; i < stop; i++) {
        var entry = entries[i];
        var nextEntry = entries[i + 1];
        if (this$1._comparator(entry[0], nextEntry[0]) < 0) {
          var newEntry = [entry[0], entry[1]];
          result.push(newEntry);
        }
      }
      // push the last ownerID
      var entry$1 = entries[entries.length - 1];
      var newEntry$1 = [entry$1[0], entry$1[1]];
      result.push(newEntry$1);
      collection = KeyedSeq(result);
    }
    assertNotInfinite(collection.size);

    var newSize = collection.size;
    var newRoot = this._factory
      .createPacker()
      .pack(this._comparator, this._options, this.__ownerID, collection);

    if (this.__ownerID) {
      this._root = newRoot;
      (this.size = newSize), (this.__altered = true);
      return this;
    }
    return newRoot
      ? makeSortedMap(this._comparator, this._options, newSize, newRoot)
      : emptySortedMap(this._comparator, this._options);
  };

  SortedMap.prototype.set = function set (k, v) {
    return updateMap$1(this, k, v);
  };

  SortedMap.prototype.remove = function remove (k) {
    return updateMap$1(this, k, NOT_SET);
  };

  SortedMap.prototype.fastRemove = function fastRemove (k) {
    return updateMap$1(this, k, NOT_SET, true);
  };

  // @pragma Composition

  SortedMap.prototype.sort = function sort (comparator) {
    return SortedMap(this, comparator, this.getOptions());
  };

  SortedMap.prototype.sortBy = function sortBy (mapper, comparator) {
    return SortedMap(
      sortFactory(this, comparator, mapper),
      comparator,
      this.getOptions()
    );
  };

  // @pragma Mutability

  SortedMap.prototype.__iterator = function __iterator (type, reverse) {
    return this._factory.createIterator(this, type, reverse);
  };

  SortedMap.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptySortedMap(this._comparator, this._options);
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeSortedMap(
      this._comparator,
      this._options,
      this.size,
      this._root,
      ownerID
    );
  };

  SortedMap.prototype.checkConsistency = function checkConsistency (printFlag) {
    var this$1 = this;

    if (this._root) {
      if (!(this.size > 0)) {
        return 1;
      }
      return this._root.checkConsistency(printFlag);
    } else if (!(this.size === 0)) {
      return 2;
    }

    var n = 0;
    var prevKey;
    this.keySeq().forEach(function (key) {
      if (n && !(this$1._comparator(prevKey, key) < 0)) {
        return 3;
      }
      prevKey = key;
      n++;
    });

    if (this.size !== n) {
      return 4;
    }

    return 0;
  };

  SortedMap.prototype.print = function print (maxDepth) {
    var header = 'SORTED MAP: size=' + this.size;
    if (this._options) {
      header = header + ', options=' + JSON.stringify(this._options);
    }
    // eslint-disable-next-line
    console.log(header);
    if (this._root) {
      this._root.print(1, maxDepth);
    }
    return this;
  };

  return SortedMap;
}(Map));

function isSortedMap(maybeSortedMap) {
  return isMap(maybeSortedMap) && isSorted(maybeSortedMap);
}

SortedMap.isSortedMap = isSortedMap;

SortedMap.defaultComparator = defaultComparator$1;
SortedMap.defaultOptions = {
  type: 'btree'
};

var SortedMapPrototype = SortedMap.prototype;
SortedMapPrototype[IS_SORTED_SENTINEL] = true;
SortedMapPrototype[DELETE] = SortedMapPrototype.remove;
SortedMapPrototype.removeIn = SortedMapPrototype.deleteIn;
SortedMapPrototype.removeAll = SortedMapPrototype.deleteAll;

function makeSortedMap(comparator, options, size, root, ownerID) {
  var map = Object.create(SortedMapPrototype);
  map._comparator = comparator || SortedMap.defaultComparator;
  map._options = options || SortedMap.defaultOptions;
  map.size = size;
  map._root = root;
  map._factory = SortedMap.getFactory(map._options);
  map.__ownerID = ownerID;
  map.__altered = false;

  if (map._options.btreeOrder && map._options.btreeOrder < 3) {
    throw new Error(
      'SortedMap: minimum value of options.btreeOrder is 3, but got: ' +
        map._options.btreeOrder
    );
  }

  if (!map._factory) {
    throw new Error('SortedMap type not supported: ' + map._options.type);
  }

  return map;
}

var DEFAULT_EMPTY_MAP;
function emptySortedMap(comparator, options) {
  if (
    comparator === SortedMap.defaultComparator &&
    options === SortedMap.defaultOptions
  ) {
    return (
      DEFAULT_EMPTY_MAP ||
      (DEFAULT_EMPTY_MAP = makeSortedMap(
        SortedMap.defaultComparator,
        SortedMap.defaultOptions,
        0
      ))
    );
  }
  return makeSortedMap(comparator, options, 0);
}

function updateMap$1(map, k, v, fast) {
  var remove = v === NOT_SET;
  var root = map._root;
  var newRoot;
  var newSize;
  if (!root) {
    if (remove) {
      return map;
    }
    newSize = 1;
    var entries = [[k, v]];
    newRoot = map._factory.createNode(
      map._comparator,
      map._options,
      map.__ownerID,
      entries
    );
  } else {
    var didChangeSize = MakeRef(CHANGE_LENGTH);
    var didAlter = MakeRef(DID_ALTER);

    if (remove) {
      if (fast) {
        newRoot = map._root.fastRemove(
          map.__ownerID,
          k,
          didChangeSize,
          didAlter
        );
      } else {
        newRoot = map._root.remove(map.__ownerID, k, didChangeSize, didAlter);
      }
    } else {
      newRoot = map._root.upsert(map.__ownerID, k, v, didChangeSize, didAlter);
    }
    if (!GetRef(didAlter)) {
      return map;
    }
    newSize = map.size + (GetRef(didChangeSize) ? (remove ? -1 : 1) : 0);
    if (newSize === 0) {
      newRoot = undefined;
    }
  }
  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__altered = true;
    return map;
  }
  return newRoot
    ? makeSortedMap(map._comparator, map._options, newSize, newRoot)
    : emptySortedMap(map._comparator, map._options);
}

function defaultComparator$1(a, b) {
  if (is(a, b)) {
    return 0;
  }

  var ta = typeof a;
  var tb = typeof b;

  if (ta !== tb) {
    return ta < tb ? -1 : 1;
  }

  switch (ta) {
    case 'undefined':
      // we should not get here and is above should take care of this case
      break;
    case 'object':
      // Take care of null cases then convert objects to strings
      if (a === null) {
        return 1;
      }
      if (b === null) {
        return -1;
      }
      a = a.toString();
      b = b.toString();
      break;
    case 'boolean':
      // default comparisons work
      break;
    case 'number':
      // take care of NaN
      if (is(a, NaN)) {
        return 1;
      }
      if (is(b, NaN)) {
        return -1;
      }
      // for all other cases the
      // default comparisons work
      break;
    case 'string':
      // default comparisons work
      break;
    case 'symbol':
      // convert symbols to strings
      a = a.toString();
      b = b.toString();
      break;
    case 'function':
      // convert functions to strings
      a = a.toString();
      b = b.toString();
      break;
    default:
      // we should not get here as all types are covered
      break;
  }

  return a < b ? -1 : a > b ? 1 : 0;
}

//
// Register all the factories
//
SortedMap.getFactory = function(options) {
  var type =
    options && options.type ? options.type : SortedMap.defaultOptions.type;

  return SortedMap.factories[type];
};

SortedMap.factories = {
  btree: new SortedMapBtreeNodeFactory()
};

var Stack = (function (IndexedCollection$$1) {
  function Stack(value) {
    return value === null || value === undefined
      ? emptyStack()
      : isStack(value) ? value : emptyStack().pushAll(value);
  }

  if ( IndexedCollection$$1 ) Stack.__proto__ = IndexedCollection$$1;
  Stack.prototype = Object.create( IndexedCollection$$1 && IndexedCollection$$1.prototype );
  Stack.prototype.constructor = Stack;

  Stack.of = function of (/*...values*/) {
    return this(arguments);
  };

  Stack.prototype.toString = function toString () {
    return this.__toString('Stack [', ']');
  };

  // @pragma Access

  Stack.prototype.get = function get (index, notSetValue) {
    var head = this._head;
    index = wrapIndex(this, index);
    while (head && index--) {
      head = head.next;
    }
    return head ? head.value : notSetValue;
  };

  Stack.prototype.peek = function peek () {
    return this._head && this._head.value;
  };

  // @pragma Modification

  Stack.prototype.push = function push (/*...values*/) {
    var arguments$1 = arguments;

    if (arguments.length === 0) {
      return this;
    }
    var newSize = this.size + arguments.length;
    var head = this._head;
    for (var ii = arguments.length - 1; ii >= 0; ii--) {
      head = {
        value: arguments$1[ii],
        next: head
      };
    }
    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return makeStack(newSize, head);
  };

  Stack.prototype.pushAll = function pushAll (iter) {
    iter = IndexedCollection$$1(iter);
    if (iter.size === 0) {
      return this;
    }
    if (this.size === 0 && isStack(iter)) {
      return iter;
    }
    assertNotInfinite(iter.size);
    var newSize = this.size;
    var head = this._head;
    iter.__iterate(function (value) {
      newSize++;
      head = {
        value: value,
        next: head
      };
    }, /* reverse */ true);
    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return makeStack(newSize, head);
  };

  Stack.prototype.pop = function pop () {
    return this.slice(1);
  };

  Stack.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._head = undefined;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return emptyStack();
  };

  Stack.prototype.slice = function slice (begin, end) {
    if (wholeSlice(begin, end, this.size)) {
      return this;
    }
    var resolvedBegin = resolveBegin(begin, this.size);
    var resolvedEnd = resolveEnd(end, this.size);
    if (resolvedEnd !== this.size) {
      // super.slice(begin, end);
      return IndexedCollection$$1.prototype.slice.call(this, begin, end);
    }
    var newSize = this.size - resolvedBegin;
    var head = this._head;
    while (resolvedBegin--) {
      head = head.next;
    }
    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return makeStack(newSize, head);
  };

  // @pragma Mutability

  Stack.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyStack();
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeStack(this.size, this._head, ownerID, this.__hash);
  };

  // @pragma Iteration

  Stack.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return new ArraySeq(this.toArray()).__iterate(
        function (v, k) { return fn(v, k, this$1); },
        reverse
      );
    }
    var iterations = 0;
    var node = this._head;
    while (node) {
      if (fn(node.value, iterations++, this$1) === false) {
        break;
      }
      node = node.next;
    }
    return iterations;
  };

  Stack.prototype.__iterator = function __iterator (type, reverse) {
    if (reverse) {
      return new ArraySeq(this.toArray()).__iterator(type, reverse);
    }
    var iterations = 0;
    var node = this._head;
    return new Iterator(function () {
      if (node) {
        var value = node.value;
        node = node.next;
        return iteratorValue(type, iterations++, value);
      }
      return iteratorDone();
    });
  };

  return Stack;
}(IndexedCollection));

function isStack(maybeStack) {
  return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
}

Stack.isStack = isStack;

var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

var StackPrototype = Stack.prototype;
StackPrototype[IS_STACK_SENTINEL] = true;
StackPrototype.shift = StackPrototype.pop;
StackPrototype.unshift = StackPrototype.push;
StackPrototype.unshiftAll = StackPrototype.pushAll;
StackPrototype.withMutations = withMutations;
StackPrototype.wasAltered = wasAltered;
StackPrototype.asImmutable = asImmutable;
StackPrototype['@@transducer/init'] = StackPrototype.asMutable = asMutable;
StackPrototype['@@transducer/step'] = function(result, arr) {
  return result.unshift(arr);
};
StackPrototype['@@transducer/result'] = function(obj) {
  return obj.asImmutable();
};

function makeStack(size, head, ownerID, hash) {
  var map = Object.create(StackPrototype);
  map.size = size;
  map._head = head;
  map.__ownerID = ownerID;
  map.__hash = hash;
  map.__altered = false;
  return map;
}

var EMPTY_STACK;
function emptyStack() {
  return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
}

function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (
    !isCollection(b) ||
    (a.size !== undefined && b.size !== undefined && a.size !== b.size) ||
    (a.__hash !== undefined &&
      b.__hash !== undefined &&
      a.__hash !== b.__hash) ||
    isKeyed(a) !== isKeyed(b) ||
    isIndexed(a) !== isIndexed(b) ||
    isOrdered(a) !== isOrdered(b) ||
    isSorted(a) !== isSorted(b)
  ) {
    return false;
  }

  if (a.size === 0 && b.size === 0) {
    return true;
  }

  var notAssociative = !isAssociative(a);

  if (isOrdered(a)) {
    var entries = a.entries();
    return (
      b.every(function (v, k) {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done
    );
  }

  var flipped = false;

  if (a.size === undefined) {
    if (b.size === undefined) {
      if (typeof a.cacheResult === 'function') {
        a.cacheResult();
      }
    } else {
      flipped = true;
      var _ = a;
      a = b;
      b = _;
    }
  }

  var allEqual = true;
  var bSize = b.__iterate(function (v, k) {
    if (
      notAssociative
        ? !a.has(v)
        : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)
    ) {
      allEqual = false;
      return false;
    }
  });

  return allEqual && a.size === bSize;
}

/**
 * Contributes additional methods to a constructor
 */
function mixin(ctor, methods) {
  var keyCopier = function (key) {
    ctor.prototype[key] = methods[key];
  };
  Object.keys(methods).forEach(keyCopier);
  Object.getOwnPropertySymbols &&
    Object.getOwnPropertySymbols(methods).forEach(keyCopier);
  return ctor;
}

function toJS(value) {
  return isDataStructure(value)
    ? Seq(value)
        .map(toJS)
        .toJSON()
    : value;
}

var Set = (function (SetCollection$$1) {
  function Set(value) {
    return value === null || value === undefined
      ? emptySet()
      : isSet(value) && !isOrdered(value)
        ? value
        : emptySet().withMutations(function (set) {
            var iter = SetCollection$$1(value);
            assertNotInfinite(iter.size);
            iter.forEach(function (v) { return set.add(v); });
          });
  }

  if ( SetCollection$$1 ) Set.__proto__ = SetCollection$$1;
  Set.prototype = Object.create( SetCollection$$1 && SetCollection$$1.prototype );
  Set.prototype.constructor = Set;

  Set.of = function of (/*...values*/) {
    return this(arguments);
  };

  Set.fromKeys = function fromKeys (value) {
    return this(KeyedCollection(value).keySeq());
  };

  Set.intersect = function intersect (sets) {
    sets = Collection(sets).toArray();
    return sets.length
      ? SetPrototype.intersect.apply(Set(sets.pop()), sets)
      : emptySet();
  };

  Set.union = function union (sets) {
    sets = Collection(sets).toArray();
    return sets.length
      ? SetPrototype.union.apply(Set(sets.pop()), sets)
      : emptySet();
  };

  Set.prototype.toString = function toString () {
    return this.__toString('Set {', '}');
  };

  // @pragma Access

  Set.prototype.has = function has (value) {
    return this._map.has(value);
  };

  // @pragma Modification

  Set.prototype.add = function add (value) {
    return updateSet(this, this._map.set(value, value));
  };

  Set.prototype.remove = function remove (value) {
    return updateSet(this, this._map.remove(value));
  };

  Set.prototype.clear = function clear () {
    return updateSet(this, this._map.clear());
  };

  // @pragma Composition

  Set.prototype.union = function union () {
    var iters = [], len = arguments.length;
    while ( len-- ) iters[ len ] = arguments[ len ];

    iters = iters.filter(function (x) { return x.size !== 0; });
    if (iters.length === 0) {
      return this;
    }
    if (this.size === 0 && !this.__ownerID && iters.length === 1) {
      return this.constructor(iters[0]);
    }
    return this.withMutations(function (set) {
      for (var ii = 0; ii < iters.length; ii++) {
        SetCollection$$1(iters[ii]).forEach(function (value) { return set.add(value); });
      }
    });
  };

  Set.prototype.intersect = function intersect () {
    var iters = [], len = arguments.length;
    while ( len-- ) iters[ len ] = arguments[ len ];

    if (iters.length === 0) {
      return this;
    }
    iters = iters.map(function (iter) { return SetCollection$$1(iter); });
    var toRemove = [];
    this.forEach(function (value) {
      if (!iters.every(function (iter) { return iter.includes(value); })) {
        toRemove.push(value);
      }
    });
    return this.withMutations(function (set) {
      toRemove.forEach(function (value) {
        set.remove(value);
      });
    });
  };

  Set.prototype.subtract = function subtract () {
    var iters = [], len = arguments.length;
    while ( len-- ) iters[ len ] = arguments[ len ];

    if (iters.length === 0) {
      return this;
    }
    iters = iters.map(function (iter) { return SetCollection$$1(iter); });
    var toRemove = [];
    this.forEach(function (value) {
      if (iters.some(function (iter) { return iter.includes(value); })) {
        toRemove.push(value);
      }
    });
    return this.withMutations(function (set) {
      toRemove.forEach(function (value) {
        set.remove(value);
      });
    });
  };

  Set.prototype.sort = function sort (comparator) {
    // Late binding
    return OrderedSet(sortFactory(this, comparator));
  };

  Set.prototype.sortBy = function sortBy (mapper, comparator) {
    // Late binding
    return OrderedSet(sortFactory(this, comparator, mapper));
  };

  Set.prototype.wasAltered = function wasAltered () {
    return this._map.wasAltered();
  };

  Set.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._map.__iterate(function (k) { return fn(k, k, this$1); }, reverse);
  };

  Set.prototype.__iterator = function __iterator (type, reverse) {
    return this._map.__iterator(type, reverse);
  };

  Set.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newMap = this._map.__ensureOwner(ownerID);
    if (!ownerID) {
      if (this.size === 0) {
        return this.__empty();
      }
      this.__ownerID = ownerID;
      this._map = newMap;
      return this;
    }
    return this.__make(newMap, ownerID);
  };

  return Set;
}(SetCollection));

function isSet(maybeSet) {
  return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
}

Set.isSet = isSet;

var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

var SetPrototype = Set.prototype;
SetPrototype[IS_SET_SENTINEL] = true;
SetPrototype[DELETE] = SetPrototype.remove;
SetPrototype.merge = SetPrototype.concat = SetPrototype.union;
SetPrototype.withMutations = withMutations;
SetPrototype.asImmutable = asImmutable;
SetPrototype['@@transducer/init'] = SetPrototype.asMutable = asMutable;
SetPrototype['@@transducer/step'] = function(result, arr) {
  return result.add(arr);
};
SetPrototype['@@transducer/result'] = function(obj) {
  return obj.asImmutable();
};

SetPrototype.__empty = emptySet;
SetPrototype.__make = makeSet;

function updateSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }
  return newMap === set._map
    ? set
    : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSet(map, ownerID) {
  var set = Object.create(SetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_SET;
function emptySet() {
  return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
}

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * Original source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var SortedSet = (function (Set$$1) {
  function SortedSet(value, comparator, options) {
    if (!comparator) {
      if (this instanceof SortedSet) {
        comparator = this._map && this.getComparator();
      }
      if (!comparator) {
        comparator = SortedSet.defaultComparator;
      }
    }
    if (!options) {
      if (this instanceof SortedSet) {
        options = this._map && this.getOptions();
      }
      if (!options) {
        options = SortedSet.defaultOptions;
      }
    }
    return value === null || value === undefined
      ? emptySortedSet(comparator, options)
      : isSortedSet(value) &&
        value.getComparator() === comparator &&
        value.getOptions() === options
        ? value
        : emptySortedSet(comparator, options).withMutations(function (set) {
            set.pack(value);
          });
  }

  if ( Set$$1 ) SortedSet.__proto__ = Set$$1;
  SortedSet.prototype = Object.create( Set$$1 && Set$$1.prototype );
  SortedSet.prototype.constructor = SortedSet;

  SortedSet.of = function of (/*...values*/) {
    return this(arguments);
  };

  SortedSet.fromKeys = function fromKeys (value) {
    return this(KeyedCollection(value).keySeq());
  };

  SortedSet.prototype.toString = function toString () {
    return this.__toString('SortedSet {', '}');
  };

  // @pragma Access

  SortedSet.prototype.getComparator = function getComparator () {
    return this._map.getComparator();
  };

  SortedSet.prototype.getOptions = function getOptions () {
    return this._map.getOptions();
  };

  // @pragma Modification

  SortedSet.prototype.pack = function pack (value) {
    var seq =
      value === undefined
        ? undefined
        : SetCollection(value)
            .toKeyedSeq()
            .mapKeys(function (k, v) { return v; });
    return updateSortedSet(this, this._map.pack(seq));
  };

  SortedSet.prototype.sort = function sort (comparator) {
    // Late binding
    return SortedSet(this, comparator, this.getOptions());
  };

  SortedSet.prototype.sortBy = function sortBy (mapper, comparator) {
    // Late binding
    return SortedSet(mapFactory(this, mapper), comparator, this.getOptions());
  };

  SortedSet.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newMap = this._map.__ensureOwner(ownerID);
    if (!ownerID) {
      if (this.size === 0) {
        return this.__empty();
      }
      this.__ownerID = ownerID;
      this._map = newMap;
      return this;
    }
    return this.__make(newMap, ownerID);
  };

  return SortedSet;
}(Set));

function isSortedSet(maybeSortedSet) {
  return isSet(maybeSortedSet) && isSorted(maybeSortedSet);
}

SortedSet.isSortedSet = isSortedSet;

SortedSet.defaultComparator = SortedMap.defaultComparator;
SortedSet.defaultOptions = SortedMap.defaultOptions;

var SortedSetPrototype = SortedSet.prototype;
SortedSetPrototype[IS_SORTED_SENTINEL] = true;

SortedSetPrototype.__empty = function() {
  return emptySortedSet(this.getComparator(), this.getOptions());
};
SortedSetPrototype.__make = makeSortedSet;

function updateSortedSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }
  return newMap === set._map
    ? set
    : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSortedSet(map, ownerID) {
  var set = Object.create(SortedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

function emptySortedSet(comparator, options) {
  return makeSortedSet(emptySortedMap(comparator, options));
}

/**
 * Returns a lazy seq of nums from start (inclusive) to end
 * (exclusive), by step, where start defaults to 0, step to 1, and end to
 * infinity. When start is equal to end, returns empty list.
 */
var Range = (function (IndexedSeq$$1) {
  function Range(start, end, step) {
    if (!(this instanceof Range)) {
      return new Range(start, end, step);
    }
    invariant(step !== 0, 'Cannot step a Range by 0');
    start = start || 0;
    if (end === undefined) {
      end = Infinity;
    }
    step = step === undefined ? 1 : Math.abs(step);
    if (end < start) {
      step = -step;
    }
    this._start = start;
    this._end = end;
    this._step = step;
    this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
    if (this.size === 0) {
      if (EMPTY_RANGE) {
        return EMPTY_RANGE;
      }
      EMPTY_RANGE = this;
    }
  }

  if ( IndexedSeq$$1 ) Range.__proto__ = IndexedSeq$$1;
  Range.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
  Range.prototype.constructor = Range;

  Range.prototype.toString = function toString () {
    if (this.size === 0) {
      return 'Range []';
    }
    return (
      'Range [ ' +
      this._start +
      '...' +
      this._end +
      (this._step !== 1 ? ' by ' + this._step : '') +
      ' ]'
    );
  };

  Range.prototype.get = function get (index, notSetValue) {
    return this.has(index)
      ? this._start + wrapIndex(this, index) * this._step
      : notSetValue;
  };

  Range.prototype.includes = function includes (searchValue) {
    var possibleIndex = (searchValue - this._start) / this._step;
    return (
      possibleIndex >= 0 &&
      possibleIndex < this.size &&
      possibleIndex === Math.floor(possibleIndex)
    );
  };

  Range.prototype.slice = function slice (begin, end) {
    if (wholeSlice(begin, end, this.size)) {
      return this;
    }
    begin = resolveBegin(begin, this.size);
    end = resolveEnd(end, this.size);
    if (end <= begin) {
      return new Range(0, 0);
    }
    return new Range(
      this.get(begin, this._end),
      this.get(end, this._end),
      this._step
    );
  };

  Range.prototype.indexOf = function indexOf (searchValue) {
    var offsetValue = searchValue - this._start;
    if (offsetValue % this._step === 0) {
      var index = offsetValue / this._step;
      if (index >= 0 && index < this.size) {
        return index;
      }
    }
    return -1;
  };

  Range.prototype.lastIndexOf = function lastIndexOf (searchValue) {
    return this.indexOf(searchValue);
  };

  Range.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var size = this.size;
    var step = this._step;
    var value = reverse ? this._start + (size - 1) * step : this._start;
    var i = 0;
    while (i !== size) {
      if (fn(value, reverse ? size - ++i : i++, this$1) === false) {
        break;
      }
      value += reverse ? -step : step;
    }
    return i;
  };

  Range.prototype.__iterator = function __iterator (type, reverse) {
    var size = this.size;
    var step = this._step;
    var value = reverse ? this._start + (size - 1) * step : this._start;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }
      var v = value;
      value += reverse ? -step : step;
      return iteratorValue(type, reverse ? size - ++i : i++, v);
    });
  };

  Range.prototype.equals = function equals (other) {
    return other instanceof Range
      ? this._start === other._start &&
          this._end === other._end &&
          this._step === other._step
      : deepEqual(this, other);
  };

  return Range;
}(IndexedSeq));

var EMPTY_RANGE;

function getIn$1(collection, searchKeyPath, notSetValue) {
  var keyPath = coerceKeyPath(searchKeyPath);
  var i = 0;
  while (i !== keyPath.length) {
    collection = get(collection, keyPath[i++], NOT_SET);
    if (collection === NOT_SET) {
      return notSetValue;
    }
  }
  return collection;
}

function getIn$$1(searchKeyPath, notSetValue) {
  return getIn$1(this, searchKeyPath, notSetValue);
}

function hasIn$1(collection, keyPath) {
  return getIn$1(collection, keyPath, NOT_SET) !== NOT_SET;
}

function hasIn$$1(searchKeyPath) {
  return hasIn$1(this, searchKeyPath);
}

function toObject() {
  assertNotInfinite(this.size);
  var object = {};
  this.__iterate(function (v, k) {
    object[k] = v;
  });
  return object;
}

// Note: all of these methods are deprecated.
Collection.isIterable = isCollection;
Collection.isKeyed = isKeyed;
Collection.isIndexed = isIndexed;
Collection.isAssociative = isAssociative;
Collection.isOrdered = isOrdered;

Collection.Iterator = Iterator;

mixin(Collection, {
  // ### Conversion to other types

  toArray: function toArray() {
    assertNotInfinite(this.size);
    var array = new Array(this.size || 0);
    var useTuples = isKeyed(this);
    var i = 0;
    this.__iterate(function (v, k) {
      // Keyed collections produce an array of tuples.
      array[i++] = useTuples ? [k, v] : v;
    });
    return array;
  },

  toIndexedSeq: function toIndexedSeq() {
    return new ToIndexedSequence(this);
  },

  toJS: function toJS$1() {
    return toJS(this);
  },

  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, true);
  },

  toMap: function toMap() {
    // Use Late Binding here to solve the circular dependency.
    return Map(this.toKeyedSeq());
  },

  toObject: toObject,

  toOrderedMap: function toOrderedMap() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedMap(this.toKeyedSeq());
  },

  toSortedMap: function toSortedMap(comparator, options) {
    // Use Late Binding here to solve the circular dependency.
    return SortedMap(this.toKeyedSeq(), comparator, options);
  },

  toSortedSet: function toSortedSet(comparator, options) {
    // Use Late Binding here to solve the circular dependency.
    return SortedSet(
      isKeyed(this) ? this.valueSeq() : this,
      comparator,
      options
    );
  },

  toOrderedSet: function toOrderedSet() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
  },

  toSet: function toSet() {
    // Use Late Binding here to solve the circular dependency.
    return Set(isKeyed(this) ? this.valueSeq() : this);
  },

  toSetSeq: function toSetSeq() {
    return new ToSetSequence(this);
  },

  toSeq: function toSeq() {
    return isIndexed(this)
      ? this.toIndexedSeq()
      : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
  },

  toStack: function toStack() {
    // Use Late Binding here to solve the circular dependency.
    return Stack(isKeyed(this) ? this.valueSeq() : this);
  },

  toList: function toList() {
    // Use Late Binding here to solve the circular dependency.
    return List(isKeyed(this) ? this.valueSeq() : this);
  },

  // ### Common JavaScript methods and properties

  toString: function toString() {
    return '[Collection]';
  },

  __toString: function __toString(head, tail) {
    if (this.size === 0) {
      return head + tail;
    }
    return (
      head +
      ' ' +
      this.toSeq()
        .map(this.__toStringMapper)
        .join(', ') +
      ' ' +
      tail
    );
  },

  // ### ES6 Collection methods (ES6 Array and Map)

  concat: function concat() {
    var values = [], len = arguments.length;
    while ( len-- ) values[ len ] = arguments[ len ];

    return reify(this, concatFactory(this, values));
  },

  includes: function includes(searchValue) {
    return this.some(function (value) { return is(value, searchValue); });
  },

  entries: function entries() {
    return this.__iterator(ITERATE_ENTRIES);
  },

  every: function every(predicate, context) {
    assertNotInfinite(this.size);
    var returnValue = true;
    this.__iterate(function (v, k, c) {
      if (!predicate.call(context, v, k, c)) {
        returnValue = false;
        return false;
      }
    });
    return returnValue;
  },

  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, true));
  },

  find: function find(predicate, context, notSetValue) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[1] : notSetValue;
  },

  forEach: function forEach(sideEffect, context) {
    assertNotInfinite(this.size);
    return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
  },

  join: function join(separator) {
    assertNotInfinite(this.size);
    separator = separator !== undefined ? '' + separator : ',';
    var joined = '';
    var isFirst = true;
    this.__iterate(function (v) {
      isFirst ? (isFirst = false) : (joined += separator);
      joined += v !== null && v !== undefined ? v.toString() : '';
    });
    return joined;
  },

  keys: function keys() {
    return this.__iterator(ITERATE_KEYS);
  },

  map: function map(mapper, context) {
    return reify(this, mapFactory(this, mapper, context));
  },

  reduce: function reduce$1(reducer, initialReduction, context) {
    return reduce(
      this,
      reducer,
      initialReduction,
      context,
      arguments.length < 2,
      false
    );
  },

  reduceRight: function reduceRight(reducer, initialReduction, context) {
    return reduce(
      this,
      reducer,
      initialReduction,
      context,
      arguments.length < 2,
      true
    );
  },

  reverse: function reverse() {
    return reify(this, reverseFactory(this, true));
  },

  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, true));
  },

  some: function some(predicate, context) {
    return !this.every(not(predicate), context);
  },

  sort: function sort(comparator) {
    return reify(this, sortFactory(this, comparator));
  },

  partialSort: function partialSort(n, comparator) {
    return reify(this, partialSortFactory(this, n, comparator));
  },

  incSort: function incSort(comparator) {
    return reify(this, incSortFactory(this, comparator, null, true));
  },

  values: function values() {
    return this.__iterator(ITERATE_VALUES);
  },

  // ### More sequential methods

  butLast: function butLast() {
    return this.slice(0, -1);
  },

  isEmpty: function isEmpty() {
    return this.size !== undefined ? this.size === 0 : !this.some(function () { return true; });
  },

  count: function count(predicate, context) {
    return ensureSize(
      predicate ? this.toSeq().filter(predicate, context) : this
    );
  },

  countBy: function countBy(grouper, context) {
    return countByFactory(this, grouper, context);
  },

  equals: function equals(other) {
    return deepEqual(this, other);
  },

  entrySeq: function entrySeq() {
    var collection = this;
    if (collection._cache) {
      // We cache as an entries array, so we can just return the cache!
      return new ArraySeq(collection._cache);
    }
    var entriesSequence = collection
      .toSeq()
      .map(entryMapper)
      .toIndexedSeq();
    entriesSequence.fromEntrySeq = function () { return collection.toSeq(); };
    return entriesSequence;
  },

  filterNot: function filterNot(predicate, context) {
    return this.filter(not(predicate), context);
  },

  findEntry: function findEntry(predicate, context, notSetValue) {
    var found = notSetValue;
    this.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        found = [k, v];
        return false;
      }
    });
    return found;
  },

  findKey: function findKey(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry && entry[0];
  },

  findLast: function findLast(predicate, context, notSetValue) {
    return this.toKeyedSeq()
      .reverse()
      .find(predicate, context, notSetValue);
  },

  findLastEntry: function findLastEntry(predicate, context, notSetValue) {
    return this.toKeyedSeq()
      .reverse()
      .findEntry(predicate, context, notSetValue);
  },

  findLastKey: function findLastKey(predicate, context) {
    return this.toKeyedSeq()
      .reverse()
      .findKey(predicate, context);
  },

  first: function first() {
    return this.find(returnTrue);
  },

  flatMap: function flatMap(mapper, context) {
    return reify(this, flatMapFactory(this, mapper, context));
  },

  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, true));
  },

  fromEntrySeq: function fromEntrySeq() {
    return new FromEntriesSequence(this);
  },

  get: function get(searchKey, notSetValue) {
    return this.find(function (_, key) { return is(key, searchKey); }, undefined, notSetValue);
  },

  getIn: getIn$$1,

  groupBy: function groupBy(grouper, context) {
    return groupByFactory(this, grouper, context);
  },

  has: function has(searchKey) {
    return this.get(searchKey, NOT_SET) !== NOT_SET;
  },

  hasIn: hasIn$$1,

  isSubset: function isSubset(iter) {
    iter = typeof iter.includes === 'function' ? iter : Collection(iter);
    return this.every(function (value) { return iter.includes(value); });
  },

  isSuperset: function isSuperset(iter) {
    iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
    return iter.isSubset(this);
  },

  keyOf: function keyOf(searchValue) {
    return this.findKey(function (value) { return is(value, searchValue); });
  },

  keySeq: function keySeq() {
    return this.toSeq()
      .map(keyMapper)
      .toIndexedSeq();
  },

  last: function last() {
    return this.toSeq()
      .reverse()
      .first();
  },

  lastKeyOf: function lastKeyOf(searchValue) {
    return this.toKeyedSeq()
      .reverse()
      .keyOf(searchValue);
  },

  max: function max(comparator) {
    return maxFactory(this, comparator);
  },

  maxBy: function maxBy(mapper, comparator) {
    return maxFactory(this, comparator, mapper);
  },

  min: function min(comparator) {
    return maxFactory(
      this,
      comparator ? neg(comparator) : defaultNegComparator
    );
  },

  minBy: function minBy(mapper, comparator) {
    return maxFactory(
      this,
      comparator ? neg(comparator) : defaultNegComparator,
      mapper
    );
  },

  rest: function rest() {
    return this.slice(1);
  },

  skip: function skip(amount) {
    return amount === 0 ? this : this.slice(Math.max(0, amount));
  },

  skipLast: function skipLast(amount) {
    return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
  },

  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, true));
  },

  skipUntil: function skipUntil(predicate, context) {
    return this.skipWhile(not(predicate), context);
  },

  sortBy: function sortBy(mapper, comparator) {
    return reify(this, sortFactory(this, comparator, mapper));
  },

  partialSortBy: function partialSortBy(n, mapper, comparator) {
    return reify(this, partialSortFactory(this, n, comparator, mapper));
  },

  incSortBy: function incSortBy(mapper, comparator) {
    return reify(this, incSortFactory(this, comparator, mapper, true));
  },

  take: function take(amount) {
    return this.slice(0, Math.max(0, amount));
  },

  takeLast: function takeLast(amount) {
    return this.slice(-Math.max(0, amount));
  },

  takeWhile: function takeWhile(predicate, context) {
    return reify(this, takeWhileFactory(this, predicate, context));
  },

  takeUntil: function takeUntil(predicate, context) {
    return this.takeWhile(not(predicate), context);
  },

  update: function update(fn) {
    return fn(this);
  },

  valueSeq: function valueSeq() {
    return this.toIndexedSeq();
  },

  // ### Hashable Object

  hashCode: function hashCode() {
    return this.__hash || (this.__hash = hashCollection(this));
  }

  // ### Internal

  // abstract __iterate(fn, reverse)

  // abstract __iterator(type, reverse)
});

var CollectionPrototype = Collection.prototype;
CollectionPrototype[IS_ITERABLE_SENTINEL] = true;
CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
CollectionPrototype.toJSON = CollectionPrototype.toArray;
CollectionPrototype.__toStringMapper = quoteString;
CollectionPrototype.inspect = CollectionPrototype.toSource = function() {
  return this.toString();
};
CollectionPrototype.chain = CollectionPrototype.flatMap;
CollectionPrototype.contains = CollectionPrototype.includes;

mixin(KeyedCollection, {
  // ### More sequential methods

  flip: function flip() {
    return reify(this, flipFactory(this));
  },

  mapEntries: function mapEntries(mapper, context) {
    var this$1 = this;

    var iterations = 0;
    return reify(
      this,
      this.toSeq()
        .map(function (v, k) { return mapper.call(context, [k, v], iterations++, this$1); })
        .fromEntrySeq()
    );
  },

  mapKeys: function mapKeys(mapper, context) {
    var this$1 = this;

    return reify(
      this,
      this.toSeq()
        .flip()
        .map(function (k, v) { return mapper.call(context, k, v, this$1); })
        .flip()
    );
  }
});

var KeyedCollectionPrototype = KeyedCollection.prototype;
KeyedCollectionPrototype[IS_KEYED_SENTINEL] = true;
KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
KeyedCollectionPrototype.toJSON = toObject;
KeyedCollectionPrototype.__toStringMapper = function (v, k) { return quoteString(k) + ': ' + quoteString(v); };

mixin(IndexedCollection, {
  // ### Conversion to other types

  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, false);
  },

  // ### ES6 Collection methods (ES6 Array and Map)

  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, false));
  },

  findIndex: function findIndex(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[0] : -1;
  },

  indexOf: function indexOf(searchValue) {
    var key = this.keyOf(searchValue);
    return key === undefined ? -1 : key;
  },

  lastIndexOf: function lastIndexOf(searchValue) {
    var key = this.lastKeyOf(searchValue);
    return key === undefined ? -1 : key;
  },

  reverse: function reverse() {
    return reify(this, reverseFactory(this, false));
  },

  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, false));
  },

  splice: function splice(index, removeNum /*, ...values*/) {
    var numArgs = arguments.length;
    removeNum = Math.max(removeNum || 0, 0);
    if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
      return this;
    }
    // If index is negative, it should resolve relative to the size of the
    // collection. However size may be expensive to compute if not cached, so
    // only call count() if the number is in fact negative.
    index = resolveBegin(index, index < 0 ? this.count() : this.size);
    var spliced = this.slice(0, index);
    return reify(
      this,
      numArgs === 1
        ? spliced
        : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
    );
  },

  // ### More collection methods

  findLastIndex: function findLastIndex(predicate, context) {
    var entry = this.findLastEntry(predicate, context);
    return entry ? entry[0] : -1;
  },

  first: function first() {
    return this.get(0);
  },

  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, false));
  },

  get: function get(index, notSetValue) {
    index = wrapIndex(this, index);
    return index < 0 ||
      (this.size === Infinity || (this.size !== undefined && index > this.size))
      ? notSetValue
      : this.find(function (_, key) { return key === index; }, undefined, notSetValue);
  },

  has: function has(index) {
    index = wrapIndex(this, index);
    return (
      index >= 0 &&
      (this.size !== undefined
        ? this.size === Infinity || index < this.size
        : this.indexOf(index) !== -1)
    );
  },

  interpose: function interpose(separator) {
    return reify(this, interposeFactory(this, separator));
  },

  interleave: function interleave(/*...collections*/) {
    var collections = [this].concat(arrCopy(arguments));
    var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
    var interleaved = zipped.flatten(true);
    if (zipped.size) {
      interleaved.size = zipped.size * collections.length;
    }
    return reify(this, interleaved);
  },

  keySeq: function keySeq() {
    return Range(0, this.size);
  },

  last: function last() {
    return this.get(-1);
  },

  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, false));
  },

  incSort: function incSort(comparator) {
    return reify(this, incSortFactory(this, comparator, null, false));
  },

  incSortBy: function incSortBy(mapper, comparator) {
    return reify(this, incSortFactory(this, comparator, mapper, false));
  },

  zip: function zip(/*, ...collections */) {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections));
  },

  zipAll: function zipAll(/*, ...collections */) {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections, true));
  },

  zipWith: function zipWith(zipper /*, ...collections */) {
    var collections = arrCopy(arguments);
    collections[0] = this;
    return reify(this, zipWithFactory(this, zipper, collections));
  }
});

var IndexedCollectionPrototype = IndexedCollection.prototype;
IndexedCollectionPrototype[IS_INDEXED_SENTINEL] = true;
IndexedCollectionPrototype[IS_ORDERED_SENTINEL] = true;

mixin(SetCollection, {
  // ### ES6 Collection methods (ES6 Array and Map)

  get: function get(value, notSetValue) {
    return this.has(value) ? value : notSetValue;
  },

  includes: function includes(value) {
    return this.has(value);
  },

  // ### More sequential methods

  keySeq: function keySeq() {
    return this.valueSeq();
  }
});

SetCollection.prototype.has = CollectionPrototype.includes;
SetCollection.prototype.contains = SetCollection.prototype.includes;

// Mixin subclasses

mixin(KeyedSeq, KeyedCollection.prototype);
mixin(IndexedSeq, IndexedCollection.prototype);
mixin(SetSeq, SetCollection.prototype);

// #pragma Helper functions

function reduce(collection, reducer, reduction, context, useFirst, reverse) {
  assertNotInfinite(collection.size);
  collection.__iterate(function (v, k, c) {
    if (useFirst) {
      useFirst = false;
      reduction = v;
    } else {
      reduction = reducer.call(context, reduction, v, k, c);
    }
  }, reverse);
  return reduction;
}

function keyMapper(v, k) {
  return k;
}

function entryMapper(v, k) {
  return [k, v];
}

function not(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}

function neg(predicate) {
  return function() {
    return -predicate.apply(this, arguments);
  };
}

function defaultZipper() {
  return arrCopy(arguments);
}

function defaultNegComparator(a, b) {
  return a < b ? 1 : a > b ? -1 : 0;
}

function hashCollection(collection) {
  if (collection.size === Infinity) {
    return 0;
  }
  var ordered = isOrdered(collection);
  var keyed = isKeyed(collection);
  var h = ordered ? 1 : 0;
  var size = collection.__iterate(
    keyed
      ? ordered
        ? function (v, k) {
            h = (31 * h + hashMerge(hash(v), hash(k))) | 0;
          }
        : function (v, k) {
            h = (h + hashMerge(hash(v), hash(k))) | 0;
          }
      : ordered
        ? function (v) {
            h = (31 * h + hash(v)) | 0;
          }
        : function (v) {
            h = (h + hash(v)) | 0;
          }
  );
  return murmurHashOfSize(size, h);
}

function murmurHashOfSize(size, h) {
  h = imul(h, 0xcc9e2d51);
  h = imul((h << 15) | (h >>> -15), 0x1b873593);
  h = imul((h << 13) | (h >>> -13), 5);
  h = ((h + 0xe6546b64) | 0) ^ size;
  h = imul(h ^ (h >>> 16), 0x85ebca6b);
  h = imul(h ^ (h >>> 13), 0xc2b2ae35);
  h = smi(h ^ (h >>> 16));
  return h;
}

function hashMerge(a, b) {
  return (a ^ (b + 0x9e3779b9 + (a << 6) + (a >> 2))) | 0; // int
}

var OrderedSet = (function (Set$$1) {
  function OrderedSet(value) {
    return value === null || value === undefined
      ? emptyOrderedSet()
      : isOrderedSet(value)
        ? value
        : emptyOrderedSet().withMutations(function (set) {
            var iter = SetCollection(value);
            assertNotInfinite(iter.size);
            iter.forEach(function (v) { return set.add(v); });
          });
  }

  if ( Set$$1 ) OrderedSet.__proto__ = Set$$1;
  OrderedSet.prototype = Object.create( Set$$1 && Set$$1.prototype );
  OrderedSet.prototype.constructor = OrderedSet;

  OrderedSet.of = function of (/*...values*/) {
    return this(arguments);
  };

  OrderedSet.fromKeys = function fromKeys (value) {
    return this(KeyedCollection(value).keySeq());
  };

  OrderedSet.prototype.toString = function toString () {
    return this.__toString('OrderedSet {', '}');
  };

  return OrderedSet;
}(Set));

function isOrderedSet(maybeOrderedSet) {
  return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
}

OrderedSet.isOrderedSet = isOrderedSet;

var OrderedSetPrototype = OrderedSet.prototype;
OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;

OrderedSetPrototype.__empty = emptyOrderedSet;
OrderedSetPrototype.__make = makeOrderedSet;

function makeOrderedSet(map, ownerID) {
  var set = Object.create(OrderedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_ORDERED_SET;
function emptyOrderedSet() {
  return (
    EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()))
  );
}

var Record = function Record(defaultValues, name) {
  var hasInitialized;

  var RecordType = function Record(values) {
    var this$1 = this;

    if (values instanceof RecordType) {
      return values;
    }
    if (!(this instanceof RecordType)) {
      return new RecordType(values);
    }
    if (!hasInitialized) {
      hasInitialized = true;
      var keys = Object.keys(defaultValues);
      var indices = (RecordTypePrototype._indices = {});
      RecordTypePrototype._name = name;
      RecordTypePrototype._keys = keys;
      RecordTypePrototype._defaultValues = defaultValues;
      for (var i = 0; i < keys.length; i++) {
        var propName = keys[i];
        indices[propName] = i;
        if (RecordTypePrototype[propName]) {
          /* eslint-disable no-console */
          typeof console === 'object' &&
            console.warn &&
            console.warn(
              'Cannot define ' +
                recordName(this$1) +
                ' with property "' +
                propName +
                '" since that property name is part of the Record API.'
            );
          /* eslint-enable no-console */
        } else {
          setProp(RecordTypePrototype, propName);
        }
      }
    }
    this.__ownerID = undefined;
    this._values = List().withMutations(function (l) {
      l.setSize(this$1._keys.length);
      KeyedCollection(values).forEach(function (v, k) {
        l.set(this$1._indices[k], v === this$1._defaultValues[k] ? undefined : v);
      });
    });
  };

  var RecordTypePrototype = (RecordType.prototype = Object.create(
    RecordPrototype
  ));
  RecordTypePrototype.constructor = RecordType;

  return RecordType;
};

Record.prototype.toString = function toString () {
    var this$1 = this;

  var str = recordName(this) + ' { ';
  var keys = this._keys;
  var k;
  for (var i = 0, l = keys.length; i !== l; i++) {
    k = keys[i];
    str += (i ? ', ' : '') + k + ': ' + quoteString(this$1.get(k));
  }
  return str + ' }';
};

Record.prototype.equals = function equals (other) {
  return (
    this === other ||
    (other &&
      this._keys === other._keys &&
      recordSeq(this).equals(recordSeq(other)))
  );
};

Record.prototype.hashCode = function hashCode () {
  return recordSeq(this).hashCode();
};

// @pragma Access

Record.prototype.has = function has (k) {
  return this._indices.hasOwnProperty(k);
};

Record.prototype.get = function get (k, notSetValue) {
  if (!this.has(k)) {
    return notSetValue;
  }
  var index = this._indices[k];
  var value = this._values.get(index);
  return value === undefined ? this._defaultValues[k] : value;
};

// @pragma Modification

Record.prototype.set = function set (k, v) {
  if (this.has(k)) {
    var newValues = this._values.set(
      this._indices[k],
      v === this._defaultValues[k] ? undefined : v
    );
    if (newValues !== this._values && !this.__ownerID) {
      return makeRecord(this, newValues);
    }
  }
  return this;
};

Record.prototype.remove = function remove (k) {
  return this.set(k);
};

Record.prototype.clear = function clear () {
  var newValues = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : makeRecord(this, newValues);
};

Record.prototype.wasAltered = function wasAltered () {
  return this._values.wasAltered();
};

Record.prototype.toSeq = function toSeq () {
  return recordSeq(this);
};

Record.prototype.toJS = function toJS$1 () {
  return toJS(this);
};

Record.prototype.entries = function entries () {
  return this.__iterator(ITERATE_ENTRIES);
};

Record.prototype.__iterator = function __iterator (type, reverse) {
  return recordSeq(this).__iterator(type, reverse);
};

Record.prototype.__iterate = function __iterate (fn, reverse) {
  return recordSeq(this).__iterate(fn, reverse);
};

Record.prototype.__ensureOwner = function __ensureOwner (ownerID) {
  if (ownerID === this.__ownerID) {
    return this;
  }
  var newValues = this._values.__ensureOwner(ownerID);
  if (!ownerID) {
    this.__ownerID = ownerID;
    this._values = newValues;
    return this;
  }
  return makeRecord(this, newValues, ownerID);
};

Record.isRecord = isRecord;
Record.getDescriptiveName = recordName;
var RecordPrototype = Record.prototype;
RecordPrototype[IS_RECORD_SENTINEL] = true;
RecordPrototype[DELETE] = RecordPrototype.remove;
RecordPrototype.deleteIn = RecordPrototype.removeIn = deleteIn;
RecordPrototype.getIn = getIn$$1;
RecordPrototype.hasIn = CollectionPrototype.hasIn;
RecordPrototype.merge = merge;
RecordPrototype.mergeWith = mergeWith;
RecordPrototype.mergeIn = mergeIn;
RecordPrototype.mergeDeep = mergeDeep;
RecordPrototype.mergeDeepWith = mergeDeepWith;
RecordPrototype.mergeDeepIn = mergeDeepIn;
RecordPrototype.setIn = setIn$$1;
RecordPrototype.update = update$$1;
RecordPrototype.updateIn = updateIn$1;
RecordPrototype.withMutations = withMutations;
RecordPrototype.asMutable = asMutable;
RecordPrototype.asImmutable = asImmutable;
RecordPrototype[ITERATOR_SYMBOL] = RecordPrototype.entries;
RecordPrototype.toJSON = RecordPrototype.toObject =
  CollectionPrototype.toObject;
RecordPrototype.inspect = RecordPrototype.toSource = function() {
  return this.toString();
};

function makeRecord(likeRecord, values, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._values = values;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record._name || record.constructor.name || 'Record';
}

function recordSeq(record) {
  return keyedSeqFromValue(record._keys.map(function (k) { return [k, record.get(k)]; }));
}

function setProp(prototype, name) {
  try {
    Object.defineProperty(prototype, name, {
      get: function() {
        return this.get(name);
      },
      set: function(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  } catch (error) {
    // Object.defineProperty failed. Probably IE8.
  }
}

/**
 * Returns a lazy Seq of `value` repeated `times` times. When `times` is
 * undefined, returns an infinite sequence of `value`.
 */
var Repeat = (function (IndexedSeq$$1) {
  function Repeat(value, times) {
    if (!(this instanceof Repeat)) {
      return new Repeat(value, times);
    }
    this._value = value;
    this.size = times === undefined ? Infinity : Math.max(0, times);
    if (this.size === 0) {
      if (EMPTY_REPEAT) {
        return EMPTY_REPEAT;
      }
      EMPTY_REPEAT = this;
    }
  }

  if ( IndexedSeq$$1 ) Repeat.__proto__ = IndexedSeq$$1;
  Repeat.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
  Repeat.prototype.constructor = Repeat;

  Repeat.prototype.toString = function toString () {
    if (this.size === 0) {
      return 'Repeat []';
    }
    return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
  };

  Repeat.prototype.get = function get (index, notSetValue) {
    return this.has(index) ? this._value : notSetValue;
  };

  Repeat.prototype.includes = function includes (searchValue) {
    return is(this._value, searchValue);
  };

  Repeat.prototype.slice = function slice (begin, end) {
    var size = this.size;
    return wholeSlice(begin, end, size)
      ? this
      : new Repeat(
          this._value,
          resolveEnd(end, size) - resolveBegin(begin, size)
        );
  };

  Repeat.prototype.reverse = function reverse () {
    return this;
  };

  Repeat.prototype.indexOf = function indexOf (searchValue) {
    if (is(this._value, searchValue)) {
      return 0;
    }
    return -1;
  };

  Repeat.prototype.lastIndexOf = function lastIndexOf (searchValue) {
    if (is(this._value, searchValue)) {
      return this.size;
    }
    return -1;
  };

  Repeat.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var size = this.size;
    var i = 0;
    while (i !== size) {
      if (fn(this$1._value, reverse ? size - ++i : i++, this$1) === false) {
        break;
      }
    }
    return i;
  };

  Repeat.prototype.__iterator = function __iterator (type, reverse) {
    var this$1 = this;

    var size = this.size;
    var i = 0;
    return new Iterator(
      function () { return i === size
          ? iteratorDone()
          : iteratorValue(type, reverse ? size - ++i : i++, this$1._value); }
    );
  };

  Repeat.prototype.equals = function equals (other) {
    return other instanceof Repeat
      ? is(this._value, other._value)
      : deepEqual(other);
  };

  return Repeat;
}(IndexedSeq));

var EMPTY_REPEAT;

function fromJS(value, converter) {
  return fromJSWith(
    [],
    converter || defaultConverter,
    value,
    '',
    converter && converter.length > 2 ? [] : undefined,
    { '': value }
  );
}

function fromJSWith(stack, converter, value, key, keyPath, parentValue) {
  var toSeq = Array.isArray(value)
    ? IndexedSeq
    : isPlainObj(value) ? KeyedSeq : null;
  if (toSeq) {
    if (~stack.indexOf(value)) {
      throw new TypeError('Cannot convert circular structure to Immutable');
    }
    stack.push(value);
    keyPath && key !== '' && keyPath.push(key);
    var converted = converter.call(
      parentValue,
      key,
      toSeq(value).map(function (v, k) { return fromJSWith(stack, converter, v, k, keyPath, value); }
      ),
      keyPath && keyPath.slice()
    );
    stack.pop();
    keyPath && keyPath.pop();
    return converted;
  }
  return value;
}

function defaultConverter(k, v) {
  return isKeyed(v) ? v.toMap() : v.toList();
}

var version = "0.2.5";

// Functional read/write API
var Immutable = {
  version: version,

  Collection: Collection,
  // Note: Iterable is deprecated
  Iterable: Collection,

  Seq: Seq,
  Map: Map,
  OrderedMap: OrderedMap,
  SortedMap: SortedMap,
  List: List,
  Stack: Stack,
  Set: Set,
  OrderedSet: OrderedSet,
  SortedSet: SortedSet,

  Record: Record,
  Range: Range,
  Repeat: Repeat,

  is: is,
  fromJS: fromJS,
  hash: hash,

  isImmutable: isImmutable,
  isCollection: isCollection,
  isKeyed: isKeyed,
  isIndexed: isIndexed,
  isAssociative: isAssociative,
  isOrdered: isOrdered,
  isSorted: isSorted,
  isValueObject: isValueObject,

  get: get,
  getIn: getIn$1,
  has: has,
  hasIn: hasIn$1,
  merge: merge$1,
  mergeDeep: mergeDeep$1,
  mergeWith: mergeWith$1,
  mergeDeepWith: mergeDeepWith$1,
  remove: remove,
  removeIn: removeIn,
  set: set,
  setIn: setIn$1,
  update: update$1,
  updateIn: updateIn
};

// Note: Iterable is deprecated
var Iterable = Collection;

exports['default'] = Immutable;
exports.version = version;
exports.Collection = Collection;
exports.Iterable = Iterable;
exports.Seq = Seq;
exports.Map = Map;
exports.OrderedMap = OrderedMap;
exports.SortedMap = SortedMap;
exports.List = List;
exports.Stack = Stack;
exports.Set = Set;
exports.OrderedSet = OrderedSet;
exports.SortedSet = SortedSet;
exports.Record = Record;
exports.Range = Range;
exports.Repeat = Repeat;
exports.is = is;
exports.fromJS = fromJS;
exports.hash = hash;
exports.isImmutable = isImmutable;
exports.isCollection = isCollection;
exports.isKeyed = isKeyed;
exports.isIndexed = isIndexed;
exports.isAssociative = isAssociative;
exports.isOrdered = isOrdered;
exports.isSorted = isSorted;
exports.isValueObject = isValueObject;
exports.get = get;
exports.getIn = getIn$1;
exports.has = has;
exports.hasIn = hasIn$1;
exports.merge = merge$1;
exports.mergeDeep = mergeDeep$1;
exports.mergeWith = mergeWith$1;
exports.mergeDeepWith = mergeDeepWith$1;
exports.remove = remove;
exports.removeIn = removeIn;
exports.set = set;
exports.setIn = setIn$1;
exports.update = update$1;
exports.updateIn = updateIn;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require('_process'))
},{"_process":12}],12:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Seqen = function () {
  function Seqen(recipe) {
    _classCallCheck(this, Seqen);

    this.recipe = recipe;
  }

  _createClass(Seqen, [{
    key: 'process',
    value: function process(collection, props) {
      return this.recipe(collection.toKeyedSeq(), props);
    }
  }]);

  return Seqen;
}();

exports.default = Seqen;
},{"immutable-sorted":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Seqen = undefined;

var _Seqen = require('./Seqen');

var _Seqen2 = _interopRequireDefault(_Seqen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Seqen = _Seqen2.default; /**
                                  *  Copyright (c) 2017, Applitopia, Inc.
                                  *  All rights reserved.
                                  *
                                  *  This source code is licensed under the MIT-style license found in the
                                  *  LICENSE file in the root directory of this source tree.
                                  *
                                  *  
                                  */

exports.default = {
  Seqen: _Seqen2.default
};
},{"./Seqen":13}],15:[function(require,module,exports){
(function (process){
/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Immutable = global.Immutable || {})));
}(this, (function (exports) { 'use strict';

// Used for setting prototype methods that IE8 chokes on.
var DELETE = 'delete';

// Constants describing the size of trie nodes.
var SHIFT = 5; // Resulted in best performance after ______?
var SIZE = 1 << SHIFT;
var MASK = SIZE - 1;

// A consistent shared value representing "not set" which equals nothing other
// than itself, and nothing that could be provided externally.
var NOT_SET = {};

// Boolean references, Rough equivalent of `bool &`.
var CHANGE_LENGTH = { value: false };
var DID_ALTER = { value: false };
var DID_MATCH = { value: false };

function MakeRef(ref) {
  ref.value = false;
  return ref;
}

function SetRef(ref) {
  ref && (ref.value = true);
}

function GetRef(ref) {
  return ref.value;
}

// A function which returns a value representing an "owner" for transient writes
// to tries. The return value will only ever equal itself, and will not equal
// the return of any subsequent call of this function.
function OwnerID() {}

// http://jsperf.com/copy-array-inline
function arrCopy(arr, offset) {
  offset = offset || 0;
  var len = Math.max(0, arr.length - offset);
  var newArr = new Array(len);
  for (var ii = 0; ii < len; ii++) {
    newArr[ii] = arr[ii + offset];
  }
  return newArr;
}

function ensureSize(iter) {
  if (iter.size === undefined) {
    iter.size = iter.__iterate(returnTrue);
  }
  return iter.size;
}

function wrapIndex(iter, index) {
  // This implements "is array index" which the ECMAString spec defines as:
  //
  //     A String property name P is an array index if and only if
  //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
  //     to 2^32−1.
  //
  // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
  if (typeof index !== 'number') {
    var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
    if ('' + uint32Index !== index || uint32Index === 4294967295) {
      return NaN;
    }
    index = uint32Index;
  }
  return index < 0 ? ensureSize(iter) + index : index;
}

function returnTrue() {
  return true;
}

function wholeSlice(begin, end, size) {
  return (begin === 0 || (size !== undefined && begin <= -size)) &&
    (end === undefined || (size !== undefined && end >= size));
}

function resolveBegin(begin, size) {
  return resolveIndex(begin, size, 0);
}

function resolveEnd(end, size) {
  return resolveIndex(end, size, size);
}

function resolveIndex(index, size, defaultIndex) {
  // Sanitize indices using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  return index === undefined
    ? defaultIndex
    : index < 0
        ? size === Infinity ? size : Math.max(0, size + index) | 0
        : size === undefined || size === index
            ? index
            : Math.min(size, index) | 0;
}

function isImmutable(maybeImmutable) {
  return (isCollection(maybeImmutable) || isRecord(maybeImmutable)) &&
    !maybeImmutable.__ownerID;
}

function isCollection(maybeCollection) {
  return !!(maybeCollection && maybeCollection[IS_ITERABLE_SENTINEL]);
}

function isKeyed(maybeKeyed) {
  return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
}

function isIndexed(maybeIndexed) {
  return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
}

function isAssociative(maybeAssociative) {
  return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
}

function isOrdered(maybeOrdered) {
  return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
}

function isRecord(maybeRecord) {
  return !!(maybeRecord && maybeRecord[IS_RECORD_SENTINEL]);
}

function isValueObject(maybeValue) {
  return !!(maybeValue &&
    typeof maybeValue.equals === 'function' &&
    typeof maybeValue.hashCode === 'function');
}

function isSorted(maybeSorted) {
  return !!(maybeSorted && maybeSorted[IS_SORTED_SENTINEL]);
}

var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
var IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@';
var IS_SORTED_SENTINEL = '@@__IMMUTABLE_SORTED__@@';

var Collection = function Collection(value) {
  return isCollection(value) ? value : Seq(value);
};

var KeyedCollection = (function (Collection) {
  function KeyedCollection(value) {
    return isKeyed(value) ? value : KeyedSeq(value);
  }

  if ( Collection ) KeyedCollection.__proto__ = Collection;
  KeyedCollection.prototype = Object.create( Collection && Collection.prototype );
  KeyedCollection.prototype.constructor = KeyedCollection;

  return KeyedCollection;
}(Collection));

var IndexedCollection = (function (Collection) {
  function IndexedCollection(value) {
    return isIndexed(value) ? value : IndexedSeq(value);
  }

  if ( Collection ) IndexedCollection.__proto__ = Collection;
  IndexedCollection.prototype = Object.create( Collection && Collection.prototype );
  IndexedCollection.prototype.constructor = IndexedCollection;

  return IndexedCollection;
}(Collection));

var SetCollection = (function (Collection) {
  function SetCollection(value) {
    return isCollection(value) && !isAssociative(value) ? value : SetSeq(value);
  }

  if ( Collection ) SetCollection.__proto__ = Collection;
  SetCollection.prototype = Object.create( Collection && Collection.prototype );
  SetCollection.prototype.constructor = SetCollection;

  return SetCollection;
}(Collection));

Collection.Keyed = KeyedCollection;
Collection.Indexed = IndexedCollection;
Collection.Set = SetCollection;

var ITERATE_KEYS = 0;
var ITERATE_VALUES = 1;
var ITERATE_ENTRIES = 2;

var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

var Iterator = function Iterator(next) {
  this.next = next;
};

Iterator.prototype.toString = function toString () {
  return '[Iterator]';
};

Iterator.KEYS = ITERATE_KEYS;
Iterator.VALUES = ITERATE_VALUES;
Iterator.ENTRIES = ITERATE_ENTRIES;

Iterator.prototype.inspect = (Iterator.prototype.toSource = function() {
  return this.toString();
});
Iterator.prototype[ITERATOR_SYMBOL] = function() {
  return this;
};

function iteratorValue(type, k, v, iteratorResult) {
  var value = type === 0 ? k : type === 1 ? v : [k, v];
  iteratorResult
    ? (iteratorResult.value = value)
    : (iteratorResult = {
        value: value,
        done: false
      });
  return iteratorResult;
}

function iteratorDone() {
  return { value: undefined, done: true };
}

function hasIterator(maybeIterable) {
  return !!getIteratorFn(maybeIterable);
}

function isIterator(maybeIterator) {
  return maybeIterator && typeof maybeIterator.next === 'function';
}

function getIterator(iterable) {
  var iteratorFn = getIteratorFn(iterable);
  return iteratorFn && iteratorFn.call(iterable);
}

function getIteratorFn(iterable) {
  var iteratorFn = iterable &&
    ((REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

function isArrayLike(value) {
  return value && typeof value.length === 'number';
}

var Seq = (function (Collection$$1) {
  function Seq(value) {
    return value === null || value === undefined
      ? emptySequence()
      : isCollection(value) || isRecord(value)
          ? value.toSeq()
          : seqFromValue(value);
  }

  if ( Collection$$1 ) Seq.__proto__ = Collection$$1;
  Seq.prototype = Object.create( Collection$$1 && Collection$$1.prototype );
  Seq.prototype.constructor = Seq;

  Seq.of = function of (/*...values*/) {
    return Seq(arguments);
  };

  Seq.prototype.toSeq = function toSeq () {
    return this;
  };

  Seq.prototype.toString = function toString () {
    return this.__toString('Seq {', '}');
  };

  Seq.prototype.cacheResult = function cacheResult () {
    if (!this._cache && this.__iterateUncached) {
      this._cache = this.entrySeq().toArray();
      this.size = this._cache.length;
    }
    return this;
  };

  // abstract __iterateUncached(fn, reverse)

  Seq.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var cache = this._cache;
    if (cache) {
      var size = cache.length;
      var i = 0;
      while (i !== size) {
        var entry = cache[reverse ? size - ++i : i++];
        if (fn(entry[1], entry[0], this$1) === false) {
          break;
        }
      }
      return i;
    }
    return this.__iterateUncached(fn, reverse);
  };

  // abstract __iteratorUncached(type, reverse)

  Seq.prototype.__iterator = function __iterator (type, reverse) {
    var cache = this._cache;
    if (cache) {
      var size = cache.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }
        var entry = cache[reverse ? size - ++i : i++];
        return iteratorValue(type, entry[0], entry[1]);
      });
    }
    return this.__iteratorUncached(type, reverse);
  };

  return Seq;
}(Collection));

var KeyedSeq = (function (Seq) {
  function KeyedSeq(value) {
    return value === null || value === undefined
      ? emptySequence().toKeyedSeq()
      : isCollection(value)
          ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq()
          : isRecord(value) ? value.toSeq() : keyedSeqFromValue(value);
  }

  if ( Seq ) KeyedSeq.__proto__ = Seq;
  KeyedSeq.prototype = Object.create( Seq && Seq.prototype );
  KeyedSeq.prototype.constructor = KeyedSeq;

  KeyedSeq.prototype.toKeyedSeq = function toKeyedSeq () {
    return this;
  };

  return KeyedSeq;
}(Seq));

var IndexedSeq = (function (Seq) {
  function IndexedSeq(value) {
    return value === null || value === undefined
      ? emptySequence()
      : isCollection(value)
          ? isKeyed(value) ? value.entrySeq() : value.toIndexedSeq()
          : isRecord(value)
              ? value.toSeq().entrySeq()
              : indexedSeqFromValue(value);
  }

  if ( Seq ) IndexedSeq.__proto__ = Seq;
  IndexedSeq.prototype = Object.create( Seq && Seq.prototype );
  IndexedSeq.prototype.constructor = IndexedSeq;

  IndexedSeq.of = function of (/*...values*/) {
    return IndexedSeq(arguments);
  };

  IndexedSeq.prototype.toIndexedSeq = function toIndexedSeq () {
    return this;
  };

  IndexedSeq.prototype.toString = function toString () {
    return this.__toString('Seq [', ']');
  };

  return IndexedSeq;
}(Seq));

var SetSeq = (function (Seq) {
  function SetSeq(value) {
    return (isCollection(value) && !isAssociative(value)
      ? value
      : IndexedSeq(value)).toSetSeq();
  }

  if ( Seq ) SetSeq.__proto__ = Seq;
  SetSeq.prototype = Object.create( Seq && Seq.prototype );
  SetSeq.prototype.constructor = SetSeq;

  SetSeq.of = function of (/*...values*/) {
    return SetSeq(arguments);
  };

  SetSeq.prototype.toSetSeq = function toSetSeq () {
    return this;
  };

  return SetSeq;
}(Seq));

Seq.isSeq = isSeq;
Seq.Keyed = KeyedSeq;
Seq.Set = SetSeq;
Seq.Indexed = IndexedSeq;

var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

Seq.prototype[IS_SEQ_SENTINEL] = true;

// #pragma Root Sequences

var ArraySeq = (function (IndexedSeq) {
  function ArraySeq(array) {
    this._array = array;
    this.size = array.length;
  }

  if ( IndexedSeq ) ArraySeq.__proto__ = IndexedSeq;
  ArraySeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
  ArraySeq.prototype.constructor = ArraySeq;

  ArraySeq.prototype.get = function get (index, notSetValue) {
    return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
  };

  ArraySeq.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var array = this._array;
    var size = array.length;
    var i = 0;
    while (i !== size) {
      var ii = reverse ? size - ++i : i++;
      if (fn(array[ii], ii, this$1) === false) {
        break;
      }
    }
    return i;
  };

  ArraySeq.prototype.__iterator = function __iterator (type, reverse) {
    var array = this._array;
    var size = array.length;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }
      var ii = reverse ? size - ++i : i++;
      return iteratorValue(type, ii, array[ii]);
    });
  };

  return ArraySeq;
}(IndexedSeq));

var ObjectSeq = (function (KeyedSeq) {
  function ObjectSeq(object) {
    var keys = Object.keys(object);
    this._object = object;
    this._keys = keys;
    this.size = keys.length;
  }

  if ( KeyedSeq ) ObjectSeq.__proto__ = KeyedSeq;
  ObjectSeq.prototype = Object.create( KeyedSeq && KeyedSeq.prototype );
  ObjectSeq.prototype.constructor = ObjectSeq;

  ObjectSeq.prototype.get = function get (key, notSetValue) {
    if (notSetValue !== undefined && !this.has(key)) {
      return notSetValue;
    }
    return this._object[key];
  };

  ObjectSeq.prototype.has = function has (key) {
    return this._object.hasOwnProperty(key);
  };

  ObjectSeq.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var object = this._object;
    var keys = this._keys;
    var size = keys.length;
    var i = 0;
    while (i !== size) {
      var key = keys[reverse ? size - ++i : i++];
      if (fn(object[key], key, this$1) === false) {
        break;
      }
    }
    return i;
  };

  ObjectSeq.prototype.__iterator = function __iterator (type, reverse) {
    var object = this._object;
    var keys = this._keys;
    var size = keys.length;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }
      var key = keys[reverse ? size - ++i : i++];
      return iteratorValue(type, key, object[key]);
    });
  };

  return ObjectSeq;
}(KeyedSeq));
ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;

var CollectionSeq = (function (IndexedSeq) {
  function CollectionSeq(collection) {
    this._collection = collection;
    this.size = collection.length || collection.size;
  }

  if ( IndexedSeq ) CollectionSeq.__proto__ = IndexedSeq;
  CollectionSeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
  CollectionSeq.prototype.constructor = CollectionSeq;

  CollectionSeq.prototype.__iterateUncached = function __iterateUncached (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var collection = this._collection;
    var iterator = getIterator(collection);
    var iterations = 0;
    if (isIterator(iterator)) {
      var step;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this$1) === false) {
          break;
        }
      }
    }
    return iterations;
  };

  CollectionSeq.prototype.__iteratorUncached = function __iteratorUncached (type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var collection = this._collection;
    var iterator = getIterator(collection);
    if (!isIterator(iterator)) {
      return new Iterator(iteratorDone);
    }
    var iterations = 0;
    return new Iterator(function () {
      var step = iterator.next();
      return step.done ? step : iteratorValue(type, iterations++, step.value);
    });
  };

  return CollectionSeq;
}(IndexedSeq));

var IteratorSeq = (function (IndexedSeq) {
  function IteratorSeq(iterator) {
    this._iterator = iterator;
    this._iteratorCache = [];
  }

  if ( IndexedSeq ) IteratorSeq.__proto__ = IndexedSeq;
  IteratorSeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
  IteratorSeq.prototype.constructor = IteratorSeq;

  IteratorSeq.prototype.__iterateUncached = function __iterateUncached (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var iterator = this._iterator;
    var cache = this._iteratorCache;
    var iterations = 0;
    while (iterations < cache.length) {
      if (fn(cache[iterations], iterations++, this$1) === false) {
        return iterations;
      }
    }
    var step;
    while (!(step = iterator.next()).done) {
      var val = step.value;
      cache[iterations] = val;
      if (fn(val, iterations++, this$1) === false) {
        break;
      }
    }
    return iterations;
  };

  IteratorSeq.prototype.__iteratorUncached = function __iteratorUncached (type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = this._iterator;
    var cache = this._iteratorCache;
    var iterations = 0;
    return new Iterator(function () {
      if (iterations >= cache.length) {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        cache[iterations] = step.value;
      }
      return iteratorValue(type, iterations, cache[iterations++]);
    });
  };

  return IteratorSeq;
}(IndexedSeq));

// # pragma Helper functions

function isSeq(maybeSeq) {
  return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
}

var EMPTY_SEQ;

function emptySequence() {
  return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
}

function keyedSeqFromValue(value) {
  var seq = Array.isArray(value)
    ? new ArraySeq(value)
    : isIterator(value)
        ? new IteratorSeq(value)
        : hasIterator(value) ? new CollectionSeq(value) : undefined;
  if (seq) {
    return seq.fromEntrySeq();
  }
  if (typeof value === 'object') {
    return new ObjectSeq(value);
  }
  throw new TypeError(
    'Expected Array or collection object of [k, v] entries, or keyed object: ' +
      value
  );
}

function indexedSeqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);
  if (seq) {
    return seq;
  }
  throw new TypeError(
    'Expected Array or collection object of values: ' + value
  );
}

function seqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);
  if (seq) {
    return seq;
  }
  if (typeof value === 'object') {
    return new ObjectSeq(value);
  }
  throw new TypeError(
    'Expected Array or collection object of values, or keyed object: ' + value
  );
}

function maybeIndexedSeqFromValue(value) {
  return isArrayLike(value)
    ? new ArraySeq(value)
    : isIterator(value)
        ? new IteratorSeq(value)
        : hasIterator(value) ? new CollectionSeq(value) : undefined;
}

/**
 * An extension of the "same-value" algorithm as [described for use by ES6 Map
 * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
 *
 * NaN is considered the same as NaN, however -0 and 0 are considered the same
 * value, which is different from the algorithm described by
 * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 *
 * This is extended further to allow Objects to describe the values they
 * represent, by way of `valueOf` or `equals` (and `hashCode`).
 *
 * Note: because of this extension, the key equality of Immutable.Map and the
 * value equality of Immutable.Set will differ from ES6 Map and Set.
 *
 * ### Defining custom values
 *
 * The easiest way to describe the value an object represents is by implementing
 * `valueOf`. For example, `Date` represents a value by returning a unix
 * timestamp for `valueOf`:
 *
 *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
 *     var date2 = new Date(1234567890000);
 *     date1.valueOf(); // 1234567890000
 *     assert( date1 !== date2 );
 *     assert( Immutable.is( date1, date2 ) );
 *
 * Note: overriding `valueOf` may have other implications if you use this object
 * where JavaScript expects a primitive, such as implicit string coercion.
 *
 * For more complex types, especially collections, implementing `valueOf` may
 * not be performant. An alternative is to implement `equals` and `hashCode`.
 *
 * `equals` takes another object, presumably of similar type, and returns true
 * if it is equal. Equality is symmetrical, so the same result should be
 * returned if this and the argument are flipped.
 *
 *     assert( a.equals(b) === b.equals(a) );
 *
 * `hashCode` returns a 32bit integer number representing the object which will
 * be used to determine how to store the value object in a Map or Set. You must
 * provide both or neither methods, one must not exist without the other.
 *
 * Also, an important relationship between these methods must be upheld: if two
 * values are equal, they *must* return the same hashCode. If the values are not
 * equal, they might have the same hashCode; this is called a hash collision,
 * and while undesirable for performance reasons, it is acceptable.
 *
 *     if (a.equals(b)) {
 *       assert( a.hashCode() === b.hashCode() );
 *     }
 *
 * All Immutable collections are Value Objects: they implement `equals()`
 * and `hashCode()`.
 */
function is(valueA, valueB) {
  if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
    return true;
  }
  if (!valueA || !valueB) {
    return false;
  }
  if (
    typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function'
  ) {
    valueA = valueA.valueOf();
    valueB = valueB.valueOf();
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
  }
  return !!(isValueObject(valueA) &&
    isValueObject(valueB) &&
    valueA.equals(valueB));
}

function fromJS(value, converter) {
  return fromJSWith(
    [],
    converter || defaultConverter,
    value,
    '',
    converter && converter.length > 2 ? [] : undefined,
    { '': value }
  );
}

function fromJSWith(stack, converter, value, key, keyPath, parentValue) {
  var toSeq = Array.isArray(value)
    ? IndexedSeq
    : isPlainObj(value) ? KeyedSeq : null;
  if (toSeq) {
    if (~stack.indexOf(value)) {
      throw new TypeError('Cannot convert circular structure to Immutable');
    }
    stack.push(value);
    keyPath && key !== '' && keyPath.push(key);
    var converted = converter.call(
      parentValue,
      key,
      toSeq(value).map(function (v, k) { return fromJSWith(stack, converter, v, k, keyPath, value); }),
      keyPath && keyPath.slice()
    );
    stack.pop();
    keyPath && keyPath.pop();
    return converted;
  }
  return value;
}

function defaultConverter(k, v) {
  return isKeyed(v) ? v.toMap() : v.toList();
}

function isPlainObj(value) {
  return value &&
    (value.constructor === Object || value.constructor === undefined);
}

var imul = typeof Math.imul === 'function' &&
  Math.imul(0xffffffff, 2) === -2
  ? Math.imul
  : function imul(a, b) {
      a |= 0; // int
      b |= 0; // int
      var c = a & 0xffff;
      var d = b & 0xffff;
      // Shift by 0 fixes the sign on the high part.
      return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
    };

// v8 has an optimization for storing 31-bit signed numbers.
// Values which have either 00 or 11 as the high order bits qualify.
// This function drops the highest order bit in a signed number, maintaining
// the sign bit.
function smi(i32) {
  return i32 >>> 1 & 0x40000000 | i32 & 0xbfffffff;
}

function hash(o) {
  if (o === false || o === null || o === undefined) {
    return 0;
  }
  if (typeof o.valueOf === 'function') {
    o = o.valueOf();
    if (o === false || o === null || o === undefined) {
      return 0;
    }
  }
  if (o === true) {
    return 1;
  }
  var type = typeof o;
  if (type === 'number') {
    if (o !== o || o === Infinity) {
      return 0;
    }
    var h = o | 0;
    if (h !== o) {
      h ^= o * 0xffffffff;
    }
    while (o > 0xffffffff) {
      o /= 0xffffffff;
      h ^= o;
    }
    return smi(h);
  }
  if (type === 'string') {
    return o.length > STRING_HASH_CACHE_MIN_STRLEN
      ? cachedHashString(o)
      : hashString(o);
  }
  if (typeof o.hashCode === 'function') {
    return o.hashCode();
  }
  if (type === 'object') {
    return hashJSObj(o);
  }
  if (typeof o.toString === 'function') {
    return hashString(o.toString());
  }
  throw new Error('Value type ' + type + ' cannot be hashed.');
}

function cachedHashString(string) {
  var hash = stringHashCache[string];
  if (hash === undefined) {
    hash = hashString(string);
    if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
      STRING_HASH_CACHE_SIZE = 0;
      stringHashCache = {};
    }
    STRING_HASH_CACHE_SIZE++;
    stringHashCache[string] = hash;
  }
  return hash;
}

// http://jsperf.com/hashing-strings
function hashString(string) {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  var hash = 0;
  for (var ii = 0; ii < string.length; ii++) {
    hash = 31 * hash + string.charCodeAt(ii) | 0;
  }
  return smi(hash);
}

function hashJSObj(obj) {
  var hash;
  if (usingWeakMap) {
    hash = weakMap.get(obj);
    if (hash !== undefined) {
      return hash;
    }
  }

  hash = obj[UID_HASH_KEY];
  if (hash !== undefined) {
    return hash;
  }

  if (!canDefineProperty) {
    hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
    if (hash !== undefined) {
      return hash;
    }

    hash = getIENodeHash(obj);
    if (hash !== undefined) {
      return hash;
    }
  }

  hash = ++objHashUID;
  if (objHashUID & 0x40000000) {
    objHashUID = 0;
  }

  if (usingWeakMap) {
    weakMap.set(obj, hash);
  } else if (isExtensible !== undefined && isExtensible(obj) === false) {
    throw new Error('Non-extensible objects are not allowed as keys.');
  } else if (canDefineProperty) {
    Object.defineProperty(obj, UID_HASH_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: hash
    });
  } else if (
    obj.propertyIsEnumerable !== undefined &&
    obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable
  ) {
    // Since we can't define a non-enumerable property on the object
    // we'll hijack one of the less-used non-enumerable properties to
    // save our hash on it. Since this is a function it will not show up in
    // `JSON.stringify` which is what we want.
    obj.propertyIsEnumerable = function() {
      return this.constructor.prototype.propertyIsEnumerable.apply(
        this,
        arguments
      );
    };
    obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
  } else if (obj.nodeType !== undefined) {
    // At this point we couldn't get the IE `uniqueID` to use as a hash
    // and we couldn't use a non-enumerable property to exploit the
    // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
    // itself.
    obj[UID_HASH_KEY] = hash;
  } else {
    throw new Error('Unable to set a non-enumerable property on object.');
  }

  return hash;
}

// Get references to ES5 object methods.
var isExtensible = Object.isExtensible;

// True if Object.defineProperty works as expected. IE8 fails this test.
var canDefineProperty = (function() {
  try {
    Object.defineProperty({}, '@', {});
    return true;
  } catch (e) {
    return false;
  }
})();

// IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
// and avoid memory leaks from the IE cloneNode bug.
function getIENodeHash(node) {
  if (node && node.nodeType > 0) {
    switch (node.nodeType) {
      case 1: // Element
        return node.uniqueID;
      case 9: // Document
        return node.documentElement && node.documentElement.uniqueID;
    }
  }
}

// If possible, use a WeakMap.
var usingWeakMap = typeof WeakMap === 'function';
var weakMap;
if (usingWeakMap) {
  weakMap = new WeakMap();
}

var objHashUID = 0;

var UID_HASH_KEY = '__immutablehash__';
if (typeof Symbol === 'function') {
  UID_HASH_KEY = Symbol(UID_HASH_KEY);
}

var STRING_HASH_CACHE_MIN_STRLEN = 16;
var STRING_HASH_CACHE_MAX_SIZE = 255;
var STRING_HASH_CACHE_SIZE = 0;
var stringHashCache = {};

var ToKeyedSequence = (function (KeyedSeq$$1) {
  function ToKeyedSequence(indexed, useKeys) {
    this._iter = indexed;
    this._useKeys = useKeys;
    this.size = indexed.size;
  }

  if ( KeyedSeq$$1 ) ToKeyedSequence.__proto__ = KeyedSeq$$1;
  ToKeyedSequence.prototype = Object.create( KeyedSeq$$1 && KeyedSeq$$1.prototype );
  ToKeyedSequence.prototype.constructor = ToKeyedSequence;

  ToKeyedSequence.prototype.get = function get (key, notSetValue) {
    return this._iter.get(key, notSetValue);
  };

  ToKeyedSequence.prototype.has = function has (key) {
    return this._iter.has(key);
  };

  ToKeyedSequence.prototype.valueSeq = function valueSeq () {
    return this._iter.valueSeq();
  };

  ToKeyedSequence.prototype.reverse = function reverse () {
    var this$1 = this;

    var reversedSequence = reverseFactory(this, true);
    if (!this._useKeys) {
      reversedSequence.valueSeq = function () { return this$1._iter.toSeq().reverse(); };
    }
    return reversedSequence;
  };

  ToKeyedSequence.prototype.map = function map (mapper, context) {
    var this$1 = this;

    var mappedSequence = mapFactory$1(this, mapper, context);
    if (!this._useKeys) {
      mappedSequence.valueSeq = function () { return this$1._iter.toSeq().map(mapper, context); };
    }
    return mappedSequence;
  };

  ToKeyedSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._iter.__iterate(function (v, k) { return fn(v, k, this$1); }, reverse);
  };

  ToKeyedSequence.prototype.__iterator = function __iterator (type, reverse) {
    return this._iter.__iterator(type, reverse);
  };

  return ToKeyedSequence;
}(KeyedSeq));
ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;

var ToIndexedSequence = (function (IndexedSeq$$1) {
  function ToIndexedSequence(iter) {
    this._iter = iter;
    this.size = iter.size;
  }

  if ( IndexedSeq$$1 ) ToIndexedSequence.__proto__ = IndexedSeq$$1;
  ToIndexedSequence.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
  ToIndexedSequence.prototype.constructor = ToIndexedSequence;

  ToIndexedSequence.prototype.includes = function includes (value) {
    return this._iter.includes(value);
  };

  ToIndexedSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var i = 0;
    reverse && ensureSize(this);
    return this._iter.__iterate(
      function (v) { return fn(v, reverse ? this$1.size - ++i : i++, this$1); },
      reverse
    );
  };

  ToIndexedSequence.prototype.__iterator = function __iterator (type, reverse) {
    var this$1 = this;

    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
    var i = 0;
    reverse && ensureSize(this);
    return new Iterator(function () {
      var step = iterator.next();
      return step.done
        ? step
        : iteratorValue(
            type,
            reverse ? this$1.size - ++i : i++,
            step.value,
            step
          );
    });
  };

  return ToIndexedSequence;
}(IndexedSeq));

var ToSetSequence = (function (SetSeq$$1) {
  function ToSetSequence(iter) {
    this._iter = iter;
    this.size = iter.size;
  }

  if ( SetSeq$$1 ) ToSetSequence.__proto__ = SetSeq$$1;
  ToSetSequence.prototype = Object.create( SetSeq$$1 && SetSeq$$1.prototype );
  ToSetSequence.prototype.constructor = ToSetSequence;

  ToSetSequence.prototype.has = function has (key) {
    return this._iter.includes(key);
  };

  ToSetSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._iter.__iterate(function (v) { return fn(v, v, this$1); }, reverse);
  };

  ToSetSequence.prototype.__iterator = function __iterator (type, reverse) {
    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
    return new Iterator(function () {
      var step = iterator.next();
      return step.done
        ? step
        : iteratorValue(type, step.value, step.value, step);
    });
  };

  return ToSetSequence;
}(SetSeq));

var FromEntriesSequence = (function (KeyedSeq$$1) {
  function FromEntriesSequence(entries) {
    this._iter = entries;
    this.size = entries.size;
  }

  if ( KeyedSeq$$1 ) FromEntriesSequence.__proto__ = KeyedSeq$$1;
  FromEntriesSequence.prototype = Object.create( KeyedSeq$$1 && KeyedSeq$$1.prototype );
  FromEntriesSequence.prototype.constructor = FromEntriesSequence;

  FromEntriesSequence.prototype.entrySeq = function entrySeq () {
    return this._iter.toSeq();
  };

  FromEntriesSequence.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._iter.__iterate(
      function (entry) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedCollection = isCollection(entry);
          return fn(
            indexedCollection ? entry.get(1) : entry[1],
            indexedCollection ? entry.get(0) : entry[0],
            this$1
          );
        }
      },
      reverse
    );
  };

  FromEntriesSequence.prototype.__iterator = function __iterator (type, reverse) {
    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
    return new Iterator(function () {
      while (true) {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedCollection = isCollection(entry);
          return iteratorValue(
            type,
            indexedCollection ? entry.get(0) : entry[0],
            indexedCollection ? entry.get(1) : entry[1],
            step
          );
        }
      }
    });
  };

  return FromEntriesSequence;
}(KeyedSeq));

ToIndexedSequence.prototype.cacheResult = (ToKeyedSequence.prototype.cacheResult = (ToSetSequence.prototype.cacheResult = (FromEntriesSequence.prototype.cacheResult = cacheResultThrough)));

function flipFactory(collection) {
  var flipSequence = makeSequence(collection);
  flipSequence._iter = collection;
  flipSequence.size = collection.size;
  flipSequence.flip = function () { return collection; };
  flipSequence.reverse = function() {
    var reversedSequence = collection.reverse.apply(this); // super.reverse()
    reversedSequence.flip = function () { return collection.reverse(); };
    return reversedSequence;
  };
  flipSequence.has = function (key) { return collection.includes(key); };
  flipSequence.includes = function (key) { return collection.has(key); };
  flipSequence.cacheResult = cacheResultThrough;
  flipSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    return collection.__iterate(function (v, k) { return fn(k, v, this$1) !== false; }, reverse);
  };
  flipSequence.__iteratorUncached = function(type, reverse) {
    if (type === ITERATE_ENTRIES) {
      var iterator = collection.__iterator(type, reverse);
      return new Iterator(function () {
        var step = iterator.next();
        if (!step.done) {
          var k = step.value[0];
          step.value[0] = step.value[1];
          step.value[1] = k;
        }
        return step;
      });
    }
    return collection.__iterator(
      type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
      reverse
    );
  };
  return flipSequence;
}

function mapFactory$1(collection, mapper, context) {
  var mappedSequence = makeSequence(collection);
  mappedSequence.size = collection.size;
  mappedSequence.has = function (key) { return collection.has(key); };
  mappedSequence.get = function (key, notSetValue) {
    var v = collection.get(key, NOT_SET);
    return v === NOT_SET
      ? notSetValue
      : mapper.call(context, v, key, collection);
  };
  mappedSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    return collection.__iterate(
      function (v, k, c) { return fn(mapper.call(context, v, k, c), k, this$1) !== false; },
      reverse
    );
  };
  mappedSequence.__iteratorUncached = function(type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    return new Iterator(function () {
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      var key = entry[0];
      return iteratorValue(
        type,
        key,
        mapper.call(context, entry[1], key, collection),
        step
      );
    });
  };
  return mappedSequence;
}

function reverseFactory(collection, useKeys) {
  var this$1 = this;

  var reversedSequence = makeSequence(collection);
  reversedSequence._iter = collection;
  reversedSequence.size = collection.size;
  reversedSequence.reverse = function () { return collection; };
  if (collection.flip) {
    reversedSequence.flip = function() {
      var flipSequence = flipFactory(collection);
      flipSequence.reverse = function () { return collection.flip(); };
      return flipSequence;
    };
  }
  reversedSequence.get = function (key, notSetValue) { return collection.get(useKeys ? key : -1 - key, notSetValue); };
  reversedSequence.has = function (key) { return collection.has(useKeys ? key : -1 - key); };
  reversedSequence.includes = function (value) { return collection.includes(value); };
  reversedSequence.cacheResult = cacheResultThrough;
  reversedSequence.__iterate = function(fn, reverse) {
    var this$1 = this;

    var i = 0;
    reverse && ensureSize(collection);
    return collection.__iterate(
      function (v, k) { return fn(v, useKeys ? k : reverse ? this$1.size - ++i : i++, this$1); },
      !reverse
    );
  };
  reversedSequence.__iterator = function (type, reverse) {
    var i = 0;
    reverse && ensureSize(collection);
    var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);
    return new Iterator(function () {
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      return iteratorValue(
        type,
        useKeys ? entry[0] : reverse ? this$1.size - ++i : i++,
        entry[1],
        step
      );
    });
  };
  return reversedSequence;
}

function filterFactory(collection, predicate, context, useKeys) {
  var filterSequence = makeSequence(collection);
  if (useKeys) {
    filterSequence.has = function (key) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && !!predicate.call(context, v, key, collection);
    };
    filterSequence.get = function (key, notSetValue) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && predicate.call(context, v, key, collection)
        ? v
        : notSetValue;
    };
  }
  filterSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    var iterations = 0;
    collection.__iterate(
      function (v, k, c) {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$1);
        }
      },
      reverse
    );
    return iterations;
  };
  filterSequence.__iteratorUncached = function(type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    var iterations = 0;
    return new Iterator(function () {
      while (true) {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        var value = entry[1];
        if (predicate.call(context, value, key, collection)) {
          return iteratorValue(type, useKeys ? key : iterations++, value, step);
        }
      }
    });
  };
  return filterSequence;
}

function countByFactory(collection, grouper, context) {
  var groups = Map().asMutable();
  collection.__iterate(function (v, k) {
    groups.update(grouper.call(context, v, k, collection), 0, function (a) { return a + 1; });
  });
  return groups.asImmutable();
}

function groupByFactory(collection, grouper, context) {
  var isKeyedIter = isKeyed(collection);
  var groups = (isOrdered(collection) ? OrderedMap() : Map()).asMutable();
  collection.__iterate(function (v, k) {
    groups.update(
      grouper.call(context, v, k, collection),
      function (a) { return ((a = a || []), a.push(isKeyedIter ? [k, v] : v), a); }
    );
  });
  var coerce = collectionClass(collection);
  return groups.map(function (arr) { return reify(collection, coerce(arr)); });
}

function sliceFactory(collection, begin, end, useKeys) {
  var originalSize = collection.size;

  if (wholeSlice(begin, end, originalSize)) {
    return collection;
  }

  var resolvedBegin = resolveBegin(begin, originalSize);
  var resolvedEnd = resolveEnd(end, originalSize);

  // begin or end will be NaN if they were provided as negative numbers and
  // this collection's size is unknown. In that case, cache first so there is
  // a known size and these do not resolve to NaN.
  if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
    return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
  }

  // Note: resolvedEnd is undefined when the original sequence's length is
  // unknown and this slice did not supply an end and should contain all
  // elements after resolvedBegin.
  // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
  var resolvedSize = resolvedEnd - resolvedBegin;
  var sliceSize;
  if (resolvedSize === resolvedSize) {
    sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
  }

  var sliceSeq = makeSequence(collection);

  // If collection.size is undefined, the size of the realized sliceSeq is
  // unknown at this point unless the number of items to slice is 0
  sliceSeq.size = sliceSize === 0
    ? sliceSize
    : (collection.size && sliceSize) || undefined;

  if (!useKeys && isSeq(collection) && sliceSize >= 0) {
    sliceSeq.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      return index >= 0 && index < sliceSize
        ? collection.get(index + resolvedBegin, notSetValue)
        : notSetValue;
    };
  }

  sliceSeq.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    if (sliceSize === 0) {
      return 0;
    }
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var skipped = 0;
    var isSkipping = true;
    var iterations = 0;
    collection.__iterate(function (v, k) {
      if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1) !== false &&
          iterations !== sliceSize;
      }
    });
    return iterations;
  };

  sliceSeq.__iteratorUncached = function(type, reverse) {
    if (sliceSize !== 0 && reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    // Don't bother instantiating parent iterator if taking 0.
    var iterator = sliceSize !== 0 && collection.__iterator(type, reverse);
    var skipped = 0;
    var iterations = 0;
    return new Iterator(function () {
      while (skipped++ < resolvedBegin) {
        iterator.next();
      }
      if (++iterations > sliceSize) {
        return iteratorDone();
      }
      var step = iterator.next();
      if (useKeys || type === ITERATE_VALUES) {
        return step;
      }
      if (type === ITERATE_KEYS) {
        return iteratorValue(type, iterations - 1, undefined, step);
      }
      return iteratorValue(type, iterations - 1, step.value[1], step);
    });
  };

  return sliceSeq;
}

function takeWhileFactory(collection, predicate, context) {
  var takeSequence = makeSequence(collection);
  takeSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var iterations = 0;
    collection.__iterate(
      function (v, k, c) { return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$1); }
    );
    return iterations;
  };
  takeSequence.__iteratorUncached = function(type, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    var iterating = true;
    return new Iterator(function () {
      if (!iterating) {
        return iteratorDone();
      }
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      var k = entry[0];
      var v = entry[1];
      if (!predicate.call(context, v, k, this$1)) {
        iterating = false;
        return iteratorDone();
      }
      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };
  return takeSequence;
}

function skipWhileFactory(collection, predicate, context, useKeys) {
  var skipSequence = makeSequence(collection);
  skipSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var isSkipping = true;
    var iterations = 0;
    collection.__iterate(function (v, k, c) {
      if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1);
      }
    });
    return iterations;
  };
  skipSequence.__iteratorUncached = function(type, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
    var skipping = true;
    var iterations = 0;
    return new Iterator(function () {
      var step;
      var k;
      var v;
      do {
        step = iterator.next();
        if (step.done) {
          if (useKeys || type === ITERATE_VALUES) {
            return step;
          }
          if (type === ITERATE_KEYS) {
            return iteratorValue(type, iterations++, undefined, step);
          }
          return iteratorValue(type, iterations++, step.value[1], step);
        }
        var entry = step.value;
        k = entry[0];
        v = entry[1];
        skipping && (skipping = predicate.call(context, v, k, this$1));
      } while (skipping);
      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };
  return skipSequence;
}

function concatFactory(collection, values) {
  var isKeyedCollection = isKeyed(collection);
  var iters = [collection]
    .concat(values)
    .map(function (v) {
      if (!isCollection(v)) {
        v = isKeyedCollection
          ? keyedSeqFromValue(v)
          : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedCollection) {
        v = KeyedCollection(v);
      }
      return v;
    })
    .filter(function (v) { return v.size !== 0; });

  if (iters.length === 0) {
    return collection;
  }

  if (iters.length === 1) {
    var singleton = iters[0];
    if (
      singleton === collection ||
      (isKeyedCollection && isKeyed(singleton)) ||
      (isIndexed(collection) && isIndexed(singleton))
    ) {
      return singleton;
    }
  }

  var concatSeq = new ArraySeq(iters);
  if (isKeyedCollection) {
    concatSeq = concatSeq.toKeyedSeq();
  } else if (!isIndexed(collection)) {
    concatSeq = concatSeq.toSetSeq();
  }
  concatSeq = concatSeq.flatten(true);
  concatSeq.size = iters.reduce(
    function (sum, seq) {
      if (sum !== undefined) {
        var size = seq.size;
        if (size !== undefined) {
          return sum + size;
        }
      }
    },
    0
  );
  return concatSeq;
}

function flattenFactory(collection, depth, useKeys) {
  var flatSequence = makeSequence(collection);
  flatSequence.__iterateUncached = function(fn, reverse) {
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }
    var iterations = 0;
    var stopped = false;
    function flatDeep(iter, currentDepth) {
      iter.__iterate(
        function (v, k) {
          if ((!depth || currentDepth < depth) && isCollection(v)) {
            flatDeep(v, currentDepth + 1);
          } else {
            iterations++;
            if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
              stopped = true;
            }
          }
          return !stopped;
        },
        reverse
      );
    }
    flatDeep(collection, 0);
    return iterations;
  };
  flatSequence.__iteratorUncached = function(type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }
    var iterator = collection.__iterator(type, reverse);
    var stack = [];
    var iterations = 0;
    return new Iterator(function () {
      while (iterator) {
        var step = iterator.next();
        if (step.done !== false) {
          iterator = stack.pop();
          continue;
        }
        var v = step.value;
        if (type === ITERATE_ENTRIES) {
          v = v[1];
        }
        if ((!depth || stack.length < depth) && isCollection(v)) {
          stack.push(iterator);
          iterator = v.__iterator(type, reverse);
        } else {
          return useKeys ? step : iteratorValue(type, iterations++, v, step);
        }
      }
      return iteratorDone();
    });
  };
  return flatSequence;
}

function flatMapFactory(collection, mapper, context) {
  var coerce = collectionClass(collection);
  return collection
    .toSeq()
    .map(function (v, k) { return coerce(mapper.call(context, v, k, collection)); })
    .flatten(true);
}

function interposeFactory(collection, separator) {
  var interposedSequence = makeSequence(collection);
  interposedSequence.size = collection.size && collection.size * 2 - 1;
  interposedSequence.__iterateUncached = function(fn, reverse) {
    var this$1 = this;

    var iterations = 0;
    collection.__iterate(
      function (v) { return (!iterations || fn(separator, iterations++, this$1) !== false) &&
        fn(v, iterations++, this$1) !== false; },
      reverse
    );
    return iterations;
  };
  interposedSequence.__iteratorUncached = function(type, reverse) {
    var iterator = collection.__iterator(ITERATE_VALUES, reverse);
    var iterations = 0;
    var step;
    return new Iterator(function () {
      if (!step || iterations % 2) {
        step = iterator.next();
        if (step.done) {
          return step;
        }
      }
      return iterations % 2
        ? iteratorValue(type, iterations++, separator)
        : iteratorValue(type, iterations++, step.value, step);
    });
  };
  return interposedSequence;
}

function sortFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }
  var isKeyedCollection = isKeyed(collection);
  var index = 0;
  var entries = collection
    .toSeq()
    .map(function (v, k) { return [k, v, index++, mapper ? mapper(v, k, collection) : v]; })
    .toArray();
  entries.sort(function (a, b) { return comparator(a[3], b[3]) || a[2] - b[2]; }).forEach(
    isKeyedCollection
      ? function (v, i) {
          entries[i].length = 2;
        }
      : function (v, i) {
          entries[i] = v[1];
        }
  );
  return isKeyedCollection
    ? KeyedSeq(entries)
    : isIndexed(collection) ? IndexedSeq(entries) : SetSeq(entries);
}

function maxFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }
  if (mapper) {
    var entry = collection
      .toSeq()
      .map(function (v, k) { return [v, mapper(v, k, collection)]; })
      .reduce(function (a, b) { return maxCompare(comparator, a[1], b[1]) ? b : a; });
    return entry && entry[0];
  }
  return collection.reduce(function (a, b) { return maxCompare(comparator, a, b) ? b : a; });
}

function maxCompare(comparator, a, b) {
  var comp = comparator(b, a);
  // b is considered the new max if the comparator declares them equal, but
  // they are not equal and b is in fact a nullish value.
  return (comp === 0 &&
    b !== a &&
    (b === undefined || b === null || b !== b)) ||
    comp > 0;
}

function zipWithFactory(keyIter, zipper, iters) {
  var zipSequence = makeSequence(keyIter);
  zipSequence.size = new ArraySeq(iters).map(function (i) { return i.size; }).min();
  // Note: this a generic base implementation of __iterate in terms of
  // __iterator which may be more generically useful in the future.
  zipSequence.__iterate = function(fn, reverse) {
    var this$1 = this;

    /* generic:
    var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
    var step;
    var iterations = 0;
    while (!(step = iterator.next()).done) {
      iterations++;
      if (fn(step.value[1], step.value[0], this) === false) {
        break;
      }
    }
    return iterations;
    */
    // indexed:
    var iterator = this.__iterator(ITERATE_VALUES, reverse);
    var step;
    var iterations = 0;
    while (!(step = iterator.next()).done) {
      if (fn(step.value, iterations++, this$1) === false) {
        break;
      }
    }
    return iterations;
  };
  zipSequence.__iteratorUncached = function(type, reverse) {
    var iterators = iters.map(
      function (i) { return ((i = Collection(i)), getIterator(reverse ? i.reverse() : i)); }
    );
    var iterations = 0;
    var isDone = false;
    return new Iterator(function () {
      var steps;
      if (!isDone) {
        steps = iterators.map(function (i) { return i.next(); });
        isDone = steps.some(function (s) { return s.done; });
      }
      if (isDone) {
        return iteratorDone();
      }
      return iteratorValue(
        type,
        iterations++,
        zipper.apply(null, steps.map(function (s) { return s.value; }))
      );
    });
  };
  return zipSequence;
}

// #pragma Helper Functions

function reify(iter, seq) {
  return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
}

function validateEntry(entry) {
  if (entry !== Object(entry)) {
    throw new TypeError('Expected [K, V] tuple: ' + entry);
  }
}

function collectionClass(collection) {
  return isKeyed(collection)
    ? KeyedCollection
    : isIndexed(collection) ? IndexedCollection : SetCollection;
}

function makeSequence(collection) {
  return Object.create(
    (isKeyed(collection)
      ? KeyedSeq
      : isIndexed(collection) ? IndexedSeq : SetSeq).prototype
  );
}

function cacheResultThrough() {
  if (this._iter.cacheResult) {
    this._iter.cacheResult();
    this.size = this._iter.size;
    return this;
  }
  return Seq.prototype.cacheResult.call(this);
}

function defaultComparator(a, b) {
  if (a === undefined && b === undefined) {
    return 0;
  }

  if (a === undefined) {
    return 1;
  }

  if (b === undefined) {
    return -1;
  }

  return a > b ? 1 : a < b ? -1 : 0;
}

function coerceKeyPath(keyPath) {
  if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
    return keyPath;
  }
  if (isOrdered(keyPath)) {
    return keyPath.toArray();
  }
  throw new TypeError(
    'Invalid keyPath: expected Ordered Collection or Array: ' + keyPath
  );
}

function invariant(condition, error) {
  if (!condition) { throw new Error(error); }
}

function assertNotInfinite(size) {
  invariant(
    size !== Infinity,
    'Cannot perform this action with an infinite size.'
  );
}

/**
 * Converts a value to a string, adding quotes if a string was provided.
 */
function quoteString(value) {
  return typeof value === 'string' ? JSON.stringify(value) : String(value);
}

var Map = (function (KeyedCollection$$1) {
  function Map(value) {
    return value === null || value === undefined
      ? emptyMap()
      : isMap(value) && !isOrdered(value) && !isSorted()
          ? value
          : emptyMap().withMutations(function (map) {
              var iter = KeyedCollection$$1(value);
              assertNotInfinite(iter.size);
              iter.forEach(function (v, k) { return map.set(k, v); });
            });
  }

  if ( KeyedCollection$$1 ) Map.__proto__ = KeyedCollection$$1;
  Map.prototype = Object.create( KeyedCollection$$1 && KeyedCollection$$1.prototype );
  Map.prototype.constructor = Map;

  Map.of = function of () {
    var keyValues = [], len = arguments.length;
    while ( len-- ) keyValues[ len ] = arguments[ len ];

    return emptyMap().withMutations(function (map) {
      for (var i = 0; i < keyValues.length; i += 2) {
        if (i + 1 >= keyValues.length) {
          throw new Error('Missing value for key: ' + keyValues[i]);
        }
        map.set(keyValues[i], keyValues[i + 1]);
      }
    });
  };

  Map.prototype.toString = function toString () {
    return this.__toString('Map {', '}');
  };

  // @pragma Access

  Map.prototype.get = function get (k, notSetValue) {
    return this._root
      ? this._root.get(0, undefined, k, notSetValue)
      : notSetValue;
  };

  // @pragma Modification

  Map.prototype.set = function set (k, v) {
    return updateMap(this, k, v);
  };

  Map.prototype.setIn = function setIn (keyPath, v) {
    return this.updateIn(keyPath, NOT_SET, function () { return v; });
  };

  Map.prototype.remove = function remove (k) {
    return updateMap(this, k, NOT_SET);
  };

  Map.prototype.deleteIn = function deleteIn (keyPath) {
    keyPath = [].concat( coerceKeyPath(keyPath) );
    if (keyPath.length) {
      var lastKey = keyPath.pop();
      return this.updateIn(keyPath, function (c) { return c && c.remove(lastKey); });
    }
  };

  Map.prototype.deleteAll = function deleteAll (keys) {
    var collection = Collection(keys);

    if (collection.size === 0) {
      return this;
    }

    return this.withMutations(function (map) {
      collection.forEach(function (key) { return map.remove(key); });
    });
  };

  Map.prototype.update = function update (k, notSetValue, updater) {
    return arguments.length === 1
      ? k(this)
      : this.updateIn([k], notSetValue, updater);
  };

  Map.prototype.updateIn = function updateIn (keyPath, notSetValue, updater) {
    if (!updater) {
      updater = notSetValue;
      notSetValue = undefined;
    }
    var updatedValue = updateInDeepMap(
      this,
      coerceKeyPath(keyPath),
      0,
      notSetValue,
      updater
    );
    return updatedValue === NOT_SET ? notSetValue : updatedValue;
  };

  Map.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._root = null;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return emptyMap();
  };

  // @pragma Composition

  Map.prototype.merge = function merge (/*...iters*/) {
    return mergeIntoMapWith(this, undefined, arguments);
  };

  Map.prototype.mergeWith = function mergeWith (merger) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return mergeIntoMapWith(this, merger, iters);
  };

  Map.prototype.mergeIn = function mergeIn (keyPath) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return this.updateIn(
      keyPath,
      emptyMap(),
      function (m) { return typeof m.merge === 'function'
          ? m.merge.apply(m, iters)
          : iters[iters.length - 1]; }
    );
  };

  Map.prototype.mergeDeep = function mergeDeep (/*...iters*/) {
    return mergeIntoMapWith(this, deepMerger, arguments);
  };

  Map.prototype.mergeDeepWith = function mergeDeepWith (merger) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return mergeIntoMapWith(this, deepMergerWith(merger), iters);
  };

  Map.prototype.mergeDeepIn = function mergeDeepIn (keyPath) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return this.updateIn(
      keyPath,
      emptyMap(),
      function (m) { return typeof m.mergeDeep === 'function'
          ? m.mergeDeep.apply(m, iters)
          : iters[iters.length - 1]; }
    );
  };

  Map.prototype.sort = function sort (comparator) {
    // Late binding
    return OrderedMap(sortFactory(this, comparator));
  };

  Map.prototype.sortBy = function sortBy (mapper, comparator) {
    // Late binding
    return OrderedMap(sortFactory(this, comparator, mapper));
  };

  // @pragma Mutability

  Map.prototype.withMutations = function withMutations (fn) {
    var mutable = this.asMutable();
    fn(mutable);
    return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
  };

  Map.prototype.asMutable = function asMutable () {
    return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
  };

  Map.prototype.asImmutable = function asImmutable () {
    return this.__ensureOwner();
  };

  Map.prototype.wasAltered = function wasAltered () {
    return this.__altered;
  };

  Map.prototype.__iterator = function __iterator (type, reverse) {
    return new MapIterator(this, type, reverse);
  };

  Map.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var iterations = 0;
    this._root &&
      this._root.iterate(
        function (entry) {
          iterations++;
          return fn(entry[1], entry[0], this$1);
        },
        reverse
      );
    return iterations;
  };

  Map.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyMap();
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeMap(this.size, this._root, ownerID, this.__hash);
  };

  return Map;
}(KeyedCollection));

function isMap(maybeMap) {
  return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
}

Map.isMap = isMap;

var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

var MapPrototype = Map.prototype;
MapPrototype[IS_MAP_SENTINEL] = true;
MapPrototype[DELETE] = MapPrototype.remove;
MapPrototype.removeIn = MapPrototype.deleteIn;
MapPrototype.removeAll = MapPrototype.deleteAll;

// #pragma Trie Nodes

var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
  this.ownerID = ownerID;
  this.entries = entries;
};

ArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  var entries = this.entries;
  for (var ii = 0, len = entries.length; ii < len; ii++) {
    if (is(key, entries[ii][0])) {
      return entries[ii][1];
    }
  }
  return notSetValue;
};

ArrayMapNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  var removed = value === NOT_SET;

  var entries = this.entries;
  var idx = 0;
  var len = entries.length;
  for (; idx < len; idx++) {
    if (is(key, entries[idx][0])) {
      break;
    }
  }
  var exists = idx < len;

  if (exists ? entries[idx][1] === value : removed) {
    return this;
  }

  SetRef(didAlter);
  (removed || !exists) && SetRef(didChangeSize);

  if (removed && entries.length === 1) {
    return; // undefined
  }

  if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
    return createNodes(ownerID, entries, key, value);
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newEntries = isEditable ? entries : arrCopy(entries);

  if (exists) {
    if (removed) {
      idx === len - 1
        ? newEntries.pop()
        : (newEntries[idx] = newEntries.pop());
    } else {
      newEntries[idx] = [key, value];
    }
  } else {
    newEntries.push([key, value]);
  }

  if (isEditable) {
    this.entries = newEntries;
    return this;
  }

  return new ArrayMapNode(ownerID, newEntries);
};

var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
  this.ownerID = ownerID;
  this.bitmap = bitmap;
  this.nodes = nodes;
};

BitmapIndexedNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
  var bitmap = this.bitmap;
  return (bitmap & bit) === 0
    ? notSetValue
    : this.nodes[popCount(bitmap & bit - 1)].get(
        shift + SHIFT,
        keyHash,
        key,
        notSetValue
      );
};

BitmapIndexedNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var bit = 1 << keyHashFrag;
  var bitmap = this.bitmap;
  var exists = (bitmap & bit) !== 0;

  if (!exists && value === NOT_SET) {
    return this;
  }

  var idx = popCount(bitmap & bit - 1);
  var nodes = this.nodes;
  var node = exists ? nodes[idx] : undefined;
  var newNode = updateNode(
    node,
    ownerID,
    shift + SHIFT,
    keyHash,
    key,
    value,
    didChangeSize,
    didAlter
  );

  if (newNode === node) {
    return this;
  }

  if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
    return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
  }

  if (
    exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])
  ) {
    return nodes[idx ^ 1];
  }

  if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
    return newNode;
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
  var newNodes = exists
    ? newNode
        ? setIn(nodes, idx, newNode, isEditable)
        : spliceOut(nodes, idx, isEditable)
    : spliceIn(nodes, idx, newNode, isEditable);

  if (isEditable) {
    this.bitmap = newBitmap;
    this.nodes = newNodes;
    return this;
  }

  return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
};

var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
  this.ownerID = ownerID;
  this.count = count;
  this.nodes = nodes;
};

HashArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var node = this.nodes[idx];
  return node
    ? node.get(shift + SHIFT, keyHash, key, notSetValue)
    : notSetValue;
};

HashArrayMapNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }
  var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var removed = value === NOT_SET;
  var nodes = this.nodes;
  var node = nodes[idx];

  if (removed && !node) {
    return this;
  }

  var newNode = updateNode(
    node,
    ownerID,
    shift + SHIFT,
    keyHash,
    key,
    value,
    didChangeSize,
    didAlter
  );
  if (newNode === node) {
    return this;
  }

  var newCount = this.count;
  if (!node) {
    newCount++;
  } else if (!newNode) {
    newCount--;
    if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
      return packNodes(ownerID, nodes, newCount, idx);
    }
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newNodes = setIn(nodes, idx, newNode, isEditable);

  if (isEditable) {
    this.count = newCount;
    this.nodes = newNodes;
    return this;
  }

  return new HashArrayMapNode(ownerID, newCount, newNodes);
};

var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
  this.ownerID = ownerID;
  this.keyHash = keyHash;
  this.entries = entries;
};

HashCollisionNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  var entries = this.entries;
  for (var ii = 0, len = entries.length; ii < len; ii++) {
    if (is(key, entries[ii][0])) {
      return entries[ii][1];
    }
  }
  return notSetValue;
};

HashCollisionNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var removed = value === NOT_SET;

  if (keyHash !== this.keyHash) {
    if (removed) {
      return this;
    }
    SetRef(didAlter);
    SetRef(didChangeSize);
    return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
  }

  var entries = this.entries;
  var idx = 0;
  var len = entries.length;
  for (; idx < len; idx++) {
    if (is(key, entries[idx][0])) {
      break;
    }
  }
  var exists = idx < len;

  if (exists ? entries[idx][1] === value : removed) {
    return this;
  }

  SetRef(didAlter);
  (removed || !exists) && SetRef(didChangeSize);

  if (removed && len === 2) {
    return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newEntries = isEditable ? entries : arrCopy(entries);

  if (exists) {
    if (removed) {
      idx === len - 1
        ? newEntries.pop()
        : (newEntries[idx] = newEntries.pop());
    } else {
      newEntries[idx] = [key, value];
    }
  } else {
    newEntries.push([key, value]);
  }

  if (isEditable) {
    this.entries = newEntries;
    return this;
  }

  return new HashCollisionNode(ownerID, this.keyHash, newEntries);
};

var ValueNode = function ValueNode(ownerID, keyHash, entry) {
  this.ownerID = ownerID;
  this.keyHash = keyHash;
  this.entry = entry;
};

ValueNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
  return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
};

ValueNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  var removed = value === NOT_SET;
  var keyMatch = is(key, this.entry[0]);
  if (keyMatch ? value === this.entry[1] : removed) {
    return this;
  }

  SetRef(didAlter);

  if (removed) {
    SetRef(didChangeSize);
    return; // undefined
  }

  if (keyMatch) {
    if (ownerID && ownerID === this.ownerID) {
      this.entry[1] = value;
      return this;
    }
    return new ValueNode(ownerID, this.keyHash, [key, value]);
  }

  SetRef(didChangeSize);
  return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
};

// #pragma Iterators

ArrayMapNode.prototype.iterate = (HashCollisionNode.prototype.iterate = function(
  fn,
  reverse
) {
  var entries = this.entries;
  for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
    if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
      return false;
    }
  }
});

BitmapIndexedNode.prototype.iterate = (HashArrayMapNode.prototype.iterate = function(
  fn,
  reverse
) {
  var nodes = this.nodes;
  for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
    var node = nodes[reverse ? maxIndex - ii : ii];
    if (node && node.iterate(fn, reverse) === false) {
      return false;
    }
  }
});

// eslint-disable-next-line no-unused-vars
ValueNode.prototype.iterate = function(fn, reverse) {
  return fn(this.entry);
};

var MapIterator = (function (Iterator$$1) {
  function MapIterator(map, type, reverse) {
    this._type = type;
    this._reverse = reverse;
    this._stack = map._root && mapIteratorFrame(map._root);
  }

  if ( Iterator$$1 ) MapIterator.__proto__ = Iterator$$1;
  MapIterator.prototype = Object.create( Iterator$$1 && Iterator$$1.prototype );
  MapIterator.prototype.constructor = MapIterator;

  MapIterator.prototype.next = function next () {
    var this$1 = this;

    var type = this._type;
    var stack = this._stack;
    while (stack) {
      var node = stack.node;
      var index = stack.index++;
      var maxIndex = (void 0);
      if (node.entry) {
        if (index === 0) {
          return mapIteratorValue(type, node.entry);
        }
      } else if (node.entries) {
        maxIndex = node.entries.length - 1;
        if (index <= maxIndex) {
          return mapIteratorValue(
            type,
            node.entries[this$1._reverse ? maxIndex - index : index]
          );
        }
      } else {
        maxIndex = node.nodes.length - 1;
        if (index <= maxIndex) {
          var subNode = node.nodes[this$1._reverse ? maxIndex - index : index];
          if (subNode) {
            if (subNode.entry) {
              return mapIteratorValue(type, subNode.entry);
            }
            stack = (this$1._stack = mapIteratorFrame(subNode, stack));
          }
          continue;
        }
      }
      stack = (this$1._stack = this$1._stack.__prev);
    }
    return iteratorDone();
  };

  return MapIterator;
}(Iterator));

function mapIteratorValue(type, entry) {
  return iteratorValue(type, entry[0], entry[1]);
}

function mapIteratorFrame(node, prev) {
  return {
    node: node,
    index: 0,
    __prev: prev
  };
}

function makeMap(size, root, ownerID, hash$$1) {
  var map = Object.create(MapPrototype);
  map.size = size;
  map._root = root;
  map.__ownerID = ownerID;
  map.__hash = hash$$1;
  map.__altered = false;
  return map;
}

var EMPTY_MAP;
function emptyMap() {
  return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
}

function updateMap(map, k, v) {
  var newRoot;
  var newSize;
  if (!map._root) {
    if (v === NOT_SET) {
      return map;
    }
    newSize = 1;
    newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
  } else {
    var didChangeSize = MakeRef(CHANGE_LENGTH);
    var didAlter = MakeRef(DID_ALTER);
    newRoot = updateNode(
      map._root,
      map.__ownerID,
      0,
      undefined,
      k,
      v,
      didChangeSize,
      didAlter
    );
    if (!GetRef(didAlter)) {
      return map;
    }
    newSize = map.size + (GetRef(didChangeSize) ? v === NOT_SET ? -1 : 1 : 0);
  }
  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__hash = undefined;
    map.__altered = true;
    return map;
  }
  return newRoot ? makeMap(newSize, newRoot) : emptyMap();
}

function updateNode(
  node,
  ownerID,
  shift,
  keyHash,
  key,
  value,
  didChangeSize,
  didAlter
) {
  if (!node) {
    if (value === NOT_SET) {
      return node;
    }
    SetRef(didAlter);
    SetRef(didChangeSize);
    return new ValueNode(ownerID, keyHash, [key, value]);
  }
  return node.update(
    ownerID,
    shift,
    keyHash,
    key,
    value,
    didChangeSize,
    didAlter
  );
}

function isLeafNode(node) {
  return node.constructor === ValueNode ||
    node.constructor === HashCollisionNode;
}

function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
  if (node.keyHash === keyHash) {
    return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
  }

  var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
  var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

  var newNode;
  var nodes = idx1 === idx2
    ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)]
    : ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2
        ? [node, newNode]
        : [newNode, node]);

  return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);
}

function createNodes(ownerID, entries, key, value) {
  if (!ownerID) {
    ownerID = new OwnerID();
  }
  var node = new ValueNode(ownerID, hash(key), [key, value]);
  for (var ii = 0; ii < entries.length; ii++) {
    var entry = entries[ii];
    node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
  }
  return node;
}

function packNodes(ownerID, nodes, count, excluding) {
  var bitmap = 0;
  var packedII = 0;
  var packedNodes = new Array(count);
  for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, (bit <<= 1)) {
    var node = nodes[ii];
    if (node !== undefined && ii !== excluding) {
      bitmap |= bit;
      packedNodes[packedII++] = node;
    }
  }
  return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
}

function expandNodes(ownerID, nodes, bitmap, including, node) {
  var count = 0;
  var expandedNodes = new Array(SIZE);
  for (var ii = 0; bitmap !== 0; ii++, (bitmap >>>= 1)) {
    expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
  }
  expandedNodes[including] = node;
  return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
}

function mergeIntoMapWith(map, merger, collections) {
  var iters = [];
  for (var ii = 0; ii < collections.length; ii++) {
    var value = collections[ii];
    var iter = KeyedCollection(value);
    if (!isCollection(value)) {
      iter = iter.map(function (v) { return fromJS(v); });
    }
    iters.push(iter);
  }
  return mergeIntoCollectionWith(map, merger, iters);
}

function deepMerger(oldVal, newVal) {
  return oldVal && oldVal.mergeDeep && isCollection(newVal)
    ? oldVal.mergeDeep(newVal)
    : is(oldVal, newVal) ? oldVal : newVal;
}

function deepMergerWith(merger) {
  return function (oldVal, newVal, key) {
    if (oldVal && oldVal.mergeDeepWith && isCollection(newVal)) {
      return oldVal.mergeDeepWith(merger, newVal);
    }
    var nextValue = merger(oldVal, newVal, key);
    return is(oldVal, nextValue) ? oldVal : nextValue;
  };
}

function mergeIntoCollectionWith(collection, merger, iters) {
  iters = iters.filter(function (x) { return x.size !== 0; });
  if (iters.length === 0) {
    return collection;
  }
  if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
    return collection.constructor(iters[0]);
  }
  return collection.withMutations(function (collection) {
    var mergeIntoMap = merger
      ? function (value, key) {
          collection.update(
            key,
            NOT_SET,
            function (oldVal) { return oldVal === NOT_SET ? value : merger(oldVal, value, key); }
          );
        }
      : function (value, key) {
          collection.set(key, value);
        };
    for (var ii = 0; ii < iters.length; ii++) {
      iters[ii].forEach(mergeIntoMap);
    }
  });
}

function updateInDeepMap(existing, keyPath, i, notSetValue, updater) {
  var isNotSet = existing === NOT_SET;
  if (i === keyPath.length) {
    var existingValue = isNotSet ? notSetValue : existing;
    var newValue = updater(existingValue);
    return newValue === existingValue ? existing : newValue;
  }
  if (!(isNotSet || (existing && existing.set))) {
    throw new TypeError(
      'Invalid keyPath: Value at [' +
        keyPath.slice(0, i).map(quoteString) +
        '] does not have a .set() method and cannot be updated: ' +
        existing
    );
  }
  var key = keyPath[i];
  var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
  var nextUpdated = updateInDeepMap(
    nextExisting,
    keyPath,
    i + 1,
    notSetValue,
    updater
  );
  return nextUpdated === nextExisting
    ? existing
    : nextUpdated === NOT_SET
        ? existing.remove(key)
        : (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
}

function popCount(x) {
  x -= x >> 1 & 0x55555555;
  x = (x & 0x33333333) + (x >> 2 & 0x33333333);
  x = x + (x >> 4) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
}

function setIn(array, idx, val, canEdit) {
  var newArray = canEdit ? array : arrCopy(array);
  newArray[idx] = val;
  return newArray;
}

function spliceIn(array, idx, val, canEdit) {
  var newLen = array.length + 1;
  if (canEdit && idx + 1 === newLen) {
    array[idx] = val;
    return array;
  }
  var newArray = new Array(newLen);
  var after = 0;
  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      newArray[ii] = val;
      after = -1;
    } else {
      newArray[ii] = array[ii + after];
    }
  }
  return newArray;
}

function spliceOut(array, idx, canEdit) {
  var newLen = array.length - 1;
  if (canEdit && idx === newLen) {
    array.pop();
    return array;
  }
  var newArray = new Array(newLen);
  var after = 0;
  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      after = 1;
    }
    newArray[ii] = array[ii + after];
  }
  return newArray;
}

var MAX_ARRAY_MAP_SIZE = SIZE / 4;
var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

var List = (function (IndexedCollection$$1) {
  function List(value) {
    var empty = emptyList();
    if (value === null || value === undefined) {
      return empty;
    }
    if (isList(value)) {
      return value;
    }
    var iter = IndexedCollection$$1(value);
    var size = iter.size;
    if (size === 0) {
      return empty;
    }
    assertNotInfinite(size);
    if (size > 0 && size < SIZE) {
      return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
    }
    return empty.withMutations(function (list) {
      list.setSize(size);
      iter.forEach(function (v, i) { return list.set(i, v); });
    });
  }

  if ( IndexedCollection$$1 ) List.__proto__ = IndexedCollection$$1;
  List.prototype = Object.create( IndexedCollection$$1 && IndexedCollection$$1.prototype );
  List.prototype.constructor = List;

  List.of = function of (/*...values*/) {
    return this(arguments);
  };

  List.prototype.toString = function toString () {
    return this.__toString('List [', ']');
  };

  // @pragma Access

  List.prototype.get = function get (index, notSetValue) {
    index = wrapIndex(this, index);
    if (index >= 0 && index < this.size) {
      index += this._origin;
      var node = listNodeFor(this, index);
      return node && node.array[index & MASK];
    }
    return notSetValue;
  };

  // @pragma Modification

  List.prototype.set = function set (index, value) {
    return updateList(this, index, value);
  };

  List.prototype.remove = function remove (index) {
    return !this.has(index)
      ? this
      : index === 0
          ? this.shift()
          : index === this.size - 1 ? this.pop() : this.splice(index, 1);
  };

  List.prototype.insert = function insert (index, value) {
    return this.splice(index, 0, value);
  };

  List.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = (this._origin = (this._capacity = 0));
      this._level = SHIFT;
      this._root = (this._tail = null);
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return emptyList();
  };

  List.prototype.push = function push (/*...values*/) {
    var values = arguments;
    var oldSize = this.size;
    return this.withMutations(function (list) {
      setListBounds(list, 0, oldSize + values.length);
      for (var ii = 0; ii < values.length; ii++) {
        list.set(oldSize + ii, values[ii]);
      }
    });
  };

  List.prototype.pop = function pop () {
    return setListBounds(this, 0, -1);
  };

  List.prototype.unshift = function unshift (/*...values*/) {
    var values = arguments;
    return this.withMutations(function (list) {
      setListBounds(list, -values.length);
      for (var ii = 0; ii < values.length; ii++) {
        list.set(ii, values[ii]);
      }
    });
  };

  List.prototype.shift = function shift () {
    return setListBounds(this, 1);
  };

  // @pragma Composition

  List.prototype.merge = function merge (/*...iters*/) {
    return mergeIntoListWith(this, undefined, arguments);
  };

  List.prototype.mergeWith = function mergeWith (merger) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return mergeIntoListWith(this, merger, iters);
  };

  List.prototype.mergeDeep = function mergeDeep (/*...iters*/) {
    return mergeIntoListWith(this, deepMerger, arguments);
  };

  List.prototype.mergeDeepWith = function mergeDeepWith (merger) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return mergeIntoListWith(this, deepMergerWith(merger), iters);
  };

  List.prototype.setSize = function setSize (size) {
    return setListBounds(this, 0, size);
  };

  // @pragma Iteration

  List.prototype.slice = function slice (begin, end) {
    var size = this.size;
    if (wholeSlice(begin, end, size)) {
      return this;
    }
    return setListBounds(
      this,
      resolveBegin(begin, size),
      resolveEnd(end, size)
    );
  };

  List.prototype.__iterator = function __iterator (type, reverse) {
    var index = reverse ? this.size : 0;
    var values = iterateList(this, reverse);
    return new Iterator(function () {
      var value = values();
      return value === DONE
        ? iteratorDone()
        : iteratorValue(type, reverse ? --index : index++, value);
    });
  };

  List.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var index = reverse ? this.size : 0;
    var values = iterateList(this, reverse);
    var value;
    while ((value = values()) !== DONE) {
      if (fn(value, reverse ? --index : index++, this$1) === false) {
        break;
      }
    }
    return index;
  };

  List.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyList();
      }
      this.__ownerID = ownerID;
      return this;
    }
    return makeList(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      ownerID,
      this.__hash
    );
  };

  return List;
}(IndexedCollection));

function isList(maybeList) {
  return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
}

List.isList = isList;

var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

var ListPrototype = List.prototype;
ListPrototype[IS_LIST_SENTINEL] = true;
ListPrototype[DELETE] = ListPrototype.remove;
ListPrototype.setIn = MapPrototype.setIn;
ListPrototype.deleteIn = (ListPrototype.removeIn = MapPrototype.removeIn);
ListPrototype.update = MapPrototype.update;
ListPrototype.updateIn = MapPrototype.updateIn;
ListPrototype.mergeIn = MapPrototype.mergeIn;
ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
ListPrototype.withMutations = MapPrototype.withMutations;
ListPrototype.asMutable = MapPrototype.asMutable;
ListPrototype.asImmutable = MapPrototype.asImmutable;
ListPrototype.wasAltered = MapPrototype.wasAltered;

var VNode = function VNode(array, ownerID) {
  this.array = array;
  this.ownerID = ownerID;
};

// TODO: seems like these methods are very similar

VNode.prototype.removeBefore = function removeBefore (ownerID, level, index) {
  if (index === level ? 1 << level : 0 || this.array.length === 0) {
    return this;
  }
  var originIndex = index >>> level & MASK;
  if (originIndex >= this.array.length) {
    return new VNode([], ownerID);
  }
  var removingFirst = originIndex === 0;
  var newChild;
  if (level > 0) {
    var oldChild = this.array[originIndex];
    newChild = oldChild &&
      oldChild.removeBefore(ownerID, level - SHIFT, index);
    if (newChild === oldChild && removingFirst) {
      return this;
    }
  }
  if (removingFirst && !newChild) {
    return this;
  }
  var editable = editableVNode(this, ownerID);
  if (!removingFirst) {
    for (var ii = 0; ii < originIndex; ii++) {
      editable.array[ii] = undefined;
    }
  }
  if (newChild) {
    editable.array[originIndex] = newChild;
  }
  return editable;
};

VNode.prototype.removeAfter = function removeAfter (ownerID, level, index) {
  if (index === (level ? 1 << level : 0) || this.array.length === 0) {
    return this;
  }
  var sizeIndex = index - 1 >>> level & MASK;
  if (sizeIndex >= this.array.length) {
    return this;
  }

  var newChild;
  if (level > 0) {
    var oldChild = this.array[sizeIndex];
    newChild = oldChild &&
      oldChild.removeAfter(ownerID, level - SHIFT, index);
    if (newChild === oldChild && sizeIndex === this.array.length - 1) {
      return this;
    }
  }

  var editable = editableVNode(this, ownerID);
  editable.array.splice(sizeIndex + 1);
  if (newChild) {
    editable.array[sizeIndex] = newChild;
  }
  return editable;
};

var DONE = {};

function iterateList(list, reverse) {
  var left = list._origin;
  var right = list._capacity;
  var tailPos = getTailOffset(right);
  var tail = list._tail;

  return iterateNodeOrLeaf(list._root, list._level, 0);

  function iterateNodeOrLeaf(node, level, offset) {
    return level === 0
      ? iterateLeaf(node, offset)
      : iterateNode(node, level, offset);
  }

  function iterateLeaf(node, offset) {
    var array = offset === tailPos ? tail && tail.array : node && node.array;
    var from = offset > left ? 0 : left - offset;
    var to = right - offset;
    if (to > SIZE) {
      to = SIZE;
    }
    return function () {
      if (from === to) {
        return DONE;
      }
      var idx = reverse ? --to : from++;
      return array && array[idx];
    };
  }

  function iterateNode(node, level, offset) {
    var values;
    var array = node && node.array;
    var from = offset > left ? 0 : left - offset >> level;
    var to = (right - offset >> level) + 1;
    if (to > SIZE) {
      to = SIZE;
    }
    return function () {
      while (true) {
        if (values) {
          var value = values();
          if (value !== DONE) {
            return value;
          }
          values = null;
        }
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        values = iterateNodeOrLeaf(
          array && array[idx],
          level - SHIFT,
          offset + (idx << level)
        );
      }
    };
  }
}

function makeList(origin, capacity, level, root, tail, ownerID, hash) {
  var list = Object.create(ListPrototype);
  list.size = capacity - origin;
  list._origin = origin;
  list._capacity = capacity;
  list._level = level;
  list._root = root;
  list._tail = tail;
  list.__ownerID = ownerID;
  list.__hash = hash;
  list.__altered = false;
  return list;
}

var EMPTY_LIST;
function emptyList() {
  return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
}

function updateList(list, index, value) {
  index = wrapIndex(list, index);

  if (index !== index) {
    return list;
  }

  if (index >= list.size || index < 0) {
    return list.withMutations(function (list) {
      index < 0
        ? setListBounds(list, index).set(0, value)
        : setListBounds(list, 0, index + 1).set(index, value);
    });
  }

  index += list._origin;

  var newTail = list._tail;
  var newRoot = list._root;
  var didAlter = MakeRef(DID_ALTER);
  if (index >= getTailOffset(list._capacity)) {
    newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
  } else {
    newRoot = updateVNode(
      newRoot,
      list.__ownerID,
      list._level,
      index,
      value,
      didAlter
    );
  }

  if (!GetRef(didAlter)) {
    return list;
  }

  if (list.__ownerID) {
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }
  return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
}

function updateVNode(node, ownerID, level, index, value, didAlter) {
  var idx = index >>> level & MASK;
  var nodeHas = node && idx < node.array.length;
  if (!nodeHas && value === undefined) {
    return node;
  }

  var newNode;

  if (level > 0) {
    var lowerNode = node && node.array[idx];
    var newLowerNode = updateVNode(
      lowerNode,
      ownerID,
      level - SHIFT,
      index,
      value,
      didAlter
    );
    if (newLowerNode === lowerNode) {
      return node;
    }
    newNode = editableVNode(node, ownerID);
    newNode.array[idx] = newLowerNode;
    return newNode;
  }

  if (nodeHas && node.array[idx] === value) {
    return node;
  }

  SetRef(didAlter);

  newNode = editableVNode(node, ownerID);
  if (value === undefined && idx === newNode.array.length - 1) {
    newNode.array.pop();
  } else {
    newNode.array[idx] = value;
  }
  return newNode;
}

function editableVNode(node, ownerID) {
  if (ownerID && node && ownerID === node.ownerID) {
    return node;
  }
  return new VNode(node ? node.array.slice() : [], ownerID);
}

function listNodeFor(list, rawIndex) {
  if (rawIndex >= getTailOffset(list._capacity)) {
    return list._tail;
  }
  if (rawIndex < 1 << list._level + SHIFT) {
    var node = list._root;
    var level = list._level;
    while (node && level > 0) {
      node = node.array[rawIndex >>> level & MASK];
      level -= SHIFT;
    }
    return node;
  }
}

function setListBounds(list, begin, end) {
  // Sanitize begin & end using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  if (begin !== undefined) {
    begin |= 0;
  }
  if (end !== undefined) {
    end |= 0;
  }
  var owner = list.__ownerID || new OwnerID();
  var oldOrigin = list._origin;
  var oldCapacity = list._capacity;
  var newOrigin = oldOrigin + begin;
  var newCapacity = end === undefined
    ? oldCapacity
    : end < 0 ? oldCapacity + end : oldOrigin + end;
  if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
    return list;
  }

  // If it's going to end after it starts, it's empty.
  if (newOrigin >= newCapacity) {
    return list.clear();
  }

  var newLevel = list._level;
  var newRoot = list._root;

  // New origin might need creating a higher root.
  var offsetShift = 0;
  while (newOrigin + offsetShift < 0) {
    newRoot = new VNode(
      newRoot && newRoot.array.length ? [undefined, newRoot] : [],
      owner
    );
    newLevel += SHIFT;
    offsetShift += 1 << newLevel;
  }
  if (offsetShift) {
    newOrigin += offsetShift;
    oldOrigin += offsetShift;
    newCapacity += offsetShift;
    oldCapacity += offsetShift;
  }

  var oldTailOffset = getTailOffset(oldCapacity);
  var newTailOffset = getTailOffset(newCapacity);

  // New size might need creating a higher root.
  while (newTailOffset >= 1 << newLevel + SHIFT) {
    newRoot = new VNode(
      newRoot && newRoot.array.length ? [newRoot] : [],
      owner
    );
    newLevel += SHIFT;
  }

  // Locate or create the new tail.
  var oldTail = list._tail;
  var newTail = newTailOffset < oldTailOffset
    ? listNodeFor(list, newCapacity - 1)
    : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

  // Merge Tail into tree.
  if (
    oldTail &&
    newTailOffset > oldTailOffset &&
    newOrigin < oldCapacity &&
    oldTail.array.length
  ) {
    newRoot = editableVNode(newRoot, owner);
    var node = newRoot;
    for (var level = newLevel; level > SHIFT; level -= SHIFT) {
      var idx = oldTailOffset >>> level & MASK;
      node = (node.array[idx] = editableVNode(node.array[idx], owner));
    }
    node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;
  }

  // If the size has been reduced, there's a chance the tail needs to be trimmed.
  if (newCapacity < oldCapacity) {
    newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
  }

  // If the new origin is within the tail, then we do not need a root.
  if (newOrigin >= newTailOffset) {
    newOrigin -= newTailOffset;
    newCapacity -= newTailOffset;
    newLevel = SHIFT;
    newRoot = null;
    newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
  } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
    offsetShift = 0;

    // Identify the new top root node of the subtree of the old root.
    while (newRoot) {
      var beginIndex = newOrigin >>> newLevel & MASK;
      if (beginIndex !== newTailOffset >>> newLevel & MASK) {
        break;
      }
      if (beginIndex) {
        offsetShift += (1 << newLevel) * beginIndex;
      }
      newLevel -= SHIFT;
      newRoot = newRoot.array[beginIndex];
    }

    // Trim the new sides of the new root.
    if (newRoot && newOrigin > oldOrigin) {
      newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
    }
    if (newRoot && newTailOffset < oldTailOffset) {
      newRoot = newRoot.removeAfter(
        owner,
        newLevel,
        newTailOffset - offsetShift
      );
    }
    if (offsetShift) {
      newOrigin -= offsetShift;
      newCapacity -= offsetShift;
    }
  }

  if (list.__ownerID) {
    list.size = newCapacity - newOrigin;
    list._origin = newOrigin;
    list._capacity = newCapacity;
    list._level = newLevel;
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }
  return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
}

function mergeIntoListWith(list, merger, collections) {
  var iters = [];
  var maxSize = 0;
  for (var ii = 0; ii < collections.length; ii++) {
    var value = collections[ii];
    var iter = IndexedCollection(value);
    if (iter.size > maxSize) {
      maxSize = iter.size;
    }
    if (!isCollection(value)) {
      iter = iter.map(function (v) { return fromJS(v); });
    }
    iters.push(iter);
  }
  if (maxSize > list.size) {
    list = list.setSize(maxSize);
  }
  return mergeIntoCollectionWith(list, merger, iters);
}

function getTailOffset(size) {
  return size < SIZE ? 0 : size - 1 >>> SHIFT << SHIFT;
}

var OrderedMap = (function (Map$$1) {
  function OrderedMap(value) {
    return value === null || value === undefined
      ? emptyOrderedMap()
      : isOrderedMap(value)
          ? value
          : emptyOrderedMap().withMutations(function (map) {
              var iter = KeyedCollection(value);
              assertNotInfinite(iter.size);
              iter.forEach(function (v, k) { return map.set(k, v); });
            });
  }

  if ( Map$$1 ) OrderedMap.__proto__ = Map$$1;
  OrderedMap.prototype = Object.create( Map$$1 && Map$$1.prototype );
  OrderedMap.prototype.constructor = OrderedMap;

  OrderedMap.of = function of (/*...values*/) {
    return this(arguments);
  };

  OrderedMap.prototype.toString = function toString () {
    return this.__toString('OrderedMap {', '}');
  };

  // @pragma Access

  OrderedMap.prototype.get = function get (k, notSetValue) {
    var index = this._map.get(k);
    return index !== undefined ? this._list.get(index)[1] : notSetValue;
  };

  // @pragma Modification

  OrderedMap.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._map.clear();
      this._list.clear();
      return this;
    }
    return emptyOrderedMap();
  };

  OrderedMap.prototype.set = function set (k, v) {
    return updateOrderedMap(this, k, v);
  };

  OrderedMap.prototype.remove = function remove (k) {
    return updateOrderedMap(this, k, NOT_SET);
  };

  OrderedMap.prototype.wasAltered = function wasAltered () {
    return this._map.wasAltered() || this._list.wasAltered();
  };

  OrderedMap.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._list.__iterate(
      function (entry) { return entry && fn(entry[1], entry[0], this$1); },
      reverse
    );
  };

  OrderedMap.prototype.__iterator = function __iterator (type, reverse) {
    return this._list.fromEntrySeq().__iterator(type, reverse);
  };

  OrderedMap.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newMap = this._map.__ensureOwner(ownerID);
    var newList = this._list.__ensureOwner(ownerID);
    if (!ownerID) {
      if (this.size === 0) {
        return emptyOrderedMap();
      }
      this.__ownerID = ownerID;
      this._map = newMap;
      this._list = newList;
      return this;
    }
    return makeOrderedMap(newMap, newList, ownerID, this.__hash);
  };

  return OrderedMap;
}(Map));

function isOrderedMap(maybeOrderedMap) {
  return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
}

OrderedMap.isOrderedMap = isOrderedMap;

OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

function makeOrderedMap(map, list, ownerID, hash) {
  var omap = Object.create(OrderedMap.prototype);
  omap.size = map ? map.size : 0;
  omap._map = map;
  omap._list = list;
  omap.__ownerID = ownerID;
  omap.__hash = hash;
  return omap;
}

var EMPTY_ORDERED_MAP;
function emptyOrderedMap() {
  return EMPTY_ORDERED_MAP ||
    (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
}

function updateOrderedMap(omap, k, v) {
  var map = omap._map;
  var list = omap._list;
  var i = map.get(k);
  var has = i !== undefined;
  var newMap;
  var newList;
  if (v === NOT_SET) {
    // removed
    if (!has) {
      return omap;
    }
    if (list.size >= SIZE && list.size >= map.size * 2) {
      newList = list.filter(function (entry, idx) { return entry !== undefined && i !== idx; });
      newMap = newList.toKeyedSeq().map(function (entry) { return entry[0]; }).flip().toMap();
      if (omap.__ownerID) {
        newMap.__ownerID = (newList.__ownerID = omap.__ownerID);
      }
    } else {
      newMap = map.remove(k);
      newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
    }
  } else if (has) {
    if (v === list.get(i)[1]) {
      return omap;
    }
    newMap = map;
    newList = list.set(i, [k, v]);
  } else {
    newMap = map.set(k, list.size);
    newList = list.set(list.size, [k, v]);
  }
  if (omap.__ownerID) {
    omap.size = newMap.size;
    omap._map = newMap;
    omap._list = newList;
    omap.__hash = undefined;
    return omap;
  }
  return makeOrderedMap(newMap, newList);
}

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  Original source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var SortedMapNode = function SortedMapNode(comparator, options, ownerID) {
  this.comparator = comparator;
  this.options = options;
  this.ownerID = ownerID;
};

SortedMapNode.prototype.getComparator = function getComparator () {};
SortedMapNode.prototype.get = function get (key, notSetValue) {};
SortedMapNode.prototype.upsert = function upsert (ownerID, key, value, didChangeSize, didAlter) {};
SortedMapNode.prototype.remove = function remove (ownerID, key, didChangeSize, didAlter) {};
SortedMapNode.prototype.fastRemove = function fastRemove (ownerID, key, didChangeSize, didAlter) {};
SortedMapNode.prototype.iterate = function iterate (fn, reverse) {};
SortedMapNode.prototype.print = function print (level, maxDepth) {};
SortedMapNode.prototype.checkConsistency = function checkConsistency (printFlag) {};

var SortedMapPacker = function SortedMapPacker() {};
SortedMapPacker.prototype.pack = function pack (comparator, options, ownerID, collection) {};

var SortedMapNodeFactory = function SortedMapNodeFactory() {};
SortedMapNodeFactory.prototype.createNode = function createNode (comparator, options, ownerID, entries, nodes) {};
SortedMapNodeFactory.prototype.createPacker = function createPacker () {};
SortedMapNodeFactory.prototype.createIterator = function createIterator (map, type, reverse) {};

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  Original source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var DEFAULT_TYPE = 'btree';
var DEFAULT_BTREE_ORDER = 33;

// #pragma Trie Nodes

var SortedMapBtreeNode = (function (SortedMapNode$$1) {
  function SortedMapBtreeNode(comparator, options, ownerID, entries, nodes) {
    SortedMapNode$$1.call(this, comparator, options, ownerID);

    this.entries = entries;
    this.nodes = nodes;

    this.btreeOrder = options && options.btreeOrder
      ? options.btreeOrder
      : DEFAULT_BTREE_ORDER;
    this.btreeNodeSplitSize = Math.floor((this.btreeOrder - 1) / 2);
    return this;
  }

  if ( SortedMapNode$$1 ) SortedMapBtreeNode.__proto__ = SortedMapNode$$1;
  SortedMapBtreeNode.prototype = Object.create( SortedMapNode$$1 && SortedMapNode$$1.prototype );
  SortedMapBtreeNode.prototype.constructor = SortedMapBtreeNode;

  SortedMapBtreeNode.prototype.getComparator = function getComparator () {
    return this.comparator;
  };

  SortedMapBtreeNode.prototype.get = function get (key, notSetValue) {
    var entries = this.entries;
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    if (GetRef(didMatch)) {
      var value = entries[idx][1];
      return value === NOT_SET ? notSetValue : value;
    } else {
      var nodes = this.nodes;
      if (nodes) {
        var value$1 = nodes[idx].get(key, notSetValue);
        return value$1 === NOT_SET ? notSetValue : value$1;
      }
    }
    return notSetValue;
  };

  // Returns first key in this subtree
  SortedMapBtreeNode.prototype.firstKey = function firstKey () {
    var nodes = this.nodes;
    if (nodes) {
      return nodes[0].firstKey();
    }

    var entries = this.entries;
    return entries[0][0];
  };

  // Returns last key in this subtree
  SortedMapBtreeNode.prototype.lastKey = function lastKey () {
    var nodes = this.nodes;
    if (nodes) {
      return nodes[nodes.length - 1].lastKey();
    }

    var entries = this.entries;
    return entries[entries.length - 1][0];
  };

  //
  // outKvn is out array with values [[key, value], node] i.e. [entry, node]
  // which can be consumed or returned by this operation
  //
  SortedMapBtreeNode.prototype.upsert = function upsert (ownerID, key, value, didChangeSize, didAlter, outKvn) {
    if (!outKvn) {
      // This must be a root case called from SortedMap
      var subKvn = [];

      var newRoot = this.upsert(
        ownerID,
        key,
        value,
        didChangeSize,
        didAlter,
        subKvn
      );

      if (subKvn[0]) {
        // Make a new root node
        var entries$1 = [subKvn[0]];
        var nodes$1 = [newRoot, subKvn[1]];
        newRoot = new SortedMapBtreeNode(
          this.comparator,
          this.options,
          ownerID,
          entries$1,
          nodes$1
        );
      }

      return newRoot;
    }

    var entries = this.entries;

    // Search keys
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    var exists = GetRef(didMatch);

    var nodes = this.nodes;
    var canEdit = ownerID && ownerID === this.ownerID;
    var newEntries;
    var newNodes;

    if (exists) {
      // Updating entries

      if (entries[idx][1] === value) {
        //
        // OPERATION: NONE, same value, no need to update
        //
        return this;
      } else {
        //
        // OPERATION: UPDATE entry value in entries
        //
        var entry = [key, value];

        SetRef(didAlter);
        newEntries = setIn$1(entries, idx, entry, canEdit);
        newNodes = nodes;
      }
    } else {
      // Inserting into entries or upserting nodes

      if (nodes) {
        //
        // RECURSIVE: UPSERT node recursively
        //
        var subKvn$1 = [];

        var updatedNode = nodes[idx].upsert(
          ownerID,
          key,
          value,
          didChangeSize,
          didAlter,
          subKvn$1
        );

        if (GetRef(didAlter)) {
          if (subKvn$1[0]) {
            //
            // Insert subKvn into this node
            //
            if (entries.length >= this.btreeOrder - 1) {
              return this.splitNode(
                idx,
                updatedNode,
                subKvn$1,
                outKvn,
                ownerID,
                canEdit
              );
            } else {
              //
              // Insert subKvn into entries and nodes
              //
              newEntries = spliceIn$1(entries, idx, subKvn$1[0], canEdit);
              newNodes = spliceIn$1(nodes, idx + 1, subKvn$1[1], canEdit);
              newNodes[idx] = updatedNode;
            }
          } else {
            //
            // No splitting, just setIn the updated subNode
            //
            newEntries = entries;
            newNodes = setIn$1(nodes, idx, updatedNode, canEdit);
          }
        } else {
          // Nothing changed
          return this;
        }
      } else {
        // Leaf node
        // Insert new entry into entries
        var entry$1 = [key, value];

        SetRef(didAlter);
        SetRef(didChangeSize);

        if (entries.length >= this.btreeOrder - 1) {
          return this.splitLeaf(idx, entry$1, outKvn, ownerID, canEdit);
        } else {
          //
          // OPERATION: INSERT new entry into entries
          //
          newEntries = spliceIn$1(entries, idx, entry$1, canEdit);
        }
      }
    }

    return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
  };

  // this version of remove doesn't do any rebalancing
  // it just sets the value in an entry to NOT_SET
  // this method would be preferable when removing large bulk
  // of entres from mutable SortedMap followed by pack()
  SortedMapBtreeNode.prototype.fastRemove = function fastRemove (ownerID, key, didChangeSize, didAlter) {
    var entries = this.entries;

    // Search keys
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    var exists = GetRef(didMatch);

    var nodes = this.nodes;
    var canEdit = ownerID && ownerID === this.ownerID;
    var newEntries;
    var newNodes;

    if (exists) {
      // Remove entry from entries
      if (entries[idx][1] === NOT_SET) {
        // the entry has been technically deleted already
        return this;
      } else {
        SetRef(didAlter);
        SetRef(didChangeSize);
        var newEntry = [key, NOT_SET];
        newEntries = setIn$1(entries, idx, newEntry, canEdit);
        newNodes = nodes;
      }
    } else {
      // Remove from node

      if (nodes) {
        // RECURSIVE: REMOVE from node recursively
        var updatedNode = nodes[idx].fastRemove(
          ownerID,
          key,
          didChangeSize,
          didAlter
        );

        if (GetRef(didAlter)) {
          //
          // No splitting, just setIn the updated subNode
          //
          newEntries = entries;
          newNodes = setIn$1(nodes, idx, updatedNode, canEdit);
        } else {
          // Nothing changed
          return this;
        }
      } else {
        // OPERATION: NONE, key to be removed doesn't exist
        return this;
      }
    }

    return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
  };

  //
  // outKvn is an output array with the following format
  //
  // [updatedEntry, updatedNode, updatedNodeIsLeft: boolean]
  //
  // The returned values can be:
  // - undefined - means the referenced item didn't change
  // - NOT_SET - means the referenced node was merged and has to be removed
  // - any other - the referenced item has to be updated with this value
  // outKvn[2] is boolean value indicating if node referenced in outKvnp[1]
  // is left (true) or right (false)
  //
  SortedMapBtreeNode.prototype.remove = function remove (ownerID, key, didChangeSize, didAlter, parent, parentIdx, outKvn) {
    var entries = this.entries;

    // Search keys
    var didMatch = MakeRef(DID_MATCH);
    var idx = binarySearch(this.comparator, entries, key, didMatch);
    var exists = GetRef(didMatch);

    var nodes = this.nodes;
    var canEdit = ownerID && ownerID === this.ownerID;
    var newEntries;
    var newNodes;

    if (exists) {
      // Remove entry from entries
      if (nodes) {
        // OPERATION: MOVE some entries from neighbors or MERGE with a neighbor
        if (entries[idx][1] === NOT_SET) {
          // the entry has been technically deleted already
          return this;
        } else {
          // WORKAROUND: so far let's do the workaround and just update
          // the entry in place with NOT_SET
          SetRef(didAlter);
          SetRef(didChangeSize);
          var newEntry = [key, NOT_SET];
          newEntries = setIn$1(entries, idx, newEntry, canEdit);
          newNodes = nodes;
        }
      } else {
        //
        // OPERATION: REMOVE entry from the LEAF
        //
        if (entries[idx][1] === NOT_SET) {
          // the entry has been technically deleted already
          return this;
        } else {
          SetRef(didAlter);
          SetRef(didChangeSize);
          if (entries.length <= this.btreeNodeSplitSize && parent) {
            // we don't have enough items in this leaf to just remove the entry
            // we should try borrow an entry from a neighbour or merge this mode with a neighbour
            // as a workaround we can just update a value in the entry to NOT_SET
            return this.consolidateLeaf(
              ownerID,
              idx,
              parent,
              parentIdx,
              canEdit,
              outKvn
            );
          } else {
            // it's ok to physically remove from the LEAF and no moves are needed
            // as the node will meet all the consistency rules
            newEntries = spliceOut$1(entries, idx, canEdit);
          }
        }
      }
    } else {
      // Remove from node

      if (nodes) {
        // RECURSIVE: REMOVE from node recursively
        var subKvn = [undefined, undefined, undefined];
        var updatedNode = nodes[idx].remove(
          ownerID,
          key,
          didChangeSize,
          didAlter,
          this,
          idx,
          subKvn
        );

        if (GetRef(didAlter)) {
          // take care of subKvn
          return this.spliceNode(
            ownerID,
            idx,
            updatedNode,
            parent,
            parentIdx,
            canEdit,
            subKvn,
            outKvn
          );
        } else {
          // Nothing changed
          return this;
        }
      } else {
        // OPERATION: NONE, key to be removed doesn't exist in this map
        return this;
      }
    }

    return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
  };

  SortedMapBtreeNode.prototype.makeNewNode = function makeNewNode (newEntries, newNodes, ownerID, canEdit) {
    if (newEntries.length === 0) {
      if (newNodes) {
        // Root node is turning into a leaf
        return newNodes[0];
      } else {
        // Root node leaf is turning into empty
        return;
      }
    }

    if (canEdit) {
      this.entries = newEntries;
      this.nodes = newNodes;
      return this;
    }
    return new SortedMapBtreeNode(
      this.comparator,
      this.options,
      ownerID,
      newEntries,
      newNodes
    );
  };

  SortedMapBtreeNode.prototype.print = function print (level, maxDepth) {
    function w(s) {
      process.stdout.write(s);
    }

    if (maxDepth && level >= maxDepth) {
      return;
    }

    var nodes = this.nodes;
    var entries = this.entries;

    if (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        w(indent(level));
        if (!node || !(node instanceof SortedMapNode$$1)) {
          w(
            '+ CORRUPT NODE[' +
              i +
              '] (L' +
              level +
              ') ' +
              JSON.stringify(node) +
              '\n'
          );
        } else {
          if (node.nodes) {
            w('+ NODE[' + i + '] (L' + level + ')\n');
          } else {
            w('+ LEAF[' + i + '] (L' + level + ')\n');
          }
          node.print(level + 1, maxDepth);
        }
        if (i < entries.length) {
          w(indent(level));
          var entry = entries[i];
          if (!entry) {
            w('- CORRUPT ENTRY[' + i + ']: ' + JSON.stringify(entry) + '\n');
          } else if (entry[1] === NOT_SET) {
            w('- REMOVED ENTRY[' + i + ']: ' + JSON.stringify(entry[0]) + '\n');
          } else {
            w('- ENTRY[' + i + ']: ' + JSON.stringify(entry[0]) + '\n');
          }
        }
      }
    } else {
      for (var i$1 = 0; i$1 < entries.length; i$1++) {
        w(indent(level));
        var entry$1 = entries[i$1];
        if (!entry$1) {
          w('- CORRUPT ENTRY[' + i$1 + ']: ' + JSON.stringify(entry$1) + '\n');
        } else if (entry$1[1] === NOT_SET) {
          w('- REMOVED ENTRY[' + i$1 + ']: ' + JSON.stringify(entry$1[0]) + '\n');
        } else {
          w('- ENTRY[' + i$1 + ']: ' + JSON.stringify(entry$1[0]) + '\n');
        }
      }
    }
  };

  SortedMapBtreeNode.prototype.checkConsistency = function checkConsistency (printFlag, level, n, leafLevel) {
    var this$1 = this;

    function w(f) {
      if (printFlag) {
        var s = f();
        if (s !== undefined) {
          process.stdout.write(indent(level));
          process.stdout.write(s);
        }
      }
    }

    if (!level) {
      level = 0;
    }
    if (!n) {
      n = 0;
    }
    if (!leafLevel) {
      leafLevel = [undefined];
    }

    if (this.nodes) {
      w(function () { return '+ Checking NODE[' + n + '] (L' + level + ')\n'; });
    } else {
      w(function () { return '+ Checking LEAF[' + n + '] (L' + level + ')\n'; });
      if (leafLevel[0] === undefined) {
        leafLevel[0] = level;
      } else if (leafLevel[0] != level) {
        failed(112, 'leaves are not on the same level');
      }
    }

    function failed(code, msg) {
      var s = 'Consistency Check Failed with error code ' + code + ': ' + msg;
      if (printFlag) {
        w(function () { return s + '\n'; });
        return code;
      }

      throw new Error(s);
    }

    var entries = this.entries;
    var nodes = this.nodes;

    if (!entries) {
      return failed(101, 'empty entries in a node');
    }

    if (!(0 < entries.length && entries.length < this.btreeOrder)) {
      return failed(
        102,
        'entries length is out of range from 0 to (btreeOrder-1)'
      );
    }

    if (level > 0 && !(this.btreeNodeSplitSize <= entries.length)) {
      return failed(103, 'entries length is shorter than btreeNodeSplitSize');
    }

    if (nodes && !(nodes.length === entries.length + 1)) {
      return failed(104, 'nodes length out of sync with entries length');
    }

    var loop = function ( i ) {
      var entry = entries[i];

      if (!entry) { return { v: failed(105, 'empty entry') }; }

      if (!(typeof entry === 'object' && entry instanceof Array))
        { return { v: failed(106, 'entry is not Array') }; }

      if (!(entry.length === 2)) { return { v: failed(107, 'entry is not Array[2]') }; }

      if (entry[1] === NOT_SET) {
        w(
          function () { return '    - Checking REMOVED ENTRY[' +
            i +
            ']: ' +
            JSON.stringify(entry[0]) +
            '\n'; }
        );
        if (!nodes) {
          failed(113, 'NOT_SET values are not allowed in leaves');
        }
      } else {
        w(
          function () { return '    - Checking ENTRY[' +
            i +
            ']: ' +
            JSON.stringify(entry[0]) +
            '\n'; }
        );
      }
    };

    for (var i = 0; i < entries.length; i++) {
      var returned = loop( i );

      if ( returned ) return returned.v;
    }

    // Check if all the keys are sorted
    for (var i$1 = 0; i$1 < entries.length - 1; i$1++) {
      if (!(this$1.comparator(entries[i$1][0], entries[i$1 + 1][0]) < 0)) {
        return failed(108, 'the entries are not sorted');
      }
    }

    if (nodes)
      { for (var i$2 = 0; i$2 < nodes.length; i$2++) {
        var node = nodes[i$2];

        if (!node || !(node instanceof SortedMapNode$$1))
          { return failed(109, 'empty or corrupt node'); }

        // Check the node recursively
        var code = node.checkConsistency(printFlag, level + 1, i$2, leafLevel);

        if (code !== 0) {
          return code;
        }

        if (
          i$2 > 0 && !(this$1.comparator(entries[i$2 - 1][0], node.firstKey()) < 0)
        ) {
          return failed(110, 'the entry and right node not sorted');
        }

        if (
          i$2 < entries.length &&
          !(this$1.comparator(node.lastKey(), entries[i$2][0]) < 0)
        ) {
          return failed(111, 'the entry and left node not sorted');
        }
      } }

    return 0;
  };

  return SortedMapBtreeNode;
}(SortedMapNode)); // class

// #pragma Iterators

SortedMapBtreeNode.prototype.iterate = function(fn, reverse) {
  var entries = this.entries;
  var nodes = this.nodes;

  if (nodes) {
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex + 1 - ii : ii];
      if (node.iterate(fn, reverse) === false) {
        return false;
      }
      var entry = entries[reverse ? maxIndex - ii : ii];
      if (entry[1] === NOT_SET) {
        continue;
      }
      if (fn(entry) === false) {
        return false;
      }
    }

    // Iterate through the remaining last node
    var node$1 = nodes[reverse ? 0 : nodes.length - 1];
    if (node$1.iterate(fn, reverse) === false) {
      return false;
    }
  } else {
    for (var ii$1 = 0, maxIndex$1 = entries.length - 1; ii$1 <= maxIndex$1; ii$1++) {
      var entry$1 = entries[reverse ? maxIndex$1 - ii$1 : ii$1];
      if (entry$1[1] === NOT_SET) {
        continue;
      }
      if (fn(entry$1) === false) {
        return false;
      }
    }
  }
};

var SortedMapBtreeNodeIterator = (function (Iterator$$1) {
  function SortedMapBtreeNodeIterator(map, type, reverse) {
    this._type = type;
    this._reverse = reverse;
    this._stack = map._root && mapIteratorFrame$1(map._root);
  }

  if ( Iterator$$1 ) SortedMapBtreeNodeIterator.__proto__ = Iterator$$1;
  SortedMapBtreeNodeIterator.prototype = Object.create( Iterator$$1 && Iterator$$1.prototype );
  SortedMapBtreeNodeIterator.prototype.constructor = SortedMapBtreeNodeIterator;

  SortedMapBtreeNodeIterator.prototype.next = function next () {
    var this$1 = this;

    var type = this._type;
    var stack = this._stack;
    while (stack) {
      var node = stack.node;
      var index = stack.index++;
      if (node.nodes) {
        var maxIndex = node.entries.length + node.nodes.length - 1;
        if (index <= maxIndex) {
          if (index % 2 === 0) {
            index /= 2;
            var subNode = node.nodes[
              this$1._reverse ? node.nodes.length - 1 - index : index
            ];
            if (subNode) {
              stack = (this$1._stack = mapIteratorFrame$1(subNode, stack));
            }
            continue;
          } else {
            index = (index - 1) / 2;
            var entry = node.entries[
              this$1._reverse ? node.entries.length - 1 - index : index
            ];
            if (entry[1] === NOT_SET) {
              continue;
            }
            return mapIteratorValue$1(type, entry);
          }
        }
      } else {
        // node.entries
        var maxIndex$1 = node.entries.length - 1;
        if (index <= maxIndex$1) {
          var entry$1 = node.entries[this$1._reverse ? maxIndex$1 - index : index];
          if (entry$1[1] === NOT_SET) {
            continue;
          }
          return mapIteratorValue$1(type, entry$1);
        }
      }
      stack = (this$1._stack = this$1._stack.__prev);
    }
    return iteratorDone();
  };

  return SortedMapBtreeNodeIterator;
}(Iterator));

function mapIteratorValue$1(type, entry) {
  return iteratorValue(type, entry[0], entry[1]);
}

function mapIteratorFrame$1(node, prev) {
  return {
    node: node,
    index: 0,
    __prev: prev
  };
}

//
// Array manipulation algorithms
//

function allocArray(n) {
  var a = new Array(n);
  return a;
}

var _indentStr = new Array(120).join(' ');

function indent(level) {
  var indentCnt = 4 * level;
  if (indentCnt > _indentStr.length) {
    indentCnt = _indentStr.length;
  }
  return _indentStr.substring(0, indentCnt);
}

function setIn$1(array, idx, val, canEdit) {
  if (canEdit) {
    array[idx] = val;
    return array;
  }

  var newLen = array.length;
  var newArray = allocArray(newLen);
  for (var ii = 0; ii < idx; ii++) {
    newArray[ii] = array[ii];
  }
  newArray[idx] = val;
  for (var ii$1 = idx + 1; ii$1 < newLen; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  return newArray;
}

function spliceIn$1(array, idx, val, canEdit) {
  var newLen = array.length + 1;

  if (canEdit) {
    // Have to shift items going backwards
    for (var ii = newLen - 1, stop = idx + 1; ii >= stop; ii--) {
      array[ii] = array[ii - 1];
    }
    array[idx] = val;
    return array;
  }

  var newArray = allocArray(newLen);
  for (var ii$1 = 0; ii$1 < idx; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  newArray[idx] = val;
  for (var ii$2 = idx + 1; ii$2 < newLen; ii$2++) {
    newArray[ii$2] = array[ii$2 - 1];
  }
  return newArray;
}

function spliceOut$1(array, idx, canEdit) {
  var newLen = array.length - 1;

  if (canEdit) {
    for (var ii = idx; ii < newLen; ii++) {
      array[ii] = array[ii + 1];
    }
    array.length = newLen;
    return array;
  }

  var newArray = allocArray(newLen);
  for (var ii$1 = 0; ii$1 < idx; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  for (var ii$2 = idx; ii$2 < newLen; ii$2++) {
    newArray[ii$2] = array[ii$2 + 1];
  }
  return newArray;
}

function spliceOutN(array, idx, n, canEdit) {
  var newLen = array.length - n;

  if (canEdit) {
    for (var ii = idx; ii < newLen; ii++) {
      array[ii] = array[ii + n];
    }
    array.length = newLen;
    return array;
  }

  var newArray = allocArray(newLen);
  for (var ii$1 = 0; ii$1 < idx; ii$1++) {
    newArray[ii$1] = array[ii$1];
  }
  for (var ii$2 = idx; ii$2 < newLen; ii$2++) {
    newArray[ii$2] = array[ii$2 + n];
  }
  return newArray;
}

//
// Example: spliceOutShiftRightN(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3, 2, canEdit)
//
// removes item at index=3 ('d') and moves all remaining items in an awway right by 2 positions
//
// Result: [?, ?, 'a', 'b', 'c', 'f', 'g']
//
function spliceOutShiftRightN(array, idx, rightN, canEdit) {
  var newLen = array.length - 1 + rightN;
  var newArray;

  if (canEdit) {
    array.length = newLen;
    newArray = array;
  } else {
    newArray = allocArray(newLen);
  }

  for (var ii = newLen - 1, stop = idx + rightN; ii >= stop; ii--) {
    newArray[ii] = array[ii - rightN + 1];
  }
  for (var ii$1 = idx + rightN - 1; ii$1 >= rightN; ii$1--) {
    newArray[ii$1] = array[ii$1 - rightN];
  }
  return newArray;
}

//
// First: setIn(array, setInIdx, setInValue)
// Then: spliceOut(array, spliceOutIdx)
// Optimized, eliminating redundant copying
// Equivalent of setInSpliceOutN(array, setInIdx, setInValue, spliceOutIdx, 1, canEdit)
//
// Example: setInSpliceOut(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3, 'D', 1, canEdit)
//
// Result: ['a', 'c', 'D', 'f', 'g']
//
function setInSpliceOut(array, setInIdx, setInValue, spliceOutIdx, canEdit) {
  var newArray = spliceOut$1(array, spliceOutIdx, canEdit);

  // Now we can edit regardless of canEdit
  if (setInIdx < spliceOutIdx) {
    newArray[setInIdx] = setInValue;
  } else if (setInIdx > spliceOutIdx) {
    newArray[setInIdx - 1] = setInValue;
  }

  return newArray;
}

function binarySearch(comparator, entries, key, didMatch) {
  var first = 0;
  var range = entries.length;

  while (range > 0) {
    var half = Math.floor(range / 2);
    var entry = entries[first + half];
    var entryKey = entry[0];
    var cmp = comparator(key, entryKey);
    if (cmp == 0) {
      SetRef(didMatch);
      return first + half;
    }
    if (cmp > 0) {
      first += half + 1;
      range -= half + 1;
    } else {
      range = half;
    }
  }
  return first;
}

//
// Node Split algorithms
//
SortedMapBtreeNode.prototype.splitNode = function(
  idx,
  updatedNode,
  subKvn,
  outKvn,
  ownerID,
  canEdit
) {
  var entries = this.entries;
  var nodes = this.nodes;
  var medianIdx = this.btreeNodeSplitSize;

  var newEntries;
  var newNodes;

  if (idx < medianIdx) {
    var rightEntries = entries.slice(medianIdx, entries.length);
    var rightNodes = nodes.slice(medianIdx, nodes.length);
    var rightNode = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries,
      rightNodes
    );

    outKvn[0] = entries[medianIdx - 1];
    outKvn[1] = rightNode;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      nodes.length = medianIdx + 1;

      // shift the items right to make room for returned Kvn
      // and updatedNode (has to go backwards)
      for (var i = medianIdx - 1; i >= idx + 1; i--) {
        entries[i] = entries[i - 1];
        nodes[i + 1] = nodes[i];
      }

      // place returned Kvn and updated node into entries and nodes
      entries[idx] = subKvn[0];
      nodes[idx] = updatedNode;
      nodes[idx + 1] = subKvn[1];
      newEntries = entries;
      newNodes = nodes;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = allocArray(medianIdx);
      newNodes = allocArray(medianIdx + 1);

      // copy the items before idx into new arrays
      for (var i$1 = 0; i$1 < idx; i$1++) {
        newEntries[i$1] = entries[i$1];
        newNodes[i$1] = nodes[i$1];
      }

      // place returned Kvn and updated node into new arrays
      newEntries[idx] = subKvn[0];
      newNodes[idx] = updatedNode;
      newNodes[idx + 1] = subKvn[1];

      // copy remaining items after idx into new arrays
      for (var i$2 = idx + 1; i$2 < medianIdx; i$2++) {
        newEntries[i$2] = entries[i$2 - 1];
        newNodes[i$2 + 1] = nodes[i$2];
      }
    }
  } else if (idx === medianIdx) {
    // allocate the arrays for right node
    var rightEntries$1 = allocArray(entries.length - medianIdx);
    var rightNodes$1 = allocArray(nodes.length - medianIdx);

    // place subKvn to the beginning of right node arrays
    rightEntries$1[0] = entries[medianIdx];
    rightNodes$1[0] = subKvn[1];

    // copy the remaining items into the right node arrays
    for (var i$3 = 1, len = rightEntries$1.length; i$3 < len; i$3++) {
      rightEntries$1[i$3] = entries[medianIdx + i$3];
      rightNodes$1[i$3] = nodes[medianIdx + i$3];
    }
    // copy the last node item into rightNodes
    rightNodes$1[rightNodes$1.length - 1] = nodes[nodes.length - 1];

    var rightNode$1 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$1,
      rightNodes$1
    );

    outKvn[0] = subKvn[0];
    outKvn[1] = rightNode$1;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      nodes.length = medianIdx + 1;
      nodes[idx] = updatedNode;
      newEntries = entries;
      newNodes = nodes;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = allocArray(medianIdx);
      newNodes = allocArray(medianIdx + 1);

      // copy the items before idx into new arrays
      for (var i$4 = 0; i$4 < medianIdx; i$4++) {
        newEntries[i$4] = entries[i$4];
        newNodes[i$4] = nodes[i$4];
      }

      // place returned Kvn and updated node into new node arrays
      newNodes[idx] = updatedNode;
    }
  } else {
    // idx > medianIdx

    // allocate the arrays for right node
    var rightEntries$2 = allocArray(entries.length - medianIdx);
    var rightNodes$2 = allocArray(nodes.length - medianIdx);

    // copy the items into the beginning of right node arrays
    var idx0 = medianIdx + 1;
    var rightIdx = idx - idx0;
    for (var i$5 = 0, len$1 = rightIdx; i$5 < len$1; i$5++) {
      rightEntries$2[i$5] = entries[idx0 + i$5];
      rightNodes$2[i$5] = nodes[idx0 + i$5];
    }

    // place subKvn to the middle right node arrays
    rightEntries$2[rightIdx] = subKvn[0];
    rightNodes$2[rightIdx] = updatedNode;
    rightNodes$2[rightIdx + 1] = subKvn[1];

    // copy the remaining items into the right node arrays
    for (var i$6 = rightIdx + 1, len$2 = rightEntries$2.length; i$6 < len$2; i$6++) {
      rightEntries$2[i$6] = entries[medianIdx + i$6];
      rightNodes$2[i$6 + 1] = nodes[medianIdx + i$6 + 1];
    }

    var rightNode$2 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$2,
      rightNodes$2
    );

    outKvn[0] = entries[medianIdx];
    outKvn[1] = rightNode$2;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      nodes.length = medianIdx + 1;
      newEntries = entries;
      newNodes = nodes;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = entries.slice(0, medianIdx);
      newNodes = nodes.slice(0, medianIdx + 1);
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

SortedMapBtreeNode.prototype.splitLeaf = function(
  idx,
  entry,
  outKvn,
  ownerID,
  canEdit
) {
  var entries = this.entries;
  var nodes = this.nodes;
  var medianIdx = this.btreeNodeSplitSize;

  var newEntries;
  var newNodes;

  if (idx < medianIdx) {
    var rightEntries = entries.slice(medianIdx, entries.length);
    var rightNode = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries
    );

    outKvn[0] = entries[medianIdx - 1];
    outKvn[1] = rightNode;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;

      // shift the items right to make room for returned Kvn
      // and updatedNode (has to go backwards)
      for (var i = medianIdx - 1; i >= idx + 1; i--) {
        entries[i] = entries[i - 1];
      }

      // place returned Kvn and updated node into entries and nodes
      entries[idx] = entry;
      newEntries = entries;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = allocArray(medianIdx);

      // copy the items before idx into new arrays
      for (var i$1 = 0; i$1 < idx; i$1++) {
        newEntries[i$1] = entries[i$1];
      }

      // place returned Kvn and updated node into new arrays
      newEntries[idx] = entry;

      // copy remaining items after idx into new arrays
      for (var i$2 = idx + 1; i$2 < medianIdx; i$2++) {
        newEntries[i$2] = entries[i$2 - 1];
      }
    }
  } else if (idx === medianIdx) {
    // allocate the arrays for right node
    var rightEntries$1 = allocArray(entries.length - medianIdx);

    // place subKvn to the beginning of right node arrays
    rightEntries$1[0] = entries[medianIdx];

    // copy the remaining items into the right node arrays
    for (var i$3 = 1, len = rightEntries$1.length; i$3 < len; i$3++) {
      rightEntries$1[i$3] = entries[medianIdx + i$3];
    }

    var rightNode$1 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$1
    );

    outKvn[0] = entry;
    outKvn[1] = rightNode$1;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      newEntries = entries;
    } else {
      // allocate new arrays for entries
      newEntries = allocArray(medianIdx);

      // copy the items before idx into new arrays
      for (var i$4 = 0; i$4 < medianIdx; i$4++) {
        newEntries[i$4] = entries[i$4];
      }
    }
  } else {
    // idx > medianIdx

    // allocate the arrays for right node
    var rightEntries$2 = allocArray(entries.length - medianIdx);

    // copy the items into the beginning of right node arrays
    var idx0 = medianIdx + 1;
    var rightIdx = idx - idx0;
    for (var i$5 = 0, len$1 = rightIdx; i$5 < len$1; i$5++) {
      rightEntries$2[i$5] = entries[idx0 + i$5];
    }

    // place subKvn to the middle right node arrays
    rightEntries$2[rightIdx] = entry;

    // copy the remaining items into the right node arrays
    for (var i$6 = rightIdx + 1, len$2 = rightEntries$2.length; i$6 < len$2; i$6++) {
      rightEntries$2[i$6] = entries[medianIdx + i$6];
    }

    var rightNode$2 = new SortedMapBtreeNode(
      this.comparator,
      this.options,
      this.ownerID,
      rightEntries$2
    );

    outKvn[0] = entries[medianIdx];
    outKvn[1] = rightNode$2;

    if (canEdit) {
      // truncate existing entries and nodes
      entries.length = medianIdx;
      newEntries = entries;
    } else {
      // allocate new arrays for entries and nodes
      newEntries = entries.slice(0, medianIdx);
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

SortedMapBtreeNode.prototype.spliceNode = function(
  ownerID,
  idx,
  updatedNode,
  parent,
  parentIdx,
  canEdit,
  subKvn,
  outKvn
) {
  var entries = this.entries;
  var nodes = this.nodes;

  var newEntries;
  var newNodes;

  var updatedEntry = subKvn[0];
  var updatedNeighbor = subKvn[1];
  var updatedNeighborIsLeft = subKvn[2];

  if (updatedNeighbor === NOT_SET) {
    //
    // Removing entry and node
    //
    if (entries.length <= this.btreeNodeSplitSize && parent) {
      // Not enough room, consolidate this node
      if (updatedNeighborIsLeft) {
        // remove left node in newNodes
        return this.consolidateNode(
          ownerID,
          idx,
          updatedNode,
          idx - 1,
          idx - 1,
          parent,
          parentIdx,
          canEdit,
          outKvn
        );
      } else {
        // remove right node in newNodes
        return this.consolidateNode(
          ownerID,
          idx,
          updatedNode,
          idx,
          idx + 1,
          parent,
          parentIdx,
          canEdit,
          outKvn
        );
      }
    } else {
      if (updatedNeighborIsLeft) {
        // update left node in newNodes
        newNodes = setInSpliceOut(nodes, idx, updatedNode, idx - 1, canEdit);
        newEntries = spliceOut$1(entries, idx - 1, canEdit);
      } else {
        // update right node in newNodes
        newNodes = setInSpliceOut(nodes, idx, updatedNode, idx + 1, canEdit);
        newEntries = spliceOut$1(entries, idx, canEdit);
      }
    }
  } else {
    //
    // Updating entry and node
    //
    newNodes = setIn$1(nodes, idx, updatedNode, canEdit);
    if (updatedNeighbor) {
      if (updatedNeighborIsLeft) {
        // update left node in newNodes
        newNodes[idx - 1] = updatedNeighbor;
        newEntries = setIn$1(entries, idx - 1, updatedEntry, canEdit);
      } else {
        // update right node in newNodes
        newNodes[idx + 1] = updatedNeighbor;
        newEntries = setIn$1(entries, idx, updatedEntry, canEdit);
      }
    } else if (updatedEntry) {
      newEntries = setIn$1(entries, idx, updatedEntry, canEdit);
    } else {
      newEntries = entries;
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

//
// We updating node at position idx, removing the entry at position removeEntryIdx,
// and removing a neighbor node at position removeNodeIdx
// (either on the left or right side of updated node). We know that we already have
// a minimum number of allowed entries in the node, so we have to either
// move some entries from a neighbor or merge with neighbour
//
SortedMapBtreeNode.prototype.consolidateNode = function(
  ownerID,
  idx,
  updatedNode,
  removeEntryIdx,
  removeNodeIdx,
  parent,
  parentIdx,
  canEdit,
  outKvn
) {
  var entries = this.entries;
  var nodes = this.nodes;

  var parentEntries = parent.entries;
  var parentNodes = parent.nodes;

  //
  // Decide if we are going to move entries or merge
  // and with which neighbor we are going to proceed
  //
  var donorNode;
  var mergeNode;
  var leftNode;
  var rightNode;
  if (parentIdx === 0) {
    // Only right node can be a host within a scope of this parent
    rightNode = parentNodes[parentIdx + 1];
    mergeNode = (donorNode = rightNode);
  } else if (parentIdx === parentNodes.length - 1) {
    // Only left node can be a host within a scope of this parent
    leftNode = parentNodes[parentIdx - 1];
    mergeNode = (donorNode = leftNode);
  } else {
    // Both left and right node could be a potential donor
    leftNode = parentNodes[parentIdx - 1];
    rightNode = parentNodes[parentIdx + 1];
    var leftAvail = (leftNode.entries.length - this.btreeNodeSplitSize + 1) /
      2;
    var rightAvail = (rightNode.entries.length -
      this.btreeNodeSplitSize +
      1) /
      2;
    if (leftAvail >= rightAvail) {
      donorNode = leftNode;
      mergeNode = rightNode;
    } else {
      donorNode = rightNode;
      mergeNode = leftNode;
    }
  }

  var newEntries;
  var newNodes;

  //
  // Move from the LEFT node
  //
  function moveFromLeftNode(node, n, merge) {
    // allocate newEntries extended by n
    newEntries = spliceOutShiftRightN(entries, removeEntryIdx, n, canEdit);
    newNodes = spliceOutShiftRightN(nodes, removeNodeIdx, n, canEdit);

    // now set the updatedNode, adjust the index according to the shift above
    var uIdx = idx < removeNodeIdx ? idx + n : idx + n - 1;
    newNodes[uIdx] = updatedNode;

    // Then move an item from the parent node into newEntries
    var i = n - 1;
    newEntries[i] = parentEntries[parentIdx - 1];

    // And move rightest node from the neighbor into newNodes
    newNodes[i--] = node.nodes[node.nodes.length - 1];

    // Then copy the items from the node
    var j;
    for (j = node.entries.length - 1; i >= 0; i--, j--) {
      newEntries[i] = node.entries[j];
      newNodes[i] = node.nodes[j];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining entry from node to parent
      outKvn[0] = node.entries[j];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(
        node.entries,
        node.entries.length - n,
        n,
        canEdit
      );
      var newNodeNodes = spliceOutN(
        node.nodes,
        node.nodes.length - n,
        n,
        canEdit
      );

      outKvn[1] = node.makeNewNode(
        newNodeEntries,
        newNodeNodes,
        ownerID,
        canEdit
      );
    }
    outKvn[2] = true;
  }

  //
  // Move from the right node
  //
  function moveFromRightNode(node, n, merge) {
    newEntries = spliceOut$1(entries, removeEntryIdx, canEdit);
    newNodes = spliceOut$1(nodes, removeNodeIdx, canEdit);

    // Expand new entries
    var j = newEntries.length;
    newEntries.length = newEntries.length + n;
    newNodes.length = newNodes.length + n;

    // now set the updatedNode, adjust the index according to the shift above
    var uIdx = idx < removeNodeIdx ? idx : idx - 1;
    newNodes[uIdx] = updatedNode;

    // Then move an item from the parent node into newEntries
    newEntries[j++] = parentEntries[parentIdx];

    // Also copy the first item in right neighbor into newNodes
    newNodes[j] = node.nodes[0];

    // Then copy the items from the node
    for (var i = 0, iLimit = n - 1; i < iLimit; i++) {
      newEntries[j + i] = node.entries[i];
      newNodes[j + i + 1] = node.nodes[i + 1];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining item from node to parent
      outKvn[0] = node.entries[n - 1];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(node.entries, 0, n, canEdit);
      var newNodeNodes = spliceOutN(node.nodes, 0, n, canEdit);

      outKvn[1] = node.makeNewNode(
        newNodeEntries,
        newNodeNodes,
        ownerID,
        canEdit
      );
    }
    outKvn[2] = false;
  }

  var donorAvail = Math.floor(
    (donorNode.entries.length - this.btreeNodeSplitSize + 1) / 2
  );
  if (donorAvail > 0) {
    //
    // OPERATION: MOVE
    //
    // move donorAvail entries from donorNode to this leaf through parentNodes
    if (donorNode === leftNode) {
      moveFromLeftNode(donorNode, donorAvail);
    } else {
      moveFromRightNode(donorNode, donorAvail);
    }
  } else {
    //
    // OPERATION: MERGE
    //
    // neither neighbour has enough entries to donate
    // we gotta merge this node with mergeNode which has fewer entries available
    if (mergeNode === leftNode) {
      // Merge with the left node
      moveFromLeftNode(mergeNode, mergeNode.entries.length + 1, true);
    } else {
      // Merge with the right node
      moveFromRightNode(mergeNode, mergeNode.entries.length + 1, true);
    }
  }

  return this.makeNewNode(newEntries, newNodes, ownerID, canEdit);
};

// We are eliminating the entry at position idx and we know that we already
// have a minimum number of allowed entries in the node, so we have to either
// move some entries from a neighbor or merge with neighbour
SortedMapBtreeNode.prototype.consolidateLeaf = function(
  ownerID,
  idx,
  parent,
  parentIdx,
  canEdit,
  outKvn
) {
  var entries = this.entries;
  var parentEntries = parent.entries;
  var parentNodes = parent.nodes;

  //
  // Decide if we are going to move entries or merge
  // and with which neighbor we are going to proceed
  //
  var donorNode;
  var mergeNode;
  var leftNode;
  var rightNode;
  if (parentIdx === 0) {
    // Only right node can be a host within a scope of this parent
    rightNode = parentNodes[parentIdx + 1];
    mergeNode = (donorNode = rightNode);
  } else if (parentIdx === parentNodes.length - 1) {
    // Only left node can be a host within a scope of this parent
    leftNode = parentNodes[parentIdx - 1];
    mergeNode = (donorNode = leftNode);
  } else {
    // Both left and right node could be a potential donor
    leftNode = parentNodes[parentIdx - 1];
    rightNode = parentNodes[parentIdx + 1];
    var leftAvail = leftNode.entries.length - this.btreeNodeSplitSize;
    var rightAvail = rightNode.entries.length - this.btreeNodeSplitSize;
    if (leftAvail >= rightAvail) {
      donorNode = leftNode;
    } else {
      donorNode = rightNode;
    }
  }

  var newEntries;
  //
  // Move from the LEFT node
  //
  // n - is the number of entries added to the target node
  //
  function moveFromLeftNode(node, n, merge) {
    // allocate newEntries extended by n
    newEntries = spliceOutShiftRightN(entries, idx, n, canEdit);

    // m is number of entries to be moved from donor node
    var m = n;
    if (!parentNotSet) {
      // Move an item from the parent node into newEntries
      newEntries[n - 1] = parentEntry;
      m--;
    }

    // Then copy the items from the node
    for (var i = 0; i < m; i++) {
      newEntries[i] = node.entries[node.entries.length - m + i];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining item from node to parent
      m++;
      outKvn[0] = node.entries[node.entries.length - m];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(
        node.entries,
        node.entries.length - m,
        m,
        canEdit
      );

      outKvn[1] = node.makeNewNode(newNodeEntries, undefined, ownerID, canEdit);
    }
    outKvn[2] = true;
  }

  //
  // Move from the right node
  //
  // n - is the number of entries added to the target node
  //
  function moveFromRightNode(node, n, merge) {
    newEntries = spliceOut$1(entries, idx, canEdit);
    // Expand new entries
    var j = newEntries.length;
    newEntries.length = newEntries.length + n;

    // m is number of entries to be moved from donor node
    var m = n;
    if (!parentNotSet) {
      // Move an item from the parent node into newEntries
      newEntries[j++] = parentEntry;
      m--;
    }

    // Then copy the items from the node
    for (var i = 0; i < m; i++) {
      newEntries[j + i] = node.entries[i];
    }

    if (merge) {
      outKvn[1] = NOT_SET;
    } else {
      // Last, copy the remaining item from node to parent
      outKvn[0] = node.entries[m++];

      // Make a copy of donor's node without donated entries
      var newNodeEntries = spliceOutN(node.entries, 0, m, canEdit);

      outKvn[1] = node.makeNewNode(newNodeEntries, undefined, ownerID, canEdit);
    }
    outKvn[2] = false;
  }

  var parentEntry = donorNode === leftNode
    ? parentEntries[parentIdx - 1]
    : parentEntries[parentIdx];
  var parentNotSet = parentEntry[1] === NOT_SET ? true : false;
  var parentAdj = parentNotSet ? 1 : 0;
  var donorAvail = donorNode.entries.length -
    this.btreeNodeSplitSize -
    parentAdj;
  if (donorAvail > 0) {
    //
    // OPERATION: MOVE
    //
    // move donorAvail entries from donorNode to this leaf through parentNodes
    var n = Math.floor((donorAvail + 1) / 2);
    if (donorNode === leftNode) {
      moveFromLeftNode(donorNode, n);
    } else {
      moveFromRightNode(donorNode, n);
    }
  } else {
    //
    // OPERATION: MERGE
    //
    // neither neighbour has enough entries to donate
    // we gotta merge this node with donorNode
    var n$1 = donorNode.entries.length + 1 - parentAdj;
    if (donorNode === leftNode) {
      // Merge with the left node
      moveFromLeftNode(donorNode, n$1, true);
    } else {
      // Merge with the right node
      moveFromRightNode(donorNode, n$1, true);
    }
  }

  return this.makeNewNode(newEntries, undefined, ownerID, canEdit);
};

var SortedMapBtreeNodePacker = (function (SortedMapPacker$$1) {
  function SortedMapBtreeNodePacker () {
    SortedMapPacker$$1.apply(this, arguments);
  }

  if ( SortedMapPacker$$1 ) SortedMapBtreeNodePacker.__proto__ = SortedMapPacker$$1;
  SortedMapBtreeNodePacker.prototype = Object.create( SortedMapPacker$$1 && SortedMapPacker$$1.prototype );
  SortedMapBtreeNodePacker.prototype.constructor = SortedMapBtreeNodePacker;

  SortedMapBtreeNodePacker.prototype.calcPlanCnt = function calcPlanCnt (order, height) {
    if (height < 1 || height > 20) {
      throw new Error('Height is out of supported limit');
    }

    // The recursive algorithm would be:
    //
    // if(height <= 1) {
    // 	return order - 1;
    // }
    // return order * this.calcPlanCnt(order, height - 1) + (order - 1);

    var n = order - 1;

    for (var h = 1; h < height; h++) {
      n = n * order + (order - 1);
    }

    return n;
  };

  SortedMapBtreeNodePacker.prototype.prepareCachedPlan = function prepareCachedPlan (order, n) {
    var key = order.toString() + ' ' + n.toString();

    var cachedPlan = SortedMapBtreeNodePacker.cache[key];

    if (cachedPlan) {
      return cachedPlan;
    }

    var plan = this.preparePlan(order, n);
    this.verifyPlan(plan);

    if (
      order < 100 &&
      n <= 100 &&
      n >= order &&
      SortedMapBtreeNodePacker.cacheSize < 500
    ) {
      SortedMapBtreeNodePacker.cache[key] = plan;
      SortedMapBtreeNodePacker.cacheSize++;
    }

    return plan;
  };

  SortedMapBtreeNodePacker.prototype.preparePlan = function preparePlan (order, n) {
    //
    // First determine height of the tree we are building
    //
    var order1 = order - 1;
    var height = 1;
    var maxEntriesCnt = order1;
    var maxEntriesCnt1;
    while (maxEntriesCnt < n) {
      maxEntriesCnt1 = maxEntriesCnt;
      maxEntriesCnt = maxEntriesCnt * order + order1;
      height++;
    }

    if (maxEntriesCnt === n) {
      // Exact match for the full tree
      return {
        op: 'build',
        full: true,
        height: height,
        order: order,
        repeat: 1,
        total: n
      };
    }

    if (height === 1) {
      return {
        op: 'build',
        full: false,
        height: height,
        order: order,
        repeat: 1,
        total: n
      };
    }

    //
    // Number of entries in subtrees of (height - 1)
    //
    var planCnt1 = maxEntriesCnt1;

    //
    // Then determine the root order
    //
    var rootOrder = 1 + Math.floor(n / (planCnt1 + 1));

    if (rootOrder < 2) {
      throw new Error(
        'Something is wrong, the rootOrder is expected to be >= 2'
      );
    }

    if (rootOrder * planCnt1 + (rootOrder - 1) === n) {
      var repeat = rootOrder;
      var repPlan = [];
      var total$1 = repeat * planCnt1 + repeat - 1;
      repPlan.push({
        op: 'build',
        full: true,
        height: height - 1,
        order: order,
        repeat: rootOrder,
        total: total$1
      });
      return {
        op: 'assemble',
        height: height,
        order: order,
        total: total$1,
        items: repPlan
      };
    }

    // We have to adjust last two subtrees
    var plan = [];

    if (rootOrder > 2) {
      var repeat$1 = rootOrder - 2;
      var total$2 = repeat$1 * planCnt1 + repeat$1 - 1;
      var build = {
        op: 'build',
        full: true,
        height: height - 1,
        order: order,
        repeat: repeat$1,
        total: total$2
      };
      plan.push(build);
      n -= total$2;
      n--;
    }

    // Find feasible plan for 2 subtrees and n entries
    n--; // 1 more entry will be in between the two subtrees
    var n2 = Math.floor(n / 2);
    if (n - n2 > 0) {
      plan.push(this.prepareCachedPlan(order, n - n2));
    }
    if (n2 > 0) {
      plan.push(this.prepareCachedPlan(order, n2));
    }

    var total = 0;
    for (var i in plan) {
      total += plan[i].total;
    }
    total += plan.length - 1;

    return {
      op: 'assemble',
      height: height,
      order: order,
      total: total,
      items: plan
    };
  };

  SortedMapBtreeNodePacker.prototype.verifyPlan = function verifyPlan (plan, level) {
    var this$1 = this;

    function failed(msg) {
      throw new Error(msg);
    }

    if (level === undefined) {
      level = 0;
    }

    if (plan.op === 'assemble') {
      var cnt = 0;

      for (var i in plan.items) {
        var pl = plan.items[i];
        cnt += pl.total;
        if (pl.op === 'build') {
          if (!(pl.order >= pl.repeat)) {
            failed(
              'Plan verification test failed: pl.order >= pl.repeat: ' +
                JSON.stringify(pl)
            );
          }
        }
        if (!(plan.height === pl.height + 1)) {
          failed('Plan verification test failed: plan.height === pl.height+1');
        }
        this$1.verifyPlan(pl, level + 1);
      }
      cnt += plan.items.length - 1;
      if (!(plan.total === cnt)) {
        failed('Count mismatch: ' + plan.total + ' vs ' + cnt);
      }
    } else if (plan.op === 'build') {
      // Verify plan consistency
      var ec = this.calcPlanCnt(plan.order, plan.height);
      if (plan.full) {
        var cnt$1 = ec * plan.repeat + plan.repeat - 1;
        if (!(plan.total === cnt$1)) {
          failed('Plan verification test failed: plan.total === ec');
        }
      } else {
        if (!(plan.height === 1)) {
          failed(
            'Plan verification test failed: expected height 1, got instead ' +
              plan.height
          );
        }
        if (!(plan.total < ec)) {
          failed('Plan verification test failed: plan.total < ec');
        }
        var halfSize = Math.floor((plan.order - 1) / 2);
        if (level > 0 && !(plan.total >= halfSize)) {
          failed(
            'Plan verification test failed: plan.total >= halfSize: ' +
              plan.total +
              ', ' +
              halfSize
          );
        }
      }
    } else {
      failed('Plan verification test failed: invalid op: ' + plan.op);
    }
  };

  // Pack the map according to the plan
  // Return a new root
  //
  // Sample Plan:
  //   {
  //     "op": "assemble",
  //     "height": 2,
  //     "order": 7,
  //     "total": 10,
  //     "items": [
  //         {
  //             "op": "build",
  //             "full": false,
  //             "height": 1,
  //             "order": 7,
  //             "repeat": 1,
  //             "total": 5
  //         },
  //         {
  //             "op": "build",
  //             "full": false,
  //             "height": 1,
  //             "order": 7,
  //             "repeat": 1,
  //             "total": 4
  //         }
  //     ]
  // }
  //

  SortedMapBtreeNodePacker.prototype.runPlan = function runPlan (plan, iter) {
    var this$1 = this;

    function failed(msg) {
      msg = 'Packing Plan is corrupt: ' + msg;
      throw new Error(msg);
    }

    if (plan.op === 'assemble') {
      for (var i in plan.items) {
        if (i > 0) {
          this$1.populate(iter, 1);
        }
        this$1.runPlan(plan.items[i], iter);
      }
    } else if (plan.op === 'build') {
      var n = (plan.total - plan.repeat + 1) / plan.repeat;
      for (var i$1 = 0; i$1 < plan.repeat; i$1++) {
        if (i$1 > 0) {
          this$1.populate(iter, 1);
        }
        this$1.populate(iter, n);
      }
    } else {
      failed('invalid op: ' + plan.op);
    }
    this.flush(plan.height);
  };

  SortedMapBtreeNodePacker.prototype.flush = function flush (height) {
    var this$1 = this;

    for (var i = 0; i < height; i++) {
      var level = i;
      if (this$1.stack[level]) {
        // flush this level
        this$1.prepareLevel(level + 1);
        this$1.addNode(level + 1, this$1.stack[level]);
        this$1.stack[level] = undefined;
        // next entry goes to parent
      }
    }
    this.stackLevel = height;
  };

  SortedMapBtreeNodePacker.prototype.populate = function populate (iter, n) {
    var this$1 = this;

    for (var i = 0; i < n; i++) {
      var next = iter.next();
      this$1.entriesCnt++;
      if (next.done) {
        throw new Error(
          'unexpected end of iterator at ' +
            this$1.entriesCnt +
            ' vs ' +
            iter.size
        );
      }
      var entry = next.value;

      var level = this$1.stackLevel;
      this$1.prepareLevel(level);
      this$1.addEntry(level, entry);

      if (level > 0) {
        // Node - go populate the subtree now
        this$1.stackLevel = 0;
      } else if (this$1.stackIndices[level] === this$1.order - 1) {
        // Leaf - we have filled all entries
        // flush the leaf
        this$1.prepareLevel(level + 1);
        this$1.addNode(level + 1, this$1.stack[level]);
        this$1.stack[level] = undefined;
        // next entry goes to parent
        this$1.stackLevel++;
      }
    }
  };

  SortedMapBtreeNodePacker.prototype.addEntry = function addEntry (level, entry) {
    this.stack[level].entries[this.stackIndices[level]++] = entry;
  };

  SortedMapBtreeNodePacker.prototype.addNode = function addNode (level, node) {
    this.stack[level].nodes[this.stackIndices[level]] = node;

    if (this.stackIndices[level] === this.order - 1) {
      // we filled the whole node
      // flush the node
      this.prepareLevel(level + 1);
      this.addNode(level + 1, this.stack[level]);
      this.stack[level] = undefined;
      // next entry goes to parent
      this.stackLevel++;
    }
  };

  SortedMapBtreeNodePacker.prototype.prepareLevel = function prepareLevel (level) {
    if (!this.stack[level]) {
      var entries = allocArray(this.order - 1);
      entries.length = 0;
      var nodes;
      if (level > 0) {
        nodes = allocArray(this.order);
        nodes.length = 0;
      }
      this.stack[level] = new SortedMapBtreeNode(
        this.comparator,
        this.options,
        this.ownerID,
        entries,
        nodes
      );
      this.stackIndices[level] = 0;
    }
  };

  SortedMapBtreeNodePacker.prototype.finish = function finish () {
    var level = this.stackLevel;
    if (level >= this.stack.length) {
      return undefined;
    }
    return this.stack[level].nodes[0];
  };

  // Will pack seq and storie it in the map
  SortedMapBtreeNodePacker.prototype.pack = function pack (comparator, options, ownerID, collection) {
    if (options && options.type && options.type !== DEFAULT_TYPE) {
      throw new Error('Unsuported type by btree factory: ' + options.type);
    }

    this.order = options && options.btreeOrder
      ? options.btreeOrder
      : DEFAULT_BTREE_ORDER;

    var kc = KeyedCollection(collection);
    assertNotInfinite(kc.size);

    var plan = this.preparePlan(this.order, kc.size);

    this.comparator = comparator;
    this.options = options;
    this.ownerID = ownerID;
    this.stack = [];
    this.stackIndices = [];
    this.stackLevel = 0;
    this.entriesCnt = 0;

    var iter = kc.entries();
    this.runPlan(plan, iter);

    if (!iter.next().done) {
      throw new Error('iterator did not end when expected');
    }

    return this.finish();
  };

  return SortedMapBtreeNodePacker;
}(SortedMapPacker));

SortedMapBtreeNodePacker.cache = {};
SortedMapBtreeNodePacker.cacheSize = 0;

var SortedMapBtreeNodeFactory = (function (SortedMapNodeFactory$$1) {
  function SortedMapBtreeNodeFactory() {}

  if ( SortedMapNodeFactory$$1 ) SortedMapBtreeNodeFactory.__proto__ = SortedMapNodeFactory$$1;
  SortedMapBtreeNodeFactory.prototype = Object.create( SortedMapNodeFactory$$1 && SortedMapNodeFactory$$1.prototype );
  SortedMapBtreeNodeFactory.prototype.constructor = SortedMapBtreeNodeFactory;

  SortedMapBtreeNodeFactory.prototype.createNode = function createNode (comparator, options, ownerID, entries, nodes) {
    return new SortedMapBtreeNode(comparator, options, ownerID, entries, nodes);
  };

  SortedMapBtreeNodeFactory.prototype.createPacker = function createPacker () {
    return new SortedMapBtreeNodePacker();
  };

  SortedMapBtreeNodeFactory.prototype.createIterator = function createIterator (map, type, reverse) {
    return new SortedMapBtreeNodeIterator(map, type, reverse);
  };

  return SortedMapBtreeNodeFactory;
}(SortedMapNodeFactory));

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  Original source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var SortedMap = (function (Map$$1) {
  function SortedMap(value, comparator, options) {
    if (!comparator) {
      if(this instanceof SortedMap) {
        comparator = this.getComparator();
      }
      if (!comparator) {
        comparator = SortedMap.defaultComparator;
      }
    }
    if (!options) {
      if(this instanceof SortedMap) {
        options = this.getOptions();
      }
      if (!options) {
        options = SortedMap.defaultOptions;
      }
    }

    return value === null || value === undefined
      ? emptySortedMap(comparator, options)
      : isSortedMap(value) &&
          value.getComparator() === comparator &&
          value.getOptions() === options
          ? value
          : emptySortedMap(comparator, options).withMutations(function (map) {
              map.pack(value);
            });
  }

  if ( Map$$1 ) SortedMap.__proto__ = Map$$1;
  SortedMap.prototype = Object.create( Map$$1 && Map$$1.prototype );
  SortedMap.prototype.constructor = SortedMap;

  SortedMap.of = function of () {
    var keyValues = [], len = arguments.length;
    while ( len-- ) keyValues[ len ] = arguments[ len ];

    return emptySortedMap().withMutations(function (map) {
      for (var i = 0; i < keyValues.length; i += 2) {
        if (i + 1 >= keyValues.length) {
          throw new Error('Missing value for key: ' + keyValues[i]);
        }
        map.set(keyValues[i], keyValues[i + 1]);
      }
    });
  };

  SortedMap.prototype.toString = function toString () {
    return this.__toString('SortedMap {', '}');
  };

  // @pragma Access

  SortedMap.prototype.getComparator = function getComparator () {
    return this._comparator;
  };

  SortedMap.prototype.getOptions = function getOptions () {
    return this._options;
  };

  SortedMap.prototype.get = function get (k, notSetValue) {
    return this._root ? this._root.get(k, notSetValue) : notSetValue;
  };

  // @pragma Modification

  SortedMap.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._root = null;
      this.__altered = true;
      return this;
    }
    return emptySortedMap(this._comparator, this._options);
  };

  SortedMap.prototype.pack = function pack (value) {
    var this$1 = this;

    var collection;
    if (value === undefined) {
      collection = this;
    } else {
      // Sort and deduplicate the entries
      var index = 0;
      var entries = KeyedCollection(value)
        .map(function (v, k) { return [k, v, index++]; })
        .toArray();

      if (entries.length === 0) {
        if (this.__ownerID) {
          this._root = undefined;
          (this.size = 0), (this.__altered = true);
          return this;
        }
        return emptySortedMap(this._comparator, this._options);
      }
      entries.sort(function (a, b) { return this$1._comparator(a[0], b[0]) || a[2] - b[2]; });
      var result = [];
      for (var i = 0, stop = entries.length - 1; i < stop; i++) {
        var entry = entries[i];
        var nextEntry = entries[i + 1];
        if (this$1._comparator(entry[0], nextEntry[0]) < 0) {
          var newEntry = [entry[0], entry[1]];
          result.push(newEntry);
        }
      }
      // push the last ownerID
      var entry$1 = entries[entries.length - 1];
      var newEntry$1 = [entry$1[0], entry$1[1]];
      result.push(newEntry$1);
      collection = KeyedSeq(result);
    }
    assertNotInfinite(collection.size);

    var newSize = collection.size;
    var newRoot = this._factory
      .createPacker()
      .pack(this._comparator, this._options, this.__ownerID, collection);

    if (this.__ownerID) {
      this._root = newRoot;
      (this.size = newSize), (this.__altered = true);
      return this;
    }
    return newRoot
      ? makeSortedMap(this._comparator, this._options, newSize, newRoot)
      : emptySortedMap(this._comparator, this._options);
  };

  SortedMap.prototype.set = function set (k, v) {
    return updateMap$1(this, k, v);
  };

  SortedMap.prototype.remove = function remove (k) {
    return updateMap$1(this, k, NOT_SET);
  };

  SortedMap.prototype.fastRemove = function fastRemove (k) {
    return updateMap$1(this, k, NOT_SET, true);
  };

  SortedMap.prototype.subMap = function subMap$1 (beginKey, endKey) {
    return subMap(this, beginKey, endKey);
  };

  // @pragma Composition

  SortedMap.prototype.sort = function sort (comparator) {
    return SortedMap(this, comparator, this.getOptions());
  };

  SortedMap.prototype.sortBy = function sortBy (mapper, comparator) {
    return SortedMap(mapFactory(this, mapper), comparator, this.getOptions());
  };

  // @pragma Mutability

  SortedMap.prototype.__iterator = function __iterator (type, reverse) {
    return this._factory.createIterator(this, type, reverse);
  };

  SortedMap.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptySortedMap(this._comparator, this._options);
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeSortedMap(
      this._comparator,
      this._options,
      this.size,
      this._root,
      ownerID
    );
  };

  SortedMap.prototype.checkConsistency = function checkConsistency (printFlag) {
    var this$1 = this;

    if (this._root) {
      if (!(this.size > 0)) {
        return 1;
      }
      return this._root.checkConsistency(printFlag);
    } else if (!(this.size === 0)) {
      return 2;
    }

    var n = 0;
    var prevKey;
    this.keySeq().forEach(function (key) {
      if (n && !(this$1._comparator(prevKey, key) < 0)) {
        return 3;
      }
      prevKey = key;
      n++;
    });

    if (this.size !== n) {
      return 4;
    }

    return 0;
  };

  SortedMap.prototype.print = function print (maxDepth) {
    var header = 'SORTED MAP: size=' + this.size;
    if (this._options) {
      header = header + ', options=' + JSON.stringify(this._options);
    }
    console.log(header);
    if (this._root) {
      this._root.print(1, maxDepth);
    }
    return this;
  };

  return SortedMap;
}(Map));

function isSortedMap(maybeSortedMap) {
  return isMap(maybeSortedMap) && isSorted(maybeSortedMap);
}

SortedMap.isSortedMap = isSortedMap;

SortedMap.defaultComparator = defaultComparator$1;
SortedMap.defaultOptions = {
  type: 'btree'
};

var SortedMapPrototype = SortedMap.prototype;
SortedMapPrototype[IS_SORTED_SENTINEL] = true;
SortedMapPrototype[DELETE] = SortedMapPrototype.remove;
SortedMapPrototype.removeIn = SortedMapPrototype.deleteIn;
SortedMapPrototype.removeAll = SortedMapPrototype.deleteAll;

function makeSortedMap(comparator, options, size, root, ownerID) {
  var map = Object.create(SortedMapPrototype);
  map._comparator = comparator ? comparator : SortedMap.defaultComparator;
  map._options = options ? options : SortedMap.defaultOptions;
  map.size = size;
  map._root = root;
  map._factory = SortedMap.getFactory(map._options);
  map.__ownerID = ownerID;
  map.__altered = false;

  if (map._options.btreeOrder && map._options.btreeOrder < 3) {
    throw new Error(
      'SortedMap: minimum value of options.btreeOrder is 3, but got: ' +
        map._options.btreeOrder
    );
  }

  if (!map._factory) {
    throw new Error('SortedMap type not supported: ' + map._options.type);
  }

  return map;
}

var DEFAULT_EMPTY_MAP;
function emptySortedMap(comparator, options) {
  if (
    comparator === SortedMap.defaultComparator &&
    options === SortedMap.defaultOptions
  ) {
    return DEFAULT_EMPTY_MAP ||
      (DEFAULT_EMPTY_MAP = makeSortedMap(
        SortedMap.defaultComparator,
        SortedMap.defaultOptions,
        0
      ));
  }
  return makeSortedMap(comparator, options, 0);
}

function updateMap$1(map, k, v, fast) {
  var remove = v === NOT_SET;
  var root = map._root;
  var newRoot;
  var newSize;
  if (!root) {
    if (remove) {
      return map;
    }
    newSize = 1;
    var entries = [[k, v]];
    newRoot = map._factory.createNode(
      map._comparator,
      map._options,
      map.__ownerID,
      entries
    );
  } else {
    var didChangeSize = MakeRef(CHANGE_LENGTH);
    var didAlter = MakeRef(DID_ALTER);

    if (remove) {
      if (fast) {
        newRoot = map._root.fastRemove(
          map.__ownerID,
          k,
          didChangeSize,
          didAlter
        );
      } else {
        newRoot = map._root.remove(map.__ownerID, k, didChangeSize, didAlter);
      }
    } else {
      newRoot = map._root.upsert(map.__ownerID, k, v, didChangeSize, didAlter);
    }
    if (!GetRef(didAlter)) {
      return map;
    }
    newSize = map.size + (GetRef(didChangeSize) ? remove ? -1 : 1 : 0);
    if (newSize === 0) {
      newRoot = undefined;
    }
  }
  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__altered = true;
    return map;
  }
  return newRoot
    ? makeSortedMap(map._comparator, map._options, newSize, newRoot)
    : emptySortedMap(map._comparator, map._options);
}

function defaultComparator$1(a, b) {
  if (is(a, b)) {
    return 0;
  }

  var ta = typeof a;
  var tb = typeof b;

  if (ta !== tb) {
    return ta < tb ? -1 : 1;
  }

  switch (ta) {
    case 'undefined':
      // we should not get here and is above should take care of this case
      break;
    case 'object':
      // Take care of null cases then convert objects to strings
      if (a === null) {
        return 1;
      }
      if (b === null) {
        return -1;
      }
      a = a.toString();
      b = b.toString();
      break;
    case 'boolean':
      // default comparisons work
      break;
    case 'number':
      // take care of NaN
      if (is(a, NaN)) {
        return 1;
      }
      if (is(b, NaN)) {
        return -1;
      }
      // for all other cases the
      // default comparisons work
      break;
    case 'string':
      // default comparisons work
      break;
    case 'symbol':
      // convert symbols to strings
      a = a.toString();
      b = b.toString();
      break;
    case 'function':
      // convert functions to strings
      a = a.toString();
      b = b.toString();
      break;
    default:
      // we should not get here as all types are covered
      break;
  }

  return a < b ? -1 : (a > b ? 1 : 0);
}

//
// Register all the factories
//
SortedMap.getFactory = function(options) {
  var type = options && options.type
    ? options.type
    : SortedMap.defaultOptions.type;

  return SortedMap.factories[type];
};

SortedMap.factories = {
  btree: new SortedMapBtreeNodeFactory()
};

var Stack = (function (IndexedCollection$$1) {
  function Stack(value) {
    return value === null || value === undefined
      ? emptyStack()
      : isStack(value) ? value : emptyStack().pushAll(value);
  }

  if ( IndexedCollection$$1 ) Stack.__proto__ = IndexedCollection$$1;
  Stack.prototype = Object.create( IndexedCollection$$1 && IndexedCollection$$1.prototype );
  Stack.prototype.constructor = Stack;

  Stack.of = function of (/*...values*/) {
    return this(arguments);
  };

  Stack.prototype.toString = function toString () {
    return this.__toString('Stack [', ']');
  };

  // @pragma Access

  Stack.prototype.get = function get (index, notSetValue) {
    var head = this._head;
    index = wrapIndex(this, index);
    while (head && index--) {
      head = head.next;
    }
    return head ? head.value : notSetValue;
  };

  Stack.prototype.peek = function peek () {
    return this._head && this._head.value;
  };

  // @pragma Modification

  Stack.prototype.push = function push (/*...values*/) {
    var arguments$1 = arguments;

    if (arguments.length === 0) {
      return this;
    }
    var newSize = this.size + arguments.length;
    var head = this._head;
    for (var ii = arguments.length - 1; ii >= 0; ii--) {
      head = {
        value: arguments$1[ii],
        next: head
      };
    }
    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return makeStack(newSize, head);
  };

  Stack.prototype.pushAll = function pushAll (iter) {
    iter = IndexedCollection$$1(iter);
    if (iter.size === 0) {
      return this;
    }
    if (this.size === 0 && isStack(iter)) {
      return iter;
    }
    assertNotInfinite(iter.size);
    var newSize = this.size;
    var head = this._head;
    iter.__iterate(
      function (value) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      },
      /* reverse */ true
    );
    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return makeStack(newSize, head);
  };

  Stack.prototype.pop = function pop () {
    return this.slice(1);
  };

  Stack.prototype.clear = function clear () {
    if (this.size === 0) {
      return this;
    }
    if (this.__ownerID) {
      this.size = 0;
      this._head = undefined;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return emptyStack();
  };

  Stack.prototype.slice = function slice (begin, end) {
    if (wholeSlice(begin, end, this.size)) {
      return this;
    }
    var resolvedBegin = resolveBegin(begin, this.size);
    var resolvedEnd = resolveEnd(end, this.size);
    if (resolvedEnd !== this.size) {
      // super.slice(begin, end);
      return IndexedCollection$$1.prototype.slice.call(this, begin, end);
    }
    var newSize = this.size - resolvedBegin;
    var head = this._head;
    while (resolvedBegin--) {
      head = head.next;
    }
    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }
    return makeStack(newSize, head);
  };

  // @pragma Mutability

  Stack.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    if (!ownerID) {
      if (this.size === 0) {
        return emptyStack();
      }
      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }
    return makeStack(this.size, this._head, ownerID, this.__hash);
  };

  // @pragma Iteration

  Stack.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return new ArraySeq(this.toArray()).__iterate(
        function (v, k) { return fn(v, k, this$1); },
        reverse
      );
    }
    var iterations = 0;
    var node = this._head;
    while (node) {
      if (fn(node.value, iterations++, this$1) === false) {
        break;
      }
      node = node.next;
    }
    return iterations;
  };

  Stack.prototype.__iterator = function __iterator (type, reverse) {
    if (reverse) {
      return new ArraySeq(this.toArray()).__iterator(type, reverse);
    }
    var iterations = 0;
    var node = this._head;
    return new Iterator(function () {
      if (node) {
        var value = node.value;
        node = node.next;
        return iteratorValue(type, iterations++, value);
      }
      return iteratorDone();
    });
  };

  return Stack;
}(IndexedCollection));

function isStack(maybeStack) {
  return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
}

Stack.isStack = isStack;

var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

var StackPrototype = Stack.prototype;
StackPrototype[IS_STACK_SENTINEL] = true;
StackPrototype.withMutations = MapPrototype.withMutations;
StackPrototype.asMutable = MapPrototype.asMutable;
StackPrototype.asImmutable = MapPrototype.asImmutable;
StackPrototype.wasAltered = MapPrototype.wasAltered;
StackPrototype.shift = StackPrototype.pop;
StackPrototype.unshift = StackPrototype.push;
StackPrototype.unshiftAll = StackPrototype.pushAll;

function makeStack(size, head, ownerID, hash) {
  var map = Object.create(StackPrototype);
  map.size = size;
  map._head = head;
  map.__ownerID = ownerID;
  map.__hash = hash;
  map.__altered = false;
  return map;
}

var EMPTY_STACK;
function emptyStack() {
  return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
}

function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (
    !isCollection(b) ||
    (a.size !== undefined && b.size !== undefined && a.size !== b.size) ||
    (a.__hash !== undefined &&
      b.__hash !== undefined &&
      a.__hash !== b.__hash) ||
    isKeyed(a) !== isKeyed(b) ||
    isIndexed(a) !== isIndexed(b) ||
    isOrdered(a) !== isOrdered(b) ||
    isSorted(a) !== isSorted(b)
  ) {
    return false;
  }

  if (a.size === 0 && b.size === 0) {
    return true;
  }

  var notAssociative = !isAssociative(a);

  if (isOrdered(a)) {
    var entries = a.entries();
    return b.every(function (v, k) {
      var entry = entries.next().value;
      return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
    }) && entries.next().done;
  }

  var flipped = false;

  if (a.size === undefined) {
    if (b.size === undefined) {
      if (typeof a.cacheResult === 'function') {
        a.cacheResult();
      }
    } else {
      flipped = true;
      var _ = a;
      a = b;
      b = _;
    }
  }

  var allEqual = true;
  var bSize = b.__iterate(function (v, k) {
    if (
      notAssociative
        ? !a.has(v)
        : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)
    ) {
      allEqual = false;
      return false;
    }
  });

  return allEqual && a.size === bSize;
}

/**
 * Contributes additional methods to a constructor
 */
function mixin(ctor, methods) {
  var keyCopier = function (key) {
    ctor.prototype[key] = methods[key];
  };
  Object.keys(methods).forEach(keyCopier);
  Object.getOwnPropertySymbols &&
    Object.getOwnPropertySymbols(methods).forEach(keyCopier);
  return ctor;
}

var Set = (function (SetCollection$$1) {
  function Set(value) {
    return value === null || value === undefined
      ? emptySet()
      : isSet(value) && !isOrdered(value)
          ? value
          : emptySet().withMutations(function (set) {
              var iter = SetCollection$$1(value);
              assertNotInfinite(iter.size);
              iter.forEach(function (v) { return set.add(v); });
            });
  }

  if ( SetCollection$$1 ) Set.__proto__ = SetCollection$$1;
  Set.prototype = Object.create( SetCollection$$1 && SetCollection$$1.prototype );
  Set.prototype.constructor = Set;

  Set.of = function of (/*...values*/) {
    return this(arguments);
  };

  Set.fromKeys = function fromKeys (value) {
    return this(KeyedCollection(value).keySeq());
  };

  Set.intersect = function intersect (sets) {
    sets = Collection(sets).toArray();
    return sets.length
      ? SetPrototype.intersect.apply(Set(sets.pop()), sets)
      : emptySet();
  };

  Set.union = function union (sets) {
    sets = Collection(sets).toArray();
    return sets.length
      ? SetPrototype.union.apply(Set(sets.pop()), sets)
      : emptySet();
  };

  Set.prototype.toString = function toString () {
    return this.__toString('Set {', '}');
  };

  // @pragma Access

  Set.prototype.has = function has (value) {
    return this._map.has(value);
  };

  // @pragma Modification

  Set.prototype.add = function add (value) {
    return updateSet(this, this._map.set(value, value));
  };

  Set.prototype.remove = function remove (value) {
    return updateSet(this, this._map.remove(value));
  };

  Set.prototype.clear = function clear () {
    return updateSet(this, this._map.clear());
  };

  // @pragma Composition

  Set.prototype.union = function union () {
    var iters = [], len = arguments.length;
    while ( len-- ) iters[ len ] = arguments[ len ];

    iters = iters.filter(function (x) { return x.size !== 0; });
    if (iters.length === 0) {
      return this;
    }
    if (this.size === 0 && !this.__ownerID && iters.length === 1) {
      return this.constructor(iters[0]);
    }
    return this.withMutations(function (set) {
      for (var ii = 0; ii < iters.length; ii++) {
        SetCollection$$1(iters[ii]).forEach(function (value) { return set.add(value); });
      }
    });
  };

  Set.prototype.intersect = function intersect () {
    var iters = [], len = arguments.length;
    while ( len-- ) iters[ len ] = arguments[ len ];

    if (iters.length === 0) {
      return this;
    }
    iters = iters.map(function (iter) { return SetCollection$$1(iter); });
    var toRemove = [];
    this.forEach(function (value) {
      if (!iters.every(function (iter) { return iter.includes(value); })) {
        toRemove.push(value);
      }
    });
    return this.withMutations(function (set) {
      toRemove.forEach(function (value) {
        set.remove(value);
      });
    });
  };

  Set.prototype.subtract = function subtract () {
    var iters = [], len = arguments.length;
    while ( len-- ) iters[ len ] = arguments[ len ];

    if (iters.length === 0) {
      return this;
    }
    var toRemove = [];
    this.forEach(function (value) {
      if (iters.some(function (iter) { return iter.includes(value); })) {
        toRemove.push(value);
      }
    });
    return this.withMutations(function (set) {
      toRemove.forEach(function (value) {
        set.remove(value);
      });
    });
  };

  Set.prototype.merge = function merge () {
    return this.union.apply(this, arguments);
  };

  Set.prototype.mergeWith = function mergeWith (merger) {
    var iters = [], len = arguments.length - 1;
    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

    return this.union.apply(this, iters);
  };

  Set.prototype.sort = function sort (comparator) {
    // Late binding
    return OrderedSet(sortFactory(this, comparator));
  };

  Set.prototype.sortBy = function sortBy (mapper, comparator) {
    // Late binding
    return OrderedSet(sortFactory(this, comparator, mapper));
  };

  Set.prototype.wasAltered = function wasAltered () {
    return this._map.wasAltered();
  };

  Set.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    return this._map.__iterate(function (_, k) { return fn(k, k, this$1); }, reverse);
  };

  Set.prototype.__iterator = function __iterator (type, reverse) {
    return this._map.__iterator(type, reverse);
  };

  Set.prototype.__ensureOwner = function __ensureOwner (ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newMap = this._map.__ensureOwner(ownerID);
    if (!ownerID) {
      if (this.size === 0) {
        return emptySet();
      }
      this.__ownerID = ownerID;
      this._map = newMap;
      return this;
    }
    return this.__make(newMap, ownerID);
  };

  return Set;
}(SetCollection));

function isSet(maybeSet) {
  return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
}

Set.isSet = isSet;

var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

var SetPrototype = Set.prototype;
SetPrototype[IS_SET_SENTINEL] = true;
SetPrototype[DELETE] = SetPrototype.remove;
SetPrototype.mergeDeep = SetPrototype.merge;
SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
SetPrototype.withMutations = MapPrototype.withMutations;
SetPrototype.asMutable = MapPrototype.asMutable;
SetPrototype.asImmutable = MapPrototype.asImmutable;

SetPrototype.__empty = emptySet;
SetPrototype.__make = makeSet;

function updateSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }
  return newMap === set._map
    ? set
    : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSet(map, ownerID) {
  var set = Object.create(SetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_SET;
function emptySet() {
  return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
}

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  Original source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var SortedSet = (function (Set$$1) {
  function SortedSet(value, comparator, options) {
    if (!comparator) {
      if(this instanceof SortedSet) {
        comparator = this.getComparator();
      }
      if (!comparator) {
        comparator = SortedSet.defaultComparator;
      }
    }
    if (!options) {
      if(this instanceof SortedSet) {
        options = this.getOptions();
      }
      if (!options) {
        options = SortedSet.defaultOptions;
      }
    }
    return value === null || value === undefined
      ? emptySortedSet(comparator, options)
      : isSortedSet(value) &&
        value.getComparator() === comparator &&
        value.getOptions() === options
          ? value
          : emptySortedSet(comparator, options).withMutations(function (set) {
              set.pack(value);
            });
  }

  if ( Set$$1 ) SortedSet.__proto__ = Set$$1;
  SortedSet.prototype = Object.create( Set$$1 && Set$$1.prototype );
  SortedSet.prototype.constructor = SortedSet;

  SortedSet.of = function of (/*...values*/) {
    return this(arguments);
  };

  SortedSet.fromKeys = function fromKeys (value) {
    return this(KeyedCollection(value).keySeq());
  };

  SortedSet.prototype.toString = function toString () {
    return this.__toString('SortedSet {', '}');
  };

  // @pragma Access

  SortedSet.prototype.getComparator = function getComparator () {
    return this._map.getComparator();
  };

  SortedSet.prototype.getOptions = function getOptions () {
    return this._map.getOptions();
  };

  // @pragma Modification

  SortedSet.prototype.pack = function pack (value) {
    var seq = value === undefined ? undefined : SetCollection(value).toKeyedSeq().mapKeys(function (k, v){ return v; });
    return updateSortedSet(this, this._map.pack(seq));
  };

  SortedSet.prototype.sort = function sort (comparator) {
    // Late binding
    return SortedSet(this, comparator, this.getOptions());
  };

  SortedSet.prototype.sortBy = function sortBy (mapper, comparator) {
    // Late binding
    return SortedSet(mapFactory$1(this, mapper), comparator, this.getOptions());
  };

  return SortedSet;
}(Set));

function isSortedSet(maybeSortedSet) {
  return isSet(maybeSortedSet) && isSorted(maybeSortedSet);
}

SortedSet.isSortedSet = isSortedSet;

SortedSet.defaultComparator = SortedMap.defaultComparator;
SortedSet.defaultOptions = SortedMap.defaultOptions;

var SortedSetPrototype = SortedSet.prototype;
SortedSetPrototype[IS_SORTED_SENTINEL] = true;

SortedSetPrototype.__empty = function() {
  return emptySortedSet(this.getComparator(), this.getOptions());
};
SortedSetPrototype.__make = makeSortedSet;

function updateSortedSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }
  return newMap === set._map
    ? set
    : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSortedSet(map, ownerID) {
  var set = Object.create(SortedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

function emptySortedSet(comparator, options) {
  return makeSortedSet(emptySortedMap(comparator, options));
}

/**
 * Returns a lazy seq of nums from start (inclusive) to end
 * (exclusive), by step, where start defaults to 0, step to 1, and end to
 * infinity. When start is equal to end, returns empty list.
 */
var Range = (function (IndexedSeq$$1) {
  function Range(start, end, step) {
    if (!(this instanceof Range)) {
      return new Range(start, end, step);
    }
    invariant(step !== 0, 'Cannot step a Range by 0');
    start = start || 0;
    if (end === undefined) {
      end = Infinity;
    }
    step = step === undefined ? 1 : Math.abs(step);
    if (end < start) {
      step = -step;
    }
    this._start = start;
    this._end = end;
    this._step = step;
    this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
    if (this.size === 0) {
      if (EMPTY_RANGE) {
        return EMPTY_RANGE;
      }
      EMPTY_RANGE = this;
    }
  }

  if ( IndexedSeq$$1 ) Range.__proto__ = IndexedSeq$$1;
  Range.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
  Range.prototype.constructor = Range;

  Range.prototype.toString = function toString () {
    if (this.size === 0) {
      return 'Range []';
    }
    return 'Range [ ' +
      this._start +
      '...' +
      this._end +
      (this._step !== 1 ? ' by ' + this._step : '') +
      ' ]';
  };

  Range.prototype.get = function get (index, notSetValue) {
    return this.has(index)
      ? this._start + wrapIndex(this, index) * this._step
      : notSetValue;
  };

  Range.prototype.includes = function includes (searchValue) {
    var possibleIndex = (searchValue - this._start) / this._step;
    return possibleIndex >= 0 &&
      possibleIndex < this.size &&
      possibleIndex === Math.floor(possibleIndex);
  };

  Range.prototype.slice = function slice (begin, end) {
    if (wholeSlice(begin, end, this.size)) {
      return this;
    }
    begin = resolveBegin(begin, this.size);
    end = resolveEnd(end, this.size);
    if (end <= begin) {
      return new Range(0, 0);
    }
    return new Range(
      this.get(begin, this._end),
      this.get(end, this._end),
      this._step
    );
  };

  Range.prototype.indexOf = function indexOf (searchValue) {
    var offsetValue = searchValue - this._start;
    if (offsetValue % this._step === 0) {
      var index = offsetValue / this._step;
      if (index >= 0 && index < this.size) {
        return index;
      }
    }
    return -1;
  };

  Range.prototype.lastIndexOf = function lastIndexOf (searchValue) {
    return this.indexOf(searchValue);
  };

  Range.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var size = this.size;
    var step = this._step;
    var value = reverse ? this._start + (size - 1) * step : this._start;
    var i = 0;
    while (i !== size) {
      if (fn(value, reverse ? size - ++i : i++, this$1) === false) {
        break;
      }
      value += reverse ? -step : step;
    }
    return i;
  };

  Range.prototype.__iterator = function __iterator (type, reverse) {
    var size = this.size;
    var step = this._step;
    var value = reverse ? this._start + (size - 1) * step : this._start;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }
      var v = value;
      value += reverse ? -step : step;
      return iteratorValue(type, reverse ? size - ++i : i++, v);
    });
  };

  Range.prototype.equals = function equals (other) {
    return other instanceof Range
      ? this._start === other._start &&
          this._end === other._end &&
          this._step === other._step
      : deepEqual(this, other);
  };

  return Range;
}(IndexedSeq));

var EMPTY_RANGE;

// Note: all of these methods are deprecated.
Collection.isIterable = isCollection;
Collection.isKeyed = isKeyed;
Collection.isIndexed = isIndexed;
Collection.isAssociative = isAssociative;
Collection.isOrdered = isOrdered;

Collection.Iterator = Iterator;

mixin(Collection, {
  // ### Conversion to other types

  toArray: function toArray() {
    assertNotInfinite(this.size);
    var array = new Array(this.size || 0);
    this.valueSeq().__iterate(function (v, i) {
      array[i] = v;
    });
    return array;
  },

  toIndexedSeq: function toIndexedSeq() {
    return new ToIndexedSequence(this);
  },

  toJS: function toJS$1() {
    return this.toSeq().map(toJS).toJSON();
  },

  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, true);
  },

  toMap: function toMap() {
    // Use Late Binding here to solve the circular dependency.
    return Map(this.toKeyedSeq());
  },

  toObject: function toObject() {
    assertNotInfinite(this.size);
    var object = {};
    this.__iterate(function (v, k) {
      object[k] = v;
    });
    return object;
  },

  toOrderedMap: function toOrderedMap() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedMap(this.toKeyedSeq());
  },

  toSortedMap: function toSortedMap(comparator, options) {
    // Use Late Binding here to solve the circular dependency.
    return SortedMap(this.toKeyedSeq(), comparator, options);
  },

  toSortedSet: function toSortedSet(comparator, options) {
    // Use Late Binding here to solve the circular dependency.
    return SortedSet(isKeyed(this) ? this.valueSeq() : this, comparator, options);
  },

  toOrderedSet: function toOrderedSet() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
  },

  toSet: function toSet() {
    // Use Late Binding here to solve the circular dependency.
    return Set(isKeyed(this) ? this.valueSeq() : this);
  },

  toSetSeq: function toSetSeq() {
    return new ToSetSequence(this);
  },

  toSeq: function toSeq() {
    return isIndexed(this)
      ? this.toIndexedSeq()
      : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
  },

  toStack: function toStack() {
    // Use Late Binding here to solve the circular dependency.
    return Stack(isKeyed(this) ? this.valueSeq() : this);
  },

  toList: function toList() {
    // Use Late Binding here to solve the circular dependency.
    return List(isKeyed(this) ? this.valueSeq() : this);
  },

  // ### Common JavaScript methods and properties

  toString: function toString() {
    return '[Collection]';
  },

  __toString: function __toString(head, tail) {
    if (this.size === 0) {
      return head + tail;
    }
    return head +
      ' ' +
      this.toSeq().map(this.__toStringMapper).join(', ') +
      ' ' +
      tail;
  },

  // ### ES6 Collection methods (ES6 Array and Map)

  concat: function concat() {
    var values = [], len = arguments.length;
    while ( len-- ) values[ len ] = arguments[ len ];

    return reify(this, concatFactory(this, values));
  },

  includes: function includes(searchValue) {
    return this.some(function (value) { return is(value, searchValue); });
  },

  entries: function entries() {
    return this.__iterator(ITERATE_ENTRIES);
  },

  every: function every(predicate, context) {
    assertNotInfinite(this.size);
    var returnValue = true;
    this.__iterate(function (v, k, c) {
      if (!predicate.call(context, v, k, c)) {
        returnValue = false;
        return false;
      }
    });
    return returnValue;
  },

  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, true));
  },

  find: function find(predicate, context, notSetValue) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[1] : notSetValue;
  },

  forEach: function forEach(sideEffect, context) {
    assertNotInfinite(this.size);
    return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
  },

  join: function join(separator) {
    assertNotInfinite(this.size);
    separator = separator !== undefined ? '' + separator : ',';
    var joined = '';
    var isFirst = true;
    this.__iterate(function (v) {
      isFirst ? (isFirst = false) : (joined += separator);
      joined += v !== null && v !== undefined ? v.toString() : '';
    });
    return joined;
  },

  keys: function keys() {
    return this.__iterator(ITERATE_KEYS);
  },

  map: function map(mapper, context) {
    return reify(this, mapFactory$1(this, mapper, context));
  },

  reduce: function reduce$1(reducer, initialReduction, context) {
    return reduce(
      this,
      reducer,
      initialReduction,
      context,
      arguments.length < 2,
      false
    );
  },

  reduceRight: function reduceRight(reducer, initialReduction, context) {
    return reduce(
      this,
      reducer,
      initialReduction,
      context,
      arguments.length < 2,
      true
    );
  },

  reverse: function reverse() {
    return reify(this, reverseFactory(this, true));
  },

  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, true));
  },

  some: function some(predicate, context) {
    return !this.every(not(predicate), context);
  },

  sort: function sort(comparator) {
    return reify(this, sortFactory(this, comparator));
  },

  values: function values() {
    return this.__iterator(ITERATE_VALUES);
  },

  // ### More sequential methods

  butLast: function butLast() {
    return this.slice(0, -1);
  },

  isEmpty: function isEmpty() {
    return this.size !== undefined ? this.size === 0 : !this.some(function () { return true; });
  },

  count: function count(predicate, context) {
    return ensureSize(
      predicate ? this.toSeq().filter(predicate, context) : this
    );
  },

  countBy: function countBy(grouper, context) {
    return countByFactory(this, grouper, context);
  },

  equals: function equals(other) {
    return deepEqual(this, other);
  },

  entrySeq: function entrySeq() {
    var collection = this;
    if (collection._cache) {
      // We cache as an entries array, so we can just return the cache!
      return new ArraySeq(collection._cache);
    }
    var entriesSequence = collection.toSeq().map(entryMapper).toIndexedSeq();
    entriesSequence.fromEntrySeq = function () { return collection.toSeq(); };

    // Entries are plain Array, which do not define toJS, so it must
    // manually converts keys and values before conversion.
    entriesSequence.toJS = function() {
      return this.map(function (entry) { return [toJS(entry[0]), toJS(entry[1])]; }).toJSON();
    };

    return entriesSequence;
  },

  filterNot: function filterNot(predicate, context) {
    return this.filter(not(predicate), context);
  },

  findEntry: function findEntry(predicate, context, notSetValue) {
    var found = notSetValue;
    this.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        found = [k, v];
        return false;
      }
    });
    return found;
  },

  findKey: function findKey(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry && entry[0];
  },

  findLast: function findLast(predicate, context, notSetValue) {
    return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
  },

  findLastEntry: function findLastEntry(predicate, context, notSetValue) {
    return this.toKeyedSeq()
      .reverse()
      .findEntry(predicate, context, notSetValue);
  },

  findLastKey: function findLastKey(predicate, context) {
    return this.toKeyedSeq().reverse().findKey(predicate, context);
  },

  first: function first() {
    return this.find(returnTrue);
  },

  flatMap: function flatMap(mapper, context) {
    return reify(this, flatMapFactory(this, mapper, context));
  },

  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, true));
  },

  fromEntrySeq: function fromEntrySeq() {
    return new FromEntriesSequence(this);
  },

  get: function get(searchKey, notSetValue) {
    return this.find(function (_, key) { return is(key, searchKey); }, undefined, notSetValue);
  },

  getIn: function getIn(searchKeyPath, notSetValue) {
    var nested = this;
    var keyPath = coerceKeyPath(searchKeyPath);
    var i = 0;
    while (i !== keyPath.length) {
      if (!nested || !nested.get) {
        throw new TypeError(
          'Invalid keyPath: Value at [' +
            keyPath.slice(0, i).map(quoteString) +
            '] does not have a .get() method: ' +
            nested
        );
      }
      nested = nested.get(keyPath[i++], NOT_SET);
      if (nested === NOT_SET) {
        return notSetValue;
      }
    }
    return nested;
    // var step;
    // while (!(step = iter.next()).done) {
    //   var key = step.value;
    //   nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
    //   if (nested === NOT_SET) {
    //     return notSetValue;
    //   }
    // }
    // return nested;
  },

  groupBy: function groupBy(grouper, context) {
    return groupByFactory(this, grouper, context);
  },

  has: function has(searchKey) {
    return this.get(searchKey, NOT_SET) !== NOT_SET;
  },

  hasIn: function hasIn(searchKeyPath) {
    return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
  },

  isSubset: function isSubset(iter) {
    iter = typeof iter.includes === 'function' ? iter : Collection(iter);
    return this.every(function (value) { return iter.includes(value); });
  },

  isSuperset: function isSuperset(iter) {
    iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
    return iter.isSubset(this);
  },

  keyOf: function keyOf(searchValue) {
    return this.findKey(function (value) { return is(value, searchValue); });
  },

  keySeq: function keySeq() {
    return this.toSeq().map(keyMapper).toIndexedSeq();
  },

  last: function last() {
    return this.toSeq().reverse().first();
  },

  lastKeyOf: function lastKeyOf(searchValue) {
    return this.toKeyedSeq().reverse().keyOf(searchValue);
  },

  max: function max(comparator) {
    return maxFactory(this, comparator);
  },

  maxBy: function maxBy(mapper, comparator) {
    return maxFactory(this, comparator, mapper);
  },

  min: function min(comparator) {
    return maxFactory(
      this,
      comparator ? neg(comparator) : defaultNegComparator
    );
  },

  minBy: function minBy(mapper, comparator) {
    return maxFactory(
      this,
      comparator ? neg(comparator) : defaultNegComparator,
      mapper
    );
  },

  rest: function rest() {
    return this.slice(1);
  },

  skip: function skip(amount) {
    return amount === 0 ? this : this.slice(Math.max(0, amount));
  },

  skipLast: function skipLast(amount) {
    return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
  },

  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, true));
  },

  skipUntil: function skipUntil(predicate, context) {
    return this.skipWhile(not(predicate), context);
  },

  sortBy: function sortBy(mapper, comparator) {
    return reify(this, sortFactory(this, comparator, mapper));
  },

  take: function take(amount) {
    return this.slice(0, Math.max(0, amount));
  },

  takeLast: function takeLast(amount) {
    return this.slice(-Math.max(0, amount));
  },

  takeWhile: function takeWhile(predicate, context) {
    return reify(this, takeWhileFactory(this, predicate, context));
  },

  takeUntil: function takeUntil(predicate, context) {
    return this.takeWhile(not(predicate), context);
  },

  update: function update(fn) {
    return fn(this);
  },

  valueSeq: function valueSeq() {
    return this.toIndexedSeq();
  },

  // ### Hashable Object

  hashCode: function hashCode() {
    return this.__hash || (this.__hash = hashCollection(this));
  }

  // ### Internal

  // abstract __iterate(fn, reverse)

  // abstract __iterator(type, reverse)
});

var CollectionPrototype = Collection.prototype;
CollectionPrototype[IS_ITERABLE_SENTINEL] = true;
CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
CollectionPrototype.toJSON = CollectionPrototype.toArray;
CollectionPrototype.__toStringMapper = quoteString;
CollectionPrototype.inspect = (CollectionPrototype.toSource = function() {
  return this.toString();
});
CollectionPrototype.chain = CollectionPrototype.flatMap;
CollectionPrototype.contains = CollectionPrototype.includes;

mixin(KeyedCollection, {
  // ### More sequential methods

  flip: function flip() {
    return reify(this, flipFactory(this));
  },

  mapEntries: function mapEntries(mapper, context) {
    var this$1 = this;

    var iterations = 0;
    return reify(
      this,
      this.toSeq()
        .map(function (v, k) { return mapper.call(context, [k, v], iterations++, this$1); })
        .fromEntrySeq()
    );
  },

  mapKeys: function mapKeys(mapper, context) {
    var this$1 = this;

    return reify(
      this,
      this.toSeq().flip().map(function (k, v) { return mapper.call(context, k, v, this$1); }).flip()
    );
  }
});

var KeyedCollectionPrototype = KeyedCollection.prototype;
KeyedCollectionPrototype[IS_KEYED_SENTINEL] = true;
KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
KeyedCollectionPrototype.toJSON = CollectionPrototype.toObject;
KeyedCollectionPrototype.__toStringMapper = function (v, k) { return quoteString(k) + ': ' + quoteString(v); };

mixin(IndexedCollection, {
  // ### Conversion to other types

  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, false);
  },

  // ### ES6 Collection methods (ES6 Array and Map)

  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, false));
  },

  findIndex: function findIndex(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[0] : -1;
  },

  indexOf: function indexOf(searchValue) {
    var key = this.keyOf(searchValue);
    return key === undefined ? -1 : key;
  },

  lastIndexOf: function lastIndexOf(searchValue) {
    var key = this.lastKeyOf(searchValue);
    return key === undefined ? -1 : key;
  },

  reverse: function reverse() {
    return reify(this, reverseFactory(this, false));
  },

  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, false));
  },

  splice: function splice(index, removeNum /*, ...values*/) {
    var numArgs = arguments.length;
    removeNum = Math.max(removeNum || 0, 0);
    if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
      return this;
    }
    // If index is negative, it should resolve relative to the size of the
    // collection. However size may be expensive to compute if not cached, so
    // only call count() if the number is in fact negative.
    index = resolveBegin(index, index < 0 ? this.count() : this.size);
    var spliced = this.slice(0, index);
    return reify(
      this,
      numArgs === 1
        ? spliced
        : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
    );
  },

  // ### More collection methods

  findLastIndex: function findLastIndex(predicate, context) {
    var entry = this.findLastEntry(predicate, context);
    return entry ? entry[0] : -1;
  },

  first: function first() {
    return this.get(0);
  },

  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, false));
  },

  get: function get(index, notSetValue) {
    index = wrapIndex(this, index);
    return index < 0 ||
      (this.size === Infinity || (this.size !== undefined && index > this.size))
      ? notSetValue
      : this.find(function (_, key) { return key === index; }, undefined, notSetValue);
  },

  has: function has(index) {
    index = wrapIndex(this, index);
    return index >= 0 &&
      (this.size !== undefined
        ? this.size === Infinity || index < this.size
        : this.indexOf(index) !== -1);
  },

  interpose: function interpose(separator) {
    return reify(this, interposeFactory(this, separator));
  },

  interleave: function interleave(/*...collections*/) {
    var collections = [this].concat(arrCopy(arguments));
    var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
    var interleaved = zipped.flatten(true);
    if (zipped.size) {
      interleaved.size = zipped.size * collections.length;
    }
    return reify(this, interleaved);
  },

  keySeq: function keySeq() {
    return Range(0, this.size);
  },

  last: function last() {
    return this.get(-1);
  },

  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, false));
  },

  zip: function zip(/*, ...collections */) {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections));
  },

  zipWith: function zipWith(zipper /*, ...collections */) {
    var collections = arrCopy(arguments);
    collections[0] = this;
    return reify(this, zipWithFactory(this, zipper, collections));
  }
});

var IndexedCollectionPrototype = IndexedCollection.prototype;
IndexedCollectionPrototype[IS_INDEXED_SENTINEL] = true;
IndexedCollectionPrototype[IS_ORDERED_SENTINEL] = true;

mixin(SetCollection, {
  // ### ES6 Collection methods (ES6 Array and Map)

  get: function get(value, notSetValue) {
    return this.has(value) ? value : notSetValue;
  },

  includes: function includes(value) {
    return this.has(value);
  },

  // ### More sequential methods

  keySeq: function keySeq() {
    return this.valueSeq();
  }
});

SetCollection.prototype.has = CollectionPrototype.includes;
SetCollection.prototype.contains = SetCollection.prototype.includes;

// Mixin subclasses

mixin(KeyedSeq, KeyedCollection.prototype);
mixin(IndexedSeq, IndexedCollection.prototype);
mixin(SetSeq, SetCollection.prototype);

// #pragma Helper functions

function reduce(collection, reducer, reduction, context, useFirst, reverse) {
  assertNotInfinite(collection.size);
  collection.__iterate(
    function (v, k, c) {
      if (useFirst) {
        useFirst = false;
        reduction = v;
      } else {
        reduction = reducer.call(context, reduction, v, k, c);
      }
    },
    reverse
  );
  return reduction;
}

function keyMapper(v, k) {
  return k;
}

function entryMapper(v, k) {
  return [k, v];
}

function toJS(value) {
  return value && typeof value.toJS === 'function' ? value.toJS() : value;
}

function not(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}

function neg(predicate) {
  return function() {
    return -predicate.apply(this, arguments);
  };
}

function defaultZipper() {
  return arrCopy(arguments);
}

function defaultNegComparator(a, b) {
  return a < b ? 1 : a > b ? -1 : 0;
}

function hashCollection(collection) {
  if (collection.size === Infinity) {
    return 0;
  }
  var ordered = isOrdered(collection);
  var keyed = isKeyed(collection);
  var h = ordered ? 1 : 0;
  var size = collection.__iterate(
    keyed
      ? ordered
          ? function (v, k) {
              h = 31 * h + hashMerge(hash(v), hash(k)) | 0;
            }
          : function (v, k) {
              h = h + hashMerge(hash(v), hash(k)) | 0;
            }
      : ordered
          ? function (v) {
              h = 31 * h + hash(v) | 0;
            }
          : function (v) {
              h = h + hash(v) | 0;
            }
  );
  return murmurHashOfSize(size, h);
}

function murmurHashOfSize(size, h) {
  h = imul(h, 0xcc9e2d51);
  h = imul(h << 15 | h >>> -15, 0x1b873593);
  h = imul(h << 13 | h >>> -13, 5);
  h = (h + 0xe6546b64 | 0) ^ size;
  h = imul(h ^ h >>> 16, 0x85ebca6b);
  h = imul(h ^ h >>> 13, 0xc2b2ae35);
  h = smi(h ^ h >>> 16);
  return h;
}

function hashMerge(a, b) {
  return a ^ b + 0x9e3779b9 + (a << 6) + (a >> 2) | 0; // int
}

var OrderedSet = (function (Set$$1) {
  function OrderedSet(value) {
    return value === null || value === undefined
      ? emptyOrderedSet()
      : isOrderedSet(value)
          ? value
          : emptyOrderedSet().withMutations(function (set) {
              var iter = SetCollection(value);
              assertNotInfinite(iter.size);
              iter.forEach(function (v) { return set.add(v); });
            });
  }

  if ( Set$$1 ) OrderedSet.__proto__ = Set$$1;
  OrderedSet.prototype = Object.create( Set$$1 && Set$$1.prototype );
  OrderedSet.prototype.constructor = OrderedSet;

  OrderedSet.of = function of (/*...values*/) {
    return this(arguments);
  };

  OrderedSet.fromKeys = function fromKeys (value) {
    return this(KeyedCollection(value).keySeq());
  };

  OrderedSet.prototype.toString = function toString () {
    return this.__toString('OrderedSet {', '}');
  };

  return OrderedSet;
}(Set));

function isOrderedSet(maybeOrderedSet) {
  return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
}

OrderedSet.isOrderedSet = isOrderedSet;

var OrderedSetPrototype = OrderedSet.prototype;
OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;

OrderedSetPrototype.__empty = emptyOrderedSet;
OrderedSetPrototype.__make = makeOrderedSet;

function makeOrderedSet(map, ownerID) {
  var set = Object.create(OrderedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_ORDERED_SET;
function emptyOrderedSet() {
  return EMPTY_ORDERED_SET ||
    (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
}

var Record = function Record(defaultValues, name) {
  var hasInitialized;

  var RecordType = function Record(values) {
    var this$1 = this;

    if (values instanceof RecordType) {
      return values;
    }
    if (!(this instanceof RecordType)) {
      return new RecordType(values);
    }
    if (!hasInitialized) {
      hasInitialized = true;
      var keys = Object.keys(defaultValues);
      var indices = (RecordTypePrototype._indices = {});
      RecordTypePrototype._name = name;
      RecordTypePrototype._keys = keys;
      RecordTypePrototype._defaultValues = defaultValues;
      for (var i = 0; i < keys.length; i++) {
        var propName = keys[i];
        indices[propName] = i;
        if (RecordTypePrototype[propName]) {
          /* eslint-disable no-console */
          typeof console === 'object' &&
            console.warn &&
            console.warn(
              'Cannot define ' +
                recordName(this$1) +
                ' with property "' +
                propName +
                '" since that property name is part of the Record API.'
            );
          /* eslint-enable no-console */
        } else {
          setProp(RecordTypePrototype, propName);
        }
      }
    }
    this.__ownerID = undefined;
    this._values = List().withMutations(function (l) {
      l.setSize(this$1._keys.length);
      KeyedCollection(values).forEach(function (v, k) {
        l.set(this$1._indices[k], v === this$1._defaultValues[k] ? undefined : v);
      });
    });
  };

  var RecordTypePrototype = (RecordType.prototype = Object.create(
    RecordPrototype
  ));
  RecordTypePrototype.constructor = RecordType;

  return RecordType;
};

Record.prototype.toString = function toString () {
    var this$1 = this;

  var str = recordName(this) + ' { ';
  var keys = this._keys;
  var k;
  for (var i = 0, l = keys.length; i !== l; i++) {
    k = keys[i];
    str += (i ? ', ' : '') + k + ': ' + quoteString(this$1.get(k));
  }
  return str + ' }';
};

Record.prototype.equals = function equals (other) {
  return this === other ||
    (this._keys === other._keys && recordSeq(this).equals(recordSeq(other)));
};

Record.prototype.hashCode = function hashCode () {
  return recordSeq(this).hashCode();
};

// @pragma Access

Record.prototype.has = function has (k) {
  return this._indices.hasOwnProperty(k);
};

Record.prototype.get = function get (k, notSetValue) {
  if (!this.has(k)) {
    return notSetValue;
  }
  var index = this._indices[k];
  var value = this._values.get(index);
  return value === undefined ? this._defaultValues[k] : value;
};

// @pragma Modification

Record.prototype.set = function set (k, v) {
  if (this.has(k)) {
    var newValues = this._values.set(
      this._indices[k],
      v === this._defaultValues[k] ? undefined : v
    );
    if (newValues !== this._values && !this.__ownerID) {
      return makeRecord(this, newValues);
    }
  }
  return this;
};

Record.prototype.remove = function remove (k) {
  return this.set(k);
};

Record.prototype.clear = function clear () {
  var newValues = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : makeRecord(this, newValues);
};

Record.prototype.wasAltered = function wasAltered () {
  return this._values.wasAltered();
};

Record.prototype.toSeq = function toSeq () {
  return recordSeq(this);
};

Record.prototype.toJS = function toJS () {
  return recordSeq(this).toJS();
};

Record.prototype.__iterator = function __iterator (type, reverse) {
  return recordSeq(this).__iterator(type, reverse);
};

Record.prototype.__iterate = function __iterate (fn, reverse) {
  return recordSeq(this).__iterate(fn, reverse);
};

Record.prototype.__ensureOwner = function __ensureOwner (ownerID) {
  if (ownerID === this.__ownerID) {
    return this;
  }
  var newValues = this._values.__ensureOwner(ownerID);
  if (!ownerID) {
    this.__ownerID = ownerID;
    this._values = newValues;
    return this;
  }
  return makeRecord(this, newValues, ownerID);
};

Record.isRecord = isRecord;
Record.getDescriptiveName = recordName;
var RecordPrototype = Record.prototype;
RecordPrototype[IS_RECORD_SENTINEL] = true;
RecordPrototype[DELETE] = RecordPrototype.remove;
RecordPrototype.deleteIn = (RecordPrototype.removeIn = MapPrototype.removeIn);
RecordPrototype.getIn = CollectionPrototype.getIn;
RecordPrototype.hasIn = CollectionPrototype.hasIn;
RecordPrototype.merge = MapPrototype.merge;
RecordPrototype.mergeWith = MapPrototype.mergeWith;
RecordPrototype.mergeIn = MapPrototype.mergeIn;
RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
RecordPrototype.setIn = MapPrototype.setIn;
RecordPrototype.update = MapPrototype.update;
RecordPrototype.updateIn = MapPrototype.updateIn;
RecordPrototype.withMutations = MapPrototype.withMutations;
RecordPrototype.asMutable = MapPrototype.asMutable;
RecordPrototype.asImmutable = MapPrototype.asImmutable;
RecordPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
RecordPrototype.toJSON = (RecordPrototype.toObject = CollectionPrototype.toObject);
RecordPrototype.inspect = (RecordPrototype.toSource = CollectionPrototype.toSource);

function makeRecord(likeRecord, values, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._values = values;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record._name || record.constructor.name || 'Record';
}

function recordSeq(record) {
  return keyedSeqFromValue(record._keys.map(function (k) { return [k, record.get(k)]; }));
}

function setProp(prototype, name) {
  try {
    Object.defineProperty(prototype, name, {
      get: function() {
        return this.get(name);
      },
      set: function(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  } catch (error) {
    // Object.defineProperty failed. Probably IE8.
  }
}

/**
 * Returns a lazy Seq of `value` repeated `times` times. When `times` is
 * undefined, returns an infinite sequence of `value`.
 */
var Repeat = (function (IndexedSeq$$1) {
  function Repeat(value, times) {
    if (!(this instanceof Repeat)) {
      return new Repeat(value, times);
    }
    this._value = value;
    this.size = times === undefined ? Infinity : Math.max(0, times);
    if (this.size === 0) {
      if (EMPTY_REPEAT) {
        return EMPTY_REPEAT;
      }
      EMPTY_REPEAT = this;
    }
  }

  if ( IndexedSeq$$1 ) Repeat.__proto__ = IndexedSeq$$1;
  Repeat.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
  Repeat.prototype.constructor = Repeat;

  Repeat.prototype.toString = function toString () {
    if (this.size === 0) {
      return 'Repeat []';
    }
    return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
  };

  Repeat.prototype.get = function get (index, notSetValue) {
    return this.has(index) ? this._value : notSetValue;
  };

  Repeat.prototype.includes = function includes (searchValue) {
    return is(this._value, searchValue);
  };

  Repeat.prototype.slice = function slice (begin, end) {
    var size = this.size;
    return wholeSlice(begin, end, size)
      ? this
      : new Repeat(
          this._value,
          resolveEnd(end, size) - resolveBegin(begin, size)
        );
  };

  Repeat.prototype.reverse = function reverse () {
    return this;
  };

  Repeat.prototype.indexOf = function indexOf (searchValue) {
    if (is(this._value, searchValue)) {
      return 0;
    }
    return -1;
  };

  Repeat.prototype.lastIndexOf = function lastIndexOf (searchValue) {
    if (is(this._value, searchValue)) {
      return this.size;
    }
    return -1;
  };

  Repeat.prototype.__iterate = function __iterate (fn, reverse) {
    var this$1 = this;

    var size = this.size;
    var i = 0;
    while (i !== size) {
      if (fn(this$1._value, reverse ? size - ++i : i++, this$1) === false) {
        break;
      }
    }
    return i;
  };

  Repeat.prototype.__iterator = function __iterator (type, reverse) {
    var this$1 = this;

    var size = this.size;
    var i = 0;
    return new Iterator(
      function () { return i === size
          ? iteratorDone()
          : iteratorValue(type, reverse ? size - ++i : i++, this$1._value); }
    );
  };

  Repeat.prototype.equals = function equals (other) {
    return other instanceof Repeat
      ? is(this._value, other._value)
      : deepEqual(other);
  };

  return Repeat;
}(IndexedSeq));

var EMPTY_REPEAT;

var Immutable = {
  Collection: Collection,
  // Note: Iterable is deprecated
  Iterable: Collection,

  Seq: Seq,
  Map: Map,
  OrderedMap: OrderedMap,
  SortedMap: SortedMap,
  List: List,
  Stack: Stack,
  Set: Set,
  OrderedSet: OrderedSet,
  SortedSet: SortedSet,

  Record: Record,
  Range: Range,
  Repeat: Repeat,

  is: is,
  fromJS: fromJS,
  hash: hash,

  isImmutable: isImmutable,
  isCollection: isCollection,
  isKeyed: isKeyed,
  isIndexed: isIndexed,
  isAssociative: isAssociative,
  isOrdered: isOrdered,
  isSorted: isSorted,
  isValueObject: isValueObject
};

// Note: Iterable is deprecated
var Iterable = Collection;

exports['default'] = Immutable;
exports.Collection = Collection;
exports.Iterable = Iterable;
exports.Seq = Seq;
exports.Map = Map;
exports.OrderedMap = OrderedMap;
exports.SortedMap = SortedMap;
exports.List = List;
exports.Stack = Stack;
exports.Set = Set;
exports.OrderedSet = OrderedSet;
exports.SortedSet = SortedSet;
exports.Record = Record;
exports.Range = Range;
exports.Repeat = Repeat;
exports.is = is;
exports.fromJS = fromJS;
exports.hash = hash;
exports.isImmutable = isImmutable;
exports.isCollection = isCollection;
exports.isKeyed = isKeyed;
exports.isIndexed = isIndexed;
exports.isAssociative = isAssociative;
exports.isOrdered = isOrdered;
exports.isSorted = isSorted;
exports.isValueObject = isValueObject;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require('_process'))
},{"_process":12}]},{},[10]);
