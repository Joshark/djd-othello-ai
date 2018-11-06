const nSquares = 8;
const divBlack = "<div class='black' />";
const divWhite = "<div class='white' />";

let score = {
  black: 0,
  white: 0,
}

let curPlayer = 'black';

const loadBoard = () => {
  var table = document.createElement("table");
  for (var i = 1; i <= nSquares; i++) {
      var tr = document.createElement('tr');
      for (var j = 1; j <= nSquares; j++) {
          var td = document.createElement('td');
          td.className = "othelloSquare";
          td.id = '' + i + j;
          tr.appendChild(td);
      }
      table.appendChild(tr);
  }
  $('#main').append(table); 

  startGame();
}

$(document).on('click', '.othelloSquare', function() {
  if(!$(this).find('.black')[0] && !$(this).find('.white')[0]) {
    if(curPlayer == 'black') {
      if (checkClickedTd($(this))) {
        pickCoin($(this), divBlack);
        changeCoin($(this), 'black', 'white', divBlack);
		curPlayer = nextPlayer();
      }
    } else {
      if (checkClickedTd($(this))) {
        pickCoin($(this), divWhite);
        changeCoin($(this), 'white', 'black', divWhite);
		curPlayer = nextPlayer();
      }
    }


    // Verifica possíveis movimentos para o proximo jogador
    if(checkGameState() == 0) {
      curPlayer = nextPlayer();

      if(checkGameState() == 0) {
		    $('.modal').addClass('show')

        // Shows modal for which player won or a tie
        if(score.black < score.white) {
    			$('.modal').html("White won")
    		} else if(score.white < score.black) {
    			$('.modal').html("Black won")
    		} else {
    			$('.modal').html("Tie")
    		}
      }
    }
	
	$('#blackCounter').html(score.black);
	$('#whiteCounter').html(score.white);
  }
})

const nextPlayer = () => {
  return curPlayer === 'black' ? 'white' : 'black';
}

const checkGameState = () => {
  let possiblePlays = [];
  let opponent = nextPlayer();
  
  let blackPieces = 0;
  let whitePieces = 0;
  
  let cordXCheck = 0;
  let cordYCheck = 0;
  let cordsXY = '';

  // Goes through all the squares to check for possible plays
  for(let x=1; x<=nSquares; x++) {
    for(let y=1; y<=nSquares; y++) {

      // Checks current square to see what piece occupies it
      if($(`#${x}${y}`).find('div').hasClass(curPlayer) || $(`#${x}${y}`).find('div').hasClass(opponent)) {
  		  if($(`#${x}${y}`).find('div').hasClass('black'))
          blackPieces++;
  		  else 
          whitePieces++;

        continue;
	  }

      // Checks all directions for selected square
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          if(dx === 0 && dy === 0)
            continue;

          for(let i=1; i < nSquares; i++) {
            cordXCheck = x + i * (dx),
            cordYCheck = y + i * (dy);

            if(cordXCheck < 1 || cordXCheck > nSquares || cordYCheck < 1 || cordYCheck > nSquares)
              break;

            cordsXY = '#' + cordXCheck + cordYCheck;

            if ($(cordsXY).find('div').hasClass(curPlayer) && i >= 2) {
              for(let j=1; j<i; j++) {
				        let pushCords = `#${-dx + x + (j * dx)}${-dy + y + (j * dy)}`;
                possiblePlays.push(pushCords);
              }
            }
            
            if(!($(cordsXY).find('div').hasClass(opponent)))
              break;
          }
        }
      }
    }
  }

  // Sets the current score
  score.black = blackPieces;
  score.white = whitePieces;
  
  return possiblePlays.length;
}

const checkClickedTd = (clickedId) => {
  let opponent = nextPlayer();
  let cordXCheck = 0;
  let cordYCheck = 0;

  let idClickedTd = clickedId.attr('id');
  let cordXClick = parseInt(idClickedTd.charAt(0));
  let cordYClick = parseInt(idClickedTd.charAt(1));

  // TODO: Try to extract to a function???
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if(dx === 0 && dy === 0)
        continue;


      for(let i=1; i < nSquares; i++) {
        cordXCheck = cordXClick + i * (dx);
        cordYCheck = cordYClick + i * (dy);
        if(cordXCheck < 1 || cordXCheck > nSquares || cordYCheck < 1 || cordYCheck > nSquares)
          break;

        let cordsXY = '#' + cordXCheck + cordYCheck;

        if ($(cordsXY).find('div').hasClass(curPlayer) && i >= 2) {
          return true;
        }
        
        if(!($(cordsXY).find('div').hasClass(opponent)))
          break;
      }
    }
  }
  return false;
}

const pickCoin = (clickedId, curPiece) => {
  var idClickedTd = clickedId.attr('id');
  $('#' + idClickedTd).html(curPiece);
}

const changeCoin = (clickedId) => {
  let coinToChange = [];
  let pushCords = '';
  let opponent = nextPlayer();
  let cordsXY = '';

  let idClickedTd = clickedId.attr('id');
  let cordXClick = parseInt(idClickedTd.charAt(0));
  let cordYClick = parseInt(idClickedTd.charAt(1));

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0)
        continue;

      for(let i=1; i < nSquares; i++) {
        cordXCheck = cordXClick + i * (dx),
        cordYCheck = cordYClick + i * (dy);

        if(cordXCheck < 1 || cordXCheck > nSquares || cordYCheck < 1 || cordYCheck > nSquares)
          break;

        cordsXY = '#' + cordXCheck + cordYCheck;

        if ($(cordsXY).find('div').hasClass(curPlayer) && i >= 2) {
          for(let j=1; j<i; j++) {
            pushCords = `#${cordXClick + (j * dx)}${cordYClick + (j * dy)}`;
            $(pushCords).find('div').removeClass();
            $(pushCords).find('div').addClass(curPlayer);
          }
        }
        
        if(!($(cordsXY).find('div').hasClass(opponent)))
          break;
      }
    }
  }
}

const startGame = () => {
  document.getElementById(`${nSquares/2}${nSquares/2 + 1}`).innerHTML = divBlack;

  document.getElementById(`${nSquares/2 + 1}${nSquares/2}`).innerHTML = divBlack;

  document.getElementById(`${nSquares/2}${nSquares/2}`).innerHTML = divWhite;

  document.getElementById(`${nSquares/2 + 1}${nSquares/2 + 1}`).innerHTML = divWhite;

  curPlayer = 'black';
}
