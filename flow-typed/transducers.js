/*
 *  Copyright (c) 2018, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

declare module "transducers.js" {

  //
  // Type Definitions
  //

  declare type Coll<T> = Iterable<T>;

  declare type Reducer<T1, T2> = {
      '@@transducer/init': ()=>T2;
      '@@transducer/step': (result: T2, input: T1)=>T2;
      '@@transducer/result': (result: T2)=>T2;
  };

  declare type ReducedType<T> = {
      '@@transducer/reduced': boolean;
      '@@transducer/value': T;
  };

  declare type Transducer<T1, T2, T3> = (xf: Reducer<T2, T3>) => Reducer<T1, T3>;

  declare type Context = {};

  //
  // Interfaces
  //

  declare type IteratorValue<T> =
    {|value: T, done: false|}
    | {|done: true|};

  declare interface Iterator<T> {
      next(): IteratorValue<T>;
  }

  //
  // General Factory Functions
  //

  declare function transformer<T1, T2>(f: (input: T1)=>T2): Reducer<T1, T2>;

  //
  // Transducer Factory Functions
  //

  declare function map<T1, T2, T3>(f: (input: T1) => T2, ctx?: Context): Transducer<T1, T2, T3>;

  declare function filter<T1, T2>(f: (input: T1) => boolean, ctx?: Context): Transducer<T1, T1, T2>;

  declare function remove<T1, T2>(f: (input: T1) => boolean, ctx?: Context): Transducer<T1, T1, T2>;

  declare function keep<T1, T2>(): Transducer<T1, T1, T2>;

  declare function dedupe<T1, T2>(): Transducer<T1, T1, T2>;

  declare function take<T1, T2>(n: number): Transducer<T1, T1, T2>;

  declare function takeWhile<T1, T2>(f: (input: T1) => boolean, ctx?: Context): Transducer<T1, T1, T2>;

  declare function drop<T1, T2>(n: number): Transducer<T1, T1, T2>;

  declare function dropWhile<T1, T2>(f: (input: T1) => boolean, ctx?: Context): Transducer<T1, T1, T2>;

  declare function partition<T1, T2>(n: number): Transducer<T1, Array<T1>, T2>;

  declare function partitionBy<T1, T2>(f: (input: T1) => mixed, ctx?: Context): Transducer<T1, Array<T1>, T2>;

  declare function interpose<T1, T2>(sep: T1): Transducer<T1, T1, T2>;

  declare function repeat<T1, T2>(n: number): Transducer<T1, T1, T2>;

  declare function takeNth<T1, T2>(n: number): Transducer<T1, T1, T2>;

  // cat<T1, T2> = Transducer<Coll<T1>, T1, T2>
  // declare function cat<T1, T2>(xf: Reducer<T1, T2>): Reducer<Coll<T1>, T2>;
  declare function cat<T1, T2, T3>(xf: Reducer<T2, T3>): Reducer<T1, T3>;

  declare function mapcat<T1, T2, T3>(f: (input: T1) => Coll<T2>, ctx?: Context): Transducer<T1, T2, T3>;

  declare function compose<T1, T2, T3>(...xform: Array<Transducer<*, *, *>>): Transducer<T1, T2, T3>;

  //
  // Applying Transformations
  //

  declare function reduce<T1, T2>(coll: Coll<T1>, xform: Reducer<T1, T2>, init: T2): T2;

  declare function transduce<T1, T2, T3>(coll: Coll<T1>, xform: Transducer<T1, T2, T3>, reducer: Reducer<T2, T3>, init: T3): T3;

  declare function seq<T1, T2, CT2: Coll<T2>>(coll: Coll<T1>, xform: Transducer<T1, T2, CT2>): CT2;

  declare function into<T1, T2, CT2: Coll<T2>>(to: CT2, xform: Transducer<T1, T2, CT2>, from: Coll<T1>): CT2;

  //
  // Collection Builder Functions
  //

  declare type PlainObject<K, V> = {[key: K]: V};

  declare function toArray<T>(coll: Coll<T>, xform?: Transducer<T, T, Array<T>>): Array<T>;

  declare function toObj<T>(coll: Coll<T>, xform?: Transducer<T, T, PlainObject<string, T>>): PlainObject<string, T>;

  declare function toIter<T>(coll: Coll<T>, xform?: Transducer<T, T, Iterator<T>>): Iterator<T>;

  //
  // Utility Functions
  //

  declare function Reduced<T>(value: T): ReducedType<T>;

  declare function iterator<T>(coll: Coll<T>): Iterator<T>;
}
