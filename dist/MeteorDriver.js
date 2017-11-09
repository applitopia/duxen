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
        var batch = this._actionFactory.batch(this._name, this._pending);
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