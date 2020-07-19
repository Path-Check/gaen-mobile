/* eslint-disable */
const screenshotText = "Home"

class Home {
  async takeScreenshot() {
    await device.takeScreenshot(screenshotText)
  }

  async isOnScreen() {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(element(by.id("home-header"))).toBeVisible()
  }
}

export default new Home()
