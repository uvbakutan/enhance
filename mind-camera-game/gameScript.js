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
circle_colors = ['#ff6666', '#66ff99', '#3399ff', '#ff9966', '#ffff66', '#6666ff', '#ff66cc', '#00cc99', '#66ccff',
                 '#ff6666', '#66ff99', '#3399ff', '#ff9966', '#ffff66', '#6666ff', '#ff66cc', '#00cc99', '#66ccff',
                 '#ff6666', '#66ff99', '#3399ff', '#ff9966', '#ffff66', '#6666ff', '#ff66cc', '#00cc99', '#66ccff'];

// Set first circle
start_game();

// Mouse event listener
canvas.addEventListener('click', function(mouse) {
  mouse_click = chek_if_mouse_click_last(mouse);
  // If clicked on last, add new circle
  if(mouse_click == circles.length - 1){
    add_circle_animation();
  }
  //If clicked on any other Game over
  else if(mouse_click != -1) {
    game_over();
  }

}, false);


function add_circle(){
  var circle = [];
  collion_with_other_c = true;
  out_of_bounds = true;

  //Use normal distribution to center the around the middle
  while(collion_with_other_c || out_of_bounds){
    circle.x = Math.floor(randn_bm()*width/6 + width/2);
    circle.y = Math.floor(randn_bm()*height/6 + height/2 );
    circle.r = min_radius + Math.floor(Math.random()*max_radius);

    out_of_bounds = check_out_of_bounds(circle);
    collion_with_other_c = check_colision(circle);
  }

  circle.color = circle_colors[Math.floor(Math.random()*circle_colors.length)];
  setTimeout(draw_circles,800);
  return circle;
}

function draw_circles() {
  context.clearRect(0,0,width,height);
  for(var i=0; i<circles.length; i++){
    context.beginPath();
    context.arc(circles[i].x, circles[i].y, circles[i].r, 0, 2 * Math.PI, true);
    context.fillStyle = circles[i].color
    context.fill();
  }
}

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

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

function chek_if_mouse_click_last(mouse){
  var collision = -1;
  offset = 10;
  for(var i = 0; i<circles.length; i++){
    diff_x = Math.abs(mouse.offsetX - circles[i].x);
    diff_y = Math.abs(mouse.offsetY - circles[i].y);
    if (diff_x < circles[i].r && diff_y < circles[i].r){
        collision = i;
        break;
    }
  }
    return collision;
}

function add_circle_animation(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("Level "+(circles.length + 1).toString(),width/2,height/2 + 15);
  circles.push(add_circle());
}

function start_game(){
  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("mind camera game ",width/2,height/2);
  context.font = "20px Arial";
  context.fillText("click anywhere to start ",width/2,height/2+70);
}

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
}
