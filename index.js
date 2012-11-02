var canvas = document.getElementById("canvas"),
		ctx    = canvas.getContext("2d")

var Box = BoxConstructor()

var boxNum = 3,
    W = 350,
		H = 450;

canvas.height = H; 
canvas.width  = W;

var boxes = [], 
		gravity = 0.2,
		bounceFactor = 1.0;

function BoxConstructor () {

  var id = 1;

  return function (opts) {
    this.id  = id++

    this.height = opts.height || 30 
    this.width  = opts.width  || 30 

    this.color = opts.color || "red"

    this.x = opts.x || W/2 
    this.y = opts.y || 50
    this.vx = opts.vx || 1
    this.vy = opts.vy || 1

    this.draw = function () {
      var self = this
	  	ctx.beginPath();
	  	ctx.fillStyle = self.color;
	  	ctx.fillRect(self.x, self.y, self.height, self.width);
	  	ctx.fillStyle = "white";
      ctx.font = "15pt arial";
      ctx.fillText(self.id, (self.x + (self.width / 2 - 7.5)), (self.y + (self.height/2 + 7.5)));
	  	ctx.closePath();
    }
  }

}

var collisions = true
var collision = false
var count = 0

while (collisions) {
  for (var i = 0; i < boxNum; i++) {
    var opts = {}, 
        sign
  
    function sign () {
      if (Math.random() < 0.5) {
        return -1
      } else {
        return 1
      }
    }
  
    opts.x = Math.floor((W - 20) * Math.random())
    opts.y = Math.floor((H - 20) * Math.random())
    
    opts.vx = Math.floor(5 * Math.random()) * sign()
    opts.vy = Math.floor(5 * Math.random()) * sign()

    boxes.push(new Box(opts))
  }
  collision = false
  for (var j = 0; j < boxes.length; j++) {
    for (var k = 0; k <boxes.length; k++) {
      if (boxes[j].id != boxes[k].id) {
        // Check for side collisions
        if (sideCollisionRangeY(boxes[j], boxes[k]) && verticalCollisionRangeX(boxes[j], boxes[k])) {
          collision = true 
        }
      }
    }
  }
  if (!collision) { collisions = false }
}

console.log(count)

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}

function updateAll () {
	clearCanvas();
  for (var i = 0; i < boxes.length; i++) {
    update(boxes[i])
  }
}

function sideCollisionRangeY (box, otherBox) {
  var otherBoxTopRange = otherBox.y - box.height
  var otherBoxBottomRange = otherBox.y + otherBox.height 
  
  if (box.y >= otherBoxTopRange && box.y <= otherBoxBottomRange) {
    return true
  }
  return false
}

function sideCollisionX (box, otherBox) {
  var otherBoxLeft = otherBox.x - box.width
  var otherBoxRight = otherBox.x + otherBox.width 

  if (box.x == otherBoxLeft || box.x == otherBoxRight) {
    return true
  }
  return false
}

function verticalCollisionRangeX (box, otherBox) {
  var otherBoxLeftRange = otherBox.x - box.width
  var otherBoxRightRange = otherBox.x + otherBox.width 
  
  if (box.x >= otherBoxLeftRange && box.x <= otherBoxRightRange) {
    return true
  }
  return false
}

function verticalCollisionY (box, otherBox) {
  var otherBoxTop = otherBox.y - box.height
  var otherBoxBottom = otherBox.y + otherBox.height 

  if (box.y == otherBoxTop || box.y == otherBoxBottom) {
    return true
  }
  return false
}

function checkCollisions (box, otherBox) {
  if (box.id != otherBox.id) {
    // Check for side collisions
    if (sideCollisionRangeY(box, otherBox) && sideCollisionX(box, otherBox)) {
      box.vx *= -bounceFactor
      otherBox.vx *= -bounceFactor
    }
    // Check for top/bottom collisions
    if (verticalCollisionRangeX(box, otherBox) && verticalCollisionY(box, otherBox)) {
      box.vy *= -bounceFactor
      otherBox.vy *= -bounceFactor
    }
  }
}

function update (box) {
  
  // Wall collision
	box.y += box.vy;
	if(box.y + box.height > H) {
		box.y = H - box.height;
		box.vy *= -bounceFactor;
	}
  if(box.y <= 0) {
		box.vy *= -bounceFactor;
	}
	box.x += box.vx;
	if(box.x + box.width > W) {
		box.x = W - box.width;
		box.vx *= -bounceFactor;
	}
  if(box.x <= 0) {
		box.vx *= -bounceFactor;
	}

  // Box collision
  for (var k = 0; k < boxes.length; k++) {
    checkCollisions(box, boxes[k])
  } 

	box.draw();

}

setInterval(updateAll, 1000/60);
