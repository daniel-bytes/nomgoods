
export default function(model) {
    const ListModel = model.list();
    
    return {
        query: function(user) {
            return ListModel.find({ ownerId: user._id }, 'name description').lean();
        },

        fetch: function(id, user) {
            return ListModel.findOne({ _id: id, ownerId: user._id }).lean();
        },

        create: function(data, user) {
            data.ownerId = user._id;

            const list = new ListModel(data);

            return list.save().then(() => {
                return list.toObject();
            });
        },

        update: function(id, data, user) {
            return ListModel.findOneAndUpdate({ _id: id, ownerId: user._id }, data).then(() => {
                return ListModel.findOne({ _id: id }).lean();
            });
        },

        remove: function(id, user) {
            return ListModel.findOneAndRemove({ _id: id, ownerId: user._id }).lean();
        }
    }
}