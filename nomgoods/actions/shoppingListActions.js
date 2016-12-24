import * as types from './actionTypes'

export function backButton() {
    return {
        type: types.BACK_BUTTON
    }
}

export function toggleCompleted(listId, itemId) {
    return {
        type: types.TOGGLE_COMPLETED,
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

export function newList() {
    return {
        type: types.NEW_LIST
    }
}

export function newListSave(name) {
    return {
        type: types.NEW_LIST_SAVE,
        name: name
    }
}

export function newItem(listId) {
    return {
        type: types.NEW_ITEM,
        listId: listId
    }
}

export function newItemSave(listId, name) {
    return {
        type: types.NEW_ITEM_SAVE,
        listId: listId,
        name: name
    }
}
