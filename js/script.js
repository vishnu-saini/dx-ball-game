$(document).ready(function() {

	var tileRows = TILE_FRAME_HEIGHT / TILE_HEIGHT;
	var tileColumn = TILE_FRAME_WIDTH / TILE_WIDTH;
	var ballPosLeft = START_POS_X;
	var ballPosTop = START_POS_Y;

	z = SLIDER_START_POS;
	slider = document.getElementById("slide");
	slider.style.left = z + "px";
	$(document).keydown(function(e) {
		if (e.keyCode == 37) {
			leftMargin  = $( "#slide" ).css( "left" ) ;
			var arr=leftMargin.split("p");
			z=(parseInt(arr[0]))-SLIDER_SPEED;
			if (z >SLIDER_WIDTH + FRAME_BORDER)
				slider.style.left = z +'px';

		}
		if (e.keyCode == 39) {
			leftMargin  = $( "#slide" ).css( "left" ) ;
			var arr=leftMargin.split("p");
			z=(parseInt(arr[0]))+SLIDER_SPEED;
			if (z < FRAME_WIDTH - SLIDER_WIDTH + FRAME_BORDER)
				slider.style.left = z + "px";

		}
	});

	$("#start").click(function(event) {
		//adding mouse event handler
		setMouseEventHandler();
		//drawing tiles
		drawFrame();
		drawBall();
		drawTileFrame();
		drawTiles(tileRows, tileColumn);

		//initialize global variables
		score = 0;
		incrX = 1;
		incrY = 1;

		flag = new Array(tileRows + 1);
		for (var a = 0; a < (tileRows + 1); a++) {
			flag[a] = new Array(tileColumn);
			for (var b = 0; b < tileColumn; b++) {
				if (a == tileRows) {
					flag[a][b] = 0;
				} else {
					if (!(a % 2 == 0 && b % 2 == 0)) {
						flag[a][b] = 1;
					}
				}
			}
		}
		//function call after each 5 milisec
		var ballMoveCycle = setInterval(function() {
			win = 1;
			checkForWin(ballMoveCycle, tileRows, tileColumn);

			if (ballPosLeft > FRAME_WIDTH - BALL_WIDTH) {
				incrX = 0;
			}
			if (ballPosLeft <= 1) {
				incrX = 1;
			}
			if (ballPosTop > FRAME_HEIGHT - SLIDER_HEIGHT - BALL_HEIGHT) {
				incrY = 0;
				gameOverCheck(ballPosLeft, ballPosLeft);
			}
			if (ballPosTop <= 1) {
				incrY = 1;
			}

			if (ballPosTop <= TILE_FRAME_HEIGHT) {
				ballInsideTileFrame();
			}

			if (incrX == 1) {
				ballPosLeft++;
			}
			if (incrX == 0) {
				ballPosLeft--;
			}
			if (incrY == 1) {
				ballPosTop++;
			}
			if (incrY == 0) {
				ballPosTop--;
			}

			$("#ball").css("top", ballPosTop + "px").css("left", ballPosLeft + "px");

		}, BALL_SPEED);
	});
});

//drawing canvas
function drawFrame() {
	$("#frame").css({
		"width" : FRAME_WIDTH + 'px',
		"height" : FRAME_HEIGHT + 'px',
		"border-width" : FRAME_BORDER + 'px',
		"margin-left" : FRAME_MARGIN_LEFT + 'px'
	});

}

//draw tile frame
function drawTileFrame() {
	$("#tileFrame").css({
		"width" : TILE_FRAME_WIDTH + 'px',
		"height" : TILE_FRAME_HEIGHT + 'px'
	});

}

//draw ball
function drawBall() {
	$("#ball").css({
		"border-width" : (BALL_WIDTH / 2) + 'px',
		"border-radius" : (BALL_WIDTH / 2) + 'px'
	});

}

