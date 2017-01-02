import React from 'react';

import {
    Button,
    Icon,
    Title
} from 'native-base'

import icon from './icon'
import * as navStates from '../state/nav-states'

export function renderBackButton(navigator, state, metadata, callbacks) {
    if (navigator.allowBackButton()) {
        return (
            <Button transparent onPress={callbacks.onBackButton}>
                <Icon name={icon('arrow-back')} /> 
            </Button>
        )
    }

    return null;
}

export function renderMenuButton(navigator, state, metadata, callbacks) {
    if (navigator.allowMenuButton()) {
        return (
            <Button transparent onPress={callbacks.onShowMenu}>
                <Icon name='ios-menu' />
            </Button>
        )
    }

    return null;
}

export function renderTitle(navigator, state, metadata, callbacks) {
    switch (navigator.state()) {
        case navStates.ADD_ITEM:
        case navStates.EDIT_LIST:
        {
            const list = state.lists.find(x => x.key === navigator.parameter("listId"));
            
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

export function renderAddButton(navigator, state, metadata, callbacks) {
    if (navigator.allowAddButton()) {
        const callback = navigator.state() === navStates.VIEW_LISTS
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