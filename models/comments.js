const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentsSchema = new Schema({
    postedby: String,
    description: String,
    postedago: String
})

mongoose.model('comments', commentsSchema);