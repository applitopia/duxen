/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

 /*eslint-disable */
import { Map, List, fromJS, is } from 'immutable-sorted';
import CommonEngine from './CommonEngine';

const cast = <T>(value: any): T => (value: T);
/*eslint-enable */

export default class AdvancedEngine extends CommonEngine implements EngineInterface {

  constructor(schema: Schema) {
    super(schema);
  }

  //
  // Compile the reducer
  //
  reducer(): Reducer {
    return (state: State=Map(), action: Action) => {
      if(!action) {
        throw new Error("Missing action");
      }
      return state;
    };
  }
}
