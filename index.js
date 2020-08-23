const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//IMPORT MODELS
require("./models/comments");
require("./models/statistics");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/comments").then(() => {
	console.log("Connected to Database");
}).catch((err) => {
	console.log("Not Connected to Database ERROR! ", err);
});

require("./routes/fetchVideos")(app);

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	const path = require("path");
	app.get("*", (req,res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`);
});