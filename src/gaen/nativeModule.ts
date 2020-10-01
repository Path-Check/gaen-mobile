import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from "react-native"

import { RawENPermissionStatus } from "../PermissionsContext"
import { ExposureInfo, Posix } from "../exposure"
import { ENDiagnosisKey } from "../Settings/ENLocalDiagnosisKeyScreen"
import { ExposureKey } from "../exposureKey"
import Logger from "../logger"

import { toExposureInfo, RawExposure } from "./dataConverters"

// Event Subscriptions
export const subscribeToExposureEvents = (
  cb: (exposureInfo: ExposureInfo) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  )
  return ExposureEvents.addListener(
    "onExposureRecordUpdated",
    (rawExposure: string) => {
      const rawExposures: RawExposure[] = JSON.parse(rawExposure)
      cb(toExposureInfo(rawExposures))
    },
  )
}

export const subscribeToEnabledStatusEvents = (
  cb: (status: RawENPermissionStatus) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  )
  return ExposureEvents.addListener(
    "onEnabledStatusUpdated",
    (data: string[] | null) => {
      if (data) {
        const status = toStatus(data)
        cb(status)
      }
    },
  )
}

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

const toStatus = (data: string[]): RawENPermissionStatus => {
  const networkAuthorization = data[0]
  const networkEnablement = data[1]
  const result: RawENPermissionStatus = ["UNAUTHORIZED", "DISABLED"]
  if (networkAuthorization === "AUTHORIZED") {
    result[0] = "AUTHORIZED"
  }
  if (networkEnablement === "ENABLED") {
    result[1] = "ENABLED"
  }
  return result
}

// Permissions Module
const permissionsModule = NativeModules.ENPermissionsModule

export const requestAuthorization = async (): Promise<void> => {
  return permissionsModule
    .requestExposureNotificationAuthorization()
    .catch((error: string) => {
      Logger.error("Failed to request ExposureNotification API Authorization", {
        error,
      })
      throw new Error(error)
    })
}

export const getCurrentENPermissionsStatus = async (
  cb: (status: RawENPermissionStatus) => void,
): Promise<void> => {
  const response = await permissionsModule.getCurrentENPermissionsStatus()
  cb(toStatus(response))
  return Promise.resolve()
}

// Exposure History Module
const exposureHistoryModule = NativeModules.ExposureHistoryModule
export const getCurrentExposures = async (): Promise<ExposureInfo> => {
  const rawExposure: string = await exposureHistoryModule.getCurrentExposures()
  const rawExposures: RawExposure[] = JSON.parse(rawExposure)
  return toExposureInfo(rawExposures)
}

export const fetchLastExposureDetectionDate = async (): Promise<Posix | null> => {
  try {
    return await exposureHistoryModule.fetchLastDetectionDate()
  } catch {
    return null
  }
}

export const checkForNewExposures = async (): Promise<void> => {
  return await exposureHistoryModule.detectExposures()
}

// Exposure Key Module
const exposureKeyModule = NativeModules.ExposureKeyModule

interface RawExposureKey {
  key: string
  rollingPeriod: number
  rollingStartNumber: number
  transmissionRisk: number
}

export const getExposureKeys = async (): Promise<ExposureKey[]> => {
  const rawKeys: RawExposureKey[] = await exposureKeyModule.fetchExposureKeys()
  if (rawKeys.every(validRawExposureKey)) {
    const exposureKeys = rawKeys.map(toExposureKey)
    return exposureKeys
  } else {
    Logger.error("Invalid expousre keys from native layer", { rawKeys })
    throw new Error("Invalid exposure keys from native layer")
  }
}

const validRawExposureKey = (rawKey: RawExposureKey): boolean => {
  const { key, rollingPeriod, rollingStartNumber, transmissionRisk } = rawKey
  if (typeof key !== "string" || key.length === 0) {
    Logger.addMetadata("InvalidRawKey", { key })
    return false
  }
  if (typeof rollingPeriod !== "number") {
    Logger.addMetadata("InvalidRawKey", { rollingPeriod })
    return false
  }
  if (typeof rollingStartNumber !== "number") {
    Logger.addMetadata("InvalidRawKey", { rollingStartNumber })
    return false
  }
  if (typeof transmissionRisk !== "number") {
    Logger.addMetadata("InvalidRawKey", { transmissionRisk })
    return false
  }
  return true
}

const toExposureKey = (rawExposureKey: RawExposureKey): ExposureKey => {
  return {
    key: rawExposureKey.key,
    rollingPeriod: rawExposureKey.rollingPeriod,
    rollingStartNumber: rawExposureKey.rollingStartNumber,
    transmissionRisk: rawExposureKey.transmissionRisk,
  }
}

export const storeRevisionToken = async (
  revisionToken: string,
): Promise<void> => {
  return exposureKeyModule.storeRevisionToken(revisionToken)
}

export const getRevisionToken = async (): Promise<string> => {
  return exposureKeyModule.getRevisionToken()
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

export const isBluetoothEnabled = async (): Promise<boolean> => {
  const bluetoothStatus = await deviceInfoModule.isBluetoothEnabled()
  return bluetoothStatus === true || bluetoothStatus === "true"
}

export const doesDeviceSupportLocationlessScanning = async (): Promise<
  boolean
> => {
  return deviceInfoModule.deviceSupportsLocationlessScanning()
}

export const isLocationEnabled = async (): Promise<boolean> => {
  return deviceInfoModule.isLocationEnabled()
}

// Debug Module
const debugModule = NativeModules.DebugMenuModule

export const forceAppCrash = async (): Promise<void> => {
  return debugModule.forceAppCrash()
}

export const fetchDiagnosisKeys = async (): Promise<ENDiagnosisKey[]> => {
  return debugModule.fetchDiagnosisKeys()
}

export type ENModuleErrorMessage = string | null
export type ENModuleSuccessMessage = string | null

export const simulateExposure = async (): Promise<"success"> => {
  return debugModule.simulateExposure()
}

export const fetchExposures = async (): Promise<RawExposure[]> => {
  return debugModule.fetchExposures()
}

export const showLastProcessedFilePath = async (): Promise<string> => {
  return debugModule.showLastProcessedFilePath()
}

export const resetExposure = async (): Promise<"success"> => {
  return debugModule.resetExposure()
}

export const toggleExposureNotifications = async (): Promise<"success"> => {
  return debugModule.toggleExposureNotifications()
}

export const simulateExposureDetectionError = async (): Promise<"success"> => {
  return debugModule.simulateExposureDetectionError()
}

export const resetExposures = async (): Promise<"success"> => {
  return debugModule.resetExposures()
}

// Utils Module
const utilsModule = NativeModules.UtilsModule

export const openAppSettings = (): void => {
  utilsModule.openAppSettings()
}
