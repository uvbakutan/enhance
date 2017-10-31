// Global variables
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
var width = 700;
var height = 500;
canvas.width = width;
canvas.height = height;
var max_radius = 30;
var min_radius = 10;
context.textAlign="center";

// Game variables
var circles = [];
var circle_colors = ['#ff6666', '#66ff99', '#3399ff', '#ff9966', '#ffff66', '#6666ff', '#ff66cc', '#00cc99', '#66ccff',
                 '#ff6666', '#66ff99', '#3399ff', '#ff9966', '#ffff66', '#6666ff', '#ff66cc', '#00cc99', '#66ccff',
                 '#ff6666', '#66ff99', '#3399ff', '#ff9966', '#ffff66', '#6666ff', '#ff66cc', '#00cc99', '#66ccff'];


// In order to prevent click actions on transition screens
// game state 0 - mouse clicks are not evaluated
//            1 - evaluate mouse clicks
var game_state = 0;

// Variable to count the number of flashes if a mistake was made
var flash_counter = 0;

// Set first circle
start_game();

// Mouse event listener
canvas.addEventListener('click', function(mouse) {
  // Evaluate mouse click if game state is 1
  if(game_state == 1){
    clicked_circle = get_clicked_circle(mouse);
    // If clicked on last, add new circle
    if(clicked_circle == circles.length - 1){
      add_circle_animation();
    }
    //If clicked on any other Game over
    else if(clicked_circle != -1) {
      game_state = 0;
      flash_last_circle();
    }
  }

}, false);

// Add new circle: assign x,y based on a normal distribution, r from an uniform distribution
// and color from a predefined list.
// Check collision with other circles and wether the new circle is out of bounds
function add_circle(){
  var circle = {};
  collion_with_other_c = true;
  out_of_bounds = true;

  //Use a normal distribution to center the circles around the middle of the canvas
  while(collion_with_other_c || out_of_bounds){
    circle.x = Math.floor(randn_bm()*width/6 + width/2);
    circle.y = Math.floor(randn_bm()*height/6 + height/2 );
    circle.r = min_radius + Math.floor(Math.random()*max_radius);

    out_of_bounds = check_out_of_bounds(circle);
    collion_with_other_c = check_colision(circle);
  }

  circle.color = circle_colors[Math.floor(Math.random()*circle_colors.length)];

  circles.push(circle);
  setTimeout(draw_circles,800);
}

// Draw all circles
function draw_circles() {
  context.clearRect(0,0,width,height);
  for(var i=0; i<circles.length; i++){
    context.beginPath();
    context.arc(circles[i].x, circles[i].y, circles[i].r, 0, 2 * Math.PI, true);
    context.fillStyle = circles[i].color
    context.fill();
  }
  game_state = 1;
}

// Function to create a normal distribution
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// Check wether the new circle collides with other circles from the list
function check_colision(circle) {
  var collision = false;
  offset = 10;
  for(var i = 0; i<circles.length; i++){
    diff_x = Math.abs(circle.x - circles[i].x);
    diff_y = Math.abs(circle.y - circles[i].y);
      if (diff_x - circle.r < circles[i].r && diff_y - circle.r < circles[i].r){
            collision = true;
            break;
          }
  }
    return collision;
}

// Check wether the new circle collides is out of bounds
function check_out_of_bounds(circle) {
  var out = false;
  if (circle.x + circle.r > width ||
      circle.x - circle.r < 0 ||
      circle.y + circle.r > height ||
      circle.y - circle.r < 0){
            out = true;
    }
  return out;
}

// Return the index of the clicked circle, otherwise -1
function get_clicked_circle(mouse){
  var clicked_circle = -1;
  offset = 10;
  for(var i = 0; i<circles.length; i++){
    diff_x = Math.abs(mouse.offsetX - circles[i].x);
    diff_y = Math.abs(mouse.offsetY - circles[i].y);
    if (diff_x < circles[i].r && diff_y < circles[i].r){
        clicked_circle = i;
        break;
    }
  }
    return clicked_circle;
}

// If player mada a mistake flash the last added circle
function flash_last_circle(){
  if(flash_counter < 6){
    var i = circles.length-1;
    context.beginPath();
    if(flash_counter % 2 ==0){
    // Draw over circle with canvas background color
      context.fillStyle = '#233241';
      context.arc(circles[i].x, circles[i].y, circles[i].r+1, 0, 2 * Math.PI, true);
    }
    else{
    // Draw the circle with original color
      context.fillStyle = circles[i].color;
      context.arc(circles[i].x, circles[i].y, circles[i].r, 0, 2 * Math.PI, true);
    }

    context.fill();
    flash_counter ++;
    // Call self after 500ms
    setTimeout(flash_last_circle,500);
  }
  else{
    flash_counter = 0;
    game_over();
  }
}

// Start the animation for the new circle
function add_circle_animation(){
  game_state = 0;
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("Level "+(circles.length + 1).toString(),width/2,height/2 + 15);
  add_circle();
}

// Game start animation
function start_game(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("mind camera game ",width/2,height/2);
  context.font = "20px Arial";
  context.fillText("click anywhere to start ",width/2,height/2+70);
  game_state = 1;
}

// Game over animation, reset the list of circles
function game_over(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("game over",width/2,height/2);
  context.font = "20px Verdana";
  context.fillText("level "+(circles.length).toString(),width/2,height/2+50);
  context.font = "20px Verdana";
  context.fillText("click anywhere to start ",width/2,height/2+100);
  circles = [];
  game_state = 1;
}
