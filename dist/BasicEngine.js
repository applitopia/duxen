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

var BasicEngine = function (_CommonEngine) {
  _inherits(BasicEngine, _CommonEngine);

  function BasicEngine(schema) {
    _classCallCheck(this, BasicEngine);

    return _possibleConstructorReturn(this, (BasicEngine.__proto__ || Object.getPrototypeOf(BasicEngine)).call(this, schema));
  }

  //
  // Compile the reducer
  //


  _createClass(BasicEngine, [{
    key: 'reducer',
    value: function reducer() {
      var _this2 = this;

      var cs = this.compiledSchema;

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

      var reduce = function reduce(mutableState, state, action) {
        switch (action.type) {
          case 'DUXEN_BATCH':
            {
              var collAction = cast(action);
              var actions = collAction.actions;
              for (var i = 0, len = actions.size; i < len; i++) {
                reduce(mutableState, state, cast(actions.get(i)));
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

      return function (state, action) {
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
          reduce(mutableState, state, action);
        });
      };
    }
  }]);

  return BasicEngine;
}(_CommonEngine3.default);

exports.default = BasicEngine;