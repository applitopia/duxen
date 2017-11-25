/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

 import SubActionFactory from './SubActionFactory';
 import BoundActionFactory from './BoundActionFactory';

export default class SubEngine implements EngineInterface {

  _engine: EngineInterface;
  _subSchemaPath: string;
  _prefix: string;
  _actionFactory: ActionFactoryInterface;

  constructor(engine: EngineInterface, subSchemaPath: string) {
    this._engine = engine;
    this._subSchemaPath = subSchemaPath;
    this._prefix = subSchemaPath+'.';
    this._actionFactory = new SubActionFactory(this._engine.actionFactory(), this._subSchemaPath);
  }

  // Extract a value from state
  get(state: State, name?: string): StateValue {
    if(!name) {
      return this._engine.get(state, this._subSchemaPath);
    }
    const prefix: string = this._prefix+name;
    return this._engine.get(state, prefix);

  }

  //
  // Subscribe to all actions created by this engine
  //
  // Returns a function to unsubscribe
  //
  subscribe(listener: Action=>void): ()=>void {
    return this._engine.subscribe(listener);
  }

  //
  // Remove all internal items from the state
  //
  printableState(state: State): State {
    let subState: State = this.get(state, undefined);
    subState = this._engine.printableState(subState);
    return subState;
  }

  persistableState(state: State): State {
    let subState = this._engine.persistableState(state);
    subState = this.get(state, undefined);
    return subState;
  }

  //
  // Repo Functions
  //

  currentBranch(repo: Repo): string {
    const currentBranch: string = repo.get("currentBranch");
    return currentBranch;
  }

  head(state: State): State {
    const st: State = this._engine.head(state);
    return st;
  }

  // SubEngine
  subEngine(subSchemaPath: string): EngineInterface {
    return this._engine.subEngine(this._prefix+subSchemaPath);
  }

  // ActionFactory
  actionFactory(): ActionFactoryInterface {
    return this._actionFactory;
  }

  boundActionFactory(dispatch: (Action)=>Action): ActionFactoryInterface {
    return new BoundActionFactory(dispatch, this.actionFactory());
  }

  //
  // Compile the reducer
  //
  stateReducer(): StateReducer { throw new Error("Reducer is not implemented in SubEngine"); }
  repoReducer(): RepoReducer { throw new Error("RepoReducer is not implemented in SubEngine"); }
}
