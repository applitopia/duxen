/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { Seq, Set } from 'immutable-sorted';

const cast = <T>(value: any): T => (value: T);

const isEmptyObject = (obj: mixed): boolean => {
  if(typeof obj !== 'object') {
    return false;
  }

  for (var x in obj) {
    return false;
  }

  return true;
}

const getMongoID = (selector: Selector): ?MongoID => {
  if(typeof selector === 'object' && selector._id !== undefined) {
    return selector._id;
  } else if(isEmptyObject(selector)) {
    return undefined;
  }
  return cast(selector);
};


export class MeteorCollection {
  _name: string;
  _engine: EngineInterface;
  _dispatch: (Action)=>Action;
  _getData: ()=>CollData;
  _getOriginals: ()=>CollData;

  _paused: boolean;
  _pending: Array<Action>;

  _ids: Set<MongoID>;

  constructor(name: string, engine: EngineInterface, dispatch: (Action)=>Action, getData: ()=>CollData, getOriginals: ()=>CollData) {
      this._name = name;
      this._engine = engine;
      this._dispatch = dispatch;
      this._getData = getData;
      this._getOriginals = getOriginals;
      this._paused = false;
      this._pending = [];
      this._ids = Set().asMutable();
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


  remove(selector: Selector): void {
    const mongoId:?MongoID = getMongoID(selector);
    if(!mongoId) {
      this._ids = Set().asMutable();
      this._pending = [];
      const action = this._engine.reset(this._name);
      this._dispatch(action);
    } else {
      this._ids.remove(mongoId);
      const action = this._engine.remove(this._name, mongoId);
      this.dispatch(action);
    }
  }

  insert(replace: CollDocument): void {
    const mongoId:MongoID = replace._id;
    if(!mongoId) {
      throw new Error("Empty mongoID: "+JSON.stringify(replace));
    }
    this._ids.add(mongoId);
    const action = this._engine.insert(this._name, mongoId, replace);
    this.dispatch(action);
  }

  update(selector: Selector, replace: CollDocument): void {
    const mongoId:?MongoID = getMongoID(selector);
    if(!mongoId) {
      throw new Error("Selector not supported:"+JSON.stringify(selector));
    }
    const action = this._engine.update(this._name, mongoId, replace);
    this.dispatch(action);
  }

  findOne(selector: Selector): boolean {
    const mongoId:?MongoID = getMongoID(selector);
    if(!mongoId) {
      throw new Error("Selector not supported:"+JSON.stringify(selector));
    }
    return this._ids.has(mongoId);
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

  retrieveOriginals(): Seq<StateKey, mixed> {
    this.flush();
    const collData = this._getOriginals();
    const action = this._engine.retrieveOriginals(this._name);
    this.dispatch(action);
    if(collData) {
      return Seq(collData).map((v)=>v?v.toJS():v);
    }
    return collData;
  }
}

export class MeteorDriver {
  _engine: EngineInterface;
  _dispatch: (Action)=>Action;
  _getState: ()=>State;

  constructor(engine: EngineInterface, dispatch: (Action)=>Action, getState: ()=>State) {
      this._engine = engine;
      this._dispatch = dispatch;
      this._getState = getState;
  }

  open(name: string, connection?: {}): MeteorCollection { // eslint-disable-line no-unused-vars
    const getData = () => this._getState().get(name);
    const getOriginals = () => this._getState().getIn(['_state', name, "originals"]);
    return new MeteorCollection(name, this._engine, this._dispatch, getData, getOriginals);
  }
}
