/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Main from './containers/Main';
import { setPlatform } from './platform'

setPlatform('android');

// Double tap R on your keyboard to reload, Shake or press menu button for dev menu
AppRegistry.registerComponent('nomgoods', () => Main);
