/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var grid_state;
var grid_characters;
var match_characters;
var currentShape; // current moving shape
var currentX, currentY;// position of current shape
var shapes = [
    [1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 1, 1]
];
var currentLetters;
var words = ["FLOW", "FOWL", "FOOL", "WOOL", "WOOF"];
var wordMatched = 0;
var wordMatchedLeft = 0;
var wordMatchedRight = 0;
var wordMatchedDown = 0;
var wordMatchedUp = 0;
var leftx;
var lefty;
var rightx;
var righty;
var downx;
var downy;
var upx;
var upy;
var interval;




var canvas = document.getElementById("game_canvas");
canvas.height = 600;
canvas.width = 300;

var TOTAL_PIXELS = canvas.height * canvas.width;
var NO_OF_ROWS = 20;
var NO_OF_COLUMNS = 10;
var BLOCK_PIXELS = TOTAL_PIXELS / (NO_OF_ROWS * NO_OF_COLUMNS);
var BLOCK_SIZE = Math.sqrt(BLOCK_PIXELS);

var ctx = canvas.getContext("2d");


function init() {
    //Create an empty game state grid
    grid_state = new Array(20);
    for (var x = 0; x < NO_OF_ROWS; ++x) {
        grid_state[x] = new Array(10);
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {
            grid_state[x][y] = 0;
        }
    }

    grid_characters = new Array(20);
    for (var x = 0; x < NO_OF_ROWS; ++x) {
        grid_characters[x] = new Array(10);
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {
            grid_characters[x][y] = '';
        }
    }

    match_characters = new Array(20);
    for (var x = 0; x < NO_OF_ROWS; ++x) {
        match_characters[x] = new Array(10);
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {
            match_characters[x][y] = 0;
        }
    }


}


function newShape() {


    var shape_id = Math.floor(Math.random() * shapes.length);
    var shape = shapes[ shape_id];
    currentShape = [];

    for (var x = 0; x < 4; ++x) {
        currentShape[x] = [];
        for (var y = 0; y < 4; ++y) {
            var i = 4 * y + x;
            if (typeof shape[ i ] !== 'undefined' && shape[ i ]) {
                currentShape[ x ][ y] = 1;
            }
            else {
                currentShape[ x ][ y ] = 0;
            }
        }
    }

    currentX = 0;
    currentY = 5;
}

function generateLetters() {

    var letters = ['L', 'O', 'F', 'W'];

    letters.sort(function () {
        return 0.5 - Math.random();
    });


    var currentLetter = [];
    currentLetter[0] = letters[0];
    currentLetter[1] = letters[1];
    currentLetter[2] = letters[2];
    currentLetter[3] = letters[3];

    var letterCount = 0;
    currentLetters = [];

    for (var x = 0; x < 4; ++x) {
        currentLetters[x] = [];
        for (var y = 0; y < 4; ++y) {
            if (currentShape[x][y]) {
                currentLetters[x][y] = currentLetter[letterCount];
                ++letterCount;
            }
        }
    }
}

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < NO_OF_ROWS; ++x) {
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {
            if (grid_state[ x ][ y ]) {
                drawBlock(x, y);
                drawBoardLetters(x, y);

            }
            if (match_characters[x][y]) {
                fillBlock(x, y);

            }
        }
    }






    for (var x = 0; x < 4; ++x) {
        for (var y = 0; y < 4; ++y) {
            if (currentShape[ x ][ y ]) {
                drawBlock(currentX + x, currentY + y);
                drawText(currentX + x, currentY + y, x, y);
            }
        }
    }
}

