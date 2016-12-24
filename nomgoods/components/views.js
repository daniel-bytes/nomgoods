import React, { Component } from 'react';
import ShoppingLists from './ShoppingLists'
import ShoppingList from './ShoppingList'
import NewItemForm from './NewItemForm'
import NewListForm from './NewListForm'
import * as navStates from '../navigation/states'

function renderShoppingLists(navigator, lists, callbacks) {
    return (
        <ShoppingLists
            lists={lists}
            onSelectList={callbacks.onSelectList}
            onDeleteList={callbacks.onDeleteList} />
    )
}

function renderAddList(navigator, lists, callbacks) {
    return (
        <NewListForm
            lists={lists}
            onSaveNewList={callbacks.onSaveNewList} />
    )
}

function renderShoppingList(navigator, lists, callbacks) {
    const listId = navigator.parameter("listId");
    const list = lists.find(x => x.key === listId);

    return (
        <ShoppingList 
            listId={listId} 
            items={list.items} 
            onToggleItemCompleted={callbacks.onToggleItemCompleted}
            onDeleteItem={callbacks.onDeleteItem} />
    )
}

function renderAddItem(navigator, lists, callbacks) {
    const listId = navigator.parameter("listId");
    const list = lists.find(x => x.key === listId);

    return (
        <NewItemForm 
            listId={listId}
            items={list.items} 
            onSaveNewItem={callbacks.onSaveNewItem} />
    )
}

export function renderView(navigator, lists, callbacks) {
    switch(navigator.state()) {
        case navStates.VIEW_LISTS:
            return renderShoppingLists(navigator, lists, callbacks);

        case navStates.ADD_LIST:
            return renderAddList(navigator, lists, callbacks);

        case navStates.EDIT_LIST:
            return renderShoppingList(navigator, lists, callbacks);
        
        case navStates.ADD_ITEM:
            return renderAddItem(navigator, lists, callbacks);

        default:
            return null;
    }
}