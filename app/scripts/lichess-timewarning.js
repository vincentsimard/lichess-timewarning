'use strict';

var lichess = {};

lichess.el = document.querySelector('#lichess');
lichess.elTable = lichess.el.querySelector('.lichess_ground .table');
lichess.elBoard = lichess.el.querySelector('.lichess_board');
lichess.elPlayerClock = lichess.el.querySelector('.clock_bottom');

lichess.isGameOver = function() {
  return this.elTable.classList.contains('finished');
};

var makeAudio = function(file, volume) {
  var audio = new Audio(chrome.extension.getURL('ogg/' + file));
  audio.volume = volume;

  return audio;
};

var timeWarning = function() {
  var audio = makeAudio('Lowtime.wav', 1);
  audio.play();

  timeWarning = function() {};
};

var handleMutation = function(mutations) {
  var firstTarget = mutations[0].target;
  var classes = firstTarget.classList;

  var hasEmerg = classes.contains('emerg');
  var hasOutOfTime = classes.contains('outoftime');
  
  if (hasEmerg && !hasOutOfTime && !lichess.isGameOver()) {
    timeWarning();
  }
};

var init = function() {
  // @TODO: Only play sound for games being played (not spectating)
  if (!lichess.elPlayerClock) { return; }

  var emergObserver = new MutationObserver(handleMutation);
  var config = { attributeFilter: ['class'] };
  
  emergObserver.observe(lichess.elPlayerClock, config);
};

init();
