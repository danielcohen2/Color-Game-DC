var express = require("express"),
	app = express();
var bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const moment = require("moment"); // require

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const mongoose = require("mongoose");
mongoose
	.connect(
		"mongodb+srv://danielcohen:aYsKMNA9QAMkmxn@cluster0.whaez.mongodb.net/colorGameHighScores?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => console.log("Connected to DB!"))
	.catch((error) => console.log(error.message));

var userScoreSchema = new mongoose.Schema({
	name: String,
	score: Number,
	round: Number,
	date: String
});

var UserScore = mongoose.model("UserScore", userScoreSchema);

app.get("/", function(req, res) {
	UserScore.find({}, function(err, allScores) {
		if (err) console.log(err);
		else {
			var orderedScores = allScores.sort(compareScores).reverse();
			let tenthHighScore;
			if (orderedScores.length < 10) {
				tenthHighScore = 0;
			} else {
				tenthHighScore = orderedScores[9];
			}
			res.render("colorGame", { finalScore: 0, min_highscore: tenthHighScore });
		}
	});
});

app.get("/highscores", function(req, res) {
	UserScore.find({}, function(err, allScores) {
		if (err) console.log(err);
		else {
			var orderedScores = allScores.sort(compareScores).reverse();
			var topTen = [];
			var loopLength = orderedScores.length > 10 ? 10 : orderedScores.length;
			for (let i = 0; i < loopLength; i++) {
				topTen.push(orderedScores[i]);
			}
			res.render("highscores", { game_highscores: topTen });
		}
	});
});

//smallest to largest
function compareScores(a, b) {
	if (a.score > b.score) return 1;
	if (b.score > a.score) return -1;
	return 0;
}

app.post("/highscores", function(req, res) {
	var highscore = req.body.highscore;
	console.log(highscore);
	var today = moment().format("M/D/YY");
	highscore.date = today;
	UserScore.create(highscore, function(err, newHighscore) {
		if (err) {
			console.log("something went wrong");
		} else {
			console.log("new user saved to db");
			console.log(newHighscore);
			res.redirect("/highscores");
		}
	});
});

//add the router
app.use("/", router);
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
	console.log("server started");
});
