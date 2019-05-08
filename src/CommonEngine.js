/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { Map } from 'immutable-sorted';
import { compileSchema } from './SchemaCompiler';
import SubEngine from './SubEngine';
import ActionFactory from './ActionFactory';
import BoundActionFactory from './BoundActionFactory';

export default class CommonEngine implements EngineInterface {
  _compiledSchema: CompiledSchema;
  _actionFactory: ActionFactoryInterface;
  _listeners: Array<(Action)=>void>;

  _verifyName(name: string, type: SchemaEntryType) {
    const cs: CompiledSchema = this._compiledSchema;

    const cn: CompiledName = cs.names[name];

    if(!cn) {
      throw new Error("Missing name in schema: "+name);
    }

    if(cn.type !== type) {
      throw new Error("Not a "+type+": "+name);
    }
  }

  constructor(schema: Schema) {
    this._compiledSchema = compileSchema(schema);
    this._actionFactory = new ActionFactory(this);
    this._listeners = [];
  }

  _getCompiledName(name: string): CompiledName {
    const cn: CompiledName = this._compiledSchema.names[name];

    if(!cn) {
      throw new Error("Name not found in schema: "+name);
    }

    return cn;
  }

  _getNameType(name: string): SchemaEntryType {
    const cs: CompiledSchema = this._compiledSchema;

    const cn: CompiledName = cs.names[name];

    if(!cn) {
      throw new Error("Missing name in schema: "+name);
    }

    return cn.type;
  }

  // Extract a value from state
  get(state: State, name?: string): StateValue {
    if(!name) {
      return state;
    }
    const cn: CompiledName = this._getCompiledName(name);
    return state.getIn(cn.path);
  }

  //
  // Subscribe to all actions created by this engine
  //
  // Returns a function to unsubscribe
  //
  subscribe(listener: Action=>void): ()=>void {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function.')
    }

    let stillSubscribed = true;

    this._listeners.push(listener);

    return () => {
      if(stillSubscribed) {
        stillSubscribed = false;
        const index: number = this._listeners.indexOf(listener);
        this._listeners.splice(index, 1);
      }
    };
  }

  //
  // Remove all internal items from the state
  //
  printableState(state: State): State {
    if(!state) {
      return state;
    }
    return state.withMutations((mutableState: State): void => {
      mutableState.delete("_state");
    });
  }

  persistableState(state: State): State {
    if(!state) {
      return state;
    }
    return Map().withMutations((mutableState: State): void => {
      for(let name: string in this._compiledSchema.names) {
        const cn: CompiledName = this._getCompiledName(name);
        switch(cn.type) {
          case 'value':
          case 'customValue': {
            if(cn.persistent) {
              mutableState.setIn(cn.path, state.getIn(cn.path));
            }
            break;
          }
          case 'collection': {
            if(cn.persistent) {
              mutableState.setIn(cn.path, state.getIn(cn.path));
            }
            break;
          }
          default: {
            // ignore
            break;
          }
        }
      }
    });
  }

  //
  // Repo Functions
  //
  currentBranch(repo: Repo): string {
    if(!repo) {
      throw Error("repo not defined");
    }
    const currentBranch: string = repo.get("currentBranch");
    return currentBranch;
  }

  currentBranchState(repo: Repo): State {
    const currentBranch: string = this.currentBranch(repo);
    const branches: RepoBranches = repo.get("branches");
    const branch: RepoBranch = branches.get(currentBranch);
    return branch;
  }

  live(repo: Repo): boolean {
    const branch: RepoBranch = this.currentBranchState(repo);
    return branch.get("live");
  }

  liveState(repo: Repo): State {
    const branch: RepoBranch = this.currentBranchState(repo);
    const states: List<State> = branch.get("states");
    if(states.size <= 0) {
      return undefined;
    }
    const state: State = states.get(states.size - 1);
    return state;
  }

  head(repo: Repo): State {
    const branch: RepoBranch = this.currentBranchState(repo);
    const currentIndex: number = branch.get("currentIndex");
    if(currentIndex < 0) {
      return undefined;
    }
    const states: List<State> = branch.get("states");
    const state: State = states.get(currentIndex);
    return state;
  }

  prev(repo: Repo): State {
    const branch: RepoBranch = this.currentBranchState(repo);
    const currentIndex: number = branch.get("currentIndex");
    if(currentIndex <= 0) {
      return undefined;
    }
    const states: List<State> = branch.get("states");
    const state: State = states.get(currentIndex - 1);
    return state;
  }

  // SubEngine
  subEngine(subSchemaPath: string): EngineInterface {
    this._verifyName(subSchemaPath, 'schema');
    return new SubEngine(this, subSchemaPath);
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
  stateReducer(): StateReducer { throw new Error("Reducer is not implemented in CommonEngine"); }
  repoReducer(): RepoReducer { throw new Error("RepoReducer is not implemented in CommonEngine"); }
}
