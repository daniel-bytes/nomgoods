import React, { Component } from 'react'
import { bindingActionCreators } from 'redux'
import { connect } from 'react-redux'
import ShoppingListApp from '../components/ShoppingListApp'
import {
    backButton,
    selectList,
    toggleCompleted, 
    newList,
    newListSave,
    newItem,
    newItemSave
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

        onToggleCompleted: (listId, itemId) => {
            dispatch(toggleCompleted(listId, itemId))
        },

        onNewList: () => {
            dispatch(newList())
        },

        onNewListSave: (name) => {
            dispatch(newListSave(name))
        },

        onNewItem: (listId) => {
            dispatch(newItem(listId))
        },

        onNewItemSave: (listId, name) => {
            dispatch(newItemSave(listId, name))
        }
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ShoppingListApp);

export default App