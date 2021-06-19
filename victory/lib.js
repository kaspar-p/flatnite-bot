const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { CLASSES } = require("../constants/constants");

const filepathMap = new Map();
filepathMap.set(2, path.resolve("./", "victory/", "data/", "kaspar-evan.txt"));
filepathMap.set(3, path.resolve("./", "victory/", "data/", "all-three.txt"));

const maximumCombinations = (numPlayers) => {
  const factorial = (n) => {
    if (n === 1) return 1;
    return n * factorial(n - 1);
  };

  // Choose with repetition
  return factorial(numPlayers + 6 - 1) / (factorial(numPlayers) * factorial(5));
};

/**
 * Returns an array of all possible permutations of @param list
 * @param {Array} list classes to permute
 * @returns {Array} A list of lists, with each sublist being a permutation of @param list
 */
const permute = (list) => {
  if (list.length === 1) {
    return [[list[0]]];
  } else {
    const allPermutations = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const withoutItem = list.slice(0, i);
      withoutItem.push(...list.slice(i + 1));

      // Get the permutation of the rest of obj without sub and prepend sub
      const permutations = permute(withoutItem);
      const prepended = permutations.map((perm) => [item, ...perm]);
      allPermutations.push(...prepended);
    }

    return allPermutations;
  }
};

/**
 * Determines whether an array of strings (a combination) is in a set of combinations
 * @param {Set} set
 * @param {Array} combination
 * @returns
 */
const isIn = (set, combination) => {
  let found = false;
  set.forEach((elem) => {
    if (_.isEqual(elem, combination)) {
      found = true;
    }
  });

  return found;
};

/**
 * Computes all possible combinations for a number of players
 * @param {Number} numPlayers
 * @returns
 */
const createAllCombinations = (numPlayers) => {
  const combos = new Set();
  if (numPlayers === 1) {
    for (const c of CLASSES) combos.add([c]);
  } else {
    const combosBelow = createAllCombinations(numPlayers - 1);

    // Add new combinations to combos
    combosBelow.forEach((combo) => {
      CLASSES.forEach((c) => {
        const newCombo = [...combo, c];

        const permutations = permute(newCombo);
        let foundIn = false;
        permutations.forEach((perm) => {
          if (isIn(combos, perm)) foundIn = true;
        });

        if (!foundIn) combos.add(newCombo);
      });
    });
  }

  return combos;
};

const getExistingCombinations = (numPlayers) => {
  const filepath = path.resolve("./victory/data/", `${numPlayers}.txt`);

  let rawData;
  try {
    rawData = fs.readFileSync(filepath, {
      encoding: "utf-8",
    });
  } catch (error) {
    console.log("error: ", error);
    fs.writeFileSync(filepath, "");
    rawData = "";
  }

  let data = new Set(
    rawData
      .trim()
      .split("\n")
      .map((row) =>
        row
          .trim()
          .split(",")
          .map((type) => type.trim())
      )
  );

  console.log(data);

  const d = [...data];
  if (d.length === 1 && d[0].length === 1 && !d[0][0]) data = new Set();

  let message;
  const maxCombos = maximumCombinations(numPlayers);
  if (data.length === maxCombos) {
    message = `All ${maxCombos} combinations completed!`;
  } else {
    message = `You have completed ${data.size}/${maxCombos} combinations!`;
  }

  const alreadyCompleted = new Set();

  // Add all combos and permutations of that combo to alreadyCompleted
  for (const row of data) {
    const permutations = permute(row);

    for (const perm of permutations) {
      if (!isIn(alreadyCompleted, perm)) alreadyCompleted.add(perm);
    }
  }

  return [alreadyCompleted, message];
};

const writeLine = (combination) => {
  fs.appendFileSync(
    path.resolve("./victory/data/", `${combination.length}.txt`),
    combination.join(",") + "\n",
    {
      encoding: "utf-8",
    }
  );
};

/**
 * Computes the intersection between all combinations and existing combinations
 * @param {Number} numPlayers
 * @param {Set} existingCombinations
 * @returns {Array}
 */
const createViableCombinations = (numPlayers, existingCombinations) => {
  const combinations = createAllCombinations(numPlayers);

  const viableCombinations = new Set();
  for (const combination of combinations) {
    if (
      !isIn(viableCombinations, combination) &&
      !isIn(existingCombinations, combination)
    ) {
      viableCombinations.add(combination);
    }
  }

  return Array.from(viableCombinations);
};

const createCombination = (numPlayers) => {
  const [existingCombinations, message] = getExistingCombinations(numPlayers);

  const viable = createViableCombinations(numPlayers, existingCombinations);

  const choice = viable[Math.floor(Math.random() * viable.length)];
  return [choice, message];
};

const writeCombination = (combination) => {
  const [existingCombinations] = getExistingCombinations(combination.length);

  let error;
  if (isIn(existingCombinations, combination)) {
    error =
      "The combination was already in the datastore. Try something new, nub.";
  } else {
    writeLine(combination);
  }

  return error;
};

module.exports = {
  writeCombination,
  createCombination,
  getExistingCombinations,
  isIn,
};
