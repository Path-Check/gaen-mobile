import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from "react-native"

import { ENPermissionStatus } from "../Device/PermissionsContext"
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
  cb: (status: ENPermissionStatus) => void,
): EventSubscription => {
  const ExposureEvents = new NativeEventEmitter(
    NativeModules.ExposureEventEmitter,
  )
  return ExposureEvents.addListener(
    "onEnabledStatusUpdated",
    (data: string | null) => {
      if (data) {
        const status = toStatus(data)
        cb(status)
      }
    },
  )
}

const toStatus = (data: string): ENPermissionStatus => {
  switch (data) {
    case "Unknown":
      return "Unknown"
    case "Active":
      return "Active"
    case "Disabled":
      return "Disabled"
    case "BluetoothOff":
      return "BluetoothOff"
    case "LocationOff":
      return "LocationOffAndRequired"
    case "Restricted":
      return "Restricted"
    case "Unauthorized":
      return "Unauthorized"
    default:
      return "Unknown"
  }
}

// Permissions Module

const permissionsModule = NativeModules.ENPermissionsModule

export type RequestAuthorizationResponse =
  | RequestAuthorizationSuccess
  | RequestAuthorizationFailure

export type RequestAuthorizationSuccess = {
  kind: "success"
  status: ENPermissionStatus
}

export type RequestAuthorizationError =
  | "IOSUnknown"
  | "BadParameter"
  | "NotEntitled"
  | "NotAuthorized"
  | "Unsupported"
  | "Invalidated"
  | "BluetoothOff"
  | "LocationOffAndRequired"
  | "InsufficientStorage"
  | "NotEnabled"
  | "APIMisuse"
  | "Internal"
  | "InsufficientMemory"
  | "RateLimited"
  | "Restricted"
  | "BadFormat"
  | "DataInaccessible"
  | "TravelStatusNotAvailable"
  | "Unknown"

export type RequestAuthorizationFailure = {
  kind: "failure"
  error: RequestAuthorizationError
}

export const requestAuthorization = async (): Promise<
  RequestAuthorizationResponse
> => {
  try {
    const enStatus = await permissionsModule.requestExposureNotificationAuthorization()
    return {
      kind: "success",
      status: toStatus(enStatus),
    }
  } catch (e) {
    switch (e.code) {
      case "NotEntitled":
        return { kind: "failure", error: "NotEntitled" }
      case "NotAuthorized":
        return { kind: "failure", error: "NotAuthorized" }
      case "Unsupported":
        return { kind: "failure", error: "Unsupported" }
      case "Invalidated":
        return { kind: "failure", error: "Invalidated" }
      case "BluetoothOff":
        return { kind: "failure", error: "BluetoothOff" }
      case "NotEnabled":
        return { kind: "failure", error: "NotEnabled" }
      case "Restricted":
        return { kind: "failure", error: "Restricted" }
      default:
        Logger.error("Unhandled Error in requestAuthorization", { e })
        return { kind: "failure", error: "Unknown" }
    }
  }
}

export const getCurrentENPermissionsStatus = async (
  cb: (status: ENPermissionStatus) => void,
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

type DetectExposuresError =
  | "RateLimited"
  | "Unknown"
  | "NotEnabled"
  | "NotAuthorized"

export type DetectExposuresResponse =
  | DetectExposuresResponseSuccess
  | DetectExposuresResponseFailure

interface DetectExposuresResponseSuccess {
  kind: "success"
}

interface DetectExposuresResponseFailure {
  kind: "failure"
  error: DetectExposuresError
}

export const detectExposures = async (): Promise<DetectExposuresResponse> => {
  try {
    await exposureHistoryModule.detectExposures()
    return { kind: "success" }
  } catch (e) {
    switch (e.code) {
      case "RateLimited":
        return { kind: "failure", error: "RateLimited" }
      case "NotEnabled":
        return { kind: "failure", error: "NotEnabled" }
      case "NotAuthorized":
        return { kind: "failure", error: "NotAuthorized" }
      default:
        Logger.error("Unhandled Error in detectExposures", { e })
        return { kind: "failure", error: "Unknown" }
    }
  }
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

export const simulateExposureDetectionError = async (): Promise<"success"> => {
  return debugModule.simulateExposureDetectionError()
}

export const resetExposures = async (): Promise<"success"> => {
  return debugModule.resetExposures()
}
