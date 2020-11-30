import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from "react-native"

// Native Events
export const subscribeToBluetoothStatusEvents = (
  cb: (enabled: boolean) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  )
  return ExposureEvents.addListener(
    "onBluetoothStatusUpdated",
    (enabled: boolean) => {
      cb(enabled)
    },
  )
}
export const subscribeToLocationStatusEvents = (
  cb: (enabled: boolean) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  )
  return ExposureEvents.addListener(
    "onLocationStatusUpdated",
    (enabled: boolean) => {
      cb(enabled)
    },
  )
}

// Utils Module
const utilsModule = NativeModules.UtilsModule

export const openAppSettings = (): void => {
  utilsModule.openAppSettings()
}

// Device Info Module
const deviceInfoModule = NativeModules.DeviceInfoModule

export const getApplicationName = async (): Promise<string> => {
  return deviceInfoModule.getApplicationName()
}

export const getBuildNumber = async (): Promise<string> => {
  return deviceInfoModule.getBuildNumber()
}

export const getVersion = async (): Promise<string> => {
  return deviceInfoModule.getVersion()
}

export const doesDeviceSupportLocationlessScanning = async (): Promise<
  boolean
> => {
  return deviceInfoModule.deviceSupportsLocationlessScanning()
}

export const isLocationEnabled = async (): Promise<boolean> => {
  return deviceInfoModule.isLocationEnabled()
}
