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

function canRotate(tetra){
    // find bottom most pixel in tetra and add it to x position
    for(var r = tetra.size - 1, breaked = false; r >= 0; --r){
        for(var c = 0; c < tetra.size; ++c){
            if(tetra.desc[r][c] == 1){
                breaked = true;
                break;
            }
        }
        if(breaked){ 
            break;
        }
    }
    var rightX = (tetra.posX + r * cellSize < canvas.width);

    for(var r = 0, breaked = false; r < tetra.size; ++r){
        for(var c = 0; c < tetra.size; ++c){
            if(tetra.desc[r][c] == 1){
                breaked = true;
                break;
            }
        }
        if(breaked){ 
            break;
        }
    }
    var leftX = (tetra.posX - c * cellSize >= 0);

    return rightX && leftX;
}

function rotateTetra(tetra){
    if(!canRotate(tetra))
        return;
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
    if (tetra.stopped) { 
        return false;
    }
    var dim = tetra.size;
    for(var r = 0; r < dim; ++r){
        for(var c = dim - 1; c >= 0; --c){
            if(tetra.desc[r][c]){
                var x = tetra.posX + (c + 1)* cellSize + dsize;
                var y = tetra.posY + r * cellSize + dsize;
                context.fillRect(x,y,dsize,dsize);
                break;
            }
            else{
                continue;
            }
        }
        if(!isBackGround(c,r))
            return false;
    }
    return true;
}

function canMoveLeft(tetra){
    if(tetra.stopped){ 
        return false;
    }
    var dim = tetra.size;
    for(var r = 0; r < dim; ++r){
        for(var c = 0; c < dim; ++c){
            if(tetra.desc[r][c]){
                var x = tetra.posX + c* cellSize + dsize;
                var y = tetra.posY + r * cellSize + dsize;
                context.fillRect(x - cellSize,y,dsize,dsize); //small dot
                if(x < 0){
                    return false;
                }
                break;
            }
            else{
                continue;
            }
        }
        if(!isBackGround(c,r))
            return false;
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
        clearFilledLines(tetra);
        var rand = getRandomInt(6,6);
        initialtetra = 
            new Tetra(tetras[rand]);
        clearInterval(timerId);
        timerId = setInterval(animateTetra,400, initialtetra);
    }
}

function sum(array) {
    if (array.length == 0) { return 0; }
    var result = 0;
    for (var i = 0; i < array.length; i++) {
        result = result + array[i];
    }
    return result;
};

function isBackGround(x,y){
    var image = context.getImageData(x + dsize,y + dsize,dsize,dsize);
    var pix = image.data;
    for(var i = 0; i < pix.length; i+=4){
        if(pix[i] + pix[i + 1] + pix[i + 2] + pix[i + 3]){
            return false;
        }
    }
    return true;
}

function clearFilledLines(tetra) {
    var posY = tetra.posY;
    var nRows = tetra.size;
    for (var y = posY, r = 0; r < nRows; r++, y += cellSize) {
        if (sum(tetra.desc[r]) == 0) {
            continue;
        }
        //alert("some tetra has ones");
        var clearLine = true;
        for (var x = 0; x < canvas.width; x += cellSize) {
            if(isBackGround(x,y)){ 
                //alert("clear lined failed at " + x + " and " + y);
                clearLine = false;
                break; // some white box is there in line
            }
        }
        
        //alert("clear line is "+clearLine);
        if (clearLine) {
            dragLines(y);
        }
    }
}

function dragLines(y){
    for(var x = 0; x < canvas.width; x += cellSize){
        for(var r = y - cellSize; r >= 0; r-=cellSize){
            if(isBackGround(x,r)){
                context.clearRect(x,r + cellSize, cellSize, cellSize);
            }else{
                context.fillRect(x, r+cellSize, cellSize, cellSize);
            }
        }
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

var timerId = setInterval(animateTetra,400, initialtetra);

context.fillStyle = "rgb(0,0,0)";
for(var i = 20; i < 27; ++i)
    context.fillRect(0, canvas.height - i * cellSize, canvas.width, cellSize);

context.clearRect(canvas.width / 2, canvas.height - 22 * cellSize, cellSize, cellSize);
context.clearRect(canvas.width / 2, canvas.height - 26 * cellSize, cellSize, cellSize * 2);
context.clearRect(0, canvas.height - 26 * cellSize, cellSize, cellSize * 6);