// function for drawing tiles
function drawTiles(tileRows, tileColumn) {

	color = new Array(7);
	for (var a = 0; a < (7); a++) {

		var r = Math.floor((Math.random() * 10) + 1);
		var g = Math.floor((Math.random() * 10) + 1);
		var b = Math.floor((Math.random() * 10) + 1);

		color[a] = "#" + r + g + b;

	}

	for ( i = 0, y = 0; i < tileRows; i++) {
		for ( j = 0, x = 0; j < tileColumn; j++) {
			if ((j < (i - 6) ) || (j >= (tileColumn - i + 6) )) {
				col = color[0];
			} else if ((j < (i - 3) ) || (j >= (tileColumn - i + 3) )) {
				col = color[1];
			} else if ((j < i ) || (j >= (tileColumn - i) )) {
				col = color[2];
			} else if ((j < (i + 3) ) || (j >= (tileColumn - i - 3))) {
				col = color[3];
			} else if ((j < (i + 6) ) || (j >= (tileColumn - i - 6) )) {
				col = color[4];
			} else if ((j < (i + 9) ) || (j >= (tileColumn - i - 9) )) {
				col = color[5];
			} else {
				col = color[6];
			}
			if (!(i % 2 == 0 && j % 2 == 0)) {
				$("<div>", {
					"class" : "tiles block" + i + "_" + j,
					"style" : "top:" + y + "px; left:" + x + "px; background-color:" + col
				}).appendTo("#tileFrame");
			}
			x = x + TILE_WIDTH;
		}
		y = y + TILE_HEIGHT;
	}

	$(".tiles").css({
		"width" : (TILE_WIDTH - 2) + 'px',
		"height" : (TILE_HEIGHT - 2) + 'px'
	});

}

// function for adding mouse event handler
function setMouseEventHandler() {
	slider = document.getElementById("slide");
	$("#frame").mousemove(function(event) {
		z = event.pageX;
		z = z - FRAME_MARGIN_LEFT;
		if (z < FRAME_WIDTH - SLIDER_WIDTH + FRAME_BORDER)
			slider.style.left = z + "px";
	});
}

//game over function
function gameOverCheck(ballPosLeft, ballPosLeft) {

	var position = $("#slide").position();
	var left = position.left;
	var right = left + 150;
	if (ballPosLeft < left - BALL_WIDTH / 2 - 5) {
		alert("Game Over \n\nyour score is : " + score);
		location.reload();
	} else if (ballPosLeft > right - BALL_WIDTH / 2 + 5) {
		alert("Game Over\n\nyour score is : " + score);
		location.reload();
	}

}

//if ball inside tile fram
function ballInsideTileFrame() {

	var position = $("#ball").position();
	var left = parseInt(position.left / TILE_WIDTH);
	var top = parseInt(position.top / TILE_HEIGHT);

	//if colision from top and bottom
	if ((position.top % TILE_HEIGHT) == 0) {
		var diffrence = position.left % TILE_WIDTH;
		//if colision from bottom
		if (incrY == 0) {
			if (top != 0) {
				if (flag[top-1][left] == 1) {
					flag[--top][left] = 0;
					raiseScoreHideBlock(top, left);
					incrY = 1;
					if ((diffrence < 5) && (flag[top][--left] == 1)) {
						flag[top][left] = 0;
						raiseScoreHideBlock(top, left);
					}
					if (diffrence > 75 && (flag[top][++left] == 0)) {
						flag[top][left] = 0;
						raiseScoreHideBlock(top, left);
					}
				}
			} else {
				incrY = 1;
			}
		}
		//if colision from top
		else if (incrY == 1) {
			if (top != (TILE_FRAME_HEIGHT / TILE_HEIGHT)) {
				if (flag[top][left] == 1) {
					flag[top][left] = 0;
					raiseScoreHideBlock(top, left);
					incrY = 0;
					if ((diffrence < 5) && (flag[top][--left] == 1)) {
						flag[top][left] = 0;
						raiseScoreHideBlock(top, left);
					}
					if (diffrence > 75 && (flag[top][++left] == 0)) {
						flag[top][left] = 0;
						raiseScoreHideBlock(top, left);
					}
				}
			}
		}

	}
	//if colision from right or left
	else if ((position.left % TILE_WIDTH) == 0) {
		// if colision from right
		if (incrX == 0) {
			if (flag[top][left - 1] == 1) {
				flag[top][--left] = 0;
				raiseScoreHideBlock(top, left);
				incrX = 1;
			}
		}
		// if colision from left
		else if (incrX == 1) {
			if (flag[top][left] == 1) {
				flag[top][left] = 0;
				raiseScoreHideBlock(top, left);
				incrX = 0;
			}
		}

	}

}

//raise score and hide tile
function raiseScoreHideBlock(top, left) {
	$("#scoreCount").text(++score);
	$(".block" + top + "_" + left).css("display", "none");
}

//check for win
function checkForWin(ballMoveCycle, tileRows, tileColumn) {
	for (var a = 0; a < (tileRows); a++) {
		for (var b = 0; b < tileColumn; b++) {
			if (flag[a][b] == 1) {
				win = 0;
			}
		}
	}
	if (win == 1) {
		clearInterval(ballMoveCycle);
		alert("Congratulations !!\nYou Win\nScore is :" + score);

	}
}
