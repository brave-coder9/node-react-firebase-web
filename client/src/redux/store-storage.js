import { createStore, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from '../redux/reducers';
import rootSaga from '../redux/sagas';

import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import debounce from 'redux-storage-decorator-debounce';
import immutablejs from 'redux-storage-decorator-immutablejs';
import Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];

// redux-storage
let merger = function(oldState, newState) {
  return oldState.mergeDeep(newState);
};
const rootReducer = storage.reducer(combineReducers({
  ...reducers,
  router: routerReducer
}), merger);
let engine = createEngine('my-save-key');
engine = debounce(engine, 1500);  // batch save, not related to immutable stuff
engine = immutablejs(engine, Object.keys(reducers));
let storageMiddleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(...middlewares,storageMiddleware)(createStore);
const store = createStoreWithMiddleware(rootReducer, Immutable.fromJS({}));
const load = storage.createLoader(engine);
load(store)
  .then((newState) => {
    console.log('Loaded state:', newState)
  })
  .catch(() => {
    console.log('Failed to load previous state')}
  );


sagaMiddleware.run(rootSaga);
export { store, history };