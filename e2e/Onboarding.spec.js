describe("Onboarding", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: "YES" },
    })
  })

  it("User navigates through the onboarding flow", async () => {
    await expect(element(by.label("Welcome to "))).toBeVisible()
    await element(by.label("Get Started")).tap()

    await expect(
      element(by.label("Together, we can contain the spread of COVID-19")),
    ).toBeVisible()
    await element(by.label("How does it work?")).tap()

    await expect(
      element(
        by.label(
          "Your phone remembers other devices it meets, but won't identify you to anyone",
        ),
      ),
    ).toBeVisible()
    await element(by.label("Is my privacy protected?")).tap()

    await expect(
      element(
        by.label(
          "No personally identifiable information ever leaves your phone",
        ),
      ),
    ).toBeVisible()
    await element(by.label("What if I'm exposed?")).tap()

    await expect(
      element(
        by.label(
          "The app will notify you if you may have been exposed to the coronavirus",
        ),
      ),
    ).toBeVisible()
    await element(by.label("What if I get sick?")).tap()

    await expect(
      element(
        by.label(
          "With the app, you can help break the chain of infection and get help direct from health experts",
        ),
      ),
    ).toBeVisible()
    await element(by.label("Get started")).tap()

    await element(
      by.label("I agree that I have read and accepted the terms of use"),
    ).tap()
    await element(by.label("Continue")).tap()

    await element(by.label("Activate Proximity Tracing")).atIndex(1).tap()
    await element(by.label("Enable Notifications")).tap()
    await expect(
      element(by.label("Exposure Notifications Disabled")),
    ).toBeVisible()
  })

  afterAll(async () => {
    await device.uninstallApp()
    await device.installApp()
  })
})
