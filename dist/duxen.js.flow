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

//
// Basic building blocks of the state
// State Key and State Value types
//
type StateKey = string | number | boolean | Map<string, StateKey>;
type StateValue = string | number | boolean | Map<StateKey, StateValue>; // | List<StateValue>;
type CollDocument = Map<string, StateValue>
type CollData = Map<StateKey, CollDocument>;

//
// Actions
//
type CollActionType =
  'DUXEN_BATCH' |
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

type DuxenActionType =
    'DUXEN_REFRESH' |
    'DUXEN_VALUE';

type RepoActionType =
    'DUXEN_CREATE_BRANCH' |
    'DUXEN_SWITCH_BRANCH' |
    'DUXEN_SAVE_BRANCH' |
    'DUXEN_RESET_BRANCH' |
    'DUXEN_REMOVE_BRANCH' |
    'DUXEN_GO_FORWARD' |
    'DUXEN_GO_BACK' |
    'DUXEN_GO_LIVE'
    ;

type CustomActionType = string;
type ActionType = CollActionType | DuxenActionType | CustomActionType;

// Coll Actions
type InsertAction = {| type: 'DUXEN_INSERT', collName: string, id: StateKey, doc: CollDocument |};
type UpdateAction = {| type: 'DUXEN_UPDATE', collName: string, id: StateKey, doc: CollDocument |};
type RemoveAction = {| type: 'DUXEN_REMOVE', collName: string, id: StateKey |};
type ResetAction = {| type: 'DUXEN_RESET', collName: string |};
type PauseAction = {| type: 'DUXEN_PAUSE', collName: string |};
type ResumeAction = {| type: 'DUXEN_RESUME', collName: string |};
type SaveAction = {| type: 'DUXEN_SAVE', collName: string |};
type RestoreAction = {| type: 'DUXEN_RESTORE', collName: string |};
type SaveOriginalsAction = {| type: 'DUXEN_SAVE_ORIGINALS', collName: string |};
type RetrieveOriginalsAction = {| type: 'DUXEN_RETRIEVE_ORIGINALS', collName: string |};
type BatchAction = {| type: 'DUXEN_BATCH', collName: string, actions: List<CollAction> |};
type CollAction = BatchAction | InsertAction | UpdateAction | RemoveAction |
  PauseAction | ResumeAction | ResetAction | SaveAction | RestoreAction |
  SaveOriginalsAction | RetrieveOriginalsAction;

// Duxen Actions
type RefreshAction = {| type: 'DUXEN_REFRESH' |};
type ValueAction = {| type: 'DUXEN_VALUE', valueName: string, value: StateValue |};

// Custom Actions
type CustomValueAction = {type: CustomActionType, value: StateValue};
type CustomAction = {type: CustomActionType};

// Repo Actions
type CreateBranchAction = {| type: 'DUXEN_CREATE_BRANCH', branchName: string |};
type SwitchBranchAction = {| type: 'DUXEN_SWITCH_BRANCH', branchName: string |};
type SaveBranchAction = {| type: 'DUXEN_SAVE_BRANCH', branchName: string |};
type ResetBranchAction = {| type: 'DUXEN_RESET_BRANCH', branchName: string |};
type RemoveBranchAction = {| type: 'DUXEN_REMOVE_BRANCH', branchName: string |};
type GoForwardAction = {| type: 'DUXEN_GO_FORWARD', steps: number |};
type GoBackAction = {| type: 'DUXEN_GO_BACK', steps: number |};
type GoLiveAction = {| type: 'DUXEN_GO_LIVE' |};
type RepoAction = CreateBranchAction | SwitchBranchAction | ResetBranchAction | SaveBranchAction |
  RemoveBranchAction | GoForwardAction | GoBackAction | GoLiveAction;

// type Action includes all types of actions
type Action = CollAction | RefreshAction | ValueAction | CustomValueAction | CustomAction | RepoAction;

