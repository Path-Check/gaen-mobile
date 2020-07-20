import React, { FunctionComponent, useContext, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import ExposureHistoryContext from "../ExposureHistoryContext"
import ExposureHistoryScreen from "../ExposureHistory/index"
import NextSteps from "../ExposureHistory/NextSteps"
import MoreInfo from "../ExposureHistory/MoreInfo"

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
  const { observeExposures } = useContext(ExposureHistoryContext)

  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener("focus", () => {
      observeExposures()
    })
    return unsubscribeTabPress
  }, [navigation, observeExposures])

  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        ...SCREEN_OPTIONS,
      }}
    >
      <Stack.Screen
        name={ExposureHistoryScreens.ExposureHistory}
        component={ExposureHistoryScreen}
      />
      <Stack.Screen
        name={ExposureHistoryScreens.NextSteps}
        component={NextSteps}
      />
      <Stack.Screen
        name={ExposureHistoryScreens.MoreInfo}
        component={MoreInfo}
      />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
