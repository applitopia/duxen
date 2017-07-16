![duxen](http://applitopia.github.io/duxen/duxen.svg)

DUXEN
=====
[![ghit.me](https://ghit.me/badge.svg?repo=applitopia/duxen)](https://ghit.me/repo/applitopia/duxen)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/duxen)
[![dependencies]("https://img.shields.io/david/bevry/badges.svg)](https://david-dm.org/bevry/badges)
[![devDependencies]("https://img.shields.io/david/dev/bevry/badges.svg)](https://david-dm.org/bevry/badges#info=devDependencies)


High performance data engine maintaining complex immutable state for reactive applications.
Fully integrated with [Immutable.js](https://facebook.github.io/immutable-js/), [Redux](https://redux.js.org), and [Meteor](https://meteor.com).

See [http://applitopia.github.io/duxen](https://applitopia.github.io/duxen) for detailed documentation.

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

Example
------
Define your DUXEN schema:

```js
const cmp=(a,b)=>(a>b?1:a<b?-1:0)

const schema = {

  'todosFilter': {
    type: 'value',
    initValue: "",
    actionType: 'CHANGE_TASKS_FILTER',
  },

  'todosLimit': {
    type: 'value',
    initValue: 100,
    actionType: 'CHANGE_TASKS_LIMIT',
  },

  'todos': {type: 'collection'},

  'todosView': {
    type:'view',
    collName: 'todos',
    props: {
      todosFilter: state=>state.get('todosFilter'),
      todosLimit: state=>state.get('todosLimit'),
    },
    recipe: (seq, props)=>seq
      .filter(v=>v.get('name').startsWith(props.todosFilter))
      .sort((a, b)=>cmp(a.get('name'), b.get('name')))
      .take(props.todosLimit),
  },

  'todosCnt': {
    type:'view',
    collName: 'todos',
    props: {
      todosFilter: state=>state.get('todosFilter'),
      todosLimit: state=>state.get('todosLimit'),
    },
    recipe: (seq, props)=>{
      const cnt = seq
      .filter(v=>v.get('name').startsWith(props.todosFilter))
      .count();
      return Seq([cnt]);
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
const action = engine.action('todosFilter', "Get milk");

// Dispatch the action to the Redux store
store.dispatch(action);

// Get the updated state from the store
const state = store.getState();
```

License
-------

MIT
