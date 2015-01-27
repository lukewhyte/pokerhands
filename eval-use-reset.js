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
  this.hand = hand.sort(function (a, b) {
    return a.num - b.num;
  });

  this.handToString = this.hand[0].suit + this.hand[0].num + ', ';
  this.result = this.init();
};

Evaluate.prototype = {
  tempHash: {},
  isFlush: true,
  isStraight: true,

  best: {
    points: 0,
    activeCards: new Stack()
  },

  compareSuit: function compareSuit (firstSuit, currSuit) { // Used to disprove existence of flush
    return currSuit === firstSuit;
  },

  compareNumber: function compareNumber (lowNum, iter, currNum) { // Used to disprove existence of straight
    return currNum === iter + lowNum;
  },

  addCardToHash: function addCardToHash (curr) {
    if (this.tempHash[curr.num]) {
      this.tempHash[curr.num] += 1;
    } else {
      this.tempHash[curr.num] = 1;
    }
    return this.tempHash;
  },

  foundFullHouse: function foundFullHouse (curr) {
    var top = this.best.activeCards.peek();
    this.best.points = fullHouse;
    if (top.num !== curr.num) {
      this.best.activeCards.push(curr);
    }
    return this.best;
  },

  foundTwoPair: function foundTwoPair (curr) {
    this.best.points = twoPair;
    this.best.activeCards.push(curr);
    return this.best;
  },

  findHighCard: function findHighCard (curr) {
    var top = this.best.activeCards.peek();
    if (curr.num > top.num) {
      this.best.activeCards.push(curr);
    }
    return this.best;
  },

  checkForStraightAndFlush: function checkForStraightAndFlush () {
    if (this.isFlush && this.isStraight) {
      this.best.points = straightFlush;
    } else if (this.isFlush && this.best.points < flush) {
      this.best.points = flush;
    } else if (this.isStraight && this.best.points < straight) {
      this.best.points = straight;
    }
  },

  findMostOfKind: function findMostOfKind (curr) {
    if (this.tempHash[curr.num] > this.best.points) { // If we've found there to be more of one kind than after examining prev card
      
      if (this.best.points === twoPair) { // if we had twoPair previously, we now have full house
        return this.foundFullHouse(curr);
      } else { // this means we've drawn first card or found 2, 3 or 4 of a kind
        this.best.points = this.tempHash[curr.num];
        this.best.activeCards.push(curr);
      }

    } else if (this.tempHash[curr.num] === this.best.points) { // this means we've either got twoPair or two high cards to compare
      
      if (this.best.points === twoOfKind) { // we can be sure this is a twoPair situation now
        this.foundTwoPair(curr);
      } else {
        this.findHighCard(curr);
      }

    } else if (this.best.points === threeOfKind && this.tempHash[curr.num] >= twoOfKind) {
      // it's also possible the user drew three of a kind then two of a kind, making this a full house
      return this.foundFullHouse(curr);
    }
  },

  reset: function () {
    this.tempHash = {};
    this.isFlush = true;
    this.isStraight = true;
    this.best.points = 0;
    this.best.activeCards.clear();
  },

  init: function init () {
    var result = '';

    this.addCardToHash(this.hand[0]);
    this.findMostOfKind(this.hand[0]);

    for (var i = 1; i < 5; i++) {
      this.addCardToHash(this.hand[i]);

      if (this.isFlush) {
        this.isFlush = this.compareSuit(this.hand[0].suit, this.hand[i].suit);
      }

      if (this.isStraight) {
        this.isStraight = this.compareNumber(this.hand[0].num, i, this.hand[i].num);
      }

      this.findMostOfKind(this.hand[i]);
      this.handToString += this.hand[i].suit + this.hand[i].num + ', ';
    }

    this.checkForStraightAndFlush();
    this.handToString = this.handToString.slice(0, -2);

    result = getResult(this.best);
    this.reset();
    return result;
  }
};

module.exports = Evaluate;