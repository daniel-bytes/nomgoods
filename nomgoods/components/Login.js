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
        const callback = this.props.onLoginGoogle;
        
        return (
            <List>
                <ListItem>
                    <Button transparent onPress={callback}>
                         <Text>Login With Google</Text>
                         <Icon name="logo-google" />
                    </Button>
                </ListItem>
            </List>
        )
    }
}