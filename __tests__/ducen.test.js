/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */


import { compile } from 'ducen';
import type { TransducerRecipe } from 'ducen';

import { seq } from 'transducers.js';
import type { Transducer } from 'transducers.js';

test("formula", function() {
  // Define a transducer recipe
  const recipe: TransducerRecipe<number, number> = [
    {
      op: 'MAP',
      fn: (x: number): number => (x + 1)
    },
    {
      op: 'FILTER',
      fn: (x: number): boolean => (x % 2 === 0)
    },
    {
      op: 'SORT',
      fn: (a: number, b: number): number => (a - b)
    },
    {
      op: 'TAKE',
      cntFn: () => 5
    },
    {
      op: 'REDUCE',
      init: () => 0,
      step: (total: number, input: number) => (total + input),
      result: (total: number) => total,
    }
  ];

  // Compile the recipe into a tranducer
  const xf: Transducer<number, number, Array<number>> = compile(recipe);

  // Transform input with the compiled transducer
  const input: Array<number> = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const output: Array<number> = seq(input, xf);
  expect(output).toEqual([30]);
});
