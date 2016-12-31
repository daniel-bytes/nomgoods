import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
    Container,
    Header,
    Title,
    Content, 
    View
} from 'native-base'

import Navigator from '../state/navigator'
import * as navStates from '../state/nav-states'
import Login from './Login'

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

    componentDidMount() {
        this.props.onInitGoogle();
    }

    render() {
        const state = this.props.state.data;
        const metadata = this.props.state.metadata;
        const navigator = new Navigator(this.props.state.metadata.nav);
        const callbacks = Object.keys(this.props)
                                .filter(key => typeof this.props[key] === 'function' && key.indexOf("on") === 0)
                                .map(key => ({ key, value: this.props[key] }))
                                .reduce((prev, cur) => { prev[cur.key] = cur.value; return prev; }, {});

        if (navigator.state() === navStates.NOT_AUTHENTICATED) {
            return (
                <Container theme={theme} style={{ backgroundColor: theme.defaultBackgroundColor }}>
                <Header>
                    <Title>Nom Goods - Login</Title>
                </Header>
                <Content style={styles.container}>
                    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20 }}>
                        <Login onLoginGoogle={callbacks.onLoginGoogle} />
                    </View>
                </Content>
            </Container>
            )
        }

        return (
            <Container theme={theme} style={{ backgroundColor: theme.defaultBackgroundColor }}>
                <Header>
                    { renderBackButton(navigator, state, metadata, callbacks) }

                    { renderMenuButton(navigator, state, metadata, callbacks) }

                    { renderTitle(navigator, state, metadata, callbacks) }

                    { renderAddButton(navigator, state, metadata, metadata, callbacks) }
                </Header>
                <Content style={styles.container}>
                    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20 }}>
                        { renderView(navigator, state, metadata, callbacks) }
                    </View>
                </Content>
            </Container>
        )
    }
}
