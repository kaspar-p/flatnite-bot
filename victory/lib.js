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

const isIn = (set, combination) => {
  let found = false;
  set.forEach((elem) => {
    if (_.isEqual(elem, combination)) {
      found = true;
    }
  });

  return found;
};

const getExistingCombinations = (numPlayers) => {
  const rawData = fs.readFileSync(filepathMap.get(numPlayers), {
    encoding: "utf-8",
  });

  const data = new Set(
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
    filepathMap.get(combination.length),
    combination.join(",") + "\n",
    {
      encoding: "utf-8",
    }
  );
};

const createCombination = (numPlayers) => {
  const [existingCombinations, message] = getExistingCombinations(numPlayers);

  const viableCombinations = new Set();
  for (const c1 of CLASSES) {
    for (const c2 of CLASSES) {
      if (numPlayers === 2) {
        const combination = [c1, c2];

        if (
          !isIn(existingCombinations, combination) &&
          !isIn(viableCombinations, combination)
        ) {
          viableCombinations.add(combination);
        }
      } else if (numPlayers === 3) {
        for (const c3 of CLASSES) {
          const combination = [c1, c2, c3];

          if (
            !isIn(existingCombinations, combination) &&
            !isIn(viableCombinations, combination)
          ) {
            viableCombinations.add(combination);
          }
        }
      }
    }
  }

  const viableList = Array.from(viableCombinations);
  const choice = viableList[Math.floor(Math.random() * viableList.length)];
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
};
