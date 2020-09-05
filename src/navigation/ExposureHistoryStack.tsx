import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

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
