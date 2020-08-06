/* eslint-disable */
const screenshotText = "EULA Accept Page"

class SignEula {
  async tapButton(languageStrings) {
    await element(by.label(languageStrings.common.continue)).tap()
  }

  async sign(languageStrings) {
    await element(
      by.text(languageStrings.onboarding.eula_agree_terms_of_use),
    ).tap()
  }

  async takeScreenshot() {
    await device.takeScreenshot(screenshotText)
  }
}

export default new SignEula()
