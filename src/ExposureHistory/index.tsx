import React from "react"
import { SafeAreaView } from "react-native"

import { useExposureContext } from "../ExposureContext"
import { useStatusBarEffect } from "../navigation"
import History from "./History"

const ExposureHistoryScreen = (): JSX.Element => {
  const { lastExposureDetectionDate } = useExposureContext()

  useStatusBarEffect("dark-content")

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <History lastDetectionDate={lastExposureDetectionDate} />
    </SafeAreaView>
  )
}

export default ExposureHistoryScreen
