/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { Map, fromJS } from 'immutable-sorted';

export const compileSchema = (schema: Schema): CompiledSchema => {

  // Compiled Schema
  const cs:CompiledSchema = {
    names: {},
    actions: {},
    collViews: {},
    initState: Map(),
  };

  const compileValueSchemaEntry = (name: string, entry: ValueSchemaEntry, prefix: string): void => {
    let actionType:CustomActionType = entry.actionType;
      if(!actionType) {
      throw new Error("Missing actionType in value schema: "+JSON.stringify(entry));
    }
    actionType = prefix+actionType;
    if(cs.actions[actionType]) {
      throw new Error("Duplicate actionType in value schema: "+JSON.stringify(entry));
    }

    const reducer:ValueReducer = (value: StateValue, action: ValueAction): StateValue => {
        switch(action.type) {
        case actionType:
          return entry.reducer?entry.reducer(value, action):action.value;
        default:
          return value;
        }
    };

    cs.actions[actionType] = {type: "value", name, actionType, reducer};
  };

  const compileCustomSchemaEntry = (name: string, entry: CustomSchemaEntry, prefix: string): void => {
    let actionType:CustomActionType = entry.actionType;
    if(!actionType) {
      throw new Error("Missing actionType in custom schema: "+JSON.stringify(entry));
    }
    actionType = prefix+actionType;
    if(cs.actions[actionType]) {
      throw new Error("Duplicate actionType in custom schema: "+JSON.stringify(entry));
    }
    if(!entry.reducer) {
      throw new Error("Missing reducer in custom schema: "+JSON.stringify(entry));
    }

    const reducer:CustomReducer = (state: State, action: CustomAction): State => {
        switch(action.type) {
        case actionType: {
          return state.withMutations((mutableState: State): void => {
            entry.reducer(mutableState, action);
          });
        }
        default: {
          return state;
        }
        }
    };

    cs.actions[actionType] = {type: "custom", name, actionType, reducer};
  };

  const compile = (schema: Schema, prefix: string): void => {
    for(let name: string in schema) {
        const entry: SchemaEntry = schema[name];

        if(!entry) {
          throw Error("Can't find name in schema: "+name);
        }

        let path:Array<string> = prefix.split('.');
        path[path.length-1] = name;

        if(entry.type === 'custom') {
          path = path.slice(0, path.length-1);
        }

        name = prefix+name;

        const compiledName:CompiledName = cs.names[name];

        if(compiledName) {
          throw Error("Duplicate name in schema: "+name);
        }

        cs.names[name] = {name, type: entry.type, prefix, path, schemaEntry: entry};

        switch(entry.type) {

        case 'value': {
          compileValueSchemaEntry(name, entry, prefix);
          break;
        }

        case 'collection': {
          const cv:Array<CompiledCollView> = cs.collViews[name];
          if(!cv) {
            cs.collViews[name] = [];
          }
          break;
        }

        case 'view': {
          const collName:string = entry.collName;
          if(!collName) {
            throw new Error("missing collName in view schema: "+name);
          }
          let cv:Array<CompiledCollView> = cs.collViews[collName];
          if(!cv) {
            cv = cs.collViews[collName] = [];
          }
          const newView:CompiledCollView = {viewName: name, collName, props: entry.props, recipe: entry.recipe};
          cv.push(newView);
          break;
        }

        case 'custom': {
          compileCustomSchemaEntry(name, entry, prefix);
          break;
        }

        case 'schema': {
          compile(entry.schema, prefix+name+".");
          break;
        }

        default: {
          throw new Error("Invalid SchemaEntry type: "+entry.type);
        }
        }
    }
  };

  //
  // Initial state
  //
  const compileInitState = (schema: Schema): State => Map().withMutations(map => {
    map.set('_props', Map());
    map.set('_state', Map());
    for(let name: string in schema) {
      const entry: SchemaEntry = schema[name];
      if(map.get(name)) {
        throw new Error('duplicate name in schema: '+name);
      }

      switch(entry.type) {
      case 'value': {
        map.set(name, fromJS(entry.initValue));
        break;
      }
      case 'collection': {
        map.setIn(["_state", name, "paused"], false);
        map.set(name, Map());
        break;
      }
      case 'schema': {
        map.set(name, compileInitState(entry.schema));
        break;
      }
      case 'custom': {
        break;
      }
      case 'view':
      default: {
        map.set(name, Map());
        break;
      }
      }
    }
  });

  compile(schema, "");
  cs.initState = compileInitState(schema);

  return cs;
}
