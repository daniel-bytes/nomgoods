import shortid from 'shortid'
import { GoogleSignin } from 'react-native-google-signin'
import ApplicationState from '../state/application-state'
import * as AwsCognito from '../services/aws-cognito'
import * as actionTypes from './action-types'
import { platform } from '../platform'
import collections from '../utils/collections'
import * as constants from '../constants'
import secrets from '../secrets'

function mapGoogleUser(user) {
    return {
        name: user.name,
        firstName: user.givenName,
        lastName: user.familyName,
        email: user.email,
        token: user.idToken,
        tokenType: constants.GOOGLE,
        data: user
    }
}

const actionMethods = {};

/*
 * State
 */
actionMethods[actionTypes.UPDATE_DATA] = function(data, nav) {
    return {
        type: actionTypes.UPDATE_DATA,
        data: data,
        nav: nav
    }
}

/*
 * Navigation
 */
actionMethods[actionTypes.BACK_BUTTON] = function() {
    return {
        type: actionTypes.BACK_BUTTON
    }
}

actionMethods[actionTypes.SELECT_LIST] = function(listId) {
    return {
        type: actionTypes.SELECT_LIST,
        listId: listId
    }
}

actionMethods[actionTypes.ADD_NEW_LIST] = function() {
    return {
        type: actionTypes.ADD_NEW_LIST
    }
}

actionMethods[actionTypes.ADD_NEW_ITEM] = function(listId) {
    return {
        type: actionTypes.ADD_NEW_ITEM,
        listId: listId
    }
}

actionMethods[actionTypes.SHOW_MENU] = function() {
    return {
        type: actionTypes.SHOW_MENU
    }
}

actionMethods[actionTypes.LOGGED_IN] = function(user, state) {
    return {
        type: actionTypes.LOGGED_IN,
        user: user,
        state: state
    }
}

actionMethods[actionTypes.LOGGED_OUT] = function() {
    return {
        type: actionTypes.LOGGED_OUT
    }
}

/*
 * Actions
 */
actionMethods[actionTypes.TOGGLE_ITEM_COMPLETED] = function(listId, itemId) {
    return function(dispatch, getState) {
        const app = getState().app;
        const state = new ApplicationState(app);

        state.toggleItemCompleted(listId, itemId);

        dispatch(
            actionMethods[actionTypes.SYNC_COGNITO](state)
        )
    }
}


actionMethods[actionTypes.SAVE_NEW_LIST] = function(name) {
    return function(dispatch, getState) {
        const app = getState().app;
        const state = new ApplicationState(app);

        state.addList(name);

        dispatch(
            actionMethods[actionTypes.SYNC_COGNITO](state, "save")
        )
    }
}

actionMethods[actionTypes.DELETE_LIST] = function(listId) {
    return function(dispatch, getState) {
        const app = getState().app;
        const state = new ApplicationState(app);

        state.removeList(listId);

        dispatch(
            actionMethods[actionTypes.SYNC_COGNITO](state)
        )
    }
}

actionMethods[actionTypes.SAVE_NEW_ITEM] = function(listId, name) {
    return function(dispatch, getState) {
        const app = getState().app;
        const state = new ApplicationState(app);

        state.addListItem(listId, name);

        dispatch(
            actionMethods[actionTypes.SYNC_COGNITO](state, "save")
        )
    }

    return state;
}

actionMethods[actionTypes.DELETE_ITEM] = function(listId, itemId) {
    return function(dispatch, getState) {
        const app = getState().app;
        const state = new ApplicationState(app);

        state.removeListItem(listId, itemId);

        dispatch(
            actionMethods[actionTypes.SYNC_COGNITO](state)
        )
    }
}

/*
 * Google
 */
actionMethods[actionTypes.INIT_GOOGLE] = function() {
    return function(dispatch) {
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            const signInParams = {};
            const pf = platform();
            
            signInParams[`${pf}ClientId`] = secrets.googleSignIn[pf].clientId;

            GoogleSignin.configure(signInParams).then(() => {
                GoogleSignin.currentUserAsync().then(googleUser => {
                    if (googleUser) {
                        const user = mapGoogleUser(googleUser);

                        dispatch(
                            actionMethods[actionTypes.LOGIN_COGNITO](user)
                        );
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

actionMethods[actionTypes.LOGIN_GOOGLE] = function() {
    return function(dispatch) {
        GoogleSignin.signIn().then((googleUser) => {
            if (googleUser) {
                const user = mapGoogleUser(googleUser);

                dispatch(
                    actionMethods[actionTypes.LOGIN_COGNITO](user)
                );
            }
        })
        .catch((err) => {
            console.warn('Google login failure', err);
        })
        .done();
    }
}

actionMethods[actionTypes.LOGOUT_GOOGLE] = function() {
    return function(dispatch) {
        GoogleSignin.signOut()/*
        GoogleSignin.revokeAccess().then(() => {
            return GoogleSignin.signOut()
        })*/
        .catch(err => {
            console.warn('Google logout failure', err);
        })
        .then(() => {
            console.log('Google logged out');
            dispatch(
                actionMethods[actionTypes.LOGOUT_COGNITO]()
            );
        })
        .done();
    }
}

/*
 * AWS
 */
actionMethods[actionTypes.LOGIN_COGNITO] = function(user) {
    return function(dispatch, getState) {
        console.log('login cognito', user.token)
        AwsCognito.signIn(user.tokenType, user.token).then(results => {
            user.id = results[0];

            // Register for changes
            AwsCognito.register(updatedKeys => {
                AwsCognito.get().then(cognitoData => {
                    console.log('Cognito Data', cognitoData)
                    const app = getState().app;
                    const state = new ApplicationState(app);

                    if (cognitoData && cognitoData.length) {
                        state.synchronizeWithCognito(cognitoData[0]);
                    }
                    
                    dispatch(
                        actionMethods[actionTypes.UPDATE_DATA](state.data())
                    )    
                });
            });

            // Load initial state
            AwsCognito.get().then(cognitoData => {
                const app = getState().app;
                const state = new ApplicationState(app);

                if (cognitoData && cognitoData.length) {
                    state.synchronizeWithCognito(cognitoData[0]);
                }
                dispatch(
                    actionMethods[actionTypes.LOGGED_IN](user, state)
                )    
            });
        })
        .catch((err) => {
            console.warn('Cognito login failure', err);
        })
        .done();
    }
}

actionMethods[actionTypes.LOGOUT_COGNITO] = function() {
    return function(dispatch) {
        AwsCognito
            .signOut()
            .catch(err => {
                console.warn('Cognito logout failure', err);
            })
            .then(() => {
                AwsCognito.unregister();

                console.log('Cognito logged out');
                dispatch(
                    actionMethods[actionTypes.LOGGED_OUT]()
                );
            })
            .done();
    }
}

actionMethods[actionTypes.SYNC_COGNITO] = function(state, nav) {
    return function(dispatch, getState) {
        const changes = state.changes();

        if (changes.length) {
            AwsCognito.synchronize(changes)
                .catch(e => console.warn(`Cognito sync failed: ${e}`))
                .done();
        }

        // Don't wait for cognito sync to finish
        dispatch(
            actionMethods[actionTypes.UPDATE_DATA](state.data(), nav)
        );
    }
}

export default actionMethods;