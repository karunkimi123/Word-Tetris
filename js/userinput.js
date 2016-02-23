/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


document.body.onkeydown = function (e) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    };
    if (typeof keys[ e.keyCode ] !== 'undefined') {
        keyPress(keys[ e.keyCode ]);
        $('#buttonPressSound').trigger("play");
        render();
    }
};

document.body.onkeyup = function (e) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    };
    if (typeof keys[ e.keyCode ] !== 'undefined') {
        $('#buttonPressSound').trigger("pause");
        document.getElementById('buttonPressSound').currentTime = 0;
    }
};


function keyPress(key) {
    switch (key) {
        case 'left':
            if (valid(0, -1)) {
                --currentY;
                // $('#buttonPressSound').trigger("play");
            }
            break;

        case 'right':
            if (valid(0, 1)) {
                ++currentY;
               // $('#buttonPressSound').trigger("play");
            }
           break;

        case 'down':
            if (valid(1)) {
                ++currentX;
                $('#buttonPressSound').trigger("play");
            }
           break;

        case 'rotate':
            var rotated = rotate(currentShape);
            var rotatedLetters = rotateLetter(currentLetters);
            if (valid(0, 0, rotated)) {
                currentShape = rotated;
                currentLetters = rotatedLetters;
                $('#buttonPressSound').trigger("play");
            }
            break;

    }
}