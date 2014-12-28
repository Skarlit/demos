(function(root){
    var SnakePiece = root.SnakePiece = function(nextPiece, modelView){
    this.next = nextPiece;
    this.modelView = modelView;
    this.vertices = [
      new THREE.Vector3(0,0,1),
      new THREE.Vector3(-1,1,1),
      new THREE.Vector3(-3,1,1),
      new THREE.Vector3(-2,0,1),
      new THREE.Vector3(-3,-1,1),
      new THREE.Vector3(-1,-1,1)
    ];
  } 

  SnakePiece.moveTransform = new THREE.Matrix3(
    1, 0, 15,
    0, 1, 0, 
    0, 0, 1
  )

  SnakePiece.prototype.draw = function(ctx, map) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    worldVertex = this.vertices[0].clone().applyMatrix3(this.modelView).applyMatrix3(map);
    ctx.moveTo(worldVertex.x, worldVertex.y);
    for(var i = 1; i < this.vertices.length; i++){
      worldVertex = this.vertices[i].clone().applyMatrix3(this.modelView).applyMatrix3(map);
      ctx.lineTo(worldVertex.x, worldVertex.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#c2ea11";
    ctx.stroke();
  };


  SnakePiece.prototype.update = function(canvas) {

    if(this.next == null){  //Head
      var nextPos = new THREE.Vector3(0,0,1).applyMatrix3(this.modelView);
      if(nextPos.x < - canvas.width / 2){
        this.modelView = new THREE.Matrix3(
          -1, 0, canvas.width/2,
           0,-1, nextPos.y,
           0, 0, 1
        );
      }else if(nextPos.x > canvas.width / 2){
        this.modelView = new THREE.Matrix3(
          1, 0, -canvas.width/2,
          0, 1, nextPos.y,
          0, 0, 1
        );
      }else if(nextPos.y > canvas.height / 2){
        this.modelView = new THREE.Matrix3(
          0, -1, nextPos.x,
          1,  0, -canvas.height/2,
          0,  0, 1
        );
      }else if(nextPos.y < -canvas.height / 2){
        this.modelView = new THREE.Matrix3(
          0, 1, nextPos.x,
         -1, 0, canvas.height/2,
          0, 0, 1
        );
      }else{
        this.modelView = Snake.matrixProduct(this.modelView, SnakePiece.moveTransform);
      }
    }else{  //Non head
       //Update from tail to head
      this.modelView = this.next.modelView.clone();
      // this.modelView = Snake.matrixProduct(this.next.modelView, new THREE.Matrix3(
      //  1, 0, -1,
      //  0, 1, 0,
      //  0, 0, 1
      // ));
    }
  };
})(this)