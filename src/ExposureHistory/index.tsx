import React from "react"
import { SafeAreaView } from "react-native"

import { useExposureContext } from "../ExposureContext"
import { useStatusBarEffect } from "../navigation"
import { toExposureHistory } from "./exposureHistory"
import History from "./History"

const CALENDAR_DAY_COUNT = 21

const ExposureHistoryScreen = (): JSX.Element => {
  const { exposureInfo, lastExposureDetectionDate } = useExposureContext()

  useStatusBarEffect("dark-content")

  const exposureHistory = toExposureHistory(exposureInfo, CALENDAR_DAY_COUNT)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <History
        exposureHistory={exposureHistory}
        lastDetectionDate={lastExposureDetectionDate}
      />
    </SafeAreaView>
  )
}

export default ExposureHistoryScreen
