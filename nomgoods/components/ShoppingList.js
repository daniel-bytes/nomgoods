import React, { Component } from 'react';
import { 
    List,
    ListItem,
    Text,
    CheckBox
} from 'native-base'

export default class ShoppingList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { listId, items } = this.props;
        const callback = this.props.onToggleCompleted;

        const listItems = this.props.items.map(x => (
            <ListItem onPress={() => callback(listId, x.key)}>
                <CheckBox checked={x.completed} onPress={() => callback(listId, x.key)} />
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