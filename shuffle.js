function shuffle (arr) {
  var temp = 0,
    j = 0,
    i = arr.length;

  while (--i) {
    j = ~~(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

module.exports = shuffle;