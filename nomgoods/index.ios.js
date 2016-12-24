/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Main from './containers/Main';
import { setPlatform } from './platform'

setPlatform('ios');

// Press Cmd+R to reload, Cmd+D or shake for dev menu
AppRegistry.registerComponent('nomgoods', () => Main);
