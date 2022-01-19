document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let ballX = canvas.width / 2;
  let ballY = canvas.height - 30;

  const paddleHeight = 10;
  const paddleWidth = 75;
  let paddleX = (canvas.width - paddleWidth) / 2;

  let rightPressed = false;
  let leftPressed = false;

  let dx = 2;
  let dy = -2;
  const ballRadius = 10;

  var score = 0;

  let brickRowCount = 3;
  let brickColumnCount = 5;
  let brickWidth = 75;
  let brickHeight = 20;
  let brickPadding = 10;
  let brickOffsetTop = 30;
  let brickOffsetLeft = 30;

  var bricks = [];

  for(let col = 0; col < brickColumnCount; col += 1) {
    bricks[col] = [];
    for(let row = 0; row < brickRowCount; row += 1) {
      bricks[col][row] = { x: 0, y: 0, isPresent: true };
    }
  }

  function drawBricks() {
    for(let col = 0; col < brickColumnCount; col += 1) {
      for(let row = 0; row < brickRowCount; row += 1) {
        let thisBrick = bricks[col][row]; 
        if(thisBrick.isPresent) {
          let brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
          let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
          thisBrick.x = brickX;
          thisBrick.y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function collisionDetection() {
    for(let col = 0; col < brickColumnCount; col += 1) {
      for(let row = 0; row < brickRowCount; row += 1) {
        let thisBrick = bricks[col][row];
        if (thisBrick.isPresent) {
          let ballLeftOfBrickSide = ballX > thisBrick.x;
          let ballRightOfBrickSide = ballX < thisBrick.x + brickWidth;
          let ballBelowBrickTop = ballY > thisBrick.y;
          let ballAboveBrickBottom = ballY < thisBrick.y + brickHeight;
          let ballInsideBrick = 
            ballLeftOfBrickSide && ballRightOfBrickSide && ballBelowBrickTop && ballAboveBrickBottom
          if ( ballInsideBrick ) {
            dy = -dy;
            thisBrick.isPresent = false;
            score += 1;
            if( score == brickRowCount * brickColumnCount ) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
              clearInterval(interval); // Needed for Chrome to end game
            }
          }
        }
      }
    }
  }


  function randomRGB() {
    return Math.random() * 255
  }

  function randomColor() {
    return `rgb(${randomRGB()}, ${randomRGB()}, ${randomRGB()})`
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    if (rightPressed) {
      paddleX += 7;
    }
    if (leftPressed) {
      paddleX -= 7;
    }
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
      dx = -dx;

      ctx.fillStyle = randomColor();
    }
    
    if (ballY + dy < ballRadius) {
      dy = -dy;
      ctx.fillStyle = randomColor();
    }

    if (ballY + dy > canvas.height - ballRadius) {
      if(ballX > paddleX && ballX < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
      }
    }

    ballX += dx;
    ballY += dy;
  };

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    }
    if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

  const interval = setInterval(draw, 10);
});

