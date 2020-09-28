import React, { FunctionComponent, useCallback } from "react"

import { useExposureContext } from "../ExposureContext"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"
import { useFocusEffect } from "@react-navigation/native"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryScreen: FunctionComponent = () => {
  const {
    lastExposureDetectionDate,
    exposureInfo,
    refreshExposureInfo,
  } = useExposureContext()

  useFocusEffect(
    useCallback(() => {
      refreshExposureInfo()
    }, [refreshExposureInfo]),
  )

  const exposures = toExposureList(exposureInfo)

  return (
    <History
      lastDetectionDate={lastExposureDetectionDate}
      exposures={exposures}
    />
  )
}

export default ExposureHistoryScreen
