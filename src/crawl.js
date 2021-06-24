const chrome = require("selenium-webdriver/chrome");
const childProcess = require("child_process");
const { until, Builder, By } = require("selenium-webdriver");
const localStorageData = require("../auth/ls");
const cookies = require("../auth/cookies");

let binPath;
try {
  const chromedriver = require("chromedriver");
  binPath = chromedriver.path;
} catch (err) {
  console.log(
    "This operating system doesn't support chromedriver.\n" +
      "Using custom-installed linux package."
  );
}

let driver;

const spinOffChromeDriverInstance = async () => {
  try {
    childProcess.execSync("killall chromedriver");
  } catch {
    // There were no processes, no worries
  }
  childProcess.execFile(binPath, [], (err, stdout, stderr) => {
    if (err || stderr) {
      console.log("Chromedriver error: ", err, stderr);
      throw err;
    }
  });
};

const connectToSite = async (isFirstTime = true) => {
  console.log("Begin connecting to website.");

  if (process.platform === "linux") {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().addArguments("--headless"))
      .build();
  } else {
    if (isFirstTime) spinOffChromeDriverInstance();
    driver = await new Builder().forBrowser("chrome").build();
  }

  try {
    console.log("Creating first request to website.");
    await driver.get("http://surviv.io/#1111");

    console.log("Gotten first response.");
    for (const object of cookies) {
      const { name, value, domain } = object;
      await driver.manage().addCookie({ name, value, domain });
    }

    console.log("Done adding cookies.");

    for (const key of Object.keys(localStorageData)) {
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
    console.log("Done connecting. Ready for user-input.");
  } catch (error) {
    console.log("Error while getting website!");
    throw error;
  }
};

const getOpenModals = async () => {
  return await driver.findElements(
    By.xpath(
      "//div[contains(@class, 'modal') and contains(@style, 'display: block')]"
    )
  );
};

const closeAllModals = async () => {
  // Click through all promotional modals
  let visibleModals;
  visibleModals = await getOpenModals();

  while (visibleModals.length > 0) {
    console.log("Open modals found: ", visibleModals.length);
    try {
      const link = await visibleModals.pop().findElement(By.css(".close"));

      await driver.executeScript("arguments[0].click();", link);
      await driver.sleep(3000);

      console.log("Modal closed.");

      visibleModals = await getOpenModals();
    } catch (error) {
      console.log("Error while closing modals!");
      throw error;
    }
  }

  console.log("All modals closed.");
};

const createTeam = async () => {
  try {
    // Assume that the bot is at the homepage
    const createTeamButton = await driver.findElement(By.id("btn-create-team"));
    await createTeamButton.click();

    console.log("Team created.");
  } catch (error) {
    console.log("Error in creating team!");
    throw error;
  }
};

const leaveTeam = async () => {
  try {
    // Assume that the bot is already sitting in a created team
    const leaveTeamButton = await driver.findElement(By.id("btn-team-leave"));

    await driver.wait(await until.elementIsEnabled(leaveTeamButton), 15000);
    await driver.executeScript("arguments[0].click();", leaveTeamButton);

    console.log("Team left.");
  } catch (error) {
    console.log("Error in leaving team!");
    throw error;
  }
};

const getLink = async () => {
  try {
    await driver.sleep(2000);
    const url = await driver.getCurrentUrl();

    return url.toString();
  } catch (error) {
    console.log("Error in getting link!");
    throw error;
  }
};

const refreshSite = async () => {
  try {
    await driver.quit();
    await connectToSite(false);
    console.log("Done refreshing!");
  } catch (error) {
    console.log("Error refreshing site!");
    throw error;
  }
};

const handleUserInput = async () => {
  try {
    await createTeam();
    const link = await getLink();
    await leaveTeam();

    return link;
  } catch (error) {
    console.log("User input error reached!");
    throw error;
  }
};

const getOtherMode = async () => {
  // Assumes that the starting point is at the main menu
  console.log("Getting other mode.");
  try {
    const modeButton = await driver.findElement(By.id("btn-change-mode"));
    await modeButton.click();

    const secondOption = await driver.findElement(By.id("1"));
    const modeText = await secondOption.getText();

    await secondOption.click();

    const typeText = await driver
      .findElement(By.id("index-play-type-selected"))
      .getText();

    return modeText.toUpperCase() + " " + typeText.toUpperCase();
  } catch (error) {
    console.log("Error getting other mode!");
    throw error;
  }
};

module.exports = { getOtherMode, connectToSite, handleUserInput, refreshSite };
