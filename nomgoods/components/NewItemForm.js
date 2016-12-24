import React, { Component } from 'react';
import { Alert } from 'react-native'
import {
    View,
    List,
    ListItem,
    Input,
    InputGroup,
    Button
} from 'native-base'

export default class NewItemForm extends Component {
    constructor(props) {
        super(props)
        this.state = { name: '' }
    }

    addItem() {
        const others = this.props.items;
        const listId = this.props.listId;
        const callback = this.props.onNewItemSave;
        const value = this.state.name.trim();

        if (!value) {
            Alert.alert("Missing name");
            return;
        }

        if (others.some(x => x.name.trim().toLowerCase() === value.toLowerCase())) {
            Alert.alert(`Already have ${value}`);
            return;
        }

        callback(listId, value)
    }

    render() {
        const listId = this.props.listId;

        return (
            <View>
                <InputGroup borderType="underline">
                    <Input onChangeText={(text) => this.setState({ name: text})} />
                </InputGroup>
                
                <Button style={{ alignSelf: "center", marginTop: 20, marginBottom: 20 }}
                        onPress={() => this.addItem()}>
                    Save
                </Button>
            </View>
        )
    }
}