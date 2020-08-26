import { Factory } from "fishery"
import { ExposureState } from "../ExposureContext"

export default Factory.define<ExposureState>(() => ({
  exposureInfo: [],
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: (): void => {},
  resetExposures: (): void => {},
  getCurrentExposures: (): void => {},
  getExposureKeys: () => Promise.resolve([]),
  lastExposureDetectionDate: null,
  storeRevisionToken: (_revisionToken: string) => Promise.resolve(),
  getRevisionToken: () => Promise.resolve(""),
}))
