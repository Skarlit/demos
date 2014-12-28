(function(root){

  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  var Snake = root.Snake = function(canvas, height, width){
    this.canvas = canvas;
    this.height = height;
    this.width = width;
    this.ctx = this.canvas.getContext('2d');
    this.body = [];
    this.head = 0;
    this.screenMap = new THREE.Matrix3(
    1, 0, this.width/2,
    0,-1, this.height/2,
    0, 0, 1
    );
    this.bait = undefined;
  }

  root.Snake.ccwTurn = new THREE.Matrix3(
    0,-1, 0, 
    1, 0, 0, 
    0, 0, 1);
  root.Snake.cwTurn = new THREE.Matrix3(
    0, 1, 0, 
   -1, 0, 0,
    0, 0, 1);

  root.Snake.matrixProduct = function (mat1, mat2){
    var a= mat1.elements;
    var b= mat2.elements;
    return new THREE.Matrix3(
      a[0]*b[0] + a[3]*b[1], a[0]*b[3]+a[3]*b[4], a[0]*b[6]+a[3]*b[7]+a[6],
      a[1]*b[0] + a[4]*b[1], a[1]*b[3]+a[4]*b[4], a[1]*b[6]+a[4]*b[7]+a[7],
      0, 0, 1
    )
  }

  Snake.prototype.init = function() {
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.body.push(new SnakePiece(null, 
      new THREE.Matrix3(
        1,0,0,
        0,1,0,
        0,0,1
    )));
    this._initKeyHandler();
  };


  Snake.prototype._initKeyHandler = function() {
    var snake = this;

    $(window).on("keyup", function(event){

      var direction = new THREE.Vector3(1,0,0).applyMatrix3(snake.body[snake.head].modelView);
      switch(event.keyCode){
        case 38: //Up
          if(direction.x > 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.ccwTurn);
          }else if (direction.x < 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.cwTurn)
          }
        break;

        case 40: //Down
          if(direction.x > 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.cwTurn)
          }else if (direction.x < 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.ccwTurn);
          }
        break;

        case 39:  //Right
        event.preventDefault();
          if(direction.y > 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.cwTurn)
          }else if (direction.y < 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.ccwTurn);
          }
        break;

        case 37:  //Left
        event.preventDefault();
          if(direction.y > 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.ccwTurn);
          }else if (direction.y < 0){
            snake.body[snake.head].modelView = Snake.matrixProduct(snake.body[snake.head].modelView, Snake.cwTurn)
          }
        break;
      }
    });
  };

  Snake.prototype.attach = function(){

    var newModelView = Snake.matrixProduct(
      this.body[this.body.length - 1].modelView, 
      new THREE.Matrix3(
        1, 0, -2,
        0, 1, 0,
        0, 0, 1
    ));

    var new_piece = new SnakePiece(
      this.body[this.body.length - 1],  //nextPiece
      newModelView
    );

    this.body.push(new_piece);
  };

  Snake.prototype.draw = function() {
    for(var i = this.body.length - 1; i >= 0; i--){
      this.body[i].draw(this.ctx, this.screenMap);
    }

    if(this.bait){
      var screenCoord = this.bait.clone().applyMatrix3(this.screenMap);
      this.ctx.beginPath();
      this.ctx.arc(screenCoord.x, screenCoord.y, 5, 0, 2*Math.PI, false);
      this.ctx.fillStyle="white";
      this.ctx.fill();
    }
  };


  Snake.prototype.update = function() {
    for(var i = this.body.length - 1; i >= 0; i--){
      this.body[i].update(this.canvas);
    }
  };

  Snake.prototype.start = function(){
    this.render();
  }

  Snake.prototype.placeBait = function() {
    if(!this.bait){
      this.bait = new THREE.Vector3(
        Math.floor((Math.random() - 0.5)*this.width), 
        Math.floor((Math.random() - 0.5)*this.height),
        1
      );
    }
  };

  Snake.prototype.checkEaten = function() {
    var snakeHead = (new THREE.Vector3(0,0,1)).applyMatrix3(this.body[this.head].modelView);
    if(snakeHead.distanceTo(this.bait)< 15){
      this.bait = undefined;
      this.attach();
    }
  };


  Snake.prototype.collision = function() {
    //Too lazy to implement LU factorization to compute the inverse of model matrix
    //just have them transformed to world frame instead
    //Bounding box doesn't seem to work O_O
    var snakeHead = (new THREE.Vector3(0,0,1)).applyMatrix3(this.body[this.head].modelView);
    for(var i = 1; i < this.body.length; i++){
       var point = (new THREE.Vector3(-2,0,1)).applyMatrix3(this.body[i].modelView);
       if(snakeHead.distanceTo(point) < 4){ //&& snakeHead.y < point1.y && snakeHead.y > point4.y){
        return true;
       }
    }
    return false;
  };

  var framecount = 0;
  var slowFactor = 5;

  Snake.prototype.render = function() {
    var id = window.requestAnimationFrame(this.render.bind(this));
    if(framecount > slowFactor){
      framecount=0;
      this.ctx.clearRect(0,0, this.width, this.height);
      this.placeBait();
      this.checkEaten();
      if(this.collision()){
        $(".gameOver").show();
        $(".startGame").show();
        window.cancelAnimationFrame(id);
        return;
      }
      this.draw();
      this.update();
    }
    framecount++;
  };





  var canvas = document.getElementById("canvas");
  $("#canvas").css({
    "border" : "10px solid #eaeaea",
    "border-radius" : "10px"
  });
  root.game = new Snake(canvas, 600, 600);
  root.game.init();
  //Init Interface
  $("canvas").css({"z-index" : "-999"});
  $("<h1></h1>").text("Game Over").css({"color":"white", 
    "position":"absolute",
    "display" : "none", 
    "top" : root.game.height/3, 
    "left" : root.game.width/3}).addClass("gameOver")
  .appendTo($("body"));
  $("<button></button>").text("Start").css({"color":"white", 
    "position":"absolute", 
    "width" : "150px",
    "height" : "120px",
    "font-size" : "30pt",
    "top" : root.game.height/2, 
    "left" : root.game.width/2.7}).addClass("startGame")
  .appendTo($("body"));

  $(".startGame").on('click', function(event){
    $(event.target).hide();
    $(".gameOver").hide();
    root.game = new Snake(canvas, 600, 600);
    root.game.init();
    root.game.start();
  })


})(this);