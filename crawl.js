const chrome = require("selenium-webdriver/chrome");
const { Builder, By } = require("selenium-webdriver");
const localStorageData = require("./ls");
const cookies = require("./cookies");

let driver;

const connectToSite = async () => {
  console.log("Begin connecting.");
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().addArguments("--headless"))
    .build();

  try {
    console.log("Requesting first time.");
    await driver.get("http://surviv.io/#1111");

    console.log("Gotten first time!");
    for (let object of cookies) {
      const { name, value, domain } = object;
      await driver.manage().addCookie({ name, value, domain });
    }

    console.log("Done adding cookies.");

    for (let key of Object.keys(localStorageData)) {
      await driver.executeScript(
        "localStorage.setItem(arguments[0],arguments[1])",
        key,
        localStorageData[key]
      );
    }

    console.log("Done adding localStorage data.");
    console.log("Requesting second time for authentication.");

    await driver.get("http://surviv.io/#1111");

    console.log("Gotten second time.");
  } catch (err) {
    throw Error(error);
  }
};

const getLink = async () => {
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
  console.log("Done with links.");

  const createTeamButton = await driver.findElement(By.id("btn-create-team"));
  await createTeamButton.click();

  await driver.sleep(1000);

  const url = await driver.getCurrentUrl();

  await driver.quit();

  console.log("Restarting connection to site.");
  connectToSite();

  console.log("Link sent.");
  return url;
};

module.exports = { connectToSite, getLink };
