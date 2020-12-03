var board = new Array();
var score = 0;
var hasConflicted = new Array();
var level;
var startgame = false;
var Num_combinations = 0;
$(document).ready(function(){
    newgame();
    $('#button').bind("click",function(){
        level = $('input:radio:checked').val();
        startgame = true;
        $('#level_select').hide();
    });
});

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
    startgame = false;
    $('#level_select').show();

}

function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }

    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
    updateScore( score );
}

function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + 50 );
                theNumberCell.css('left',getPosLeft(i,j) + 50 );
            }
            else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false;
        }
}

function generateOneNumber(){

    if( nospace( board ) )
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    var times = 0;
    while( times < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    //var randNumber = Math.random() < 0.5 ? 2 : 4;
    var randNumber;
    if(!startgame)
        randNumber = 2;
    else
    {
        if(level === 'easy')
            randNumber = 2;
        else if(level === 'normal')
            randNumber = Math.random() < 0.6 ? 2 : 4;
        else
        {
            var temp = Math.random();
            randNumber = temp <= 0.3 ? 2 : (temp < 0.7 ? 4:8);
        }
    }


    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}

$(document).keydown( function( event ){
    if(startgame) {
        switch (event.keyCode) {
            case 37: //left
                if (moveLeft()) {
                    levelGenerateNumber();
                    setTimeout("isgameover()", 300);
                }
                break;
            case 38: //up
                if (moveUp()) {
                    levelGenerateNumber();
                    setTimeout("isgameover()", 300);
                }
                break;
            case 39: //right
                if (moveRight()) {
                    levelGenerateNumber();
                    setTimeout("isgameover()", 300);
                }
                break;
            case 40: //down
                if (moveDown()) {
                    levelGenerateNumber();
                    setTimeout("isgameover()", 300);
                }
                break;
            default: //default
                break;
        }
    }
});

function levelGenerateNumber() {
    if(level==='easy')
        setTimeout("generateOneNumber()",210);
    else if(level==='normal')
    {
        setTimeout("generateOneNumber()",210);
        setTimeout("generateOneNumber()",210);
    }
    else{
        setTimeout("generateOneNumber()",210);
        setTimeout("generateOneNumber()",210);
    }
}

function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover();
    }
}

function gameover(){
    alert('gameover');
    $('#level_select').show();
    startgame = false;
    newgame();
}

function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    Num_combinations = 0;
    var score_t = 0;
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        Num_combinations++;
                        score_t += board[i][k];

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    score += score_t * Num_combinations;
    updateScore( score );
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    Num_combinations = 0;
    var score_t = 0;
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation( i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score_t += board[i][k];
                        Num_combinations++;
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    score += score_t * Num_combinations;
    updateScore( score );
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    Num_combinations = 0;
    var score_t = 0;
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        Num_combinations++;
                        //add score
                        score_t += board[k][j];

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    score += score_t * Num_combinations;
    updateScore( score );
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    Num_combinations = 0;
    var score_t = 0;
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        Num_combinations++;
                        score_t += board[k][j];


                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    score += score_t * Num_combinations;
    updateScore( score );
    setTimeout("updateBoardView()",200);
    return true;
}

