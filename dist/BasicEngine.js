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

var cast = function cast(value) {
  return value;
};

var SimpleEngine = function (_CommonEngine) {
  _inherits(SimpleEngine, _CommonEngine);

  function SimpleEngine(schema) {
    _classCallCheck(this, SimpleEngine);

    return _possibleConstructorReturn(this, (SimpleEngine.__proto__ || Object.getPrototypeOf(SimpleEngine)).call(this, schema));
  }

  //
  // Compile the reducer
  //


  _createClass(SimpleEngine, [{
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

        if (_this2._getNameType(action.collName) !== 'collection' || !cs.collViews[action.collName]) {
          failed("Unknown collection name: " + action.collName);
        }
      };

      var updateViews = function updateViews(mutableState, state, collName, collData) {
        var paused = mutableState.getIn(["_state", collName, "paused"]);

        if (paused === true) {
          return;
        }

        var va = cs.collViews[collName];

        for (var i = 0, length = va.length; i < length; i++) {
          var v = va[i];

          // Prepare props
          var props = {};
          for (var p in v.props) {
            var propFn = v.props[p];
            props[p] = propFn(mutableState);
          }
          var oldProps = mutableState.getIn(['_props', v.viewName]);
          var newProps = (0, _immutableSorted.fromJS)(props);
          var oldData = state.get(collName);
          var oldPaused = state.getIn(["_state", collName, "paused"]);
          if (collData !== oldData || !(0, _immutableSorted.is)(oldProps, newProps) || oldPaused !== paused) {
            var newdata = v.recipe(cast(collData.toSeq()), props);

            mutableState.setIn(['_props', v.viewName], newProps);
            mutableState.set(v.viewName, newdata);
          }
        }
      };

      var updateOriginals = function updateOriginals(mutableState, collName, id, doc) {
        var collData = mutableState.getIn(["_state", collName, "originals"]);

        if (collData) {
          if (!collData.has(id)) {
            mutableState.setIn(["_state", collName, "originals", id], doc);
          }
        }
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
              var collData = cast(mutableState.get(_collAction.collName));

              var newcollData = collData.set(_collAction.id, _collAction.doc);

              mutableState.set(_collAction.collName, newcollData);

              updateOriginals(mutableState, _collAction.collName, _collAction.id);
              updateViews(mutableState, state, _collAction.collName, newcollData);
              break;
            }

          case 'DUXEN_UPDATE':
            {
              var _collAction2 = cast(action);
              var _collData = cast(mutableState.get(_collAction2.collName));
              var id = _collAction2.id;

              var doc = _collData.get(id);
              if (!doc) {
                throw new Error("Updating document that does not exist: " + JSON.stringify(id));
              }

              var updDoc = _collAction2.doc;
              var setDoc = cast(updDoc.get("$set"));
              var unsetDoc = cast(updDoc.get("$unset"));

              var newDoc = void 0;
              if (setDoc || unsetDoc) {
                newDoc = doc.withMutations(function (mutableDoc) {
                  if (setDoc) {
                    setDoc.forEach(function (v, k) {
                      return mutableDoc.set(k, v);
                    });
                  }
                  if (unsetDoc) {
                    unsetDoc.forEach(function (v, k) {
                      return mutableDoc.delete(k);
                    });
                  }
                });
              } else {
                newDoc = updDoc;
              }

              var _newcollData = _collData.set(_collAction2.id, newDoc);
              mutableState.set(_collAction2.collName, _newcollData);

              updateOriginals(mutableState, _collAction2.collName, id, doc);
              updateViews(mutableState, state, _collAction2.collName, _newcollData);
              break;
            }

          case 'DUXEN_REMOVE':
            {
              var _collAction3 = cast(action);
              var _collData2 = cast(mutableState.get(_collAction3.collName));
              var _id = _collAction3.id;

              var _doc = _collData2.get(_id);
              if (!_doc) {
                throw new Error("Updating document that does not exist: " + JSON.stringify(_id));
              }

              var _newcollData2 = _collData2.remove(_collAction3.id);

              mutableState.set(_collAction3.collName, _newcollData2);

              updateOriginals(mutableState, _collAction3.collName, _id, _doc);
              updateViews(mutableState, state, _collAction3.collName, _newcollData2);
              break;
            }

          case 'DUXEN_RESET':
            {
              var _collAction4 = cast(action);
              var _newcollData3 = (0, _immutableSorted.Map)();

              mutableState.set(_collAction4.collName, _newcollData3);
              mutableState.deleteIn(["_state", _collAction4.collName, "originals"]);
              updateViews(mutableState, state, _collAction4.collName, _newcollData3);
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
              mutableState.setIn(["_state", _collAction6.collName, "paused"], false);
              var _collData3 = cast(mutableState.get(_collAction6.collName));
              updateViews(mutableState, state, _collAction6.collName, _collData3);
              break;
            }

          case 'DUXEN_SAVE':
            {
              var _collAction7 = cast(action);
              var _collData4 = cast(mutableState.get(_collAction7.collName));
              mutableState.setIn(["_state", _collAction7.collName, "saved"], _collData4);
              break;
            }

          case 'DUXEN_RESTORE':
            {
              var _collAction8 = cast(action);
              var _collData5 = cast(mutableState.getIn(["_state", _collAction8.collName, "saved"]));
              if (!_collData5) {
                throw new Error("Restore: nothing was saved");
              }
              mutableState.deleteIn(["_state", _collAction8.collName, "saved"]);
              mutableState.set(_collAction8.collName, _collData5);
              updateViews(mutableState, state, _collAction8.collName, _collData5);
              break;
            }

          case 'DUXEN_SAVE_ORIGINALS':
            {
              var _collAction9 = cast(action);
              var _collData6 = cast(mutableState.getIn(["_state", _collAction9.collName, "originals"]));
              if (_collData6) {
                throw new Error("Save Originals: called twice without retrieve originals");
              }
              mutableState.setIn(["_state", _collAction9.collName, "originals"], (0, _immutableSorted.Map)());
              break;
            }

          case 'DUXEN_RETRIEVE_ORIGINALS':
            {
              var _collAction10 = cast(action);
              var _collData7 = cast(mutableState.getIn(["_state", _collAction10.collName, "originals"]));
              if (!_collData7) {
                throw new Error("Retrieve Originals: called without save originals");
              }
              mutableState.deleteIn(["_state", _collAction10.collName, "originals"]);
              break;
            }

          default:
            {
              //
              // Apply value or custom reducer
              var changed = false;
              var compiledAction = cs.actions[action.type];
              if (compiledAction) {
                var name = compiledAction.name;
                var compiledName = cs.names[name];

                if (!compiledName) {
                  throw new Error("Unknown name in action: " + JSON.stringify(action));
                }

                switch (compiledAction.type) {
                  case 'value':
                    {
                      var valueAction = cast(action);
                      var oldValue = state.getIn(compiledName.path);
                      if (oldValue === undefined) {
                        throw Error("Lost value in state:" + name);
                      }
                      var reducer = compiledAction.reducer;
                      var newValue = reducer(oldValue, valueAction);
                      if (oldValue !== newValue) {
                        mutableState.setIn(compiledName.path, newValue);
                        changed = true;
                      }
                      break;
                    }
                  case 'custom':
                    {
                      var customAction = cast(action);
                      var _reducer = compiledAction.reducer;
                      if (compiledName.path.length > 0) {
                        var subState = mutableState.getIn(compiledName.path);
                        if (!subState) {
                          throw new Error("Missing path in state:" + JSON.stringify(compiledName.path));
                        }
                        var mutableSubState = subState.asMutable();
                        _reducer(mutableSubState, customAction);
                        mutableState.setIn(compiledName.path, mutableSubState);
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

              if (changed) for (var _name in cs.collViews) {
                var _collData8 = cast(state.get(_name));
                updateViews(mutableState, state, _name, _collData8);
              }
              break;
            }
        }
      };

      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cs.initState;
        var action = arguments[1];

        if (action.collName) {
          validateAction(cast(action));
        }

        return state.withMutations(function (mutableState) {
          reduce(mutableState, state, action);
        });
      };
    }
  }]);

  return SimpleEngine;
}(_CommonEngine3.default);

exports.default = SimpleEngine;