import React, { Component } from 'react';
import Swipeout from 'react-native-swipeout';
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
        const callback = this.props.onToggleItemCompleted;
        const deleteCallback = this.props.onDeleteItem;

        return (
            <List dataArray={this.props.items}
                  renderRow={(x) =>
                    <Swipeout backgroundColor="white" right={[{
                        text: 'Delete',
                        backgroundColor: 'red',
                        onPress: () => deleteCallback(listId, x.key)
                    }]}>
                        <ListItem onPress={() => callback(listId, x.key)}>
                            <CheckBox checked={x.completed} onPress={() => callback(listId, x.key)} />
                            <Text>{x.name}</Text>
                        </ListItem>
                    </Swipeout>} >
            </List>
        )
    }
}