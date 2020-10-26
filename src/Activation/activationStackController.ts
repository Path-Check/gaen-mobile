import { Platform } from "react-native"

import { ActivationStackScreens, ActivationStackScreen } from "../navigation"

type SystemServicesArguments = {
  isLocationRequiredAndOff: boolean
  isBluetoothOn: boolean
}

export const nextScreenFromBluetooth = ({
  isLocationRequiredAndOff,
}: Pick<
  SystemServicesArguments,
  "isLocationRequiredAndOff"
>): ActivationStackScreen => {
  if (Platform.OS === "ios") {
    return ActivationStackScreens.NotificationPermissions
  } else {
    return isLocationRequiredAndOff
      ? ActivationStackScreens.ActivateLocation
      : ActivationStackScreens.AnonymizedDataConsent
  }
}

export const nextScreenFromExposureNotifications = ({
  isBluetoothOn,
  isLocationRequiredAndOff,
}: SystemServicesArguments): ActivationStackScreen => {
  if (isBluetoothOn) {
    return nextScreenFromBluetooth({ isLocationRequiredAndOff })
  } else {
    return ActivationStackScreens.ActivateBluetooth
  }
}
