var deck = require('./deck.js'),
  shuffle = require('./shuffle.js'),
  Evaluate = require('./evaluate'),
  $ = require('jquery');

var $loading = $('div.loading'),
  i = 0;

var dealHands = function dealHands () {
  var toDom = '',
    hand, j = 0;

  while (j < 10000) {
    shuffle(deck);
    hand = new Evaluate(deck.slice(0,5));
    toDom += '<li>' + hand.handToString + ': ' + hand.result + '</li>';
    j++;
  }

  return toDom;
};

$(function () {
  var $list = $('ol.list'),
    $loading = $('div.loading'),
    output = '',
    load = setInterval(function () {
      if (i < 100) {
        output += dealHands();
        $loading.html(++i + '%');
      } else {
        $loading.hide();
        $list.append(output).show();
      }
    }, 1);
    
})