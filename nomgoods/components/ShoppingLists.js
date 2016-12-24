import React, { Component } from 'react'
import Swipeout from 'react-native-swipeout'
import { 
    List,
    ListItem,
    Text,
    View
} from 'native-base'

export default class ShoppingLists extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const callback = this.props.onSelectList;
        const deleteCallback = this.props.onDeleteList;

        return (
            <List dataArray={this.props.lists}
                  renderRow={(x) =>
                    <Swipeout backgroundColor="white" right={[{
                        text: 'Delete',
                        backgroundColor: 'red',
                        onPress: () => deleteCallback(x.key)
                    }]}>
                        <ListItem onPress={() => callback(x.key)}>
                            <Text>{x.name}</Text>
                        </ListItem>
                    </Swipeout>} >
            </List>
        )
    }
}