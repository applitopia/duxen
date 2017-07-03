'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeteorDriver = exports.createEngine = undefined;

var _BasicEngine = require('./BasicEngine');

var _BasicEngine2 = _interopRequireDefault(_BasicEngine);

var _MeteorDriver = require('./MeteorDriver');

var _MeteorDriver2 = _interopRequireDefault(_MeteorDriver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Engine from './AdvancedEngine';

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
  return new _BasicEngine2.default(schema);
};

exports.createEngine = createEngine;
exports.MeteorDriver = _MeteorDriver2.default;
exports.default = {
  createEngine: createEngine
};