import listModel from './list'
import userModel from './user'

export default function(mongoose) {
    const ListModel = listModel(mongoose);
    const UserModel = userModel(mongoose);

    return {
        list: () => ListModel,
        user: () => UserModel
    }
}