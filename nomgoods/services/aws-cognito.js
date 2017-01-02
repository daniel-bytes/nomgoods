import { NativeModules, NativeEventEmitter } from 'react-native'
import secrets from '../secrets.json';

const CognitoDatasetName = 'nomgoods:dataset:app:1';
const CognitoKeyName = 'nomgoods:key:data:1';
const AwsCognito = NativeModules.Cognito;
const eventEmitter = new NativeEventEmitter(AwsCognito);
const onChangeListeners = [];

const AwsRegions = {
    AWSRegionUSEast1:  1,
    AWSRegionUSEast2:  2,
    AWSRegionUSWest1:  3,
    AWSRegionUSWest2:  4,
    AWSRegionEUWest1:  5,
    AWSRegionEUWest2:  6,
    AWSRegionEUCentral1:  7,
    AWSRegionAPSoutheast1:  8,
    AWSRegionAPNortheast1:  9,
    AWSRegionAPNortheast2:  10,
    AWSRegionAPSoutheast2:  11,
    AWSRegionAPSouth1:  12,
    AWSRegionSAEast1:  13,
    AWSRegionCNNorth1:  14,
    AWSRegionCACentral1:  15,
    AWSRegionUSGovWest1:  16
};

const AwsIdentityProviders = {
    Google: 'accounts.google.com',
    Facebook: 'graph.facebook.com',
    Twitter: 'api.twitter.com',
    Amazon: 'www.amazon.com'
}

export function register(changeCallback) {
    onChangeListeners.push(
        eventEmitter.addListener('onChange', changeCallback)
    );
}

export function unregister() {
    for (let onChangeListener of onChangeListeners) {
        onChangeListener.remove();
    }
    onChangeListeners = [];
}

export function signIn(tokenType, token) {
    const identityPoolId = secrets.aws.identityPoolId;
    const identityProvider = AwsIdentityProviders[tokenType];
    const region = AwsRegions[secrets.aws.region];

    return AwsCognito.signIn(identityPoolId, identityProvider, token, region);
}

export function signOut() {
    return AwsCognito.signOut();
}

export function synchronize(kvps) {
    return AwsCognito
        .synchronize(CognitoDatasetName, kvps)
        .catch(e => {
            console.log(`Cognito sync failed.  ${e}.`);
        })
}

export function get() {
    return AwsCognito
        .get(CognitoDatasetName)
        .catch(e => {
            console.log(`Cognito get failed.  ${e}.`);
        })
}