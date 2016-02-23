/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function createAudio() {
    var sound = $('#sound');


    for (var i = 0; i < words.length; i++) {

        var audio = $('<audio />');
        audio.attr('src', 'http://localhost:8383/WordGame1/' + words[i] + '.mp3');
        audio.addClass('' + words[i]);
        sound.append(audio);

    }

    var buttonPress = $('<audio />');
    buttonPress.attr('src', 'http://localhost:8383/WordGame1/Buttonpress.mp3');
    buttonPress.attr('id', 'buttonPressSound');
    sound.append(buttonPress);
    
    var collide = $('<audio />');
    collide.attr('src', 'http://localhost:8383/WordGame1/Collide.mp3');
    collide.attr('id', 'collideSound');
    sound.append(collide);
    
}