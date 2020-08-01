import React from "react"
import { SafeAreaView } from "react-native"

import { useExposureContext } from "../ExposureContext"
import { useStatusBarEffect } from "../navigation"
import History from "./History"

import { ExposureInfo, ExposureDatum } from "../exposure"

import { Colors } from "../styles"

const toExposureList = (exposureInfo: ExposureInfo): ExposureDatum[] => {
  return exposureInfo
}

const ExposureHistoryScreen = (): JSX.Element => {
  const { lastExposureDetectionDate, exposureInfo } = useExposureContext()

  useStatusBarEffect("dark-content")

  const exposures = toExposureList(exposureInfo)

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors.primaryBackground, flex: 1 }}
    >
      <History
        lastDetectionDate={lastExposureDetectionDate}
        exposures={exposures}
      />
    </SafeAreaView>
  )
}

export default ExposureHistoryScreen
