import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { HomeScreens, HomeScreen } from "./index"
import Home from "../Home/Home"

type HomeStackParams = {
  [key in HomeScreen]: undefined
}
const Stack = createStackNavigator<HomeStackParams>()

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
      <Stack.Screen name={HomeScreens.Home} component={Home} />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
