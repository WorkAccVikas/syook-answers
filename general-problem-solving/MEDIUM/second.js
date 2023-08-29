// PROBLEM STATEMENT : Hide that PIN!

const SECRET_CODE = {
  1: "pop",
  10: "double rip",
  100: "hide your mints",
  1000: "fall",
};

const REMOVE_BINARY_VALUE = "10000";

const convertPin = (pin) => {
  const binaryPin = pin.toString(2);

  let length = binaryPin.toString().length;
  let temp = [];

  for (let i = length - 1, index = 0; i >= 0; i--, index++) {
    if (binaryPin[i] === "1") {
      let value = Math.pow(2, index);
      temp.push(value.toString(2));
    }
  }
  const reverse = temp.some((e) => e === REMOVE_BINARY_VALUE);

  const output = temp
    .filter((e) => e !== REMOVE_BINARY_VALUE)
    .map((element, i) => {
      console.log(element);
      if (SECRET_CODE[element]) {
        return SECRET_CODE[element];
      }
    });

  // Reverse the result if needed
  if (reverse) {
    output.reverse();
  }

  return output;
};

console.log(convertPin(3));
console.log(convertPin(19));
