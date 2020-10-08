//when page is fully loaded, then run init
window.addEventListener("load", init);
//sets up all click listeners
function init() {
	setUpGameClickListeners();
}

function setUpGameClickListeners() {
	setUpGameStartButtons();
	setUpRoundStartButtons();
	setUpSquareListeners();
	setUpPlayPauseButton();
	// document.querySelector('.modal-close').addEventListener('click', function() {
	// 	hidePostGameModal();
	// });
}

var startButtonClicked = false;
var roundButtonClicked = false;

var messageDisplay = document.querySelector("#message");
var gameTimeDisplay = document.querySelector("#time");
var round;
var score;
var lives;

//run when startGame button is clicked
function gameSetUp() {
	hideNonGameThings();
	messageDisplay.textContent = "";
	gameTimeDisplay.textContent = 10;
	round = 0;
	score = 0;
	lives = 5;
	preRound();
}

var playingGame = false;
var gameButtonClicked = false;

function preRound() {
	round++;
	updateScoreboard();
	clearRGB();
	hideSquares();
	hideGameButton();
	roundButtonClicked = false;
	revealPreRound();
	// when preRoundStartButton is clicked will run startRound
}

function startRound() {
	hidePreRound();
	hideRoundCountdown();
	playingGame = true;
	gameButtonClicked = false;
	revealGameButton();
	resumeGame(10);
}

function resumeGame(timeForTimer) {
	revealSquares();
	messageDisplay.textContent = "";
	gamePauseButton.textContent = "Pause";
	countdownTimer(timeForTimer, gameTimeDisplay, roundTimerRunOut);
}

function setUpGameStartButtons() {
	var startGameButtons = document.querySelectorAll(".startGameButton");
	var seconds = 3;
	for (var i = 0; i < startGameButtons.length; i++) {
		startGameButtons[i].addEventListener("click", function() {
			//only allow this button to be clicked once
			if (!startButtonClicked) gameSetUp();
			startButtonClicked = true;
		});
	}
}

function setUpRoundStartButtons() {
	var startRoundButton = document.querySelector("#startRoundButton");
	var seconds = 3;
	startRoundButton.addEventListener("click", function() {
		if (!roundButtonClicked) {
			setUpColorsAndSquaresForRound();
			revealRoundCountdown();
			countdownTimer(seconds, roundCountdownDivNumber, startRound);
		}
		roundButtonClicked = true;
	});
}
var squares = document.querySelectorAll(".square");
function setUpSquareListeners() {
	//add event listeners to squares
	for (let index = 0; index < squares.length; index++) {
		//add click listeners that check to see if the square you click is the same as the pickedColor
		squares[index].addEventListener("click", function() {
			//grab color of picked square
			var clickedBackgroundColor = this.style.backgroundColor;
			//compare color with picked Color
			if (clickedBackgroundColor === pickedColor) {
				pickedCorrectColor();
			} else {
				this.style.backgroundColor = "black";
				pickedIncorrectColor();
			}
		});
	}
}

function pickedCorrectColor() {
	messageDisplay.textContent = "Correct!";
	if (playingGame) {
		var timeLeftInRound = time;
		score += timeLeftInRound * 10;
		updateScoreboard();
		pauseGame();
		messageDisplay.textContent = "Correct!";
		// gamePauseButton.textContent = '';
		preRound();
	}
}

function pickedIncorrectColor() {
	messageDisplay.textContent = "Incorrect!";
	//only want to lose life if playing game (at the end of a round you are not playing and can still guess which ones were correct)
	if (playingGame) loseLife();
}

var gamePauseButton = document.querySelector("#gamePauseButton");
function setUpPlayPauseButton() {
	gamePauseButton.addEventListener("click", function() {
		if (gamePauseButton.textContent === "Pause") {
			console.log("pause clicked");
			pauseAndHideGame();
			return;
		} else if (gamePauseButton.textContent === "Play") {
			resumeGame(time / 10);
			return;
		} else if (gamePauseButton.textContent === "Next Round") {
			if (!gameButtonClicked) preRound();
			gameButtonClicked = true;
		} else {
		}
	});
}

function pauseAndHideGame() {
	pauseGame();
	hideSquares();
}

function pauseGame() {
	clearInterval(timer);
	messageDisplay.textContent = "Game Paused!";
	gamePauseButton.textContent = "Play";
}

