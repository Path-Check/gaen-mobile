import { Factory } from "fishery"

import { GaenStrategy } from "../gaen"

export default Factory.define<GaenStrategy>(() => ({
  exposureEventsStrategy: {
    exposureInfoSubscription: () => {
      return { remove: () => {} }
    },
    getCurrentExposures: () => new Promise(() => []),
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
    request: () => Promise.resolve(),
  },
}))
