var canvas = document.getElementById("canvas"),
		ctx    = canvas.getContext("2d");

var Box = BoxConstructor()

var boxNum = 20,
    W = 350,
		H = 450;

canvas.height = H; 
canvas.width  = W;

var boxes = [], 
		gravity = 0.2,
		bounceFactor = 1;

function BoxConstructor () {

  var id = 1;

  return function (opts) {
    this.id  = id++

    this.height = opts.height || 15
    this.width  = opts.width  || 15

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
	  	ctx.closePath();
    }
  }

}

for (var i = 0; i < boxNum; i++) {
  var opts = {}, 
      rand = Math.random(),
      sign

  function sign () {
    if (Math.random() < 0.5) {
      return -1
    } else {
      return 1
    }
  }

  opts.x = Math.floor(W * rand)
  opts.y = Math.floor(H * rand)
  
  opts.vx = Math.floor(20 * rand) * sign()
  opts.vy = Math.floor(20 * rand) * sign()

  boxes.push(new Box(opts))
}


function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}

function updateAll () {
	clearCanvas();
  for (var i = 0; i < boxes.length; i++) {
    update(boxes[i])
  }
}

function checkCollisions (box, otherBox) {
  if (box.id != otherBox.id) {
    // Check for side collisions
    if ((box.x <= otherBox.x + otherBox.width && box.x + box.width >= otherBox.x) && 
        (box.y + box.height >= otherBox.y && box.y <= otherBox.y + otherBox.height)) {
      box.vy *= -bounceFactor
    }
    if ((box.x + box.width >= otherBox.x && box.x + box.width <= otherBox.x + otherBox.width) && 
        (box.y + box.height >= otherBox.y && box.y <= otherBox.y + otherBox.height)) {
      box.vy *= -bounceFactor
    }
    // Check for top/bottom collisions
    if ((box.y <= otherBox.y + otherBox.height && box.y + box.height >= otherBox.y) && 
        (box.x + box.width >= otherBox.x && box.x <= otherBox.x + otherBox.width)) {
      box.vx *= -bounceFactor
    }
    if ((box.y + box.height >= otherBox.y && box.y + box.height <= otherBox.y + otherBox.height) && 
        (box.x + box.width >= otherBox.x && box.x <= otherBox.x + otherBox.width)) {
      box.vx *= -bounceFactor
    }
  }
}

function update (box) {

	box.draw();
  
  // Wall collision
	box.y += box.vy;
	if(box.y + box.height > H) {
		box.y = H - box.height;
		box.vy *= -bounceFactor;
	}
  if(box.y - box.height <= 0) {
		box.y = 0 + box.height;
		box.vy *= -bounceFactor;
	}
	box.x += box.vx;
	if(box.x + box.width > W) {
		box.x = W - box.width;
		box.vx *= -bounceFactor;
	}
  if(box.x - box.width <= 0) {
		box.x = 0 + box.width;
		box.vx *= -bounceFactor;
	}

  // Box collision
  for (var k = 0; k < boxes.length; k++) {
    checkCollisions(box, boxes[k])
  } 

}

setInterval(updateAll, 1000/60);
