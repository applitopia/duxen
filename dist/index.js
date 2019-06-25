"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MeteorDriver", {
  enumerable: true,
  get: function get() {
    return _MeteorDriver.MeteorDriver;
  }
});
exports["default"] = exports.createEngine = void 0;

var _RepoEngine = _interopRequireDefault(require("./RepoEngine"));

var _MeteorDriver = require("./MeteorDriver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  return new _RepoEngine["default"](schema);
};

exports.createEngine = createEngine;
var _default = {
  createEngine: createEngine
};
exports["default"] = _default;