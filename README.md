![duxen](http://applitopia.github.io/duxen/duxen.svg)

DUXEN
=====
[![ghit.me](https://ghit.me/badge.svg?repo=applitopia/duxen)](https://ghit.me/repo/applitopia/duxen)
[![npm version](https://badge.fury.io/js/duxen.svg)](https://badge.fury.io/js/duxen)
[![jest](https://img.shields.io/badge/tested_with-jest-brightgreen.svg)](https://facebook.github.io/jest/)
[![dependencies](https://img.shields.io/david/applitopia/duxen.svg)](https://david-dm.org/applitopia/duxen)
[![devDependencies](https://img.shields.io/david/dev/applitopia/duxen.svg)](https://david-dm.org/applitopia/duxen?type=dev)
[![Gitter](https://img.shields.io/gitter/room/applitopia/duxen.svg)](https://gitter.im/duxen/Lobby)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

High performance data engine maintaining complex immutable state for reactive applications.
Fully integrated with [Immutable.js](https://facebook.github.io/immutable-js/), [Redux](https://redux.js.org), and [Meteor](https://meteor.com).

See demo here: [https://stackblitz.com/edit/duxen-demo](https://stackblitz.com/edit/duxen-demo)

Huh?
====
Redux is an amazing concept that shows how to manage application data in a predictable state containers. It is actually a tiny library (2kB) with a simple container that receives actions and forwards them to reducers. The actions and reducers themselves have to be fully designed and developed from scratch. Although Redux applications are elegant, behave consistently, and are easy to test, their state management logic is usually scattered across many small files and developers may end up typing a lot of repetitive boilerplate code. Moreover, the reducers must be written as pure functions with no side effects and they have to modify the application state in an immutable way. This can become difficult and error prone especially if application logic is complex.

So here comes DUXEN, the Redux Engine.

Instead of writing individual reducers and action creators, the developer is focusing on the whole application state. The state is described with a schema that contains simple values, collections, and views which are seamlessly transforming the data in collections into their presentation form. The DUXEN compiles the schema, generates the reducers, and provides all the action creators. The resulting application state is built by DUXEN as one large immutable object using Immutable.js library.


Installation
------------

```shell
npm install duxen
```

Development
-----------

Setup:

```shell
git clone https://github.com/applitopia/duxen.git
cd duxen
npm install
```

Lint:
```shell
npm run lint
```

Build:
```shell
npm run build
```

Test:
```shell
npm test
```

Lint, Build, & Test:
```shell
npm run all
```

Update Dependencies:
```shell
npm update --save
```

Example
------
Define your DUXEN schema:

```js
const cmp=(a,b)=>(a>b?1:(a<b?-1:0))

const schema = {

  'todosFilter': {
    type: 'value',
    initValue: "",
  },

  'todosLimit': {
    type: 'value',
    initValue: 10,
  },

  'todos': {type: 'collection'},

  'todosView': {
    type:'view',
    sourceName: 'todos',
    props: ['todosFilter', 'todosLimit'],
    recipe: (seq, props)=>seq
      .filter(v=>v.get('text').indexOf(props.todosFilter) >= 0)
      .sort((a, b)=>cmp(a.get('text'), b.get('text')))
      .take(props.todosLimit),
  },

  'todosCnt': {
    type:'view',
    sourceName: 'todosView',
    props: [],
    recipe: (seq)=>Seq({cnt: seq.count()})
  },

  'todosCompletedCnt': {
    type:'view',
    sourceName: 'todosView',
    props: [],
    recipe: (seq, props)=>{
      const cnt = seq
      .filter(v=>v.get('completed'))
      .count();
      return Seq({cnt});
    }
  },

}
```
Create a DUXEN engine:
```js
import { createEngine } from 'duxen'

const engine = createEngine(schema)
```
Get a reducer from the engine and attach it to a Redux store:
```js
import { createStore } from 'redux'

const store = createStore(engine.reducer())

```
Create actions and dispatch them to the store:
```js
// Create an action that changes the value of the filter
const action = engine.value('todosFilter', "Get milk");

// Dispatch the action to the Redux store
store.dispatch(action);

// Get the updated state from the store
const state = store.getState();
```

License
-------

MIT