function setUpColorsAndSquaresForRound() {
	//generate new colors
	var colors = generateRandomColors();
	//pick a new random color as the picked Color
	pickedColor = pickColor(colors);
	//change color display to match picked Color
	var selectedColorForRound = document.querySelector("#RGB");
	selectedColorForRound.textContent = pickedColor;
	//change colors of the squares on the page
	for (let i = 0; i < squares.length; i++) squares[i].style.backgroundColor = colors[i];
}

function clearRGB() {
	var selectedColorForRound = document.querySelector("#RGB");
	selectedColorForRound.textContent = "RGB";
}

function pickColor(colors) {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function generateRandomColors() {
	var numberOfSquares = 6;
	//make an array
	var arr = [];
	//repeat num times
	for (var i = 0; i < numberOfSquares; i++) {
		//get random color and push into arr
		arr.push(randomColor());
	}
	//return array
	return arr;
}

function randomColor() {
	//pick a red from 0-255
	var r = Math.floor(Math.random() * 256);
	//pick a green from 0-255
	var g = Math.floor(Math.random() * 256);
	//pick a blue from 0-255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + b + ", " + g + ")";
}

var gameRounds = document.querySelectorAll(".roundNum");
var gameScores = document.querySelectorAll(".scoreNum");
var gameLives = document.querySelector("#livesNum");
function updateScoreboard() {
	gameRounds.forEach(function(elem) {
		elem.textContent = round;
	});
	gameScores.forEach(function(elem) {
		elem.textContent = score;
	});
	gameLives.textContent = lives;
}

//timer runs every .1 seconds and just adjusts the htmlElem so that it displays the timer.
//  when the countdown time hits 0, the timer is done and it will stop itself
var time; //we want to globally keep track of the time of the timer
var timer; //we want to globally have access to the timer so that we can stop it when we want
// var timerRunning = false;
function countdownTimer(seconds, htmlElem, func) {
	time = seconds * 10;
	timer = setInterval(function() {
		time--;
		if (time > 0) {
			var timeString = time / 10 + "";
			if (timeString.length === 1) timeString += ".0"; //if timeString is a whole number , add a .0 - i.e 7.0 seconds
			htmlElem.textContent = timeString;
		} else {
			htmlElem.textContent = 0;
			clearInterval(timer);
			console.log("timer made it to 0");

			if (func !== undefined) {
				func();
			}
			updateScoreboard();
		}
	}, 100);
}

function loseLife() {
	messageDisplay.textContent = "Life lost!";
	lives--;
	updateScoreboard();
	if (lives === 0) gameOver();
}

function roundTimerRunOut() {
	playingGame = false;
	gamePauseButton.textContent = "Next Round";
	loseLife();
}

function gameOver() {
	playingGame = false;
	pauseGame();
	messageDisplay.textContent = "Game Over!";
	hideGameButton();
	gameOverPopUp();

	var finalScore = document.querySelector("#finalScore");
	finalScore.value = score;

	var finalRound = document.querySelector("#finalRound");
	finalRound.value = round;
}

function gameOverPopUp() {
	startButtonClicked = false;
	revealPostGameModal();
}

function revealPreRound() {
	document.querySelector("#preRound").classList.remove("invisible");
}

function hidePreRound() {
	document.querySelector("#preRound").classList.add("invisible");
}

function revealRoundCountdown() {
	document.querySelector("#roundCountdownDiv").classList.remove("invisible");
}

function hideRoundCountdown() {
	document.querySelector("#roundCountdownDiv").classList.add("invisible");
}

function hideNonGameThings() {
	document.querySelector("#preGame").classList.add("invisible");
	hidePostGameModal();
}

function hideGameButton() {
	gamePauseButton.classList.add("invisible");
}

function revealGameButton() {
	gamePauseButton.classList.remove("invisible");
}

function hideSquares() {
	document.querySelector("#gameContainer").classList.add("invisible");
}

function revealSquares() {
	document.querySelector("#gameContainer").classList.remove("invisible");
}

function revealPostGameModal() {
	document.querySelector("#postGameModal").classList.remove("invisible");
}

function hidePostGameModal() {
	document.querySelector("#postGameModal").classList.add("invisible");
}
