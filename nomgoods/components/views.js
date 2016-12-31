import React, { Component } from 'react';
import ShoppingLists from './ShoppingLists'
import ShoppingList from './ShoppingList'
import NewItemForm from './NewItemForm'
import NewListForm from './NewListForm'
import Menu from './Menu'
import * as navStates from '../state/nav-states'

const renderers = {};

renderers[navStates.VIEW_LISTS] = function(navigator, state, metadata, callbacks) {
    return (
        <ShoppingLists
            lists={state.lists}
            onSelectList={callbacks.onSelectList}
            onDeleteList={callbacks.onDeleteList} />
    )
}

renderers[navStates.ADD_LIST] = function(navigator, state, metadata, callbacks) {
    return (
        <NewListForm
            lists={state.lists}
            onSaveNewList={callbacks.onSaveNewList} />
    )
}

renderers[navStates.EDIT_LIST] = function(navigator, state, metadata, callbacks) {
    const listId = navigator.parameter("listId");
    const list = state.lists.find(x => x.key === listId);

    return (
        <ShoppingList 
            listId={listId} 
            items={list.items} 
            onToggleItemCompleted={callbacks.onToggleItemCompleted}
            onDeleteItem={callbacks.onDeleteItem} />
    )
}

renderers[navStates.ADD_ITEM] = function(navigator, state, metadata, callbacks) {
    const listId = navigator.parameter("listId");
    const list = state.lists.find(x => x.key === listId);

    return (
        <NewItemForm 
            listId={listId}
            items={list.items} 
            onSaveNewItem={callbacks.onSaveNewItem} />
    )
}

renderers[navStates.MENU] = function(navigator, state, metadata, callbacks) {
    return (
        <Menu user={metadata.user}
              onLoginGoogle={callbacks.onLoginGoogle}
              onLogoutGoogle={callbacks.onLogoutGoogle} />
    )
}

export function renderView(navigator, state, metadata, callbacks) {
    const func = renderers[navigator.state()];

    if (func && navigator.state()) {
        return func(navigator, state, metadata, callbacks);
    }

    return null;
}