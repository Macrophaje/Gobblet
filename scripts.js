function initializeClickHandlers(){
	for (var player = 0; player < 2; player++) {
		for (var stack = 0; stack < 3; stack++) {
			$(`#player-${player}-stack-${stack}`).on('click', (function(selectedPlayer, stackNumber) {
				return function() {
					selectUnplayedPiece(selectedPlayer, stackNumber);
				};
			})(player, stack));
		}
	}

	for (var square = 0; square < 16; square++) {
		$(`#square-${square}`).on('click', (function(selectedSquare) {
			return function() {
				selectSquare(selectedSquare);
			};
		})(square));
	}
}

var boardState = [];

function initializeBoardState() {
	for (var i=0; i<16; i++) {
		boardState.push({
			squareStack : []
		});
	}
}

var isPieceSelected = false;
var selectedPiece;
var currentPlayer = 0;

var playerState = {
	0 : {
		stacks : [4, 4, 4],
	},

	1 : {
		stacks : [4, 4, 4],
	},
};

function selectUnplayedPiece(player, stackNumber){
	//user selected a piece off the board
	if (player !== currentPlayer) {
		console.log("Wrong player");
		return;
	}
	if (playerState[player].stacks[stackNumber] <= 0) {
		console.log("No pieces remain");
		return;
	}	
	selectedPiece = {
		player : player,
		stackNumber: stackNumber,
		pieceSize : playerState[player].stacks[stackNumber],
		unplayed : true, 
	};
	isPieceSelected = true;
}

function selectPlayedPiece (player, square) {
	//User clicked a piece on the board
	if (player !== boardState[square].squareStack[boardState[square].squareStack.length-1].player) {
		console.log("Wrong player");
		return;
	}
	selectedPiece = {
		player : boardState[square].squareStack[boardState[square].squareStack.length-1].player,
		pieceSize: boardState[square].squareStack[boardState[square].squareStack.length-1].pieceSize,
		unplayed : false,
		startingSquare: square, 
	};
	isPieceSelected = true;
}

function selectSquare(square) {
	if (!isPieceSelected && boardState[square].squareStack[0]) {
		selectPlayedPiece(currentPlayer, square);
	} else if ((!boardState[square].squareStack[0] && isPieceSelected) || 
				(boardState[square].squareStack[0] && boardState[square].squareStack[boardState[square].squareStack.length-1].pieceSize < selectedPiece.pieceSize)){
		placePiece(square);
	} else if (boardState[square].squareStack[0] && boardState[square].squareStack[boardState[square].squareStack.length-1].pieceSize >= selectedPiece.pieceSize){
		console.log("You can onyl Gobble smaller pieces!")
	} else {
		console.log("Select a piece to move!")
	}
}

function placePiece(square) {
	boardState[square].squareStack.push({
		player : selectedPiece.player,
		pieceSize: selectedPiece.pieceSize,
	});
	var oldSquare = selectedPiece.startingSquare

	//Replace square with selected piece
	$(`#square-${square}`).removeClass(function (int, className) {
		var initialClasses = className.split(" ");
		var finalClasses = [];
		for (var i=0; i < initialClasses.length; i++) {
			if (initialClasses[i].indexOf("player") === 0 || initialClasses[i].indexOf("size") === 0) {
				finalClasses.push(initialClasses[i]);
			} 
		}
		return finalClasses.join(' ');
	}).addClass(`player-${currentPlayer} size-${selectedPiece.pieceSize}`);

	if (selectedPiece.unplayed){
		//Remove piece from unplayed stack
		playerState[currentPlayer].stacks[selectedPiece.stackNumber]--;

		$(`#player-${currentPlayer}-stack-${selectedPiece.stackNumber} img`).attr(
			"src", `img/player-${currentPlayer}-clear-${playerState[currentPlayer].stacks[selectedPiece.stackNumber]}.svg`);
	} else {
		//Remove piece from old board square
		$(`#square-${oldSquare}`).removeClass(function (int, className) {
			var initialClasses = className.split(" ");
			var finalClasses = [];
			for (var i=0; i < initialClasses.length; i++) {
				if (initialClasses[i].indexOf("player") === 0 || initialClasses[i].indexOf("size") === 0) {
					finalClasses.push(initialClasses[i]);
				} 
			}
			return finalClasses.join(' ');
		});
		boardState[oldSquare].squareStack.pop();
		if (boardState[oldSquare].squareStack[boardState[oldSquare].squareStack.length-1] !== undefined){
			$(`#square-${oldSquare}`).addClass(`player-${boardState[oldSquare].squareStack[boardState[oldSquare].squareStack.length-1].player} 
				size-${boardState[oldSquare].squareStack[boardState[oldSquare].squareStack.length-1].pieceSize}`);
		}
	}

	isPieceSelected = false;
	selectedPiece = null;
	checkWinner(oldSquare, square);
	changeCurrentPlayer();
}

function checkWinner(oldSquare, square){
		
}

function changeCurrentPlayer(){
	if (currentPlayer === 0) {
		currentPlayer = 1;
	} else {
		currentPlayer = 0;
	}
}

$.when($.ready).then(function() {
	initializeClickHandlers();
	initializeBoardState();
});
