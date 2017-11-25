/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import Engine from './RepoEngine';
import { MeteorDriver } from './MeteorDriver'

const createEngine = (schema: Schema): EngineInterface => new Engine(schema);

export {
  createEngine,
  MeteorDriver
};

export default {
  createEngine
};
