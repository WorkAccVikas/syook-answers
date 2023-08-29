function isEmptyString(str) {
  return typeof str === "string" && str.length === 0;
}

function isValidOrderNumber(str) {
  const PATTERN = /^\d+$/;
  return PATTERN.test(str);
}

module.exports = {
  isEmptyString,
  isValidOrderNumber,
};
