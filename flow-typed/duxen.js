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
declare type StateKey = string | number | boolean | Map<string, StateKey>;
declare type StateValue = string | number | boolean | Map<StateKey, StateValue>; // | List<StateValue>;
declare type CollDocument = Map<string, StateValue>
declare type CollData = Map<StateKey, CollDocument>;

//
// Actions
//
declare type CollActionType =
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
declare type CustomActionType = string;
declare type ActionType = CollActionType | CustomActionType;

declare type InsertAction = {type: 'DUXEN_INSERT', collName: string, id: StateKey, doc: CollDocument};
declare type UpdateAction = {type: 'DUXEN_UPDATE', collName: string, id: StateKey, doc: CollDocument};
declare type RemoveAction = {type: 'DUXEN_REMOVE', collName: string, id: StateKey};
declare type ResetAction = {type: 'DUXEN_RESET', collName: string};
declare type PauseAction = {type: 'DUXEN_PAUSE', collName: string};
declare type ResumeAction = {type: 'DUXEN_RESUME', collName: string};
declare type SaveAction = {type: 'DUXEN_SAVE', collName: string};
declare type RestoreAction = {type: 'DUXEN_RESTORE', collName: string};
declare type SaveOriginalsAction = {type: 'DUXEN_SAVE_ORIGINALS', collName: string};
declare type RetrieveOriginalsAction = {type: 'DUXEN_RETRIEVE_ORIGINALS', collName: string};
declare type BatchAction = {type: 'DUXEN_BATCH', collName: string, actions: List<CollAction>};
declare type CollAction = BatchAction | InsertAction | UpdateAction | RemoveAction |
  PauseAction | ResumeAction | ResetAction | SaveAction | RestoreAction |
  SaveOriginalsAction | RetrieveOriginalsAction;

declare type ValueAction = {type: CustomActionType, value: StateValue};
declare type CustomAction = {type: CustomActionType};
declare type Action = CollAction | ValueAction | CustomAction;

//
// State & Reducer
//
declare type State = Map<string, StateValue>;
declare type ValueReducer = (value: StateValue, action: ValueAction)=>StateValue;
declare type CustomReducer = (mutableState: State, action: CustomAction)=>void;
declare type Reducer = (state: ?State, action: Action)=>State;

//
// Schema
//
declare type SchemaEntryType =
  'value' |
  'collection' |
  'view' |
  'custom' |
  'schema';
declare type ValueSchemaEntry = {
  type: 'value',
  path?: string,
  initValue: StateValue,
  actionType: CustomActionType,
  action?: (StateValue)=>ValueAction,
  reducer?: ValueReducer};
declare type CollectionSchemaEntry = {
  type: 'collection',
  path?: string
};
declare type Props = {[string]: StateValue};
declare type PropsRecipe = {[string]: (state: State)=>StateValue};
declare type ViewRecipe = (seq: Seq<StateKey, StateValue>, props: Props) => Seq<StateKey, StateValue>;

declare type ViewSchemaEntry = {
  type: 'view',
  collName: string,
  path?: string,
  recalcOn?: [CustomActionType],
  props: PropsRecipe,
  recipe: ViewRecipe
};

declare type CustomSchemaEntry = {
  type: 'custom',
  path?: string,
  actionType: CustomActionType,
  action: ()=>CustomAction,
  reducer: CustomReducer
};

declare type SubSchemaEntry = {
  type: 'schema',
  path?: string,
  schema: Schema
};

declare type SchemaEntry = ValueSchemaEntry | CollectionSchemaEntry | ViewSchemaEntry | CustomSchemaEntry | SubSchemaEntry;

declare type Schema = {
  [string]: SchemaEntry
};

declare interface EngineInterface {
  // Utility functions
  get(state: State, name: string): StateValue;
  cleanState(state: State): State;
  subscribe(listener: (Action)=>void): ()=>void;

  // Action creators
  insert(collName: string, id: StateKey, doc: CollDocument): InsertAction;
  update(collName: string, id: StateKey, doc: CollDocument): UpdateAction;
  remove(collName: string, id: StateKey): RemoveAction;

  reset(collName: string): ResetAction;
  pause(collName: string): PauseAction;
  resume(collName: string): ResumeAction;
  save(collName: string): SaveAction;
  restore(collName: string): RestoreAction;
  saveOriginals(collName: string): SaveOriginalsAction;
  retrieveOriginals(collName: string): RetrieveOriginalsAction;

  batch(collName: string, actions: List<CollAction>): BatchAction;
  value(valueName: string, value: StateValue): ValueAction;
  custom(type: CustomActionType): CustomAction;

  // Reducer
  reducer(): Reducer;
}

declare function createEngine(schema: Schema): EngineInterface;

//
// Meteor Driver
//

declare type MongoID = string | {|_str: string|};
declare type Selector = MongoID | {_id: MongoID} | {||};

declare class MeteorCollection {
  static (name: string, engine: EngineInterface, dispatch: (Action)=>Action, getData: ()=>CollData, getOriginals: ()=>CollData): MeteorCollection;
  dispatch(action: Action): Action;
  flush(): void;

  remove(selector: Selector): void;
  insert(replace: CollDocument): void;
  update(selector: Selector, replace: CollDocument): void;
  findOne(selector: Selector): boolean;

  pauseObservers(): void;
  resumeObservers(): void;
  saveOriginals(): void;
  retrieveOriginals(): void;
}

declare class MeteorDriver {
  static (engine: EngineInterface, dispatch: (Action)=>Action, getState: ()=>State): MeteorDriver;
  open(name: string, connection: {}): MeteorCollection;
}
