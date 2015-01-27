// Each possible hand is assigned a value on a linear scale from 
// 'high card' = 1 to 'straigh flush' = 9, 

var Stack = require('./stack.js');

var getResult = require('./references.js');

var oneOfKind = 1,
  twoOfKind = 2,
  threeOfKind = 3,
  fourOfKind = 4,
  twoPair = 5,
  straight = 6,
  flush = 7,
  fullHouse = 8,
  straightFlush = 9;

var Evaluate = function Evaluate (hand) {
  var handObj = {
    hand: hand.sort(function (a, b) {
      return a.num - b.num;
    }),

    tempHash: {},

    isFlush: true,
    isStraight: true,

    best: {
      points: 0,
      activeCards: new Stack()
    }
  };

  handObj.suit = handObj.hand[0].suit; // these props are used to sniff out straights and flushes
  handObj.lowNum = handObj.hand[0].num;

  this.handToString = handObj.hand[0].suit + handObj.hand[0].num + ', ';
  this.result = this.init(handObj);
};

Evaluate.prototype = {
  compareSuit: function compareSuit (firstSuit, currSuit) { // Used to disprove existence of flush
    return currSuit === firstSuit;
  },

  compareNumber: function compareNumber (lowNum, iter, currNum) { // Used to disprove existence of straight
    return currNum === iter + lowNum;
  },

  addCardToHash: function addCardToHash (handObj, curr) {
    if (handObj.tempHash[curr.num]) {
      handObj.tempHash[curr.num] += 1;
    } else {
      handObj.tempHash[curr.num] = 1;
    }
    return handObj.tempHash;
  },

  foundFullHouse: function foundFullHouse (handObj, curr) {
    var top = handObj.best.activeCards.peek();
    handObj.best.points = fullHouse;
    if (top.num !== curr.num) {
      handObj.best.activeCards.push(curr);
    }
    return handObj.best;
  },

  foundTwoPair: function foundTwoPair (handObj, curr) {
    handObj.best.points = twoPair;
    handObj.best.activeCards.push(curr);
    return handObj.best;
  },

  findHighCard: function findHighCard (handObj, curr) {
    var top = handObj.best.activeCards.peek();
    if (curr.num > top.num) {
      handObj.best.activeCards.push(curr);
    }
    return handObj.best;
  },

  checkForStraightAndFlush: function checkForStraightAndFlush (handObj) {
    if (handObj.isFlush && handObj.isStraight) {
      handObj.best.points = straightFlush;
    } else if (handObj.isFlush && handObj.best.points < flush) {
      handObj.best.points = flush;
    } else if (handObj.isStraight && handObj.best.points < straight) {
      handObj.best.points = straight;
    }
  },

  findMostOfKind: function findMostOfKind (handObj, curr) {
    if (handObj.tempHash[curr.num] > handObj.best.points) { // If we've found there to be more of one kind than after examining prev card
      
      if (handObj.best.points === twoPair) { // if we had twoPair previously, we now have full house
        return this.foundFullHouse(handObj, curr);
      } else { // this means we've drawn first card or found 2, 3 or 4 of a kind
        handObj.best.points = handObj.tempHash[curr.num];
        handObj.best.activeCards.push(curr);
      }

    } else if (handObj.tempHash[curr.num] === handObj.best.points) { // this means we've either got twoPair or two high cards to compare
      
      if (handObj.best.points === twoOfKind) { // we can be sure this is a twoPair situation now
        this.foundTwoPair(handObj, curr);
      } else {
        this.findHighCard(handObj, curr);
      }

    } else if (handObj.best.points === threeOfKind && handObj.tempHash[curr.num] >= twoOfKind) {
      // it's also possible the user drew three of a kind then two of a kind, making this a full house
      return this.foundFullHouse(handObj, curr);
    }
  },

  init: function init (handObj) {
    this.addCardToHash(handObj, handObj.hand[0]);
    this.findMostOfKind(handObj, handObj.hand[0]);

    for (var i = 1; i < 5; i++) {
      this.addCardToHash(handObj, handObj.hand[i]);

      if (handObj.isFlush) {
        handObj.isFlush = this.compareSuit(handObj.suit, handObj.hand[i].suit);
      }

      if (handObj.isStraight) {
        handObj.isStraight = this.compareNumber(handObj.lowNum, i, handObj.hand[i].num);
      }

      this.findMostOfKind(handObj, handObj.hand[i]);
      this.handToString += handObj.hand[i].suit + handObj.hand[i].num + ', ';
    }

    this.checkForStraightAndFlush(handObj);
    this.handToString = this.handToString.slice(0, -2);
    return getResult(handObj.best);
  }
};

module.exports = Evaluate;