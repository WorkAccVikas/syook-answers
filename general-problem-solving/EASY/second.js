// PROBLEM STATEMENT : Shorten me!

function encodeString(str) {
  if (!str) return "";

  let outputString;
  let output = [];
  let current = str[0];
  let count = 1;

  for (let i = 1; i < str.length; i++) {
    const element = str[i];
    if (element === current) {
      count++;
    } else {
      output.push(count > 1 ? count : "");
      output.push(current);
      current = element;
      count = 1;
    }
  }

  output.push(count > 1 ? count : "");
  output.push(current);
  outputString = output.join("");
  return outputString;
}

function decodedString(str) {
  let output = [];
  let outputString = "";
  let count = "";

  for (let i = 0; i < str.length; i++) {
    const element = str[i];

    // check check element is number or not
    if (!isNaN(parseInt(element))) {
      count += element;
    } else {
      if (count) {
        output.push(element.repeat(parseInt(count)));
        count = "";
      } else {
        output.push(element);
      }
    }
  }

  outputString = output.join("");
  return outputString;
}

console.log(encodeString("AAABBCDD"));
console.log(decodedString("3A2BC2D"));

console.log(encodeString("AAAAAAAAAAABWWWWWWWWWWWBB"));
console.log(decodedString("11AB11W2B"));
