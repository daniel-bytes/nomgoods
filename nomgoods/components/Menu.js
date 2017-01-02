import React, { Component } from 'react';
import { 
    List,
    ListItem,
    Text,
    Button,
    Icon
} from 'native-base'

export default class Menu extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <List>
                { this.renderSignInListItem() }
                { this.renderSignOutListItem() }
            </List>
        )
    }

    renderSignInListItem() {
        const user = this.props.user;
        const isNotSignedIn = user === null;
        const callback = this.props.onLoginGoogle;

        if (isNotSignedIn) {
            return (
                <ListItem>
                    <Button transparent onPress={callback}>
                         <Text>Login With Google</Text>
                         <Icon name="logo-google" />
                    </Button>
                </ListItem>
            )
        }

        return null;
    }

    renderSignOutListItem() {
        const user = this.props.user;
        const isSignedIn = user !== null;
        const callback = this.props.onLogoutGoogle;

        if (isSignedIn) {
            const icon = 'logo-' + this.props.user.tokenType.toLowerCase();

            return (
                <ListItem>
                    <Button transparent onPress={callback}>
                        <Text>{user.name} - Sign Out</Text>
                        <Icon name={icon} />
                    </Button>
                </ListItem>
            )
        }

        return null;
    }
}