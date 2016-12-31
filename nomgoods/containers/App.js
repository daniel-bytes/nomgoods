import React, { Component } from 'react'
import { bindingActionCreators } from 'redux'
import { connect } from 'react-redux'
import ShoppingListApp from '../components/ShoppingListApp'
import actions from '../actions/shoppingListActions'

const mapStateToProps = (state) => {
    return {
        state: state.app
    }
}

const mapDispatchToProps = (dispatch) => {
    // Create an object that dispatches actions
    // Given { 
    //      ToggleFoo: () => { ... }, 
    //      SaveBar: (param1, param2) => { ... } 
    //  }
    // Returns {
    //      onToggleFoo: () => dispatch(actions.ToggleFoo()),
    //      onSaveBar: (param1, param2) => dispatch(actions.SaveBar(param1, param2))
    // }
    const result = Object.keys(actions).map(key => {
        return {
            name: 'on' + key,
            func: function() {
                dispatch(
                    actions[key].apply(result, [...arguments])
                )
            }
        }
    })
    .reduce((prev, cur) => {
        prev[cur.name] = cur.func
        return prev
    }, {});

    return result;
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ShoppingListApp);

export default App