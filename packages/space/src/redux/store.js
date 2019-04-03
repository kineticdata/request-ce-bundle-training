import { createContext } from 'react';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext, reachify } from 'redux-first-history';
import reducers from './reducers';
import saga from './sagas';

export let store = null;
export let history = null;

export const configureStore = hashHistory => {
  if (!store && !history) {
    console.log('Configuring space package redux store');

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'SPACE' })
      : compose;

    const sagaMiddlware = createSagaMiddleware();

    const {
      createReduxHistory,
      routerMiddleware,
      routerReducer,
    } = createReduxHistoryContext({ history: hashHistory });

    store = createStore(
      combineReducers({
        ...reducers,
        router: routerReducer,
      }),
      composeEnhancers(applyMiddleware(routerMiddleware, sagaMiddlware)),
    );

    history = reachify(createReduxHistory(store));

    sagaMiddlware.run(saga);
  }
};

export const context = createContext(null);
