import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import { HomeStackScreens } from "./index"
import Home from "../Home"
import BluetoothInfo from "../Home/BluetoothInfo"
import ProximityTracingInfo from "../Home/ProximityTracingInfo"
import LocationInfo from "../Home/LocationInfo"

const Stack = createStackNavigator()

const screenOptions = {
  headerShown: false,
}

const cardScreenOptions = {
  ...TransitionPresets.ModalPresentationIOS,
  headerShown: false,
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
}

const HomeStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={HomeStackScreens.Home} component={Home} />
      <Stack.Screen
        name={HomeStackScreens.BluetoothInfo}
        component={BluetoothInfo}
        options={cardScreenOptions}
      />
      <Stack.Screen
        name={HomeStackScreens.ProximityTracingInfo}
        component={ProximityTracingInfo}
        options={cardScreenOptions}
      />
      <Stack.Screen
        name={HomeStackScreens.LocationInfo}
        component={LocationInfo}
        options={cardScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default HomeStack
