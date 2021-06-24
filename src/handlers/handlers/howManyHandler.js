const fs = require("fs");
const path = require("path");

const { sendMessage } = require("../../message");

const howManyHandler = async (client) => {
  const linksPath = path.join(__dirname, "../../analysis/data/links.txt");

  const linksData = fs.readFileSync(linksPath, {
    encoding: "utf-8",
  });

  const links = linksData
    .trim()
    .split("\n")
    .map((row) => row.trim());

  const specificNumberLinks = (n) =>
    links.filter((link) => link.length === n).length;
  const toPercentage = (n) => ((n / links.length) * 100).toFixed(4);

  const numZero = specificNumberLinks(0);
  const zeroPercentage = toPercentage(numZero);

  const numOne = specificNumberLinks(1);
  const onePercentage = toPercentage(numOne);

  const numTwo = specificNumberLinks(2);
  const twoPercentage = toPercentage(numTwo);

  const numThree = specificNumberLinks(3);
  const threePercentage = toPercentage(numThree);

  const numFour = specificNumberLinks(4);
  const fourPercentage = toPercentage(numFour);

  sendMessage(
    client,
    `Links of length 0  :::  ${numZero} / ${links.length} = ${zeroPercentage}\n` +
      `Links of length 1  :::  ${numOne} / ${links.length} = ${onePercentage}\n` +
      `Links of length 2  :::  ${numTwo} / ${links.length} = ${twoPercentage}\n` +
      `Links of length 3  :::  ${numThree} / ${links.length} = ${threePercentage}\n` +
      `Links of length 4  :::  ${numFour} / ${links.length} = ${fourPercentage}`
  );
};

module.exports = howManyHandler;
