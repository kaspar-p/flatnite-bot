const fs = require("fs");
const path = require("path");
const crawler = require("../crawl");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const analyze = async () => {
  const base = process.env.PWD;

  const linkPath = path.join(base, "analysis/data/links.txt");

  await crawler.connectToSite();
  await sleep(5000);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const link = await crawler.handleUserInput();

    if (link === "https://surviv.io/") continue;

    const code = link.toString().split("#")[1];

    // Add link to database
    fs.appendFileSync(linkPath, code + "\n", { encoding: "utf-8" });
  }
};

module.exports = { analyze };
