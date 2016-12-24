import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
    Container,
    Header,
    Title,
    Content, 
    View
} from 'native-base'

import Navigator from '../navigation/navigator'
import * as navStates from '../navigation/states'

import icon from './icon'
import theme from '../themes'
import { renderView } from './views'
import { 
    renderBackButton, 
    renderMenuButton,
    renderAddButton, 
    renderTitle 
} from './header-nav'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
    }
});

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const lists = this.props.state.lists;
        const navigator = new Navigator(this.props.state.nav);
        const callbacks = {
            onBackButton: this.props.onBackButton,
            onToggleItemCompleted: this.props.onToggleItemCompleted,
            onSelectList: this.props.onSelectList,
            onAddNewList: this.props.onAddNewList,
            onSaveNewList: this.props.onSaveNewList,
            onDeleteList: this.props.onDeleteList,            
            onAddNewItem: this.props.onAddNewItem,
            onSaveNewItem: this.props.onSaveNewItem,
            onDeleteItem: this.props.onDeleteItem
        }

        return (
            <Container theme={theme} style={{ backgroundColor: theme.defaultBackgroundColor }}>
                <Header>
                    { renderBackButton(navigator, lists, callbacks) }

                    { renderMenuButton(navigator, lists, callbacks) }

                    { renderTitle(navigator, lists, callbacks) }

                    { renderAddButton(navigator, lists, callbacks) }
                </Header>
                <Content style={styles.container}>
                    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20 }}>
                        { renderView(navigator, lists, callbacks) }
                    </View>
                </Content>
            </Container>
        )
    }
}
