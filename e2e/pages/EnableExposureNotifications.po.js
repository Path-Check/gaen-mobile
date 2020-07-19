class EnableExposureNotifications {
  async tapButton(languageStrings) {
    await element(
      by.label(languageStrings.label.launch_enable_exposure_notif),
    ).tap()
  }

  async takeScreenshot() {
    await device.takeScreenshot("Enable Exposure Notifications Page")
  }

  async isOnScreen(languageStrings) {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.text(languageStrings.label.launch_exposure_notif_header)),
    ).toBeVisible()
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(
      element(by.text(languageStrings.label.launch_exposure_notif_subheader)),
    ).toBeVisible()
  }
}

export default new EnableExposureNotifications()
