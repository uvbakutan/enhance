// Global variables
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
var width = 700;
var height = 500;
canvas.width = width;
canvas.height = height;

// Number of elements to remember
var mem_num   = 6;
// Preview duration for the elements
var mem_dur = 1000;

// Rows and columns where the numbers can be located
var num_row =  4;
var num_col =  5;
// Box size for hiding the numbers
var box_size = 60;

// Create all possible locations: num_row * num_column
number_positions = [];
for(var i=0; i<num_row * num_col; i++){
  number_positions.push(i);
}

// Values for the numbers we want to memorize
var number_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Game variables
var numbers = [];
number_colors = ['#e6e6e6', '#9ba2ab' ,'#33cccc', '#ff5353', '#f47e37', '#66ccff', '#bb0058', '#9933ff', '#66ff99', '#ffff66'];

// If the last number was clicked show it and later delete it
var was_clicked = true;

// In order to prevent click actions on transition screens
// game state 0 - first level animation
//            1 - evaluate mouse clicks
//            2 - mouse clicks are not evaluated
game_state      = 0;

// Initialize the text alignment
context.textBaseline="bottom";
context.textAlign="center";

start_game();

// Mouse event listener
canvas.addEventListener('click', function(mouse) {
  // Show numer of elements to memorize and preview duration
  if(game_state == 0){
    game_state = 2;
    level_animation();
    game_state = 1;
   }
  // Evaluate mouse click if game state is 1
  else if(game_state == 1) {
    clicked_number = mouse_click_box(mouse);

    // Check wether a box was clicked at all
    if(clicked_number != -1){
      // If yes then is it the last one
      if(clicked_number == numbers[numbers.length - 1].n){
        // If it is the correct one clear it from the screen
        game_state = 2;
        was_clicked = true;
        show_clear_last();
      }
      // If the pressed box was not the last one show all the remaining numbers
      else{
        game_state = 0;
        draw_numbers_mistake();
      }
    }

  }

}, false);

// Get a new set of numbers. Shuffle all possible locatins and values and out of them choose
// the first [mem_num] where mem_num is the number of values we want to memorize
function get_new_numbers(){
   shuffle(number_values);
   shuffle(number_positions);

   numbers = [];

  for(var i=0; i<mem_num; i++){
    var number = {};
    number.n = number_values[i];
    number.pos = number_positions[i];
    number.color = number_colors[number.n];

    numbers.push(number);
  }

  // Sort numbers (lowest is last). We will use this later when we check if the last one was clicked
  numbers.sort(sort_compare);

  setTimeout(draw_numbers,1000);
}

// Draw the numbers on the canvas
function draw_numbers() {
  context.clearRect(0,0,width,height);
  context.textBaseline="top";
  context.textAlign="left";
  context.font = "60px Verdana";
  for(var i=0; i<numbers.length; i++){
    // Go through the rows and columns add draw the appropriate number
    context.fillStyle = numbers[i].color;
    context.fillText((numbers[i].n).toString(), 115 + (numbers[i].pos % (num_col))*105, 75 + Math.floor(numbers[i].pos / num_col) * 100);
  }

  context.textBaseline="bottom";
  context.textAlign="center";

  // Draw the boxes after the preview (memory duration)
  setTimeout(draw_boxes, mem_dur);
}

// Draw the remaining numbers if the player made a mistake
function draw_numbers_mistake() {
  context.clearRect(0,0,width,height);
  context.textBaseline="top";
  context.textAlign="left";
  context.font = "60px Verdana";
  for(var i=0; i<numbers.length; i++){
    context.fillStyle = numbers[i].color;
    context.fillText((numbers[i].n).toString(), 115 + (numbers[i].pos % (num_col))*105, 75 + Math.floor(numbers[i].pos / num_col) * 100);
  }

  context.textBaseline="bottom";
  context.textAlign="center";

  context.fillStyle = 'white';
  context.font = "20px Verdana";
  context.fillText("click anywhere to start ",width/2,50);
}

// Show the correct number and later delete it
function show_clear_last(){
  // Clear the box and show the number
  if(was_clicked){
    context.clearRect(115 + (numbers[numbers.length - 1].pos % (num_col))*105, 75 + Math.floor(numbers[numbers.length - 1].pos / num_col) * 100,60,60);

    context.textBaseline="top";
    context.textAlign="left";
    context.font = "60px Verdana";

    context.fillStyle = numbers[numbers.length - 1].color;
    context.fillText((numbers[numbers.length - 1].n).toString(), 115 + (numbers[numbers.length - 1].pos % (num_col))*105, 75 + Math.floor(numbers[numbers.length - 1].pos / num_col) * 100);

    context.textBaseline="bottom";
    context.textAlign="center";

    was_clicked = false;

    // Call this function again after 500ms
    setTimeout(show_clear_last, 300);
  }

  // Clear the number and check wether it was the last one
  else{
    context.clearRect(115 + (numbers[numbers.length - 1].pos % (num_col))*105, 75 + Math.floor(numbers[numbers.length - 1].pos / num_col) * 100,60,60);

    numbers.pop();
    game_state = 1;

    // If it was the last one start a new level
    if (numbers.length < 1) {
      game_state = 2;
      level_animation();
      game_state = 1;
    }
  }
}

// Draw boxes on over the numbers
function draw_boxes() {
  context.fillStyle = 'white';
  for(var i=0; i<numbers.length; i++){
    context.fillRect(115 + (numbers[i].pos % (num_col))*105, 75 + Math.floor(numbers[i].pos / num_col) * 100, box_size, box_size);
  }
}

// Get the value of the clicked number, otherwise -1
function mouse_click_box(mouse){
  var clicked_number = -1;

  for(var i = 0; i<numbers.length; i++){
    diff_x = mouse.offsetX - (115 + (numbers[i].pos % (num_col))*105);
    diff_y = mouse.offsetY - (75 + Math.floor(numbers[i].pos / num_col) * 100);

    if (diff_x > 0 && diff_x < box_size && diff_y > 0 && diff_y < box_size){
        clicked_number = numbers[i].n;
        break;
    }
  }
  return clicked_number;
}

function level_animation(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "30px Verdana";
  context.fillText("Numbers: "+(mem_num).toString(), width/2, height/2);
  context.fillText("Duration: "+(mem_dur).toString() +"ms", width/2, height/2 + 40);
  get_new_numbers();
}

function start_game(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("monkey brain ",width/2,height/2);
  context.font = "20px Arial";
  context.fillText("click anywhere to start ",width/2,height/2+70);
}

// Function that shuffles the array a using the Fisher–Yates algorithm
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

// Helper function for javascript sort
function sort_compare(a,b) {
  if (a.n < b.n)
    return 1;
  if (a.n > b.n)
    return -1;
  return 0;
}
