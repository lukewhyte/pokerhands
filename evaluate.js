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
  this.points = 0;

  this.isFlush = true;
  this.isStraight = true;

  this.handToString = this.hand[0].suit + this.hand[0].num + ', ';
  this.result = this.init();
};

Evaluate.prototype = {
  tempHash: {},
  activeCards: new Stack(),

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
    var top = this.activeCards.peek();
    this.points = fullHouse;
    if (top.num !== curr.num) {
      this.activeCards.push(curr);
    }
  },

  foundTwoPair: function foundTwoPair (curr) {
    this.points = twoPair;
    this.activeCards.push(curr);
  },

  findHighCard: function findHighCard (curr) {
    var top = this.activeCards.peek();
    if (curr.num > top.num) {
      this.activeCards.push(curr);
    }
  },

  checkForStraightAndFlush: function checkForStraightAndFlush () {
    if (this.isFlush && this.isStraight) {
      this.points = straightFlush;
    } else if (this.isFlush && this.points < flush) {
      this.points = flush;
    } else if (this.isStraight && this.points < straight) {
      this.points = straight;
    }
  },

  findMostOfKind: function findMostOfKind (curr) {
    if (this.tempHash[curr.num] > this.points) { // If we've found there to be more of one kind than after examining prev card
      
      if (this.points === twoPair) { // if we had twoPair previously, we now have full house
        return this.foundFullHouse(curr);
      } else { // this means we've drawn first card or found 2, 3 or 4 of a kind
        this.points = this.tempHash[curr.num];
        this.activeCards.push(curr);
      }

    } else if (this.tempHash[curr.num] === this.points) { // this means we've either got twoPair or two high cards to compare
      
      if (this.points === twoOfKind) { // we can be sure this is a twoPair situation now
        this.foundTwoPair(curr);
      } else {
        this.findHighCard(curr);
      }

    } else if (this.points === threeOfKind && this.tempHash[curr.num] >= twoOfKind) {
      // it's also possible the user drew three of a kind then two of a kind, making this a full house
      return this.foundFullHouse(curr);
    }
  },

  init: function init () {
    var result = '';

    this.tempHash = {};

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

    return getResult(this.points, this.activeCards);
  }
};

module.exports = Evaluate;