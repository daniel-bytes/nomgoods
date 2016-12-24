export default function(mongoose) {
    const schema = mongoose.Schema({
        email: {
            type: String, 
            required: true
        }
    });

    return mongoose.model('User', schema);
}