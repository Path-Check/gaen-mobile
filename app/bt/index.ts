import { TracingStrategy } from "../tracingStrategy"
import * as BTNativeModule from "./nativeModule"
import { useBTCopyContent, btAssets } from "./content"
import { toExposureHistory } from "./exposureNotifications"
import { ExposureEventsStrategy } from "../ExposureHistoryContext"

const btExposureEventContext: ExposureEventsStrategy = {
  exposureInfoSubscription: BTNativeModule.subscribeToExposureEvents,
  toExposureHistory: toExposureHistory,
  getCurrentExposures: BTNativeModule.getCurrentExposures,
}

const btStrategy: TracingStrategy = {
  name: "bt",
  exposureEventsStrategy: btExposureEventContext,
  assets: btAssets,
  useCopy: useBTCopyContent,
}

export { BTNativeModule }
export default btStrategy
