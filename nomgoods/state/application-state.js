import shortid from 'shortid'
import Navigator from './navigator'
import { remove } from '../utils/collections'

export const ChangeTypes = {
    Set: "set",
    Remove: "remove"
}

function parseCognitoData(key, value) {
    const parts = key.split(':');

    if (parts.length >= 2) {
        if (parts[0] === 'list') {
            const results = JSON.parse(value);
            results.listId = parts[1];

            if (parts.length === 2) {
                results.type = 'list';
            }
            else if (parts.length === 4 && parts[2] === 'item') {
                results.type = 'item';
                results.itemId = parts[3];
            }

            return results;
        }
    }

    return null;
}

export default class ApplicationState {
    constructor(other) {
        if (other instanceof ApplicationState) {
            this._state = {...other._state};
        }
        else if (typeof other === 'object') {
            this._state = {...other};
        }
        else if (typeof other === 'string') {
            this._state = JSON.parse(other);
        }
        else {
            throw new Error(`Invalid state parameter type '${typeof other}'.`);
        }

        if (!this._state.data) {
            throw new Error("Missing data section.");
        }

        if (!this._state.metadata) {
            throw new Error("Missing metadata section.");
        }

        if (!this._state.metadata.nav) {
            throw new Error("Missing metadata nav section.");
        }

        this._changes = [];
    }

    state() {
        return this._state;
    }

    data() {
        return this._state.data;
    }

    setData(data) {
        this._state.data = data;
    }

    synchronizeWithCognito(cognitoData) {
        // Merge lists and items with incoming key/value pairs
        console.log('synchronizeWithCognito', cognitoData)

        const dataArr = Object.keys(cognitoData)
                                .map(x => parseCognitoData(x, cognitoData[x]))
                                .filter(x => x && x.type)
                                .sort((l,r) => l.type === 'list' ? -1 : 1)
        
        const lists = this._state.data.lists;
        console.log('state', this._state)
        for (let data of dataArr) {
            let list = lists.find(x => x.key === data.listId);

            if (data.type === 'list') {
                if (!list) {
                    list = { key: data.listId, items: [] }
                    lists.push(list);
                }

                list.name = data.name;
            }
            else if (data.type === 'item' && list) {
                let item = list.items.find(x => x.key === data.itemId);

                if (!item) {
                    item = { key: data.itemId }
                    list.items.push(item);
                }

                item.name = data.name;
                item.completed = data.completed;
            }
        }

        remove(lists, l => !dataArr.some(x => l.key === x.listId));

        for (let list of lists) {
            remove(list.items, i => !dataArr.some(x => i.key === x.itemId));
        }
    }

    addList(name) {
        const id = shortid.generate();

        this._state.data.lists.push({
            key: id,
            name: name,
            items: []
        });

        this._changes.push({
            type: ChangeTypes.Add,
            key: `list:${id}`,
            value: JSON.stringify({ name })
        });
    }

    removeList(listId) {
        const removed = remove(this._state.data.lists, x => x.key === listId);

        if (removed) {
            this._changes.push({
                type: ChangeTypes.Remove,
                key: `list:${listId}`
            });
        }
    }

    addListItem(listId, name) {
        const list = this._state.data.lists.find(x => x.key === listId);

        if (list) {
            const completed = false;
            const id = shortid.generate();
            
            list.items.push({
                key: id,
                name: name,
                completed: completed
            });

            this._changes.push({
                type: ChangeTypes.Set,
                key: `list:${listId}:item:${id}`,
                value: JSON.stringify({ name, completed })
            });
        }
    }

    toggleItemCompleted(listId, itemId) {
        const list = this._state.data.lists.find(x => x.key === listId);

        if (list) {
            const item = list.items.find(x => x.key === itemId);

            if (item) {
                const name = item.name;
                const completed = !item.completed;
                
                item.completed = completed;

                this._changes.push({
                    type: ChangeTypes.Set,
                    key: `list:${listId}:item:${itemId}`,
                    value: JSON.stringify({ name, completed })
                });
            }
        }
    }

    removeListItem(listId, itemId) {
        const list = this._state.data.lists.find(x => x.key === listId);

        if (list) {
            const removed = remove(list.items, x => x.key === itemId);

            if (removed) {
                this._changes.push({
                    type: ChangeTypes.Remove,
                    key: `list:${listId}:item:${itemId}`
                });
            }
        }
    }

    metadata() {
        return this._state.metadata;
    }

    user() {
        return this._state.metadata.user;
    }

    setUser(user) {
        this._state.metadata.user = user;
    }

    createNavigator() {
        return new Navigator(this._state.metadata.nav);
    }

    toString() {
        return this._state.toString();
    }

    changes() {
        return this._changes;
    }
}