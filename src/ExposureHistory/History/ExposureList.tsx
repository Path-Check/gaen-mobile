import React, { FunctionComponent } from "react"
import { View } from "react-native"

import { ExposureDatum } from "../../exposure"
import ExposureListItem from "./ExposureListItem"

interface ExposureListProps {
  exposures: ExposureDatum[]
}

const ExposureList: FunctionComponent<ExposureListProps> = ({ exposures }) => {
  return (
    <View testID={"exposure-list"}>
      {exposures.map((exposure) => {
        return <ExposureListItem key={exposure.date} exposureDatum={exposure} />
      })}
    </View>
  )
}

export default ExposureList
