var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var cellSize = 10;
var dsize = 2;

function Tetra(desc){
    this.size = desc.length;
    this.desc = desc;
    this.posX = canvas.width / 2;
    this.posY = 0;
    this.stopped = false;
}

function clearTetra(tetra){
    if(tetra.stopped){
        return;
    }
    var x = tetra.posX;
    var y = tetra.posY;
    context.moveTo(x,y);
    var s = cellSize;
    var dim = tetra.size;
    for(var i = 0; i < dim; ++i)
        for(var j = 0; j < dim; ++j){
            if(tetra.desc[i][j]){
                context.clearRect(x + j * s, y + i * s, s, s);
            }
        }
}

function drawTetra(tetra){
    if(tetra.stopped){
        return;
    }
    var x = tetra.posX;
    var y = tetra.posY;
    context.moveTo(x,y);
    var s = cellSize;
    var dim = tetra.size;
    for(var i = 0; i < dim; ++i)
        for(var j = 0; j < dim; ++j){
            if(tetra.desc[i][j]){
                context.fillRect(x + j * s, y + i * s, s, s);
            }
        }
}


// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotateTetra(tetra){
    clearTetra(tetra);
    var dim = tetra.size;
    var ret = new Array(dim);

    for (var i = 0; i < dim; ++i) {
        ret[i] = new Array(dim);
        for (var j = 0; j < dim; ++j) {
            ret[i][j] = tetra.desc[dim - j - 1][i];
        }
    }
    tetra.desc = ret;
    drawTetra(tetra);
}

function canMoveRight(tetra){
    if(tetra.stopped){ 
        return false;
    }
    var dim = tetra.size;
    for(var r = 0; r < dim; ++r){
        var imgd;
        for(var c = dim - 1; c >= 0; --c){
            if(tetra.desc[r][c]){
                var x = tetra.posX + (c + 1)* cellSize + dsize;
                var y = tetra.posY + r * cellSize + dsize;
                imgd = context.getImageData(x, y, dsize, dsize);
                context.fillRect(x,y,dsize,dsize);
                break;
            }
            else{
                continue;
            }
        }
        if(imgd){
            var pix = imgd.data;
            for(var i = 0, n = pix.length; i<n;i+=4){
                if(pix[i] + pix[i+1] + pix[i+2] + pix[i+3]){
                    return false;
                }
            }
        }
    }
    return true;
}

function canMoveLeft(tetra){
    if(tetra.stopped){ 
        return false;
    }
    var dim = tetra.size;
    for(var r = 0; r < dim; ++r){
        var imgd;
        for(var c = 0; c < dim; ++c){
            if(tetra.desc[r][c]){
                var x = tetra.posX + (c - 1)* cellSize + dsize;
                var y = tetra.posY + r * cellSize + dsize;
                imgd = context.getImageData(x, y, dsize, dsize);
                context.fillRect(x,y,dsize,dsize);
                break;
            }
            else{
                continue;
            }
        }
        if(imgd){
            var pix = imgd.data;
            for(var i = 0, n = pix.length; i<n;i+=4){
                if(pix[i] + pix[i+1] + pix[i+2] + pix[i+3]){
                    return false;
                }
            }
        }
    }
    return true;
}

function canMoveDown(tetra){
    if(tetra.stopped){ 
        return false;
    }
    var dim = tetra.size;
    for(var c = 0; c < dim; ++c){
        var imgd;
        for(var r = dim - 1; r >= 0; --r){
            if(tetra.desc[r][c]){
                var x = tetra.posX + c * cellSize + dsize;
                var y = tetra.posY + (r + 1) * cellSize + dsize;
                imgd = context.getImageData(x, y, dsize, dsize);
                context.fillRect(x,y,dsize,dsize);
                break;
            }
            else{
                continue;
            }
        }

        if(imgd){
            var pix = imgd.data;
            for(var i = 0, n = pix.length; i<n;i+=4){
                if(pix[i] + pix[i+1] + pix[i+2] + pix[i+3]){
                    return false;
                }
            }
        }
    }
    return true;
}

function moveLeft(tetra){
    if(canMoveLeft(tetra)){
        clearTetra(tetra);
        tetra.posX -= cellSize;
        drawTetra(tetra);
    }
}

function moveRight(tetra){
    if(canMoveRight(tetra)){
        clearTetra(tetra);
        tetra.posX += cellSize;
        drawTetra(tetra);
    }
}

function animateTetra(tetra){
    if(canMoveDown(tetra)){
        clearTetra(tetra);
        tetra.posY += cellSize;
        drawTetra(tetra);        
    }
    else{
        tetra.stopped = true;
        var rand = getRandomInt(0,7);
        initialtetra = 
            new Tetra(tetras[rand]);
        clearInterval(timerId);
        timerId = setInterval(animateTetra,100, initialtetra);
    }   
}

var tetras = [
    [
	[0,0,1],
	[1,1,1],
	[0,0,0]
    ],
    [
	[1,0,0],
	[1,1,1],
	[0,0,0]
    ],
    [
	[0,1,1],
	[1,1,0],
	[0,0,0]
    ],
    [
	[1,1,0],
	[0,1,1],
	[0,0,0]
    ],
    [
	[0,1,0],
	[1,1,1],
	[0,0,0]
    ],
    [
	[1,1],
	[1,1]
    ],
    [
	[0,0,0,0],
	[1,1,1,1],
	[0,0,0,0],
	[0,0,0,0]
    ]
];


function handleArrowKeys(evt) {
    evt = (evt) ? evt : ((window.event) ? event : null);
    if (evt) {
        switch (evt.keyCode) {
        case 37:
            moveLeft(initialtetra);
            break;    
        case 38:
            rotateTetra(initialtetra);
            break;    
        case 39:
            moveRight(initialtetra);
            break;    
        case 40:
            break;    
        }
    }
}

document.onkeyup = handleArrowKeys;


var initialtetra = new Tetra([
                                 [0,0,0,0],
                                 [1,1,1,1],
                                 [0,0,0,0],
                                 [0,0,0,0]
                             ]);

var timerId = setInterval(animateTetra,100, initialtetra);

context.fillStyle = "rgb(0,0,0)";
context.fillRect(0,canvas.height - 20 * cellSize, canvas.width, cellSize);
