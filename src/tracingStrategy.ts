import { PermissionStrategy } from "./PermissionsContext"
import { ExposureKey } from "./exposureKey"
import { ExposureInfo } from "./exposure"

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
  submitDiagnosisKeys: (certificate: string, hmacKey: string) => Promise<string>
}
