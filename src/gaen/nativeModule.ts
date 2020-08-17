import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from "react-native"

import { ENPermissionStatus } from "../PermissionsContext"
import { ExposureInfo, Posix } from "../exposure"
import { ENDiagnosisKey } from "../More/ENLocalDiagnosisKeyScreen"
import { ExposureKey } from "../exposureKey"

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
  cb: (status: ENPermissionStatus) => void,
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

const toStatus = (data: string[]): ENPermissionStatus => {
  const networkAuthorization = data[0]
  const networkEnablement = data[1]
  const result: ENPermissionStatus = ["UNAUTHORIZED", "DISABLED"]
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

export const requestAuthorization = async (
  cb: (data: string) => void,
): Promise<void> => {
  permissionsModule.requestExposureNotificationAuthorization(cb)
}

export const getCurrentENPermissionsStatus = async (
  cb: (status: ENPermissionStatus) => void,
): Promise<void> => {
  permissionsModule.getCurrentENPermissionsStatus((data: string[]) => {
    const status = toStatus(data)
    cb(status)
  })
}

// Exposure History Module
const exposureHistoryModule = NativeModules.ExposureHistoryModule
export const getCurrentExposures = async (
  cb: (exposureInfo: ExposureInfo) => void,
): Promise<void> => {
  exposureHistoryModule.getCurrentExposures((rawExposure: string) => {
    const rawExposures: RawExposure[] = JSON.parse(rawExposure)
    cb(toExposureInfo(rawExposures))
  })
}

export const fetchLastExposureDetectionDate = async (): Promise<Posix | null> => {
  try {
    return await exposureHistoryModule.fetchLastDetectionDate()
  } catch {
    return null
  }
}

// Exposure Key Module
const exposureKeyModule = NativeModules.ExposureKeyModule

interface RawExposureKey {
  key: null | string
  rollingPeriod: number
  rollingStartNumber: number
  transmissionRisk: number
}

export const getExposureKeys = async (): Promise<ExposureKey[]> => {
  const keys: RawExposureKey[] = await exposureKeyModule.fetchExposureKeys()
  return keys.map(toExposureKey)
}

const toExposureKey = (rawExposureKey: RawExposureKey): ExposureKey => {
  return {
    key: rawExposureKey.key || "",
    rollingPeriod: rawExposureKey.rollingPeriod,
    rollingStartNumber: rawExposureKey.rollingStartNumber,
    transmissionRisk: rawExposureKey.transmissionRisk,
  }
}

export const submitDiagnosisKeys = async (
  certificate: string,
  hmacKey: string,
): Promise<string> => {
  return exposureKeyModule.postDiagnosisKeys(certificate, hmacKey)
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

export const detectExposuresNow = async (): Promise<string> => {
  return debugModule.detectExposuresNow()
}

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
