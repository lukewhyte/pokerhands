var deck = require('./deck.js'),
  shuffle = require('./shuffle.js'),
  Evaluate = require('./evaluate'),
  $ = require('jquery');

var dealHands = function dealHands () {
  var toDom = '', hand, i = 0;

  while (i < 1000000) {
    shuffle(deck);
    hand = new Evaluate(deck.slice(0,5));
    toDom += '<li>' + hand.handToString + ': ' + hand.result + '</li>';
    i++;
  }

  return toDom;
};

$(function () {
  var $list = $('ul.list'),
    output = dealHands();
  $list.append(output);
})