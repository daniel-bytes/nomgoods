import * as types from '../actions/actionTypes'
import * as navStates from '../navigation/states'
import Navigator from '../navigation/navigator'

const initialState = {
    lists: [{
        key: '1',
        name: 'Duane Reade',
        createdOn: new Date(),
        createdBy: {
            key: 'u1',
            name: 'Daniel Battaglia'
        },
        items: [
            {
                key: 'a',
                name: 'Toothpaste',
                completed: false
            },
            {
                key: 'b',
                name: 'Coffee',
                completed: false
            },
            {
                key: 'c',
                name: 'Soap',
                completed: true
            }
        ]
    }],
    nav: [{
        state: navStates.VIEW_LISTS,
        parameters: {}
    }]
}

function handleBackButton(prevState, action) {
    const results = { ...prevState }

    new Navigator(results.nav).backButton();

    return results;
}

function handleSelectList(prevState, action) {
    const results = { ...prevState }

    new Navigator(results.nav).selectList(action.listId);

    return results;
}

function handleToggleCompleted(prevState, action) {
    const results = { ...prevState };
    const list = results.lists.find(x => x.key === action.listId);
    
    if (list) {
        const item = list.items.find(x => x.key === action.itemId);

        if (item) {
            item.completed = !item.completed;
        }
    }

    return results;
}

function handleNewList(prevState, action) {
    const results = { ...prevState }
    
    new Navigator(results.nav).addButton();

    return results;
}

function handleNewListSave(prevState, action) {
    const results = { ...prevState }

    results.lists.push({
        key: String(Math.random()),
        name: action.name,
        createdOn: new Date(),
        createdBy: {
            key: 'u1',
            name: 'Daniel Battaglia'
        },
        items: []
    });
    
    new Navigator(results.nav).saveButton();

    return results;
}

function handleDeleteList(prevState, action) {
    const results = { ...prevState };
    
    for (let i = 0; i < results.lists.length; i++) {
        if (results.lists[i].key === action.listId) {
            results.lists.splice(i, 1);
            break;
        }
    }

    return results;
}

function handleNewItem(prevState, action) {
    const results = { ...prevState }
    
    new Navigator(results.nav).addButton();

    return results;
}

function handleNewItemSave(prevState, action) {
    const results = { ...prevState }
    const list = results.lists.find(x => x.key === action.listId);

    list.items.push({
        key: String(Math.random()),
        name: action.name,
        completed: false
    });
    
    new Navigator(results.nav).saveButton();

    return results;
}

function handleDeleteItem(prevState, action) {
    const results = { ...prevState };
    const list = results.lists.find(x => x.key === action.listId);

    if (list) {
        for (let i = 0; i < list.items.length; i++) {
            if (list.items[i].key === action.itemId) {
                list.items.splice(i, 1);
                break;
            }
        }
    }

    return results;
}

export default function shoppingListApp(state = initialState, action = {}) {
    switch(action.type) {
        case types.BACK_BUTTON:
            return handleBackButton(state, action);

        case types.SELECT_LIST:
            return handleSelectList(state, action);

        case types.TOGGLE_ITEM_COMPLETED:
            return handleToggleCompleted(state, action);

        case types.ADD_NEW_LIST:
            return handleNewList(state, action);

        case types.SAVE_NEW_LIST:
            return handleNewListSave(state, action);

        case types.DELETE_LIST:
            return handleDeleteList(state, action);

        case types.ADD_NEW_ITEM:
            return handleNewItem(state, action);

        case types.SAVE_NEW_ITEM:
            return handleNewItemSave(state, action);

        case types.DELETE_ITEM:
            return handleDeleteItem(state, action);

        default:
            return state;
    }
}