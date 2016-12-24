import React from 'react';

import {
    Button,
    Icon,
    Title
} from 'native-base'

import icon from './icon'
import * as navStates from '../navigation/states'

export function renderBackButton(navigator, lists, callbacks) {
    if (navigator.state() !== navStates.VIEW_LISTS) {
        return (
            <Button transparent onPress={callbacks.onBackButton}>
                <Icon name={icon('arrow-back')} /> 
            </Button>
        )
    }

    return null;
}

export function renderMenuButton(navigator, lists, callbacks) {
    if (navigator.state() === navStates.VIEW_LISTS) {
        return (
            <Button transparent>
                <Icon name='ios-menu' />
            </Button>
        )
    }

    return null;
}

export function renderTitle(navigator, lists, callbacks) {
    switch (navigator.state()) {
        case navStates.ADD_ITEM:
        case navStates.EDIT_LIST:
        {
            const list = lists.find(x => x.key === navigator.parameter("listId"));
            
            return (
                <Title>{list.name}</Title>
            )
        }
        default:
            return (
                <Title>Shopping List</Title>
            )
    }
    
}

export function renderAddButton(navigator, lists, callbacks) {
    if (navigator.allowAddButton()) {
        const callback = navigator.state() === navStates.ADD_LIST 
                            ? callbacks.onAddNewList 
                            : callbacks.onAddNewItem;

        return (
            <Button transparent onPress={callback}>
                <Icon name={icon('add')} />
            </Button>
        )
    }

    return null;
}