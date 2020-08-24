import { getAnalyticsConsent, setAnalyticsConsent } from "./storage"
import AsyncStorage from "@react-native-community/async-storage"

describe("getAnalyticsConsent", () => {
  describe("when the consent status is null", () => {
    it("returns false", async () => {
      expect.assertions(1)
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValue(null)

      expect(await getAnalyticsConsent()).toEqual(false)
    })
  })

  describe("when the user has opted out of analytics", () => {
    it("returns false", async () => {
      expect.assertions(1)
      jest
        .spyOn(AsyncStorage, "getItem")
        .mockResolvedValue("USER_NOT_CONSENTED")

      expect(await getAnalyticsConsent()).toEqual(false)
    })
  })

  describe("when the user has consented to analytics", () => {
    it("returns true", async () => {
      expect.assertions(1)
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValue("USER_CONSENTED")

      expect(await getAnalyticsConsent()).toEqual(true)
    })
  })

  describe("when there is corrupted data in storage", () => {
    it("defaults to false", async () => {
      expect.assertions(1)
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValue("BAD_DATA_AHH")

      expect(await getAnalyticsConsent()).toEqual(false)
    })
  })
})

describe("setAnalyticsConsent", () => {
  describe("when a user denies consent", () => {
    it("sets consent status to USER_NOT_CONSENTED", async () => {
      expect.assertions(1)
      const setItemSpy = jest.spyOn(AsyncStorage, "setItem")

      await setAnalyticsConsent(false)
      expect(setItemSpy).toHaveBeenCalledWith(
        "ANALYTICS_CONSENT",
        "USER_NOT_CONSENTED",
      )
    })
  })

  describe("when a user gives consent", () => {
    it("sets consent status to USER_CONSENTED", async () => {
      expect.assertions(1)

      const setItemSpy = jest.spyOn(AsyncStorage, "setItem")

      await setAnalyticsConsent(true)
      expect(setItemSpy).toHaveBeenCalledWith(
        "ANALYTICS_CONSENT",
        "USER_CONSENTED",
      )
    })
  })
})
