import { languages } from "./helpers/language"
import EnableNotifications from "./pages/EnableNotifications.po.js"
import EnableExposureNotifications from "./pages/EnableExposureNotifications.po.js"
import Welcome from "./pages/Welcome.po.js"
import PersonalPrivacy from "./pages/PersonalPrivacy.po.js"
import NotificationDetails from "./pages/NotificationDetails.po.js"
import ShareDiagnosis from "./pages/ShareDiagnosis.po.js"
import SignEula from "./pages/SignEula.po.js"
import Home from "./pages/Home.po.js"

describe.each(languages)(
  `Onboarding test suite in %s`,
  (locale, languageStrings) => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        languageAndLocale: {
          language: locale,
          locale,
        },
        permissions: { notifications: "YES" },
      })
    })

    describe("Onboarding", () => {
      it("User navigates through the onboarding flow", async () => {
        await Welcome.isOnScreen(languageStrings)
        await Welcome.tapButton(languageStrings)

        await SignEula.sign(languageStrings)
        await SignEula.tapButton(languageStrings)

        await PersonalPrivacy.isOnScreen(languageStrings)
        await PersonalPrivacy.tapButton(languageStrings)

        await NotificationDetails.isOnScreen(languageStrings)
        await NotificationDetails.tapButton(languageStrings)

        await ShareDiagnosis.isOnScreen(languageStrings)
        await ShareDiagnosis.tapButton()

        await EnableNotifications.isOnScreen(languageStrings)
        await EnableNotifications.tapButton(languageStrings)

        await EnableExposureNotifications.isOnScreen(languageStrings)
        await EnableExposureNotifications.tapButton(languageStrings)

        await Home.isOnScreen()
      })

      afterAll(async () => {
        await device.uninstallApp()
        await device.installApp()
      })
    })
  },
)
