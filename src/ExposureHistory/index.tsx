import React, { FunctionComponent, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"

import { useExposureContext } from "../ExposureContext"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryScreen: FunctionComponent = () => {
  const {
    lastExposureDetectionDate,
    exposureInfo,
    observeExposures,
  } = useExposureContext()

  const exposures = toExposureList(exposureInfo)

  useFocusEffect(
    useCallback(() => {
      observeExposures()
    }, [observeExposures]),
  )

  return (
    <History
      lastDetectionDate={lastExposureDetectionDate}
      exposures={exposures}
    />
  )
}

export default ExposureHistoryScreen
