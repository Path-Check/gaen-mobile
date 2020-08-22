import { Factory } from "fishery"

import { TracingStrategy } from "../tracingStrategy"

export default Factory.define<TracingStrategy>(() => ({
  exposureEventsStrategy: {
    exposureInfoSubscription: () => {
      return { remove: () => {} }
    },
    getCurrentExposures: () => {},
    getLastDetectionDate: () => {
      return new Promise(() => null)
    },
    getExposureKeys: () => new Promise(() => []),
    storeRevisionToken: (_revisionToken: string) => Promise.resolve(),
    getRevisionToken: () => Promise.resolve(""),
  },
  permissionStrategy: {
    statusSubscription: () => {
      return { remove: () => {} }
    },
    check: () => {},
    request: () => {},
  },
}))
