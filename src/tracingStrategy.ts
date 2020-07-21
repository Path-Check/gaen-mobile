import { PermissionStrategy } from "./PermissionsContext"
import { ExposureInfo } from "./exposure"

type Posix = number

export interface TracingStrategy {
  name: string
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
}
