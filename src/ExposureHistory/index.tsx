import React, { FunctionComponent } from "react"

import { useExposureContext } from "../ExposureContext"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryScreen: FunctionComponent = () => {
  const { lastExposureDetectionDate, exposureInfo } = useExposureContext()

  const exposures = toExposureList(exposureInfo)

  return (
    <History
      lastDetectionDate={lastExposureDetectionDate}
      exposures={exposures}
    />
  )
}

export default ExposureHistoryScreen
