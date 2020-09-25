import React, { FunctionComponent, useEffect } from "react"

import { useExposureContext } from "../ExposureContext"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"
import { useNavigation } from "@react-navigation/native"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryScreen: FunctionComponent = () => {
  const {
    lastExposureDetectionDate,
    exposureInfo,
    refreshExposureInfo,
  } = useExposureContext()

  const navigation = useNavigation()

  useEffect(() => {
    // Refresh exposure info each time this screen gets focus
    navigation.addListener("focus", () => {
      refreshExposureInfo()
    })
  }, [])

  const exposures = toExposureList(exposureInfo)

  return (
    <History
      lastDetectionDate={lastExposureDetectionDate}
      exposures={exposures}
    />
  )
}

export default ExposureHistoryScreen
