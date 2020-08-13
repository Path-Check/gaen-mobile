import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import { HomeScreens, HomeScreen } from "./index"
import Home from "../Home/Home"
import BluetoothInfo from "../Home/BluetoothInfo"

type HomeStackParams = {
  [key in HomeScreen]: undefined
}
const Stack = createStackNavigator<HomeStackParams>()

const screenOptions = {
  headerShown: false,
}

const cardScreenOptions = {
  ...TransitionPresets.ModalPresentationIOS,
  headerShown: false,
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
}

const ExposureHistoryStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={HomeScreens.Home} component={Home} />
      <Stack.Screen
        name={HomeScreens.BluetoothInfo}
        component={BluetoothInfo}
        options={cardScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
