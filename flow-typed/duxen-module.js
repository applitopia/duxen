/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { Map, List, Seq } from 'immutable-sorted';

declare module 'duxen' {

//
// Basic building blocks of the state
// State Key and State Value types
//
declare export type StateKey = string | number | boolean | Map<string, StateKey>;
declare export type StateValue = string | number | boolean | Map<StateKey, StateValue>; // | List<StateValue>;
declare export type CollDocument = Map<string, StateValue>
declare export type CollData = Map<StateKey, CollDocument>;

//
// Actions
//
declare export type CollActionType =
  'DUXEN_INSERT' |
  'DUXEN_UPDATE' |
  'DUXEN_REMOVE' |
  'DUXEN_RESET' |
  'DUXEN_PAUSE' |
  'DUXEN_RESUME' |
  'DUXEN_SAVE' |
  'DUXEN_RESTORE' |
  'DUXEN_SAVE_ORIGINALS' |
  'DUXEN_RETRIEVE_ORIGINALS' ;

declare export type DuxenActionType =
    'DUXEN_INIT' |
    'DUXEN_REFRESH' |
    'DUXEN_BATCH' |
    'DUXEN_VALUE';

declare export type RepoActionType =
    'DUXEN_CREATE_BRANCH' |
    'DUXEN_SWITCH_BRANCH' |
    'DUXEN_SAVE_BRANCH' |
    'DUXEN_RESET_BRANCH' |
    'DUXEN_REMOVE_BRANCH' |
    'DUXEN_GO_FORWARD' |
    'DUXEN_GO_BACK' |
    'DUXEN_GO_LIVE'
    ;

declare export type CustomActionType = string;
declare export type ActionType = CollActionType | DuxenActionType | CustomActionType;

// Coll Actions
declare export type InsertAction = {| type: 'DUXEN_INSERT', collName: string, id: StateKey, doc: CollDocument |};
declare export type UpdateAction = {| type: 'DUXEN_UPDATE', collName: string, id: StateKey, doc: CollDocument |};
declare export type RemoveAction = {| type: 'DUXEN_REMOVE', collName: string, id: StateKey |};
declare export type ResetAction = {| type: 'DUXEN_RESET', collName: string |};
declare export type PauseAction = {| type: 'DUXEN_PAUSE', collName: string |};
declare export type ResumeAction = {| type: 'DUXEN_RESUME', collName: string |};
declare export type SaveAction = {| type: 'DUXEN_SAVE', collName: string |};
declare export type RestoreAction = {| type: 'DUXEN_RESTORE', collName: string |};
declare export type SaveOriginalsAction = {| type: 'DUXEN_SAVE_ORIGINALS', collName: string |};
declare export type RetrieveOriginalsAction = {| type: 'DUXEN_RETRIEVE_ORIGINALS', collName: string |};
declare export type CollAction = InsertAction | UpdateAction | RemoveAction |
  PauseAction | ResumeAction | ResetAction | SaveAction | RestoreAction |
  SaveOriginalsAction | RetrieveOriginalsAction;

// Duxen Actions
declare export type InitAction = {| type: 'DUXEN_INIT', state: State |};
declare export type RefreshAction = {| type: 'DUXEN_REFRESH' |};
declare export type BatchAction = {| type: 'DUXEN_BATCH', actions: List<Action> |};
declare export type ValueAction = {| type: 'DUXEN_VALUE', valueName: string, value: StateValue |};
declare export type DuxenAction = InitAction | RefreshAction | BatchAction | ValueAction;

// Custom Actions
declare export type CustomValueAction = {type: CustomActionType, value: StateValue};
declare export type CustomAction = {type: CustomActionType};

// Repo Actions
declare export type CreateBranchAction = {| type: 'DUXEN_CREATE_BRANCH', branchName: string |};
declare export type SwitchBranchAction = {| type: 'DUXEN_SWITCH_BRANCH', branchName: string |};
declare export type SaveBranchAction = {| type: 'DUXEN_SAVE_BRANCH', branchName: string |};
declare export type ResetBranchAction = {| type: 'DUXEN_RESET_BRANCH', branchName: string |};
declare export type RemoveBranchAction = {| type: 'DUXEN_REMOVE_BRANCH', branchName: string |};
declare export type GoForwardAction = {| type: 'DUXEN_GO_FORWARD', steps: number |};
declare export type GoBackAction = {| type: 'DUXEN_GO_BACK', steps: number |};
declare export type GoLiveAction = {| type: 'DUXEN_GO_LIVE' |};
declare export type RepoAction = CreateBranchAction | SwitchBranchAction | ResetBranchAction | SaveBranchAction |
  RemoveBranchAction | GoForwardAction | GoBackAction | GoLiveAction;

// type Action includes all types of actions
declare export type Action = CollAction | DuxenAction | CustomValueAction | CustomAction | RepoAction;

declare export type ValueReducer = (value: StateValue, action: ValueAction) => StateValue;
declare export type CustomReducer = (mutableState: State, action: CustomAction) => void;

//
// State & StateReducer
//
declare export type State = Map<string, StateValue>;
declare export type StateReducer = (state: ?State, action: Action)=>State;

//
// Schema
//
declare export type SchemaEntryType =
  'value' |
  'customValue' |
  'formula' |
  'collection' |
  'view' |
  'custom' |
  'schema';
declare export type ValueSchemaEntry = {|
  type: 'value',
  path?: string,
  initValue: StateValue,
  persistent?: boolean
|};
declare export type CustomValueSchemaEntry = {|
  type: 'customValue',
  path?: string,
  initValue: StateValue,
  persistent?: boolean,
  actionType: CustomActionType,
  action: (StateValue)=>CustomValueAction,
  reducer: ValueReducer
|};
declare export type CollectionSchemaEntry = {|
  type: 'collection',
  path?: string,
  persistent?: boolean
|};
declare export type Props = {[string]: StateValue};
declare export type PropsRecipe = Array<string>;
declare export type FormulaRecipe = (props: Props) => StateValue;
declare export type ViewRecipe = (seq: Seq<StateKey, CollDocument>, props: Props) => Seq<StateKey, CollDocument>;

declare export type FormulaSchemaEntry = {|
  type: 'formula',
  path?: string,
  props: PropsRecipe,
  recipe: FormulaRecipe
|};

declare export type ViewSchemaEntry = {|
  type: 'view',
  sourceName: string,
  path?: string,
  props: PropsRecipe,
  recipe: ViewRecipe
|};

declare export type CustomSchemaEntry = {|
  type: 'custom',
  path?: string,
  actionType: CustomActionType,
  action: () => CustomAction,
  reducer: CustomReducer
|};

declare export type SubSchemaEntry = {|
  type: 'schema',
  path?: string,
  schema: Schema
|};

declare export type SchemaEntry = ValueSchemaEntry | CustomValueSchemaEntry | FormulaSchemaEntry | CollectionSchemaEntry | ViewSchemaEntry | CustomSchemaEntry | SubSchemaEntry;

declare export type Schema = {
  [string]: SchemaEntry
};

//
// Repo and RepoReducer
//

declare export type RepoOptionsProps = {|
  history: number
|};
declare export type RepoOptions = State;

declare export type RepoBranchProps = {|
  live: boolean,
  currentIndex: number,
  states: Array<State>,
  actions: Array<Action>
|};
declare export type RepoBranch = State;
declare export type RepoBranches = Map<string, RepoBranch>;

declare export type RepoProps = {|
  version: number,
  options: RepoOptions,
  currentBranch: string,
  branches: {[string]: RepoBranchProps},
|};
declare export type Repo = State;

declare export type RepoReducer = (repo: ?Repo, action: Action) => Repo;

//
// Interfaces
//

declare export interface ActionFactoryInterface {
  // Collection Actions
  insert(collName: string, id: StateKey, doc: CollDocument): InsertAction;
  update(collName: string, id: StateKey, doc: CollDocument): UpdateAction;
  remove(collName: string, id: StateKey): RemoveAction;

