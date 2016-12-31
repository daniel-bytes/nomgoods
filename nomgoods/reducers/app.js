import * as types from '../actions/actionTypes'
import * as navStates from '../state/nav-states'
import ApplicationState from '../state/application-state'
import { GoogleSignin } from 'react-native-google-signin'
import { AwsCognito } from '../components/aws-cognito';

const initialState = {
    data: {
        lists: [{
            key: '1',
            name: 'Duane Reade',
            createdOn: new Date(),
            createdBy: {
                key: 'u1',
                name: 'Daniel Battaglia'
            },
            items: [
                {
                    key: 'a',
                    name: 'Toothpaste',
                    completed: false
                },
                {
                    key: 'b',
                    name: 'Coffee',
                    completed: false
                },
                {
                    key: 'c',
                    name: 'Soap',
                    completed: true
                }
            ]
        }],
    },
    metadata: {
        user: null,
        nav: [{
            state: navStates.VIEW_LISTS,
            parameters: {}            
        },
        {
            state: navStates.NOT_AUTHENTICATED,
            parameters: {}
        }]
    }
}

const app = {};

app[types.BACK_BUTTON] = function(state, action) {
    state.createNavigator().backButton();

    return state;
}

app[types.SELECT_LIST] = function(state, action) {
    state.createNavigator().selectList(action.listId);

    return state;
}

app[types.TOGGLE_ITEM_COMPLETED] = function(state, action) {
    const list = state.data().lists.find(x => x.key === action.listId);
    
    if (list) {
        const item = list.items.find(x => x.key === action.itemId);

        if (item) {
            item.completed = !item.completed;
        }
    }

    return state;
}

app[types.ADD_NEW_LIST] = function(state, action) {
    state.createNavigator().addButton();

    return state;
}

app[types.SAVE_NEW_LIST] = function(state, action) {
    state.data().lists.push({
        key: String(Math.random()),
        name: action.name,
        createdOn: new Date(),
        createdBy: {
            key: 'u1',
            name: 'Daniel Battaglia'
        },
        items: []
    });
    
    state.createNavigator().saveButton();

    return state;
}

app[types.DELETE_LIST] = function(state, action) {
    const lists = state.data().lists;

    for (let i = 0; i < lists.length; i++) {
        if (lists[i].key === action.listId) {
            lists.splice(i, 1);
            break;
        }
    }

    return state;
}

app[types.ADD_NEW_ITEM] = function(state, action) {
    state.createNavigator().addButton();

    return state;
}

app[types.SAVE_NEW_ITEM] = function(state, action) {
    const list = state.data().lists.find(x => x.key === action.listId);

    list.items.push({
        key: String(Math.random()),
        name: action.name,
        completed: false
    });
    
    state.createNavigator().saveButton();

    return state;
}

app[types.DELETE_ITEM] = function(state, action) {
    const list = state.data().lists.find(x => x.key === action.listId);

    if (list) {
        for (let i = 0; i < list.items.length; i++) {
            if (list.items[i].key === action.itemId) {
                list.items.splice(i, 1);
                break;
            }
        }
    }

    return state;
}

app[types.SHOW_MENU] = function(state, action) {
    state.createNavigator().menuButton();

    return state;
}

app[types.LOGOUT] = function(state, action) {
    state.setUser(null);
    AwsCognito.signOut();

    state.createNavigator().login();
    return state;
}

app[types.SET_GOOGLE_USER] = function(state, action) {
    state.setUser({
        name: action.user.name,
        firstName: action.user.givenName,
        lastName: action.user.familyName,
        email: action.user.email,
        token: action.user.idToken,
        //token: action.user.securityToken,
        provider: {
            type: 'google',
            data: action.user
        }
    });

    state.createNavigator().backButton();
    
    return state;
}

export default function shoppingListApp(state = initialState, action = {}) {
    const method = app[action.type];

    if (method) {
        const appState = new ApplicationState(state);
        const result = method(appState, action);
        return result instanceof ApplicationState ? result.state() : appState.state();
    }
    
    return state;
}