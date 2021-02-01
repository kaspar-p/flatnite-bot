const chrome = require("selenium-webdriver/chrome");
const { Builder, By } = require("selenium-webdriver");
const localStorageData = require("./ls");
const cookies = require("./cookies");

let driver;

const connectToSite = async () => {
  console.log("Begin connecting to website.");
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().addArguments("--headless"))
    .build();

  try {
    console.log("Creating first request to website.");
    await driver.get("http://surviv.io/#1111");

    console.log("Gotten first response.");
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

    console.log("Gotten second response.");
    await closeAllModals();
  } catch (error) {
    console.log("Error reached: ", error);
    throw new Error(error);
  }
};

const closeAllModals = async () => {
  // Click through all promotional modals
  let visibleModals;
  try {
    visibleModals = await driver.findElements(
      By.xpath(
        `//div[contains(@class, 'modal') and contains(@style, 'display: block')]`
      )
    );
  } catch (error) {
    console.log("Error reached in finding modals to close: ", error);
    throw new Error(error);
  }

  while (visibleModals.length > 0) {
    console.log("Open modal found.");
    try {
      const link = await visibleModals[0].findElement(By.css(".close"));

      await driver.executeScript("arguments[0].click();", link);
      await driver.sleep(1000);

      console.log("Modal closed.");

      visibleModals = await driver.findElements(
        By.xpath(
          `//div[contains(@class, 'modal') and contains(@style, 'display: block')]`
        )
      );
    } catch (error) {
      console.log("Error encountered while closing modal: ", error);
      break;
    }
  }

  console.log("All modals closed.");
  return;
};

const createTeam = async () => {
  try {
    // Assume that the bot is at the homepage
    const createTeamButton = await driver.findElement(By.id("btn-create-team"));
    await createTeamButton.click();

    console.log("Team created.");
  } catch (error) {
    console.log("Error in creating team: ", error);
    throw new Error(error);
  }
};

const leaveTeam = async () => {
  try {
    // Assume that the bot is already sitting in a created team
    const leaveTeamButton = await driver.findElement(By.id("close-team-menu"));
    await leaveTeamButton.click();

    console.log("Team left.");
  } catch (error) {
    console.log("Error in leaving team: ", error);
    throw new Error(error);
  }
};

const getLink = async () => {
  try {
    const url = await driver.getCurrentUrl();
    return url;
  } catch (error) {
    console.log("Error in getting link: ", error);
    throw new Error(error);
  }
};

const handleUserInput = async () => {
  try {
    console.log("-- Begin handling user input --");

    await createTeam();
    const link = await getLink();
    await leaveTeam();

    console.log("-- Finished handling user input --");
    return link;
  } catch (error) {
    console.log("User input error reached: ", error);
    throw new Error(error);
  }
};

module.exports = { connectToSite, handleUserInput };
