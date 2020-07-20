import React, { FunctionComponent } from "react"
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack"

import SettingsScreen from "../More/index"
import AboutScreen from "../More/About"
import LicensesScreen from "../More/Licenses"
import AffectedUserStack from "../AffectedUserFlow"
import ENDebugMenu from "../More/ENDebugMenu"
import ENLocalDiagnosisKeyScreen from "../More/ENLocalDiagnosisKeyScreen"
import ExposureListDebugScreen from "../More/ExposureListDebugScreen"
import LanguageSelection from "../More/LanguageSelection"

import { MoreStackScreens, MoreStackScreen } from "./index"

type MoreStackScreenParams = {
  [key in MoreStackScreen]: undefined
}
const Stack = createStackNavigator<MoreStackScreenParams>()

const SCREEN_OPTIONS = {
  headerShown: false,
}

interface MoreStackRouteState {
  index: number
  key: string
  routeNames: MoreStackScreen[]
  routes: MoreStackRoute[]
  stale: boolean
  type: "stack"
}

export interface MoreStackRoute {
  key: string
  name: MoreStackScreen
  params: undefined
  state?: MoreStackRouteState
}

export const determineTabBarVisibility = (route: MoreStackRoute): boolean => {
  if (route.state) {
    const routeState = route.state
    const currentRoute = routeState.routes[routeState.index]
    const routeName = currentRoute.name
    return routeName != MoreStackScreens.AffectedUserFlow
  } else {
    return true
  }
}

const MoreStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name={MoreStackScreens.Settings}
        component={SettingsScreen}
      />
      <Stack.Screen name={MoreStackScreens.About} component={AboutScreen} />
      <Stack.Screen
        name={MoreStackScreens.Licenses}
        component={LicensesScreen}
      />
      <Stack.Screen
        name={MoreStackScreens.ENDebugMenu}
        component={ENDebugMenu}
      />
      <Stack.Screen
        name={MoreStackScreens.LanguageSelection}
        component={LanguageSelection}
      />
      <Stack.Screen
        name={MoreStackScreens.AffectedUserFlow}
        component={AffectedUserStack}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MoreStackScreens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
      />
      <Stack.Screen
        name={MoreStackScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
    </Stack.Navigator>
  )
}

export default MoreStack
