import { ActivationStackScreens } from "../navigation"
import {
  nextScreenFromExposureNotifications,
  nextScreenFromBluetooth,
} from "./activationStackController"

describe("nextScreenFromExposureNotifications", () => {
  describe("when the platform is iOS", () => {
    beforeEach(() => {
      jest.mock("react-native/Libraries/Utilities/Platform", () => {
        return {
          OS: "ios",
        }
      })
    })

    afterEach(() => {
      jest.resetModules()
    })

    describe("when the bluetooth is off", () => {
      it("returns the bluetooth screen", () => {
        expect(
          nextScreenFromExposureNotifications({
            isLocationRequiredAndOff: true,
            isBluetoothOn: false,
          }),
        ).toEqual(ActivationStackScreens.ActivateBluetooth)
      })
    })

    describe("when the bluetooth is on", () => {
      it("returns the notifications screen", () => {
        expect(
          nextScreenFromExposureNotifications({
            isLocationRequiredAndOff: true,
            isBluetoothOn: true,
          }),
        ).toEqual(ActivationStackScreens.NotificationPermissions)
      })
    })
  })

  describe("when the platform is android", () => {
    beforeEach(() => {
      jest.mock("react-native/Libraries/Utilities/Platform", () => {
        return {
          OS: "android",
        }
      })
    })

    afterEach(() => {
      jest.resetModules()
    })

    describe("when the bluetooth is off", () => {
      it("returns the bluetooth screen", () => {
        expect(
          nextScreenFromExposureNotifications({
            isLocationRequiredAndOff: true,
            isBluetoothOn: false,
          }),
        ).toEqual(ActivationStackScreens.ActivateBluetooth)
      })
    })

    describe("when the bluetooth is on", () => {
      describe("when the location is required and off", () => {
        it("returns the activate location screen", () => {
          expect(
            nextScreenFromExposureNotifications({
              isLocationRequiredAndOff: true,
              isBluetoothOn: true,
            }),
          ).toEqual(ActivationStackScreens.ActivateLocation)
        })
      })

      describe("when location is not required or on", () => {
        it("returns the anonymized data consent screen", () => {
          expect(
            nextScreenFromExposureNotifications({
              isLocationRequiredAndOff: false,
              isBluetoothOn: true,
            }),
          ).toEqual(ActivationStackScreens.AnonymizedDataConsent)
        })
      })
    })
  })
})

describe("nextScreenFromBluetooth", () => {
  describe("when the platform is iOS", () => {
    beforeEach(() => {
      jest.mock("react-native/Libraries/Utilities/Platform", () => {
        return {
          OS: "ios",
        }
      })
    })

    afterEach(() => {
      jest.resetModules()
    })

    it("returns the notifications screen", () => {
      expect(
        nextScreenFromBluetooth({
          isLocationRequiredAndOff: true,
        }),
      ).toEqual(ActivationStackScreens.NotificationPermissions)
    })
  })

  describe("when the platform is android", () => {
    beforeEach(() => {
      jest.mock("react-native/Libraries/Utilities/Platform", () => {
        return {
          OS: "android",
        }
      })
    })

    afterEach(() => {
      jest.resetModules()
    })

    describe("when the location is required and off", () => {
      it("returns the activate location screen", () => {
        expect(
          nextScreenFromBluetooth({
            isLocationRequiredAndOff: true,
          }),
        ).toEqual(ActivationStackScreens.ActivateLocation)
      })
    })

    describe("when location is not required or on", () => {
      it("returns the anonymized data consent screen", () => {
        expect(
          nextScreenFromBluetooth({
            isLocationRequiredAndOff: false,
          }),
        ).toEqual(ActivationStackScreens.AnonymizedDataConsent)
      })
    })
  })
})
