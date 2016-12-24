import React, { Component } from 'react'
import { bindingActionCreators } from 'redux'
import { connect } from 'react-redux'
import ShoppingListApp from '../components/ShoppingListApp'
import {
    backButton,
    selectList,
    toggleItemCompleted, 
    addNewList,
    saveNewList,
    deleteList,
    addNewItem,
    saveNewItem,
    deleteItem
} from '../actions/shoppingListActions'

const mapStateToProps = (state) => {
    return {
        state: state.app
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onBackButton: () => {
            dispatch(backButton())
        },

        onSelectList: (listId) => {
            dispatch(selectList(listId))
        },

        onToggleItemCompleted: (listId, itemId) => {
            dispatch(toggleItemCompleted(listId, itemId))
        },

        onAddNewList: () => {
            dispatch(addNewList())
        },

        onSaveNewList: (name) => {
            dispatch(saveNewList(name))
        },

        onDeleteList: (listId) => {
            dispatch(deleteList(listId))
        },

        onAddNewItem: (listId) => {
            dispatch(addNewItem(listId))
        },

        onSaveNewItem: (listId, name) => {
            dispatch(saveNewItem(listId, name))
        },

        onDeleteItem: (listId, itemId) => {
            dispatch(deleteItem(listId, itemId))
        }
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ShoppingListApp);

export default App