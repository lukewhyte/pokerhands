function buildDeck () {
  var deck = [],
    deckLen = 0,
    suits = ['H', 'S', 'D', 'C'],
    i = 0;

  while (i < 4) { // 4 === suits.length
    var j = 2;
    for (; j < 15; j++) {
      deck[deckLen++] = {
        suit: suits[i],
        num: j
      };
    }
    i++;
  }
  return deck;
}

module.exports = buildDeck();