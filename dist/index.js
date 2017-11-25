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