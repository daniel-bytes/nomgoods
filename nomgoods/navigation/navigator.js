import * as navStates from './states'

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

    allowBackButton() {
        return this._stack.length > 1;
    }

    allowAddButton() {
        switch (this.state()) {
            case navStates.VIEW_LISTS:
            case navStates.EDIT_LIST:
                return true;
            default:
                return false;
        }
    }

    allowSaveButton() {
        switch (this.state()){
            case navStates.ADD_LIST:
            case navStates.ADD_ITEM:
                return true;
            default:
                return false;
        }
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

    backButton() {
        if (!this.allowBackButton()) {
            return false;
        }

        this._stack.pop();
        return true;
    }

    addButton() {
        switch (this.state()) {
            case navStates.VIEW_LISTS:
                this._stack.push({
                    state: navStates.ADD_LIST,
                    parameters:{}
                });
                return true;

            case navStates.EDIT_LIST:
                this._stack.push({
                    state: navStates.ADD_ITEM,
                    parameters:{ listId: this.parameter("listId") }
                });
                return true;
        }

        return false;
    }

    saveButton() {
        if (!this.allowSaveButton()) {
            return false;
        }

        this._stack.pop();
        return true;
    }
}