/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

const unifyId = (mongoId: MongoID): string => {
  if(typeof(mongoId) !== 'string') {
    return mongoId._str;
  }
  return mongoId;
};

class MeteorCollection {
  _name: string;
  _engine: EngineInterface;
  _dispatch: (Action)=>Action;
  _getData: ()=>CollData;
  _getOriginals: ()=>CollData;

  _paused: boolean;
  _pending: Array<Action>;

  _ids: {[string]: true};

  constructor(name: string, engine: EngineInterface, dispatch: (Action)=>Action, getData: ()=>CollData, getOriginals: ()=>CollData) {
      this._name = name;
      this._engine = engine;
      this._dispatch = dispatch;
      this._getData = getData;
      this._getOriginals = getOriginals;
      this._paused = false;
      this._pending = [];
      this._ids = {};
  }

  dispatch(action: Action): Action {
    if(this._paused) {
      this._pending.push(action);
    } else {
      this._dispatch(action);
    }

    return action;
  }

  flush(): void {
    if(this._pending.length > 0) {
      const batch = this._engine.batch(this._name, this._pending);
      this._dispatch(batch);
      this._pending = [];
    }
  }


  remove(mongoId: MongoID | {||}): void {
    const removeId=(mongoIdStr: string): void => {
      delete this._ids[mongoIdStr];
      const action = this._engine.remove(this._name, mongoIdStr);
      this.dispatch(action);
    };

    switch(typeof(mongoId)) {
      case 'string': {
          removeId(mongoId);
          break;
      }

      case 'object': {
        if(mongoId._str === undefined) {
          this._ids = {};
          this._pending = [];
          const action = this._engine.reset(this._name);
          this._dispatch(action);
        } else {
          removeId(mongoId._str);
        }
        break;
      }

      default: {
        throw new Error("Invalid MongoID: "+JSON.stringify(mongoId));
      }
    }
  }

  insert(replace: CollDocument): void {
    const mongoId = unifyId(replace._id);
    this._ids[mongoId] = true;
    const action = this._engine.insert(this._name, mongoId, replace);
    this.dispatch(action);
  }

  update(mongoId: MongoID, replace: CollDocument): void {
    mongoId = unifyId(mongoId);
    const action = this._engine.update(this._name, mongoId, replace);
    this.dispatch(action);
  }

  findOne(mongoId: MongoID): boolean {
    mongoId = unifyId(mongoId);
    return this._ids[mongoId];
  }

  pauseObservers(): void {
    this._paused = true;
    this._pending = [];
    const action = this._engine.pause(this._name);
    this.dispatch(action);
  }

  resumeObservers(): void {
    this.flush();
    this._paused = false;
    const action = this._engine.resume(this._name);
    this.dispatch(action);
  }

  saveOriginals(): void {
    const action = this._engine.saveOriginals(this._name);
    this.dispatch(action);
  }

  retrieveOriginals(): void {
    this.flush();
    const collData = this._getOriginals();
    const action = this._engine.retrieveOriginals(this._name);
    this.dispatch(action);
    return collData;
  }
}

export default class MeteorDriver {
  _engine: EngineInterface;
  _dispatch: (Action)=>Action;
  _getState: ()=>State;

  constructor(engine: EngineInterface, dispatch: (Action)=>Action, getState: ()=>State) {
      this._engine = engine;
      this._dispatch = dispatch;
      this._getState = getState;
  }

  open(name: string, connection: {}): MeteorCollection { // eslint-disable-line no-unused-vars
    const getData = () => this._getState().get(name);
    const getOriginals = () => this._getState().getIn(['_state', name, "originals"]);
    return new MeteorCollection(name, this._engine, this._dispatch, getData, getOriginals);
  }
}
