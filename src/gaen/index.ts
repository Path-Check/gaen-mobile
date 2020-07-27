import { TracingStrategy, ExposureEventsStrategy } from "../tracingStrategy"
import { PermissionStrategy } from "../PermissionsContext"
import * as NativeModule from "./nativeModule"

const exposureEventsStrategy: ExposureEventsStrategy = {
  exposureInfoSubscription: NativeModule.subscribeToExposureEvents,
  getCurrentExposures: NativeModule.getCurrentExposures,
  getLastDetectionDate: NativeModule.fetchLastExposureDetectionDate,
  getExposureKeys: NativeModule.getExposureKeys,
  submitDiagnosisKeys: NativeModule.submitDiagnosisKeys,
}

const permissionStrategy: PermissionStrategy = {
  statusSubscription: NativeModule.subscribeToEnabledStatusEvents,
  check: NativeModule.getCurrentENPermissionsStatus,
  request: NativeModule.requestAuthorization,
}

const btStrategy: TracingStrategy = {
  exposureEventsStrategy,
  permissionStrategy,
}

export { NativeModule }
export default btStrategy
