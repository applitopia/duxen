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

// deps is array of [sourceName, dependentName]
export const compileDependencies = (deps: Array<[string, string]>): {[string]: Array<string>} => {
  // dt is dependecy table
  const dt:{[string]: Array<string>} = {};

  // cd is compiled dependency table
  const cd:{[string]: Array<string>} = {};

  for(let i = 0; i < deps.length; i++) {
    const dep = deps[i];
    const sourceName = dep[0];
    const depName = dep[1];

    let dtDep:Array<string> = dt[sourceName];

    if(!dtDep) {
      dtDep = [];
      dt[sourceName] = dtDep;
    }
    dtDep.push(depName);
  }

  const expand = (s: string, output: Array<string>, stackTable: {[string]: true}, stack: Array<string>) => {
    stack.push(s);

    if(stackTable[s]) {
      throw new Error("Dependency loop: "+stack.toString());
    }

    stackTable[s] = true;

    const a: Array<string> = dt[s];

    if(a)
    for(let i = 0; i < a.length; i++) {
      const si: string = a[i];
      output.push(si);
      expand(si, output, stackTable, stack);
    }

    stack.pop();
    delete stackTable[s];
  };

  // eliminate duplicates in arrays (keep the last reference)
  const dedupe = (a: Array<string>): Array<string> => {
    const t: {[string]: number} = {};

    for(let i = a.length-1; i >= 0; i--) {
      const s: string = a[i];

      if(t[s] === undefined) {
        t[s] = i;
      }
    }

    const r: Array<string> = [];
    for(let i = 0; i < a.length; i++) {
      const s: string = a[i];

      if(t[s] === i) {
        r.push(s);
      }
    }

    return r;
  };

  // Expand arrays, identify loops, eliminate duplicates
  for(let sourceName: string in dt) {
    const ea: Array<string> = [];
    const stackTable: {[string]: true} = {};
    const stack: Array<string> = [];

    expand(sourceName, ea, stackTable, stack);
    const dea = dedupe(ea);

    cd[sourceName] = dea;
  }

  return cd;
};

export const compileSchema = (schema: Schema): CompiledSchema => {

  // Compiled Schema
  const cs:CompiledSchema = {
    names: {},
    actions: {},
    initState: Map(),
  };

  const compileValueSchemaEntry = (name: string, entry: ValueSchemaEntry, namePrefix: string): void => {
    let actionType:CustomActionType = entry.actionType;
      if(!actionType) {
      throw new Error("Missing actionType in value schema: "+JSON.stringify(entry));
    }
    actionType = namePrefix+actionType;
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
    if(entry.path) {
      throw new Error("Path is not allowed in custom schema: "+JSON.stringify(entry));
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

  const compile = (schema: Schema, schemaName: string, schemaPathName: string): void => {

    for(let name: string in schema) {
      if(name.match(/^\$|\.|\0/)) {
        throw Error("Invalid name (can't start with $, can't contain '.' or '\0'): "+name);
      }

      const entry: SchemaEntry = schema[name];

      if(!entry) {
        throw Error("Improper definition in schema: "+name);
      }

      let schemaPath:Array<string> = schemaPathName?schemaPathName.split('.'):[];
      const subPathName:string = (entry.path ? entry.path : name);
      let subPath:Array<string> = subPathName.split('.');
      const pathNamePrefix:string = schemaPathName ? schemaPathName + '.' : "";
      const pathName:string = pathNamePrefix + subPathName;
      let path:Array<string> = pathName.split('.');

      if(entry.type === 'custom') {
        path = path.slice(0, path.length-1);
        subPath = subPath.slice(0, subPath.length-1);
      }

      const namePrefix:string = (schemaName?schemaName+'.':"");
      name = namePrefix + name;

      const compiledName:CompiledName = cs.names[name];

      if(compiledName) {
        throw Error("Duplicate name in schema: "+name);
      }

      const cn:CompiledName = {name, type: entry.type, namePrefix, path, schemaPath, subPath, schemaEntry: entry, dependents: []};
      cs.names[name] = cn;

      switch(entry.type) {

      case 'value': {
        cn.initValue = entry.initValue;
        compileValueSchemaEntry(name, entry, namePrefix);
        break;
      }

      case 'collection': {
        break;
      }

      case 'view': {
        const sourceName:string = entry.sourceName;
        if(!sourceName) {
          throw new Error("missing sourceName in view schema: "+name);
        }
        break;
      }

      case 'custom': {
        compileCustomSchemaEntry(name, entry, namePrefix);
        break;
      }

      case 'schema': {
        compile(entry.schema, name, pathName);
        break;
      }

      default: {
        throw new Error("Invalid SchemaEntry type: "+entry.type);
      }
      }
    }

    // Build dependents
    const deps: Array<[string, string]> = [];
    for(let name: string in cs.names) {
      const cn:CompiledName = cs.names[name];
      const cnse:SchemaEntry = cn.schemaEntry;

      switch(cnse.type) {
        case 'view': {
          if(!cnse.sourceName) {
            throw new Error("Source collection or view name is not specified for: "+name);
          }

          const srcName:string = cn.namePrefix+cnse.sourceName;
          const sn:CompiledName = cs.names[srcName];
          if(!sn) {
            throw new Error("Source name not found in schema: "+srcName);
          }
          deps.push([srcName, name]);
          break;
        }
        default: {
          break;
        }
      }
    }
    const cd: {[string]: Array<string>} = compileDependencies(deps);
    for(let name: string in cd) {
      const a: Array<string> = cd[name];
      const sn:CompiledName = cs.names[name];
      sn.dependents = a;
    }
  };

  //
  // Initial state
  //
  const compileInitState = (schema: Schema, prefix: string, rootMap: State): State => Map().withMutations(map => {

    if(!rootMap) {
      rootMap = map;
      map.set('_props', Map());
      map.set('_state', Map());
    }
    for(let name: string in schema) {
      const entry: SchemaEntry = schema[name];

      if(map.get(name)) {
        throw new Error('duplicate name in schema: '+name);
      }

      name = prefix+name;
      const cn:CompiledName = cs.names[name];

      switch(entry.type) {
      case 'value': {
        map.setIn(cn.subPath, cn.initValue);
        break;
      }
      case 'collection': {
        map.setIn(cn.subPath, Map());
        rootMap.setIn(["_state", name, "paused"], false);
        break;
      }
      case 'schema': {
        map.setIn(cn.subPath, compileInitState(entry.schema, prefix+name+".", rootMap));
        break;
      }
      case 'custom': {
        break;
      }
      case 'view': {
        map.setIn(cn.subPath, Map());
        break;
      }

      default: {
        throw new Error("Unexpected entry type: "+entry.type);
      }
      }
    }
  });

  compile(schema, "", "");
  cs.initState = compileInitState(schema, "", undefined);

  return cs;
}
