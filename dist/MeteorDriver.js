'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  
 */

var unifyId = function unifyId(mongoId) {
  if (typeof mongoId !== 'string') {
    return mongoId._str;
  }
  return mongoId;
};

var MeteorCollection = function () {
  function MeteorCollection(name, engine, dispatch, getData, getOriginals) {
    _classCallCheck(this, MeteorCollection);

    this._name = name;
    this._engine = engine;
    this._dispatch = dispatch;
    this._getData = getData;
    this._getOriginals = getOriginals;
    this._paused = false;
    this._pending = [];
    this._ids = {};
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
        var batch = this._engine.batch(this._name, this._pending);
        this._dispatch(batch);
        this._pending = [];
      }
    }
  }, {
    key: 'remove',
    value: function remove(mongoId) {
      var _this = this;

      var removeId = function removeId(mongoIdStr) {
        delete _this._ids[mongoIdStr];
        var action = _this._engine.remove(_this._name, mongoIdStr);
        _this.dispatch(action);
      };

      switch (typeof mongoId === 'undefined' ? 'undefined' : _typeof(mongoId)) {
        case 'string':
          {
            removeId(mongoId);
            break;
          }

        case 'object':
          {
            if (mongoId._str === undefined) {
              this._ids = {};
              this._pending = [];
              var action = this._engine.reset(this._name);
              this._dispatch(action);
            } else {
              removeId(mongoId._str);
            }
            break;
          }

        default:
          {
            throw new Error("Invalid MongoID: " + JSON.stringify(mongoId));
          }
      }
    }
  }, {
    key: 'insert',
    value: function insert(replace) {
      var mongoId = unifyId(replace._id);
      this._ids[mongoId] = true;
      var action = this._engine.insert(this._name, mongoId, replace);
      this.dispatch(action);
    }
  }, {
    key: 'update',
    value: function update(mongoId, replace) {
      mongoId = unifyId(mongoId);
      var action = this._engine.update(this._name, mongoId, replace);
      this.dispatch(action);
    }
  }, {
    key: 'findOne',
    value: function findOne(mongoId) {
      mongoId = unifyId(mongoId);
      return this._ids[mongoId];
    }
  }, {
    key: 'pauseObservers',
    value: function pauseObservers() {
      this._paused = true;
      this._pending = [];
      var action = this._engine.pause(this._name);
      this.dispatch(action);
    }
  }, {
    key: 'resumeObservers',
    value: function resumeObservers() {
      this.flush();
      this._paused = false;
      var action = this._engine.resume(this._name);
      this.dispatch(action);
    }
  }, {
    key: 'saveOriginals',
    value: function saveOriginals() {
      var action = this._engine.saveOriginals(this._name);
      this.dispatch(action);
    }
  }, {
    key: 'retrieveOriginals',
    value: function retrieveOriginals() {
      this.flush();
      var collData = this._getOriginals();
      var action = this._engine.retrieveOriginals(this._name);
      this.dispatch(action);
      return collData;
    }
  }]);

  return MeteorCollection;
}();

var MeteorDriver = function () {
  function MeteorDriver(engine, dispatch, getState) {
    _classCallCheck(this, MeteorDriver);

    this._engine = engine;
    this._dispatch = dispatch;
    this._getState = getState;
  }

  _createClass(MeteorDriver, [{
    key: 'open',
    value: function open(name, connection) {
      var _this2 = this;

      // eslint-disable-line no-unused-vars
      var getData = function getData() {
        return _this2._getState().get(name);
      };
      var getOriginals = function getOriginals() {
        return _this2._getState().getIn(['_state', name, "originals"]);
      };
      return new MeteorCollection(name, this._engine, this._dispatch, getData, getOriginals);
    }
  }]);

  return MeteorDriver;
}();

exports.default = MeteorDriver;