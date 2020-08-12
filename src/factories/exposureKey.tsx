import { Factory } from "fishery"

import { ExposureKey } from "../exposureKey"

export default Factory.define<ExposureKey>(() => {
  return {
    key: "key",
    rollingPeriod: 1,
    rollingStartNumber: 2,
    transmissionRisk: 1,
  }
})
