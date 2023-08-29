// PROBLEM STATEMENT : Am I Perfect?

function isPerfect(number) {
  if (number <= 0) return "Invalid";

  let sum = 0;
  let i = 0;

  while (i < number) {
    if (number % i === 0) {
      sum += i;
    }
    i++;
  }

  if (sum === number) {
    return "Perfect";
  } else if (sum > number) {
    return "Abundant";
  } else {
    return "Deficient";
  }
}

console.log(isPerfect(6));
console.log(isPerfect(12));
console.log(isPerfect(8));
