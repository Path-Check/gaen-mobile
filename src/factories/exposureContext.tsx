import { Factory } from "fishery"
import { ExposureState } from "../ExposureContext"

export default Factory.define<ExposureState>(() => ({
  exposureKeyDate: new Date(),
  exposureKeyCheckCount: 0,
  exposureInfo: [],
  exposureKeys: [],
  getCurrentExposures: () => Promise.resolve([]),
  getExposureKeys: () => Promise.resolve([]),
  lastExposureDetectionDate: null,
  storeRevisionToken: (_revisionToken: string) => Promise.resolve(),
  getRevisionToken: () => Promise.resolve(""),
  refreshExposureInfo: () => {},
  detectExposures: () => Promise.resolve({ kind: "success" }),
}))