function fillBlock(x, y) {
    var pixelX = y * BLOCK_SIZE;
    var pixelY = x * BLOCK_SIZE;

    var alpha = 0.5;

    ctx.fillStyle = "rgba(255, 187, 255 , " + alpha + ")";
    ctx.fillRect(pixelX, pixelY, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
}

function drawBlock(x, y) {
    var pixelX = y * BLOCK_SIZE;
    var pixelY = x * BLOCK_SIZE;

    //Set the fill color for drawing commands
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(pixelX, pixelY, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
}

function drawBoardLetters(x, y) {


    var pixelX = y * BLOCK_SIZE;
    var pixelY = x * BLOCK_SIZE;

    ctx.font = "20px sans-serif";
    ctx.strokeStyle = "#FFFFFF";
    ctx.textBaseline = "hanging";

    ctx.strokeText(grid_characters[x][y], pixelX + 6, pixelY + 8);
}

function drawText(a, b, x, y) {


    var pixelX = b * BLOCK_SIZE;
    var pixelY = a * BLOCK_SIZE;

    ctx.font = "20px sans-serif";
    ctx.strokeStyle = "#FFFFFF";
    ctx.textBaseline = "hanging";

    ctx.strokeText(currentLetters[x][y], pixelX + 6, pixelY + 8);
}

function fallingBlocks() {
    if (valid(1)) {
        ++currentX;
    }
    else {
        freeze();
        match();

        if (wordMatched) {

            clearBlocks();
            //  render();
            alignrows();

        }



        newShape();
        generateLetters();
        
    }

    render();
}

function rotate(currentShape) {
    var newCurrentShape = [];
    for (var x = 0; x < 4; ++x) {
        newCurrentShape[ x ] = [];
        for (var y = 0; y < 4; ++y) {
            newCurrentShape[ x][ y ] = currentShape[ 3 - y ][ x ];
        }
    }

    return newCurrentShape;
}

function rotateLetter(currentLetters) {
    var newCurrentLetters = [];
    for (var x = 0; x < 4; ++x) {
        newCurrentLetters[ x ] = [];
        for (var y = 0; y < 4; ++y) {
            newCurrentLetters[ x][ y ] = currentLetters[ 3 - y ][ x ];
        }
    }

    return newCurrentLetters;
}

function valid(offsetX, offsetY, newCurrentShape) {

    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrentShape = newCurrentShape || currentShape;



    for (var x = 0; x < 4; ++x) {
        for (var y = 0; y < 4; ++y) {
            if (newCurrentShape[ x ][ y ]) {
                if (typeof grid_state[ x + offsetX ] === 'undefined'
                        || typeof grid_state[ x + offsetX ][ y + offsetY ] === 'undefined'
                        || grid_state[ x + offsetX ][ y + offsetY ]
                        || y + offsetY < 0
                        || x + offsetX >= NO_OF_ROWS
                        || y + offsetY >= NO_OF_COLUMNS) {
                    
                    return false;
                }
            }
        }
    }
    return true;
}

function freeze() {
    $('#collideSound').trigger("play");

    for (var x = 0; x < 4; ++x) {
        for (var y = 0; y < 4; ++y) {
            if (currentShape[ x ][ y ]) {
                grid_state[ x + currentX ][ y + currentY ] = currentShape[ x ][ y ];
                grid_characters[ x + currentX ][ y + currentY ] = currentLetters[ x ][ y ];
            }
        }
    }
}

function match() {

    for (var x = 0; x < NO_OF_ROWS; ++x) {
        match_characters[x] = new Array(10);
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {
            match_characters[x][y] = 0;
        }
    }

    for (var x = 0; x < NO_OF_ROWS; ++x)
    {
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {

            if (grid_characters[x][y] !== '') {

                checkLeft(x, y);
                checkRight(x, y);
                checkUp(x, y);
                checkDown(x, y);

            }
        }
    }
}


function checkLeft(x, y) {
    if (y < 3) {
        return;
    }
    else {
        if (grid_characters[x][y - 1] !== '' && grid_characters[x][y - 2] !== '' && grid_characters[x][y - 3] !== '') {
            var left_chars = [];

            for (var i = 0; i < 4; ++i) {
                left_chars[i] = grid_characters[x][y - i];
            }

            var left_string = left_chars.join('');
            var matched = searchStringInArray(left_string, words);
            if (matched === 1) {
                $('#' + left_string).text(parseInt($('#' + left_string).text()) + 1);
                $('.' + left_string).trigger("play");

                wordMatched = 1;
                wordMatchedLeft = 1;
                leftx = x;
                lefty = y;

                for (var i = 0; i < 4; ++i) {
                    match_characters[x][y - i] = 1;
                }
            }

        }
    }
}

function checkRight(x, y) {
    if (y > 6) {
        return;
    }
    else {
        if (grid_characters[x][y + 1] !== '' && grid_characters[x][y + 2] !== '' && grid_characters[x][y + 3] !== '') {
            var right_chars = [];
            for (var i = 0; i < 4; ++i) {
                right_chars[i] = grid_characters[x][y + i];
            }

            var right_string = right_chars.join('');
            var matched = searchStringInArray(right_string, words);
            if (matched === 1) {
                $('#' + right_string).text(parseInt($('#' + right_string).text()) + 1);
                $('.' + right_string).trigger("play");

                wordMatched = 1;
                wordMatchedRight = 1;
                rightx = x;
                righty = y;

                for (var i = 0; i < 4; ++i) {
                    match_characters[x][y + i] = 1;

                }
            }

        }
    }
}

function checkDown(x, y) {
    if (x > 16) {
        return;
    }
    else {
        if (grid_characters[x + 1][y] !== '' && grid_characters[x + 2][y] !== '' && grid_characters[x + 3][y] !== '') {
            var down_chars = [];

            for (var i = 0; i < 4; ++i) {
                down_chars[i] = grid_characters[x + i][y];
            }

            var down_string = down_chars.join('');
            var matched = searchStringInArray(down_string, words);
            if (matched === 1) {
                $('#' + down_string).text(parseInt($('#' + down_string).text()) + 1);
                $('.' + down_string).trigger("play");

                wordMatched = 1;
                wordMatchedDown = 1;
                downx = x;
                downy = y;

                for (var i = 0; i < 4; ++i) {
                    match_characters[x + i][y] = 1;

                }
            }

        }
    }
}

function checkUp(x, y) {
    if (x < 3) {
        return;
    }
    else {
        if (grid_characters[x - 1][y] !== '' && grid_characters[x - 2][y] !== '' && grid_characters[x - 3][y] !== '') {
            var up_chars = [];

            for (var i = 0; i < 4; ++i) {
                up_chars[i] = grid_characters[x - i][y];
            }

            var up_string = up_chars.join('');
            var matched = searchStringInArray(up_string, words);
            if (matched === 1) {

                $('#' + up_string).text(parseInt($('#' + up_string).text()) + 1);
                $('.' + up_string).trigger("play");

                wordMatched = 1;
                wordMatchedUp = 1;
                upx = x;
                upy = y;

                for (var i = 0; i < 4; ++i) {
                    match_characters[x - i][y] = 1;

                }
            }

        }
    }
}

function clearBlocks() {



    for (var x = 0; x < NO_OF_ROWS; ++x)
    {
        for (var y = 0; y < NO_OF_COLUMNS; ++y) {
            if (match_characters[x][y]) {

                grid_state[ x ][ y ] = 0;
                grid_characters[ x ][ y ] = "";
                //  match_characters[x][y] = 0;

            }
        }
    }
}

function searchStringInArray(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
        if (strArray[j].match(str))
            return 1;
    }
    return 0;
}

function  alignrows() {

    if (wordMatchedLeft === 1) {
        for (var y = lefty; y >= lefty - 3; y--) {
            for (var x = leftx - 1; x >= 0; x--) {
                grid_state[x + 1][y] = grid_state[x][y];
                grid_characters[x + 1][y] = grid_characters[x][y];
                //  render();
            }
        }
        leftx = 0;
        lefty = 0;
        wordMatchedLeft = 0;


    }

    if (wordMatchedRight === 1) {
        for (var y = righty; y <= righty + 3; y++) {
            for (var x = rightx - 1; x >= 0; x--) {
                grid_state[x + 1][y] = grid_state[x][y];
                grid_characters[x + 1][y] = grid_characters[x][y];
                // render();
            }
        }
        rightx = 0;
        righty = 0;
        wordMatchedRight = 0;

    }

    if (wordMatchedDown === 1) {
        for (var x = downx - 1; x >= 0; x--) {
            y = downy;
            grid_state[x + 4][y] = grid_state[x][y];
            grid_characters[x + 4][y] = grid_characters[x][y];
            //  render();
        }

        downx = 0;
        downy = 0;
        wordMatchedDown = 0;

    }

    if (wordMatchedUp === 1) {

        var y = upy;

        for (var x = upx - 4; x >= 0; x--) {


            grid_state[x + 4][y] = grid_state[x][y];
            grid_characters[x + 4][y] = grid_characters[x][y];
            //  render();
        }
        upx = 0;
        upy = 0;
        wordMatchedUp = 0;

    }

    wordMatched = 0;

}

function newGame() {
    clearInterval(interval);
    init();
    newShape();
    generateLetters();
   
    $('#start').val('PAUSE');
    interval = window.setInterval(fallingBlocks, 500);
}

function pause() {
    clearInterval(interval);
    $('#start').val('RESUME');

}

function resume() {
    interval = window.setInterval(fallingBlocks, 500);
    $('#start').val('PAUSE');
}

function createWordsTable() {
    var table = $('#inner_body');
    for (var i = 0; i < words.length; i++) {
        table.append('<tr>' + '<td>' + words[i] + '</td>' + '<td id =' + words[i] + '>' + 0 + '</td>');
    }
}

function createPopUpWordsTable() {
    var table = $('#outer_body');
    for (var i = 0; i < words.length; i++) {
        var text = $('#' + words[i]).text();
        table.append('<tr>' + '<td>' + words[i] + '</td>' + '<td>' + text + '</td>');
    }
}

function gameOver() {

    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $('#start').val('START');

    $("tbody#outer_body tr").remove();
    createPopUpWordsTable();
    $("tbody#inner_body tr").remove();

    $('#element_to_pop_up').bPopup();
}




$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
    $('#start').click(function () {
        if ($(this).val() === 'START') {
            newGame();

            createWordsTable();
            createAudio();
            document.getElementById("stop").disabled = false;
            return;
        }
        if ($(this).val() === 'PAUSE') {
            pause();
            return;
        }
        if ($(this).val() === 'RESUME') {
            resume();
            return;
        }

    });

    $('#stop').click(function () {
        gameOver();
    });


});

























