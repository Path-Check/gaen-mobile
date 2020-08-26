import React, { FunctionComponent, useState, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import { useExposureContext } from "../ExposureContext"
import ExposureHistoryScreen from "../ExposureHistory/index"

import {
  ExposureHistoryScreens,
  ExposureHistoryScreen as Screen,
} from "./index"

type ExposureHistoryStackParams = {
  [key in Screen]: undefined
}
const Stack = createStackNavigator<ExposureHistoryStackParams>()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const ExposureHistoryStack: FunctionComponent = () => {
  const navigation = useNavigation()
  const { observeExposures } = useExposureContext()
  const [, setIsFocused] = useState(false)

  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener("focus", () => {
      setIsFocused(true)
      observeExposures()
    })
    const unsubscribeTabBlur = navigation.addListener("blur", () => {
      setIsFocused(false)
    })
    return () => {
      unsubscribeTabPress()
      unsubscribeTabBlur()
    }
  }, [navigation, observeExposures])

  return (
    <Stack.Navigator
      screenOptions={{
        ...SCREEN_OPTIONS,
      }}
    >
      <Stack.Screen
        name={ExposureHistoryScreens.ExposureHistory}
        component={ExposureHistoryScreen}
      />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
