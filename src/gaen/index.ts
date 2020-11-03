import { PermissionStrategy } from "../Device/PermissionsContext"
import { ExposureInfo } from "../exposure"
import { ExposureKey } from "../exposureKey"
import * as NativeModule from "./nativeModule"

type Posix = number

export interface GaenStrategy {
  exposureEventsStrategy: ExposureEventsStrategy
  permissionStrategy: PermissionStrategy
}

type ExposureInfoSubscription = (
  cb: (exposureInfo: ExposureInfo) => void,
) => { remove: () => void }

export interface ExposureEventsStrategy {
  exposureInfoSubscription: ExposureInfoSubscription
  getCurrentExposures: () => Promise<ExposureInfo>
  getLastDetectionDate: () => Promise<Posix | null>
  getExposureKeys: () => Promise<ExposureKey[]>
  getRevisionToken: () => Promise<string>
  storeRevisionToken: (revisionToken: string) => Promise<void>
}

const exposureEventsStrategy: ExposureEventsStrategy = {
  exposureInfoSubscription: NativeModule.subscribeToExposureEvents,
  getCurrentExposures: NativeModule.getCurrentExposures,
  getLastDetectionDate: NativeModule.fetchLastExposureDetectionDate,
  getExposureKeys: NativeModule.getExposureKeys,
  storeRevisionToken: NativeModule.storeRevisionToken,
  getRevisionToken: NativeModule.getRevisionToken,
}

const permissionStrategy: PermissionStrategy = {
  statusSubscription: NativeModule.subscribeToEnabledStatusEvents,
  check: NativeModule.getCurrentENPermissionsStatus,
  request: NativeModule.requestAuthorization,
}

const gaenStrategy: GaenStrategy = {
  exposureEventsStrategy,
  permissionStrategy,
}

export { NativeModule }
export default gaenStrategy
