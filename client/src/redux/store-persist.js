import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import createSagaMiddleware from 'redux-saga';
import reducers from '../redux/reducers';
import rootSaga from '../redux/sagas';

const config = {
  key: 'root', // key is required
  storage, // storage is now required
}
const reducer = persistReducer(
  config,
  combineReducers({
    ...reducers,
    router: routerReducer
  })
);

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];

let store = createStore(
  reducer,
  compose(applyMiddleware(...middlewares))
);
let persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { persistor, store, history };
