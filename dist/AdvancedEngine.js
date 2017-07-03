'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

/*eslint-disable */


var cast = function cast(value) {
  return value;
};
/*eslint-enable */

var AdvancedEngine = function (_CommonEngine) {
  _inherits(AdvancedEngine, _CommonEngine);

  function AdvancedEngine(schema) {
    _classCallCheck(this, AdvancedEngine);

    return _possibleConstructorReturn(this, (AdvancedEngine.__proto__ || Object.getPrototypeOf(AdvancedEngine)).call(this, schema));
  }

  //
  // Compile the reducer
  //


  _createClass(AdvancedEngine, [{
    key: 'reducer',
    value: function reducer() {
      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutableSorted.Map)();
        var action = arguments[1];

        if (!action) {
          throw new Error("Missing action");
        }
        return state;
      };
    }
  }]);

  return AdvancedEngine;
}(_CommonEngine3.default);

exports.default = AdvancedEngine;