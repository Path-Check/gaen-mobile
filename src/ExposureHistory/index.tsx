import React from "react"

import { useExposureContext } from "../ExposureContext"
import { useStatusBarEffect } from "../navigation"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryScreen = (): JSX.Element => {
  const { lastExposureDetectionDate, exposureInfo } = useExposureContext()

  useStatusBarEffect("dark-content")

  const exposures = toExposureList(exposureInfo)

  return (
    <History
      lastDetectionDate={lastExposureDetectionDate}
      exposures={exposures}
    />
  )
}

export default ExposureHistoryScreen
