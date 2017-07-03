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
 declare type CompiledProps = {[string]: (state: State)=>StateValue};
 declare type CompiledCollView = {
   viewName: string,
   collName: string,
   props: CompiledProps,
   recipe: Recipe};
 declare type CompiledCollectionViews = {[string]: Array<CompiledCollectionView>};
 declare type CompiledName = {name: string, type: SchemaEntryType, prefix: string, path: Array<string>, schemaEntry: SchemaEntry};
 declare type CompiledNames = {[string]: CompiledName};
 declare type CompiledAction =
   {type: "value", name: string, actionType: CustomActionType, reducer: ValueReducer} |
   {type: "custom", name: string, actionType: CustomActionType, reducer: CustomReducer};
 declare type CompiledActions = {[CustomActionType]: CompiledAction};
 declare type CompiledSchema = {
   collViews: CompiledCollViews,
   names: CompiledNames,
   actions: CompiledActions,
   initState: State,
 };
