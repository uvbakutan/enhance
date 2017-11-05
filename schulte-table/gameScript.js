// Global variables
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
var width = 700;
var height = 500;
canvas.width = width;
canvas.height = height;

// Number that we are looking for
var current_number   = 0;

// Rows and columns where the numbers can be located
var num_row =  6;
var num_col =  6;
// Box size for hiding the numbers
var box_size = 64;
// Offsets to draw the numbers
var draw_x_offset = 181;
var draw_y_offset = 85;

// Variable used to highlight the clicked box
var was_clicked = false;

// Create all possible locations: num_row * num_column
number_positions = [];
for(var i=0; i<num_row * num_col; i++){
  number_positions.push(i);
}

// Timer variable to measure elapsed Timer
var timer = -1;
update_time();

// Update timer each second
function update_time(){
  timer++;
  setTimeout(update_time,1000);
}


// Game variables
var numbers = [];
number_colors = ['#e6e6e6', '#9ba2ab' ,'#33cccc', '#ff5353', '#f47e37', '#66ccff', '#bb0058', '#9933ff', '#66ff99', '#ffff66', '#e6e6e6', '#9ba2ab' ,'#33cccc', '#ff5353', '#f47e37', '#66ccff', '#bb0058', '#9933ff', '#66ff99', '#ffff66', '#e6e6e6', '#9ba2ab' ,'#33cccc', '#ff5353', '#f47e37', '#66ccff', '#bb0058', '#9933ff', '#66ff99', '#ffff66','#e6e6e6', '#9ba2ab' ,'#33cccc', '#ff5353', '#f47e37', '#66ccff', '#bb0058', '#9933ff', '#66ff99', '#ffff66','#e6e6e6', '#9ba2ab' ,'#33cccc', '#ff5353', '#f47e37', '#66ccff', '#bb0058', '#9933ff', '#66ff99', '#ffff66' ];

// If the last number was clicked show it and later delete it
var was_clicked = true;

// In order to prevent click actions on transition screens
// game state 0 - first level animation
//            1 - evaluate mouse clicks
//            2 - mouse clicks are not evaluated
game_state      = 0;

// Initialize the text alignment
context.textBaseline="middle";
context.textAlign="center";

start_game();


// Mouse event listener
canvas.addEventListener('click', function(mouse) {
  // Evaluate mouse click if game state is 1
  if(game_state == 1) {
    clicked_number = mouse_click_box(mouse);

    // Check wether a box was clicked at all and highlight it
    // In the highlight function check if it was the right one
    if(clicked_number.n != -1){
      was_clicked = false;
      highlighth_clicked_box(clicked_number);
    }
  }

  // If first click get new numbers
  if(game_state == 0){
    get_new_numbers();
    game_state = 1;
  }
}, false);

// Get a new set of numbers. Shuffle all possible locatins and values and out of them choose
// the first [mem_num] where mem_num is the number of values we want to memorize
function get_new_numbers(){
   shuffle(number_positions);

   numbers = [];

  for(var i=0; i<number_positions.length; i++){
    var number = {};
    number.n = i;
    number.pos = number_positions[i];
    number.color = number_colors[number.n];

    numbers.push(number);
  }

  draw_boxes();
  draw_numbers();
  draw_current_number();
}

// Draw boxes on over the numbers
function draw_boxes() {
  // Draw the background box in white to make a border and inside lines
  context.clearRect(0,0,width,height);
  context.fillStyle = '#476685';
  var box_start_x = draw_x_offset - box_size/2 + 1;
  var box_start_y = draw_y_offset - box_size/2 + 1;
  context.fillRect(box_start_x, box_start_y,  num_col*(box_size + 1), num_row*(box_size  + 1));

  context.fillStyle = '#233241';
  for(var i=0; i<numbers.length; i++){
    context.fillRect(draw_x_offset - box_size/2 + (numbers[i].pos % (num_col))*66, draw_y_offset - box_size/2 + Math.floor(numbers[i].pos / num_col) * 66, box_size, box_size);
  }

  draw_small_circle();
}

