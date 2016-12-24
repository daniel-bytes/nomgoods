export default function(mongoose) {
    const schema = mongoose.Schema({
        name: { 
            type: String, 
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true
        },
        shareIds: {
            type: [mongoose.Schema.Types.ObjectId]
        },
        items: [mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            completed: { 
                type: Boolean,
                required: true 
            }
        })]
    });

    return mongoose.model('List', schema);
}