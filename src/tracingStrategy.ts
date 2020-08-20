import { PermissionStrategy } from "./PermissionsContext"
import { ExposureInfo } from "./exposure"
import { ExposureKey } from "./exposureKey"

type Posix = number

export interface TracingStrategy {
  exposureEventsStrategy: ExposureEventsStrategy
  permissionStrategy: PermissionStrategy
}

type ExposureInfoSubscription = (
  cb: (exposureInfo: ExposureInfo) => void,
) => { remove: () => void }

export interface ExposureEventsStrategy {
  exposureInfoSubscription: ExposureInfoSubscription
  getCurrentExposures: (cb: (exposureInfo: ExposureInfo) => void) => void
  getLastDetectionDate: () => Promise<Posix | null>
  getExposureKeys: () => Promise<ExposureKey[]>
  getRevisionToken: () => Promise<string>
  storeRevisionToken: (revisionToken: string) => Promise<void>
}
