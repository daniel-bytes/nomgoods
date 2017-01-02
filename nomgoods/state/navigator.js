import * as navStates from './nav-states'

/// Wrapper class around a navigation array stack.
/// All operations are performed on the underlying array (no copies performed).
export default class Navigator {
    constructor(data) {
        if (!Array.isArray(data)) {
            throw new Error("Argument error: NavData ctor parameter 'data' must be an array.");
        }
        else if (!data.length) {
            throw new Error("Argument error: NavData ctor parameter 'data' must not be empty.");
        }

        this._stack = data;
    }

    state() {
        return this.current().state;
    }

    parameter(name) {
        return this.current().parameters[name];
    }

    current() {
        return this._stack[this._stack.length - 1];
    }

    allowMenuButton() {
        return this._stack.length < 2 || this.state() === navStates.MENU;
    }

    allowBackButton() {
        return this._stack.length > 1 && this.state() !== navStates.MENU;
    }

    allowAddList() {
        return this.state() === navStates.VIEW_LISTS;
    }

    allowSaveList() {
        return this.state() === navStates.ADD_LIST;
    }

    allowAddItem() {
        return this.state() === navStates.EDIT_LIST;
    }

    allowSaveItem() {
        return this.state() === navStates.ADD_ITEM;
    }

    allowAddButton() {
        return this.allowAddList() || this.allowAddItem();
    }

    allowSaveButton() {
        return this.allowSaveList() || this.allowSaveItem();
    }

    selectList(listId) {
        if (this.state() === navStates.VIEW_LISTS) {
            this._stack.push({
                state: navStates.EDIT_LIST,
                parameters: { listId }
            })

            return true;
        }

        return false;
    }

    login() {
        this._stack.push({
            state: navStates.NOT_AUTHENTICATED,
            parameters: {}
        })
    }

    home() {
        this._stack.pop();

        if (this._stack.length === 0) {
            this._stack.push({
                state: navStates.VIEW_LISTS,
                parameters: {}
            })
        }
    }

    back() {
        if (!this.allowBackButton()) {
            return false;
        }

        this._stack.pop();
        return true;
    }

    save() {
        if (!this.allowSaveButton()) {
            return false;
        }

        this._stack.pop();
        return true;
    }

    addList() {
        if (this.state() === navStates.VIEW_LISTS) {
            
            this._stack.push({
                state: navStates.ADD_LIST,
                parameters:{}
            });
            return true;
        }

        return false;
    }

    addItem() {
        if (this.state() === navStates.EDIT_LIST) {
            this._stack.push({
                state: navStates.ADD_ITEM,
                parameters:{ listId: this.parameter("listId") }
            });
            return true;
        }

        return false;
    }

    menuButton() {
        if (!this.allowMenuButton()) {
            return false;
        }

        if (this.state() === navStates.MENU) {
            this._stack.pop();
        }
        else {
            this._stack.push({
                state: navStates.MENU,
                parameters: {}
            });
        }

        return true;
    }
}