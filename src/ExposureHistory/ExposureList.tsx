import React, { FunctionComponent } from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useExposureContext } from "../ExposureContext"

const ExposureList: FunctionComponent = () => {
  const { exposureInfo } = useExposureContext()
  console.log({ exposureInfo })
  return (
    <View>
      {Object.keys(exposureInfo).map((e) => {
        const exposure = exposureInfo[e]
        return (
          <TouchableOpacity key={exposure.date}>
            <Text>{exposure.kind}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default ExposureList
