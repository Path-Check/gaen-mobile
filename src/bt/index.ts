import { TracingStrategy } from "../tracingStrategy"
import { toExposureHistory } from "./exposureNotifications"
import { PermissionStrategy } from "../PermissionsContext"
import { ExposureEventsStrategy } from "../ExposureHistoryContext"
import * as BTNativeModule from "./nativeModule"

const btExposureEventContext: ExposureEventsStrategy = {
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  toExposureHistory: toExposureHistory,
  getCurrentExposures: BTNativeModule.getCurrentExposures,
}

const btPermissionStrategy: PermissionStrategy = {
  statusSubscription: BTNativeModule.subscribeToEnabledStatusEvents,
  check: BTNativeModule.getCurrentENPermissionsStatus,
  request: BTNativeModule.requestAuthorization,
}

const btStrategy: TracingStrategy = {
  name: "bt",
  exposureEventsStrategy: btExposureEventContext,
  permissionStrategy: btPermissionStrategy,
}

export { BTNativeModule }
export default btStrategy
