import { Factory } from "fishery"

import { TracingStrategy } from "../tracingStrategy"

export default Factory.define<TracingStrategy>(() => ({
  name: "test-tracing-strategy",
  exposureEventsStrategy: {
    exposureInfoSubscription: () => {
      return { remove: () => {} }
    },
    getCurrentExposures: () => {},
    getLastDetectionDate: () => {
      return new Promise(() => null)
    },
  },
  permissionStrategy: {
    statusSubscription: () => {
      return { remove: () => {} }
    },
    check: () => {},
    request: () => {},
  },
}))
