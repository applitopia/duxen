"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _immutableSorted = require("immutable-sorted");

var _SchemaCompiler = require("./SchemaCompiler");

var _SubEngine = _interopRequireDefault(require("./SubEngine"));

var _ActionFactory = _interopRequireDefault(require("./ActionFactory"));

var _BoundActionFactory = _interopRequireDefault(require("./BoundActionFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CommonEngine =
/*#__PURE__*/
function () {
  _createClass(CommonEngine, [{
    key: "_verifyName",
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
    this._actionFactory = new _ActionFactory["default"](this);
    this._listeners = [];
  }

  _createClass(CommonEngine, [{
    key: "_getCompiledName",
    value: function _getCompiledName(name) {
      var cn = this._compiledSchema.names[name];

      if (!cn) {
        throw new Error("Name not found in schema: " + name);
      }

      return cn;
    }
  }, {
    key: "_getNameType",
    value: function _getNameType(name) {
      var cs = this._compiledSchema;
      var cn = cs.names[name];

      if (!cn) {
        throw new Error("Missing name in schema: " + name);
      }

      return cn.type;
    } // Extract a value from state

  }, {
    key: "get",
    value: function get(state, name) {
      if (!name) {
        return state;
      }

      var cn = this._getCompiledName(name);

      return state.getIn(cn.path);
    } //
    // Subscribe to all actions created by this engine
    //
    // Returns a function to unsubscribe
    //

  }, {
    key: "subscribe",
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
    } //
    // Remove all internal items from the state
    //

  }, {
    key: "printableState",
    value: function printableState(state) {
      if (!state) {
        return state;
      }

      return state.withMutations(function (mutableState) {
        mutableState["delete"]("_state");
      });
    }
  }, {
    key: "persistableState",
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
            case 'customValue':
              {
                if (cn.persistent) {
                  mutableState.setIn(cn.path, state.getIn(cn.path));
                }

                break;
              }

            case 'collection':
              {
                if (cn.persistent) {
                  mutableState.setIn(cn.path, state.getIn(cn.path));
                }

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
    } //
    // Repo Functions
    //

  }, {
    key: "currentBranch",
    value: function currentBranch(repo) {
      if (!repo) {
        throw Error("repo not defined");
      }

      var currentBranch = repo.get("currentBranch");
      return currentBranch;
    }
  }, {
    key: "currentBranchState",
    value: function currentBranchState(repo) {
      var currentBranch = this.currentBranch(repo);
      var branches = repo.get("branches");
      var branch = branches.get(currentBranch);
      return branch;
    }
  }, {
    key: "live",
    value: function live(repo) {
      var branch = this.currentBranchState(repo);
      return branch.get("live");
    }
  }, {
    key: "liveState",
    value: function liveState(repo) {
      var branch = this.currentBranchState(repo);
      var states = branch.get("states");

      if (states.size <= 0) {
        return undefined;
      }

      var state = states.get(states.size - 1);
      return state;
    }
  }, {
    key: "head",
    value: function head(repo) {
      var branch = this.currentBranchState(repo);
      var currentIndex = branch.get("currentIndex");

      if (currentIndex < 0) {
        return undefined;
      }

      var states = branch.get("states");
      var state = states.get(currentIndex);
      return state;
    }
  }, {
    key: "prev",
    value: function prev(repo) {
      var branch = this.currentBranchState(repo);
      var currentIndex = branch.get("currentIndex");

      if (currentIndex <= 0) {
        return undefined;
      }

      var states = branch.get("states");
      var state = states.get(currentIndex - 1);
      return state;
    } // SubEngine

  }, {
    key: "subEngine",
    value: function subEngine(subSchemaPath) {
      this._verifyName(subSchemaPath, 'schema');

      return new _SubEngine["default"](this, subSchemaPath);
    } // ActionFactory

  }, {
    key: "actionFactory",
    value: function actionFactory() {
      return this._actionFactory;
    }
  }, {
    key: "boundActionFactory",
    value: function boundActionFactory(dispatch) {
      return new _BoundActionFactory["default"](dispatch, this.actionFactory());
    } //
    // Compile the reducer
    //

  }, {
    key: "stateReducer",
    value: function stateReducer() {
      throw new Error("Reducer is not implemented in CommonEngine");
    }
  }, {
    key: "repoReducer",
    value: function repoReducer() {
      throw new Error("RepoReducer is not implemented in CommonEngine");
    }
  }]);

  return CommonEngine;
}();

exports["default"] = CommonEngine;