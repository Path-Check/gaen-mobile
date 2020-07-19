/* eslint-disable */
const screenshotText = "Share Diagnosis"

class ShareDiagnosis {
  async tapButton() {
    await element(by.label("Next")).atIndex(0).tap()
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText)
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.text(languageStrings.label.launch_screen4_header_bluetooth)),
    ).toBeVisible()
  }
}

export default new ShareDiagnosis()
