// Set up the game canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get the restart button element
const restartButton = document.getElementById("restartButton");

// Set canvas size to full window
canvas.width = 600;
canvas.height = 800;

// Game variables
let carWidth = 50;
let carHeight = 100;
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 20;
let carSpeed = 7;
let leftKey = false;
let rightKey = false;
let score = 0;
let obstacles = [];
let gameOverFlag = false;

// Road line variables
let roadLines = [];

// Car object
let car = {
    x: carX,
    y: carY,
    width: carWidth,
    height: carHeight,
    color: "blue"
};

// Event listeners for controlling the car
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") leftKey = true;
    if (e.key === "ArrowRight") rightKey = true;
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft") leftKey = false;
    if (e.key === "ArrowRight") rightKey = false;
});

// Function to draw the car
function drawCar() {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Function to create obstacles (cars)
function createObstacle() {
    let width = carWidth;  // Set the obstacle width to the player's car width
    let height = carHeight;  // Set the obstacle height to the player's car height
    let xPos = Math.random() * (canvas.width - width);
    let speed = Math.random() * 3 + 2; // Speed range from 2 to 5
    obstacles.push({ x: xPos, y: -100, width: width, height: height, speed: speed });
}

// Function to draw obstacles (cars) with headlights
function drawObstacles() {
    ctx.fillStyle = "red"; // Set color for obstacles (cars) to blue
    for (let i = 0; i < obstacles.length; i++) {
        // Draw the body of the obstacle (car)
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

    

        obstacles[i].y += obstacles[i].speed; // Move the car downwards

        // Check for collision with the player's car
        if (
            car.x < obstacles[i].x + obstacles[i].width &&
            car.x + car.width > obstacles[i].x &&
            car.y < obstacles[i].y + obstacles[i].height &&
            car.y + car.height > obstacles[i].y
        ) {
            gameOver(); // End the game if collision occurs
        }

        // Remove obstacles that have moved off-screen
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1); // Remove obstacle
            score++; // Increment score
        }
    }
}

// Function to draw headlights on the obstacles (cars)
function drawHeadlights(x, y, width, height) {
    ctx.fillStyle = "lightblue"; // Set color for headlights to light blue

    // Draw two small rectangles (headlights) at the front of the car
    ctx.fillRect(x + width * 0.2, y + height * 0.2, 10, 10); // Left headlight
    ctx.fillRect(x + width * 0.7, y + height * 0.2, 10, 10); // Right headlight
}

// Function to draw the road lines
function drawRoadLines() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    // Add road lines
    for (let i = 0; i < roadLines.length; i++) {
        ctx.setLineDash([20, 20]); // Dashed line pattern
        ctx.beginPath();
        ctx.moveTo(roadLines[i].x, roadLines[i].y);
        ctx.lineTo(roadLines[i].x, roadLines[i].y + 30);
        ctx.stroke();

        // Move the road lines down
        roadLines[i].y += 5;
        if (roadLines[i].y > canvas.height) {
            roadLines[i].y = -30; // Reset to the top of the screen
        }
    }
}

// Function to update the game state
function updateGame() {
    if (gameOverFlag) return; // Stop the game if it's over

    if (leftKey && car.x > 0) {
        car.x -= carSpeed;
    }
    if (rightKey && car.x < canvas.width - car.width) {
        car.x += carSpeed;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawRoadLines(); // Draw road lines
    drawCar();
    drawObstacles();

    // Create new obstacles
    if (Math.random() < 0.03) {
        createObstacle();
    }

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Loop the game
    requestAnimationFrame(updateGame);
}

// Game over function
function gameOver() {
    gameOverFlag = true; // Set gameOverFlag to true

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2 - 60, canvas.height / 2 + 50);

    // Show the restart button
    restartButton.style.display = "block";
}

// Function to restart the game
function restartGame() {
    // Reset game variables
    car.x = canvas.width / 2 - carWidth / 2;
    car.y = canvas.height - carHeight - 20;
    score = 0;
    obstacles = [];
    gameOverFlag = false;
    roadLines = []; // Reset road lines

    // Create new road lines at the start of the game
    for (let i = 0; i < 5; i++) {
        roadLines.push({ x: canvas.width / 2 - 5, y: i * 150 });
    }

    // Hide the restart button
    restartButton.style.display = "none";

    // Start the game loop again
    updateGame();
}

// Event listener for the restart button
restartButton.addEventListener("click", restartGame);

// Initialize the road lines for the game
for (let i = 0; i < 5; i++) {
    roadLines.push({ x: canvas.width / 2 - 5, y: i * 150 });
}

// Start the game
updateGame();