  // Value / Custom Actions
  value(valueName: string, value: StateValue): ValueAction;
  customValue(valueName: string, value: StateValue): CustomValueAction;
  custom(type: CustomActionType): CustomAction;

  // Meteor Integration
  reset(collName: string): ResetAction;
  pause(collName: string): PauseAction;
  resume(collName: string): ResumeAction;
  save(collName: string): SaveAction;
  restore(collName: string): RestoreAction;
  saveOriginals(collName: string): SaveOriginalsAction;
  retrieveOriginals(collName: string): RetrieveOriginalsAction;

  // Repo Actions
  createBranch(branchName: string): CreateBranchAction;
  switchBranch(branchName: string): SwitchBranchAction;
  saveBranch(branchName: string): SaveBranchAction;
  resetBranch(branchName: string): ResetBranchAction;
  removeBranch(branchName: string): RemoveBranchAction;
  goForward(steps: number): GoForwardAction;
  goBack(steps: number): GoBackAction;
  goLive(): GoLiveAction;

  // Utility Actions
  refresh() : RefreshAction;
  batch(actions: List<Action>): BatchAction;
}

declare export interface EngineInterface {
  // Utility functions
  get(state: State, name?: string): StateValue;
  printableState(state: State): State;
  persistableState(state: State): State;
  subscribe(listener: (Action)=>void): ()=>void;

  // Repo Functions
  currentBranch(repo: Repo): string;
  currentBranchState(repo: Repo): State;
  live(repo: Repo): boolean;
  head(repo: Repo): State;
  prev(repo: Repo): State;

  // SubEngine
  subEngine(subSchemaPath: string): EngineInterface;

  // ActionFactory
  actionFactory(): ActionFactoryInterface;
  boundActionFactory(dispatch: (Action)=>Action): ActionFactoryInterface;

  // Reducer
  stateReducer(): StateReducer;
  repoReducer(): RepoReducer;
}

declare export function createEngine(schema: Schema): EngineInterface;

//
// Meteor Driver
//

declare export type MongoID = string | {|_str: string|};
declare export type Selector = MongoID | {_id: MongoID} | {||};

declare export class MeteorCollection {
  static (name: string, engine: EngineInterface, dispatch: (Action)=>Action, getData: ()=>CollData, getOriginals: ()=>CollData): MeteorCollection;
  dispatch(action: Action): Action;
  flush(): void;

  remove(selector: Selector): void;
  insert(replace: CollDocument): void;
  update(selector: Selector, replace: CollDocument): void;
  findOne(selector: Selector): boolean;
  fetchOne(selector: Selector): CollDocument;

  pauseObservers(): void;
  resumeObservers(): void;
  saveOriginals(): void;
  retrieveOriginals(): void;
}

declare export class MeteorDriver {
  static (engine: EngineInterface, dispatch: (Action)=>Action, getState: ()=>State): MeteorDriver;
  open(name: string, connection: {}): MeteorCollection;
}

}
