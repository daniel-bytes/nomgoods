import * as actionTypes from '../actions/action-types'
import * as navStates from '../state/nav-states'
import ApplicationState from '../state/application-state'
import { GoogleSignin } from 'react-native-google-signin'
import * as AwsCognito from '../services/aws-cognito';
import initialState from '../initial-state'

const app = {};

/*
 * State
 */
app[actionTypes.UPDATE_DATA] = function(state, action) {
    state.setData(action.data);

    if (action.nav) {
        const navigator = state.createNavigator();
        const method = navigator[action.nav];

        if (typeof method === 'function') {
            method.call(navigator);
        }
        else {
            console.warn(`Warning: invalid navigation method ${action.nav}`);
            if (typeof action.nav === 'object') console.log(Object.keys(action.nav));
        }
    }

    return state;
}

/*
 * Navigation
 */
app[actionTypes.BACK_BUTTON] = function(state, action) {
    state.createNavigator().back();

    return state;
}

app[actionTypes.SELECT_LIST] = function(state, action) {
    state.createNavigator().selectList(action.listId);

    return state;
}

app[actionTypes.ADD_NEW_LIST] = function(state, action) {
    console.log('add_new_list')
    state.createNavigator().addList();

    return state;
}

app[actionTypes.ADD_NEW_ITEM] = function(state, action) {
    console.log('add_new_item')
    state.createNavigator().addItem();

    return state;
}

app[actionTypes.SHOW_MENU] = function(state, action) {
    state.createNavigator().menuButton();

    return state;
}

app[actionTypes.LOGGED_IN] = function(state, action) {
    state.setUser(action.user);
    state.setData(action.state.data());
    state.createNavigator().home();
    console.log('logged in', state.user());

    return state;
}

app[actionTypes.LOGGED_OUT] = function(state, action) {
    state.setUser(null);
    state.createNavigator().login();

    return state;
}

/*
 * Reducer
 */
export default function shoppingListApp(state = initialState, action = {}) {
    const method = app[action.type];

    if (method) {
        const appState = new ApplicationState(state);
        const result = method(appState, action);
        return result instanceof ApplicationState ? result.state() : appState.state();
    }
    
    return state;
}