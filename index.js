const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

//IMPORT MODELS
require("./models/comments");
require("./models/statistics");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: process.env.ZUBHUB_SESSION_SECRET}));

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

	const engines = require("consolidate");
	app.set("views", __dirname + "/client/build");
	app.engine("html", engines.swig);
	app.set("view engine", "html");

	app.get("/", (req, res) => {
			res.render("index.html");
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`);
});