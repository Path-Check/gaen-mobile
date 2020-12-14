import React, { FunctionComponent } from "react"
import { View } from "react-native"
import env from "react-native-config"

import { ExposureDatum } from "../../exposure"
import ExposureListItem from "./ExposureListItem"
import ExposureSummary from "./ExposureSummary"

interface ExposureListProps {
  exposures: ExposureDatum[]
}

const DEFAULT_QUARANTINE_LENGTH = 10

const ExposureList: FunctionComponent<ExposureListProps> = ({ exposures }) => {
  const envQuarantineLength = Number(env.QUARANTINE_LENGTH)

  const quarantineLength = isNaN(envQuarantineLength)
    ? DEFAULT_QUARANTINE_LENGTH
    : envQuarantineLength

  const mostRecentExposure = exposures[0]

  console.log("asdf")
  return (
    <View>
      <ExposureSummary
        exposure={mostRecentExposure}
        quarantineLength={quarantineLength}
      />
      <View testID={"exposure-list"}>
        {exposures.map((exposure) => {
          return (
            <ExposureListItem key={exposure.date} exposureDatum={exposure} />
          )
        })}
      </View>
    </View>
  )
}

export default ExposureList
