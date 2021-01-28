require("chromedriver");
const { Builder, By } = require("selenium-webdriver");
const childProcess = require("child_process");
const chromedriver = require("chromedriver");
const binPath = chromedriver.path;
const localStorageData = require("./ls");
const cookies = require("./cookies");

let driver;

// Begin chromedriver executable
const beginChromeDriver = () => {
  console.log("Beginning chromedriver!");
  childProcess.execFile(binPath, [], function (err, stdout, stderr) {
    if (err || stderr) console.log(err, stderr);
  });
};

const connectToSite = async () => {
  console.log("begin method");
  driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Requesting first time!");
    await driver.get("http://surviv.io/#1111");

    console.log("Gotten first time!");
    for (let object of cookies) {
      const { name, value, domain } = object;
      await driver.manage().addCookie({ name, value, domain });
    }

    console.log("Done adding cookies!");

    for (let key of Object.keys(localStorageData)) {
      await driver.executeScript(
        "localStorage.setItem(arguments[0],arguments[1])",
        key,
        localStorageData[key]
      );
    }

    console.log("Done adding localStorage data, requesting second time!");

    await driver.get("http://surviv.io/#1111");

    console.log("Gotten second time! You should be authenticated now!");
  } catch (err) {
    throw Error(error);
  }
};

const getLink = async () => {
  let randomElement = await driver.findElement(By.css("div"));
  await driver.executeScript("arguments[0].click();", randomElement);
  randomElement = await driver.findElement(By.css("div"));
  await driver.executeScript("arguments[0].click();", randomElement);
  randomElement = await driver.findElement(By.css("div"));
  await driver.executeScript("arguments[0].click();", randomElement);
  console.log("on the website");

  // Click through all promotional modals
  let visibleModals = await driver.findElements(
    By.xpath(
      `//div[contains(@class, 'modal') and contains(@style, 'display: block')]`
    )
  );
  while (visibleModals.length > 0) {
    console.log("Open modal found!");
    try {
      const link = await visibleModals[0].findElement(By.css(".close"));

      await driver.executeScript("arguments[0].click();", link);
      await driver.sleep(10000);

      console.log("Link Clicked!");

      visibleModals = await driver.findElements(
        By.xpath(
          `//div[contains(@class, 'modal') and contains(@style, 'display: block')]`
        )
      );
    } catch (error) {
      break;
    }
  }
  console.log("Done with links");

  const createTeamButton = await driver.findElement(By.id("btn-create-team"));
  console.log("create team button: ", createTeamButton);
  await createTeamButton.click();

  await driver.sleep(1000);

  const url = await driver.getCurrentUrl();

  await driver.quit();

  connectToSite();
  return url;
};

module.exports = { connectToSite, beginChromeDriver, getLink };