type ValueReducer = (value: StateValue, action: ValueAction) => StateValue;
type CustomReducer = (mutableState: State, action: CustomAction) => void;

//
// State & StateReducer
//
type State = Map<string, StateValue>;
type StateReducer = (state: ?State, action: Action)=>State;

//
// Schema
//
type SchemaEntryType =
  'value' |
  'customValue' |
  'formula' |
  'collection' |
  'view' |
  'custom' |
  'schema';
type ValueSchemaEntry = {|
  type: 'value',
  path?: string,
  initValue: StateValue,
|};
type CustomValueSchemaEntry = {|
  type: 'customValue',
  path?: string,
  initValue: StateValue,
  actionType: CustomActionType,
  action: (StateValue)=>CustomValueAction,
  reducer: ValueReducer
|};
type CollectionSchemaEntry = {|
  type: 'collection',
  path?: string
|};
type Props = {[string]: StateValue};
type PropsRecipe = Array<string>;
type FormulaRecipe = (props: Props) => StateValue;
type ViewRecipe = (seq: Seq<StateKey, CollDocument>, props: Props) => Seq<StateKey, CollDocument>;

type FormulaSchemaEntry = {|
  type: 'formula',
  path?: string,
  props: PropsRecipe,
  recipe: FormulaRecipe
|};

type ViewSchemaEntry = {|
  type: 'view',
  sourceName: string,
  path?: string,
  props: PropsRecipe,
  recipe: ViewRecipe
|};

type CustomSchemaEntry = {|
  type: 'custom',
  path?: string,
  actionType: CustomActionType,
  action: () => CustomAction,
  reducer: CustomReducer
|};

type SubSchemaEntry = {|
  type: 'schema',
  path?: string,
  schema: Schema
|};

type SchemaEntry = ValueSchemaEntry | CustomValueSchemaEntry | FormulaSchemaEntry | CollectionSchemaEntry | ViewSchemaEntry | CustomSchemaEntry | SubSchemaEntry;

type Schema = {
  [string]: SchemaEntry
};

//
// Repo and RepoReducer
//

type RepoOptionsProps = {|
  history: number
|};
type RepoOptions = State;

type RepoBranchProps = {|
  live: boolean,
  currentIndex: number,
  states: Array<State>,
  actions: Array<Action>
|};
type RepoBranch = State;
type RepoBranches = Map<string, RepoBranch>;

type RepoProps = {|
  version: number,
  options: RepoOptions,
  currentBranch: string,
  branches: {[string]: RepoBranchProps},
|};
type Repo = State;

type RepoReducer = (repo: ?Repo, action: Action) => Repo;

//
// Interfaces
//

declare interface ActionFactoryInterface {
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
  batch(collName: string, actions: List<CollAction>): BatchAction;
}

declare interface EngineInterface {
  // Utility functions
  get(state: State, name?: string): StateValue;
  printableState(state: State): State;
  persistableState(state: State): State;
  subscribe(listener: (Action)=>void): ()=>void;

  // Repo Functions
  currentBranch(repo: Repo): string;
  head(repo: Repo): State;

  // SubEngine
  subEngine(subSchemaPath: string): EngineInterface;

  // ActionFactory
  actionFactory(): ActionFactoryInterface;
  boundActionFactory(dispatch: (Action)=>Action): ActionFactoryInterface;

  // Reducer
  stateReducer(): StateReducer;
  repoReducer(): RepoReducer;
}

declare function createEngine(schema: Schema): EngineInterface;

//
// Meteor Driver
//

type MongoID = string | {|_str: string|};
type Selector = MongoID | {_id: MongoID} | {||};

declare class MeteorCollection {
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

declare class MeteorDriver {
  static (engine: EngineInterface, dispatch: (Action)=>Action, getState: ()=>State): MeteorDriver;
  open(name: string, connection: {}): MeteorCollection;
}
