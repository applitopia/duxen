/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

 //
 // Compiled Types
 //

 declare type CompiledName = {|
   name: string,
   type: SchemaEntryType,
   initValue?: StateValue,
   persistent: boolean,
   namePrefix: string,
   path: Array<string>,
   schemaPath: Array<string>,
   subPath: Array<string>,
   schemaEntry: SchemaEntry,
   dependents: Array<string>,
   seqen?: Seqen<StateKey, CollDocument, StateKey, CollDocument>
 |};

 declare type CompiledNames = {
   [string]: CompiledName
 };

 declare type CompiledCustomValueAction = {|
   type: "customValue",
   name: string,
   actionType: CustomActionType,
   reducer: ValueReducer
 |};

 declare type CompiledCustomAction = {|
   type: "custom",
   name: string,
   actionType: CustomActionType,
   reducer: CustomReducer
 |};

 declare type CompiledAction = CompiledCustomValueAction | CompiledCustomAction;

 declare type CompiledActions = {
   [CustomActionType]: CompiledAction
 };

 declare type CompiledSchema = {|
   names: CompiledNames,
   actions: CompiledActions,
   initState: State,
   allDependents: Array<string>
 |};
