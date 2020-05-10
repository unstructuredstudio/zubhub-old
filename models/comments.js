const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentsSchema = new Schema({
    videoId: String,
    comments: [{
        postedby: String,
        description: String,
        postedago: String
    }]
})

mongoose.model('comments', commentsSchema); 