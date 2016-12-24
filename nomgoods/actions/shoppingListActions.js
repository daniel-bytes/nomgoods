import * as types from './actionTypes'

export function backButton() {
    return {
        type: types.BACK_BUTTON
    }
}

export function toggleItemCompleted(listId, itemId) {
    return {
        type: types.TOGGLE_ITEM_COMPLETED,
        listId: listId,
        itemId: itemId
    }
}

export function selectList(listId) {
    return {
        type: types.SELECT_LIST,
        listId: listId
    }
}

export function addNewList() {
    return {
        type: types.ADD_NEW_LIST
    }
}

export function saveNewList(name) {
    return {
        type: types.SAVE_NEW_LIST,
        name: name
    }
}

export function deleteList(listId) {
    return {
        type: types.DELETE_LIST,
        listId: listId
    }
}

export function addNewItem(listId) {
    return {
        type: types.ADD_NEW_ITEM,
        listId: listId
    }
}

export function saveNewItem(listId, name) {
    return {
        type: types.SAVE_NEW_ITEM,
        listId: listId,
        name: name
    }
}

export function deleteItem(listId, itemId) {
    return {
        type: types.DELETE_ITEM,
        listId: listId,
        itemId: itemId
    }
}