import React, { FunctionComponent, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"

import { useExposureContext } from "../ExposureContext"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryStackScreen: FunctionComponent = () => {
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

export default ExposureHistoryStackScreen
