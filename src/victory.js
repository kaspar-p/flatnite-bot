const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const {
  classInvariants,
  inverseClassInvariants,
  PRIMES,
  CLASSES,
} = require("./constants");

const filepath = (numPlayers) =>
  path.resolve(__dirname, `../data/victory-data/${numPlayers}.txt`);

const maximumCombinations = (numPlayers) => {
  const factorial = (n) => {
    if (n === 1) return 1n;
    return BigInt(n) * factorial(n - 1);
  };

  // Choose with repetition
  return (
    factorial(numPlayers + CLASSES.length - 1) /
    (factorial(numPlayers) * factorial(CLASSES.length - 1))
  );
};

/**
 * Using the fundamental theorem of arithmetic, each combination is saved as a prime factorization.
 * This function returns the combination that is associated with @param invariant
 * @param {BigInt} invariant
 * @returns {Array<String>[6]}
 */
const invariantToCombination = (invariant) => {
  const combination = [];
  let number = invariant;
  let index = 0;
  while (!PRIMES.includes(number)) {
    if (index > PRIMES.length) {
      throw new Error("Index out of bounds! On integer: ", invariant);
    }

    const prime = PRIMES[index];
    if (number % prime === 0n) {
      number = number / prime;
      combination.push(inverseClassInvariants[prime]);

      // Reset index for duplicate primes in factorization
      index = 0;
    } else {
      // Check new prime if this one failed
      index++;
    }
  }

  // Guaranteed PRIMES.includes(number) is true due to while loop condition
  combination.push(inverseClassInvariants[number]);
  combination.sort();

  return combination;
};

/**
 * Calculates the composite number invariant for this combination
 * @param {Array<String>[6]} combination
 * @returns {BigInt}
 */
const combinationToInvariant = (combination) => {
  let total = 1n;
  for (const c of combination) {
    total *= classInvariants[c];
  }

  return total;
};

/**
 * Computes all possible combinations for a number of players
 * @param {Number} numPlayers
 * @returns {Set<BigInt>} A set of invariants for all combinations
 */
const createAllCombinations = (numPlayers) => {
  const combos = new Set();

  if (numPlayers === 1) {
    for (const prime of PRIMES) combos.add(prime);
  } else {
    const invariants = createAllCombinations(numPlayers - 1);

    // Add new combinations to combos
    invariants.forEach((invariant) => {
      PRIMES.forEach((prime) => {
        const newInvariant = invariant * prime;

        if (!combos.has(newInvariant)) combos.add(newInvariant);
      });
    });
  }

  return combos;
};

/**
 * Get the combinations that are saved in data currently
 * @param {number} numPlayers
 * @returns {[Set<number>, String]}
 */
const getExistingCombinations = (numPlayers) => {
  let rawData;
  try {
    rawData = fs.readFileSync(filepath(numPlayers), {
      encoding: "utf-8",
    });
  } catch (error) {
    console.log("error: ", error);
    fs.writeFileSync(filepath(numPlayers), "");
    rawData = "";
  }

  let alreadyCompleted = new Set(
    rawData
      .trim()
      .split("\n")
      .map((row) => BigInt(row.trim()))
  );

  const d = [...alreadyCompleted];
  if (d.length === 1 && d[0].length === 1 && !d[0][0]) {
    alreadyCompleted = new Set();
  }

  let message;
  const maxCombos = maximumCombinations(numPlayers);
  if (alreadyCompleted.size === maxCombos) {
    message = `All ${maxCombos} combinations completed!`;
  } else {
    message = `You have completed ${alreadyCompleted.size}/${maxCombos} combinations!`;
  }

  return [alreadyCompleted, message];
};

/**
 * Write a single line into data
 * @param {BigInt} invariant
 */
const writeLine = (invariant) => {
  fs.appendFileSync(
    filepath(invariantToCombination(invariant).length),
    invariant + "\n",
    {
      encoding: "utf-8",
    }
  );
};

/**
 * Computes the difference between all combinations and existing combinations
 * @param {number} numPlayers
 * @param {Set<number>} existingCombinations
 * @returns {Array}
 */
const createViableCombinations = (numPlayers, existingCombinations) => {
  const allCombinations = createAllCombinations(numPlayers);

  const difference = new Set(
    [...allCombinations].filter((x) => !existingCombinations.has(x))
  );

  return Array.from(difference);
};

/**
 * Creates a random combination of length @param numPlayers
 * @param {number} numPlayers
 * @returns
 */
const createCombination = (numPlayers) => {
  const [existingCombinations, message] = getExistingCombinations(numPlayers);

  const viable = createViableCombinations(numPlayers, existingCombinations);

  const choice = viable[Math.floor(Math.random() * viable.length)];
  console.log(choice);
  const combination = _.shuffle(invariantToCombination(choice));
  console.log(combination);
  return [combination, message];
};

/**
 * Write a combination into data
 * @param {Array<string>[6]} combination
 * @returns {Error?}
 */
const writeCombination = (combination) => {
  const [existingCombinations] = getExistingCombinations(combination.length);
  const invariant = combinationToInvariant(combination);

  let error;
  if (existingCombinations.has(invariant)) {
    error =
      "The combination was already in the datastore. Try something new, nub.";
  } else {
    writeLine(invariant);
  }

  return error;
};

module.exports = {
  writeCombination,
  createCombination,
  getExistingCombinations,
  combinationToInvariant,
};
