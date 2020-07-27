import React, { FunctionComponent } from "react"
import { View } from "react-native"
import { useExposureContext } from "../ExposureContext"
import ExposureListItem from "./ExposureListItem"

const ExposureList: FunctionComponent = () => {
  const { exposureInfo } = useExposureContext()

  return (
    <View>
      {exposureInfo.map((exposure) => {
        return <ExposureListItem key={exposure.date} exposureDatum={exposure} />
      })}
    </View>
  )
}

export default ExposureList
