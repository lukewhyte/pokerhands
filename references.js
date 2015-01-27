var cardNames = {
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Jack',
  12: 'Queen',
  13: 'King',
  14: 'Ace',
  'H': 'Hearts',
  'D': 'Diamonds',
  'C': 'Clubs',
  'S': 'Spades' 
};

var handResponses = function handResponses (points, activeCards) {
  var topCard = activeCards.pop(),
    secondCard = activeCards.pop() || topCard,
    possResponses = {
      1: cardNames[topCard.num] + ' high',
      2: points + ' ' + cardNames[topCard.num],
      3: points + ' ' + cardNames[topCard.num],
      4: points + ' ' + cardNames[topCard.num],
      5: 'Two Pair: ' + cardNames[topCard.num] + ' ' + cardNames[secondCard.num],
      6: 'Straight: ' + cardNames[topCard.num] + ' high',
      7: 'Flush: ' + cardNames[topCard.suit],
      8: 'Full House: 3 ' + cardNames[topCard.num] + ' and 2 ' + cardNames[secondCard.num],
      9: 'Straight Flush: ' + cardNames[topCard.suit] + ', ' + cardNames[topCard.num] + ' high'
    };

  return possResponses[points];
};

module.exports = handResponses;