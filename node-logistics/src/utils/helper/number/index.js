function getRandomNumberInRange(end, start = 0) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

module.exports = { getRandomNumberInRange };
