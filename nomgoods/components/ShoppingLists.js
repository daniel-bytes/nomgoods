import React, { Component } from 'react';
import { 
    List,
    ListItem,
    Text
} from 'native-base'

export default class ShoppingList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const callback = this.props.onSelectList;

        const listItems = this.props.lists.map(x => (
            <ListItem onPress={() => callback(x.key)}>
                <Text>{x.name}</Text>
            </ListItem>
        ));

        return (
            <List>
                {listItems}
            </List>
        )
    }
}