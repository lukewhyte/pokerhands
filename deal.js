var deck = require('./deck.js'),
  shuffle = require('./shuffle.js'),
  Evaluate = require('./evaluate'),
  $ = require('jquery');

var dealHands = function dealHands ($loading) {
  var toDom = '',
    hand, i = 0, j = 0;

  for (; i < 100; i++) {
    toDom = '';
    j = 0;

    while (j < 10000) {
      shuffle(deck);
      hand = new Evaluate(deck.slice(0,5));
      toDom += '<li>' + hand.handToString + ': ' + hand.result + '</li>';
      j++;
    }

    $loading.html((i + 1) + '%');
  }
};

$(function () {
  var $list = $('ol.list'),
    $loading = $('div.loading'),
    output = dealHands($loading);

  $loading.hide();
  $list.append(output).show();
})