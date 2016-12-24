
export default function(model) {
    const UserModel = model.user();
    
    return {
        fetch: function(id) {
            return UserModel.findOne({ _id: id }).lean();
        },

        create: function(data) {
            const user = new UserModel(data);

            return user.save().then(() => {
                return user.toObject();
            });
        },

        update: function(id, data) {
            return UserModel.findOneAndUpdate({ _id: id }, data).then(() => {
                return UserModel.findOne({ _id: id }).lean();
            });
        },

        remove: function(id) {
            return UserModel.findOneAndRemove({ _id: id }).lean();
        }
    }
}