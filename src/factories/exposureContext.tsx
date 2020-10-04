import { Factory } from "fishery"
import { ExposureState } from "../ExposureContext"
import { SUCCESS_RESPONSE } from "../OperationResponse"

export default Factory.define<ExposureState>(() => ({
  exposureInfo: [],
  getCurrentExposures: () => Promise.resolve([]),
  getExposureKeys: () => Promise.resolve([]),
  lastExposureDetectionDate: null,
  storeRevisionToken: (_revisionToken: string) => Promise.resolve(),
  getRevisionToken: () => Promise.resolve(""),
  refreshExposureInfo: () => {},
  checkForNewExposures: () => Promise.resolve(SUCCESS_RESPONSE),
}))
