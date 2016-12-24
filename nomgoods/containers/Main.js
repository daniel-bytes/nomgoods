import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'

import * as reducers from '../reducers'
import App from './App'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer, undefined, autoRehydrate());

persistStore(store, { storage: AsyncStorage });

export default class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}

