import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"

import ExposureHistoryScreen from "../ExposureHistory/index"
import MoreInfo from "../ExposureHistory/MoreInfo"
import {
  ExposureHistoryStackScreens,
  ExposureHistoryStackScreen,
} from "./index"
import { applyHeaderLeftBackButton } from "./HeaderLeftBackButton"

import { Headers } from "../styles"

type ExposureHistoryStackParams = {
  [key in ExposureHistoryStackScreen]: undefined
}
const Stack = createStackNavigator<ExposureHistoryStackParams>()

const defaultScreenOptions: StackNavigationOptions = {
  ...Headers.headerMinimalOptions,
  headerLeft: applyHeaderLeftBackButton(),
  headerRight: () => null,
}

const ExposureHistoryStack: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ExposureHistoryStackScreens.ExposureHistory}
        component={ExposureHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ExposureHistoryStackScreens.MoreInfo}
        component={MoreInfo}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
