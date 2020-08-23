const mongoose = require("mongoose");
const {Schema} = mongoose;

const likesSchema = new Schema({
	videoId: String,
	likes: {type: Number, default: 0, min: 0}
});

mongoose.model("likes", likesSchema);