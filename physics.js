
//canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var continueAnimating = false;

// Bubblez variables
var bubbleRadius = 20;
var rocks = [];
var bubbles = [];
var totalBubbles = 3;
for (var i = 0; i < totalBubbles; i++) {
    addBubble();
}

var lineWidth = 6;

var origMaxSpeedX = 10;
var origMaxSpeedY = 2;
var gravity = 0.05;
var reboundCoeff = 0.5;
var frictionCoeff = 0.5;
var collisionCoeff = 1;

function addBubble(){
	var bubble = {
		radius : bubbleRadius
	}
	resetBubble(bubble);
	bubbles.push(bubble);
}

// move the rock to a random position near the top-of-canvas
// assign the rock a random speed

function resetBubble(bubble) {
    bubble.x = Math.random() * (canvas.width - 2*bubbleRadius) + bubbleRadius;
    bubble.y = Math.random() * 80 + bubbleRadius;
    bubble.speedx = origMaxSpeedX*Math.random() - origMaxSpeedX/2;
    bubble.speedy = origMaxSpeedY*Math.random() - origMaxSpeedY/2;
    bubble.collision = 0;
}

function animate() {

    // request another animation frame

    if (continueAnimating) {
        requestAnimationFrame(animate);
    }

    // for each rock
    // (1) check for collisions
    // (2) advance the rock
    // (3) if the rock falls below the canvas, reset that rock
 
    for (var i = 0; i < bubbles.length; i++) {

        var bubble = bubbles[i];
        bubble.px = bubble.x;
        bubble.py = bubble.y;
        // advance the rocks
        bubble.y += bubble.speedy;
        bubble.speedy += gravity;
            // if the rock is below the canvas,
            if (bubble.y >= canvas.height - bubble.radius) {
                //resetBubble(bubble);
            bubble.speedy *= -reboundCoeff;
            bubble.y = canvas.height - bubble.radius;
            }

        bubble.x += bubble.speedx;
        // friction
        if(Math.abs(bubble.y - (canvas.height - bubble.radius)) < 0.1){
            bubble.speedx *= frictionCoeff;
        }
        if(bubble.x >= canvas.width- bubble.radius) {
            bubble.speedx *= -reboundCoeff;
            bubble.x = canvas.width - bubble.radius;
        }
        else if(bubble.x < 0){
            bubble.speedx *= -reboundCoeff;
            bubble.x = 0;
        }


            for (var j = 0; j < bubbles.length; j++) {
                if(j==i) continue;
                var obstacle = bubbles[j];
                var dist = distance(obstacle.x,obstacle.y, bubble.x, bubble.y);
                
                if(dist < (bubble.radius + obstacle.radius)){
                    //console.log("!!!");
                    var vx, vy, norm;
                    vx = obstacle.x - bubble.x;
                    vy = obstacle.y - bubble.y;
                    norm = Math.sqrt(vx*vx + vy*vy);
                    vx/=norm;
                    vy/=norm;
                    //console.log(vx+"-"+vy);

                    
                    bubble.speedx -= vx*obstacle.speedx*collisionCoeff;
                    bubble.speedy -= vy*obstacle.speedy*collisionCoeff;
                    
                    bubble.collision ++;
                }
            }

    }

    

    // Validate collisions (convserving energy)
    for (var j = 0; j < bubbles.length; j++) {
        if(bubble.collision > 0){
            /*bubble.speedy -= bubble.speedy*collisionCoeff*bubble.collision;
            bubble.speedx -= bubble.speedx*collisionCoeff*bubble.collision;
            */
            bubble.x = bubble.px;
            bubble.y = bubble.py;
        }
        bubble.collision = 0;
    }

    // Fix last collision issues
    for (var i = 0; i < bubbles.length; i++) {
        var bubble = bubbles[i];
        for (var j = 0; j < bubbles.length; j++) {
            if(j==i) continue;
            var obstacle = bubbles[j];
            var dist = distance(obstacle.x,obstacle.y, bubble.x, bubble.y);
            
            while(dist < (bubble.radius + obstacle.radius)){
                //console.log("!!!");
                var vx, vy, norm;
                vx = obstacle.x - bubble.x;
                vy = obstacle.y - bubble.y;
                norm = Math.sqrt(vx*vx + vy*vy);
                vx/=norm;
                vy/=norm;
                //console.log(vx+"-"+vy);

                
                bubble.x -= vx;
                bubble.y -= vy;
                dist = distance(obstacle.x,obstacle.y, bubble.x, bubble.y);
            }
        }
    }
    // redraw everything
    drawAll();

}

function distance(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function drawAll() {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background
    // (optionally drawImage an image)
    ctx.fillStyle = "ivory";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw all rocks
    for (var i = 0; i < bubbles.length; i++) {
        var bubble = bubbles[i];
        // optionally, drawImage(rocksImg,rock.x,rock.y)
        ctx.fillStyle = "gray";
        //ctx.fill(rock.x, rock.y, rock.width, rock.height);

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI, false);
        if(i == 0){
            ctx.fillStyle = '#CC0000';
        }
        else if(i == 1){
            ctx.fillStyle = '#0000CC';
        }
        else{
            ctx.fillStyle = '#00CC00';
        }
        //ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.closePath();

    }

    /*
    ctx.font = "14px Times New Roman";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 15);
    */
}

// button to start the game
$("#start").click(function () {
    for (var i = 0; i < bubbles.length; i++) {
        resetBubble(bubbles[i]);
    }
    if (!continueAnimating) {
        continueAnimating = true;
        animate();
    };
});

