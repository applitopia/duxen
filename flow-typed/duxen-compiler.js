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

 declare type CompiledCollView = {
   viewName: string,
   collName: string,
   props: PropsRecipe,
   recipe: Recipe
 };

 declare type CompiledCollViews = {
   [string]: Array<CompiledCollView>
 };

 declare type CompiledName = {
   name: string,
   type: SchemaEntryType,
   initValue?: StateValue,
   namePrefix: string,
   path: Array<string>,
   schemaPath: Array<string>,
   subPath: Array<string>,
   schemaEntry: SchemaEntry
 };

 declare type CompiledNames = {
   [string]: CompiledName
 };

 declare type CompiledValueAction = {
   type: "value",
   name: string,
   actionType: CustomActionType,
   reducer: ValueReducer
 };

 declare type CompiledCustomAction = {
   type: "custom",
   name: string,
   actionType: CustomActionType,
   reducer: CustomReducer
 };

 declare type CompiledAction = CompiledValueAction | CompiledCustomAction;

 declare type CompiledActions = {
   [CustomActionType]: CompiledAction
 };

 declare type CompiledSchema = {
   collViews: CompiledCollViews,
   names: CompiledNames,
   actions: CompiledActions,
   initState: State,
 };
