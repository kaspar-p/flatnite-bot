const fs = require("fs");
const { CLASSES } = require("../constants/constants");

const filepathMap = new Map();
filepathMap.set(2, "./data/kaspar-luke.txt");
filepathMap.set(3, "./data/all-three.txt");

const maximumCombinations = (n) => (n === 3 ? 56 : 15);
const splitKey = (n) => (n === 3 ? "," : " + ");

const makePermutations = (combination) => {
  const permutations = [];

  for (const c1 of combination) {
    for (const c2 of combination) {
      if (combination.length === 2) {
        permutations.push([c1, c2]);
      } else {
        for (const c3 of combination) {
          permutations.push([c1, c2, c3]);
        }
      }
    }
  }

  return permutations;
};

const getExistingCombinations = (numPlayers) => {
  const rawData = fs.readFileSync(filepathMap.get(numPlayers), {
    encoding: "utf-8",
  });

  const data = new Set(
    rawData
      .split("\n")
      .trim()
      .map((row) =>
        row
          .trim()
          .split(splitKey(numPlayers))
          .map((type) => type.trim())
      )
  );

  let message;
  if (data.length === maximumCombinations(numPlayers)) {
    message = "All 56 combinations completed!";
  } else {
    message = `You have completed ${data.size} combinations!`;
  }

  const alreadyCompleted = new Set();

  // Add all combos and permutations of that combo to alreadyCompleted
  for (const row of data) {
    const permutations = makePermutations(row);

    for (const perm of permutations) {
      alreadyCompleted.add(perm);
    }
  }

  return [alreadyCompleted, message];
};

const writeLine = (combination) => {
  const numPlayers = combination.length;

  const formattedCombination =
    numPlayers === 2 ? combination.join(" + ") : combination.join(",");

  fs.appendFileSync(filepathMap.get(numPlayers), formattedCombination, {
    encoding: "utf-8",
  });
};

const createCombination = (numPlayers) => {
  const [existingCombinations, message] = getExistingCombinations(numPlayers);

  const viableCombinations = new Set();
  for (const c1 of CLASSES) {
    for (const c2 of CLASSES) {
      for (const c3 of CLASSES) {
        const combination = [c1, c2, c3];

        if (
          !existingCombinations.has(combination) &&
          !viableCombinations.has(combination)
        ) {
          viableCombinations.add(combination);
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

  if (existingCombinations.includes(combination)) {
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
