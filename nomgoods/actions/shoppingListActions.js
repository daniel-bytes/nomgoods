import { GoogleSignin } from 'react-native-google-signin'
import { AwsCognito, AwsProviders, AwsRegions } from '../components/aws-cognito';
import * as types from './actionTypes'
import secrets from '../secrets.json'

function initCognito(user, tokenType) {
    const identityPoolId = secrets["aws"]["identity-pool-id"];
    const token = user.idToken;
    const region = AwsRegions[secrets["aws"]["region"]];

    return AwsCognito.signIn(identityPoolId, tokenType, token, region);
}

const results = {};

results[types.BACK_BUTTON] = function() {
    return {
        type: types.BACK_BUTTON
    }
}

results[types.TOGGLE_ITEM_COMPLETED] = function(listId, itemId) {
    return {
        type: types.TOGGLE_ITEM_COMPLETED,
        listId: listId,
        itemId: itemId
    }
}

results[types.SELECT_LIST] = function(listId) {
    return {
        type: types.SELECT_LIST,
        listId: listId
    }
}

results[types.ADD_NEW_LIST] = function() {
    return {
        type: types.ADD_NEW_LIST
    }
}


results[types.SAVE_NEW_LIST] = function(name) {
    return {
        type: types.SAVE_NEW_LIST,
        name: name
    }
}

results[types.DELETE_LIST] = function(listId) {
    return {
        type: types.DELETE_LIST,
        listId: listId
    }
}

results[types.ADD_NEW_ITEM] = function(listId) {
    return {
        type: types.ADD_NEW_ITEM,
        listId: listId
    }
}

results[types.SAVE_NEW_ITEM] = function(listId, name) {
    return {
        type: types.SAVE_NEW_ITEM,
        listId: listId,
        name: name
    }
}

results[types.DELETE_ITEM] = function(listId, itemId) {
    return {
        type: types.DELETE_ITEM,
        listId: listId,
        itemId: itemId
    }
}

results[types.SHOW_MENU] = function() {
    return {
        type: types.SHOW_MENU
    }
}

results[types.LOGOUT] = function() {
    return {
        type: types.LOGOUT
    }
}

results[types.INIT_GOOGLE] = function() {
    return function(dispatch) {
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            const signInParams = { iosClientId: secrets["google-sign-in"]["ios-client-id"] };

            GoogleSignin.configure(signInParams).then(() => {
                GoogleSignin.currentUserAsync().then(user => {
                    if (user) {
                        initCognito(user, AwsProviders.Google).then(() => {
                            dispatch(
                                results[types.SET_GOOGLE_USER](user)
                            );
                        });
                    }
                });
            });
        })
        .catch(err => {
            console.warn('Google login init failure', err);
        })
        .done();
    }
}

results[types.LOGIN_GOOGLE] = function() {
    return function(dispatch) {
        GoogleSignin.signIn().then((user) => {
            initCognito(user, AwsProviders.Google).then(() => {
                dispatch(
                    results[types.SET_GOOGLE_USER](user)
                )
            });
        })
        .catch((err) => {
            console.warn('Google login failure', err);
        })
        .done();
    }
}

results[types.LOGOUT_GOOGLE] = function() {
    return function(dispatch) {
        GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
            dispatch(
                results[types.LOGOUT]()
            );
        })
        .catch(err => {
            console.warn('Google logout failure', err);
        })
        .done();
    }
}

results[types.SET_GOOGLE_USER] = function(user) {
    return {
        type: types.SET_GOOGLE_USER,
        user: user
    }
}

export default results;