// Draw circle in the middle
function draw_small_circle(){
  context.beginPath();
  context.arc(width/2 - 3, height/2, 5, 0, 2 * Math.PI, true);
  context.fillStyle = number_colors[3];
  context.fill();
}

function highlighth_clicked_box(clicked_number){
  if(!was_clicked){
    was_clicked = true;
    setTimeout(highlighth_clicked_box, 250, clicked_number);
    context.fillStyle = '#476685';

    context.fillRect(draw_x_offset - box_size/2 + (numbers[clicked_number.i].pos % (num_col))*66, draw_y_offset - box_size/2 + Math.floor(numbers[clicked_number.i].pos / num_col) * 66, box_size, box_size);

    draw_one_number(clicked_number.i);
    draw_small_circle();
  }
  else{
    context.fillStyle = '#233241';

    context.fillRect(draw_x_offset - box_size/2 + (numbers[clicked_number.i].pos % (num_col))*66, draw_y_offset - box_size/2 + Math.floor(numbers[clicked_number.i].pos / num_col) * 66, box_size, box_size);

    draw_one_number(clicked_number.i);
    draw_small_circle();

    // Check if it is the correct one
    if( was_clicked && clicked_number.n == current_number){
      // If correct one shuffle and draw new numbers
      current_number ++;
      // If the player reached the last number draw victory anymation
      if(current_number > number_positions.length - 1){
        current_number = 0;
        victory();
        game_state = 0;
      }
      else{
        get_new_numbers();
      }
    }
  }
}

// Draw the numbers on the canvas
function draw_numbers() {
  context.font = "40px Verdana";
  for(var i=0; i<numbers.length; i++){
    // Go through the rows and columns add draw the appropriate number
    context.fillStyle = numbers[i].color;
    context.fillText((numbers[i].n).toString(), draw_x_offset + (numbers[i].pos % (num_col))*66, draw_y_offset + Math.floor(numbers[i].pos / num_col) * 66);
  }
}

// Draw the numbers on the canvas
function draw_one_number(i) {
  context.font = "40px Verdana";
  context.fillStyle = numbers[i].color;
  context.fillText((numbers[i].n).toString(), draw_x_offset + (numbers[i].pos % (num_col))*66, draw_y_offset + Math.floor(numbers[i].pos / num_col) * 66);
}

// Get the value of the clicked number, otherwise -1
function mouse_click_box(mouse){
  var clicked_number = {};
  // Clicked number value
  clicked_number.n = -1;
  // Clicked number index
  clicked_number.i = -1

  for(var i = 0; i<numbers.length; i++){
    diff_x = mouse.offsetX - (draw_x_offset - box_size/2 + (numbers[i].pos % (num_col))*66);
    diff_y = mouse.offsetY - (draw_y_offset - box_size/2 + Math.floor(numbers[i].pos / num_col) * 66);

    if (diff_x > 0 && diff_x < box_size && diff_y > 0 && diff_y < box_size){
        clicked_number.n = numbers[i].n;
        clicked_number.i = i;
        break;
    }
  }
  return clicked_number;
}

function draw_current_number(){
  context.fillStyle = 'white';
  context.font = "20px Verdana";
  context.fillText("find: " + current_number,50,25);
}

function start_game(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("schulte table ",width/2,height/2 - 30);
  context.font = "20px Arial";
  context.fillText("click anywhere to start ",width/2,height/2 + 40);
}

function victory(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "30px Verdana";
  context.fillText("Great job! Duration: " + Math.round(timer/60) + "m, " + timer%60 + "s",width/2,height/2 - 30);
  context.font = "20px Arial";
  context.fillText("click anywhere to start ",width/2,height/2 + 40);
}

// Function that shuffles the array a using the Fisher–Yates algorithm
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}
