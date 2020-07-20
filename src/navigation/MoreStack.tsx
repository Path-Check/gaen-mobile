import React, { FunctionComponent } from "react"
import {
  TransitionPresets,
  createStackNavigator,
  StackNavigationOptions,
  HeaderStyleInterpolators,
} from "@react-navigation/stack"

import MoreScreen from "../More/index"
import AboutScreen from "../More/About"
import LicensesScreen from "../More/Licenses"
import AffectedUserStack from "../AffectedUserFlow"
import ENDebugMenu from "../More/ENDebugMenu"
import ENLocalDiagnosisKeyScreen from "../More/ENLocalDiagnosisKeyScreen"
import ExposureListDebugScreen from "../More/ExposureListDebugScreen"
import LanguageSelection from "../More/LanguageSelection"

import { Colors } from "../styles"

import { Screens, Stacks } from "./index"

const Stack = createStackNavigator()

const SCREEN_OPTIONS: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.primaryViolet,
  },
  headerTitleStyle: {
    color: Colors.white,
    textTransform: "uppercase",
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.white,
}

type MoreStackRouteName =
  | "Settings"
  | "About"
  | "Licenses"
  | "ENDebugMenu"
  | "LanguageSelection"
  | "AffectedUserFlow"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

interface MoreStackRouteState {
  index: number
  key: string
  routeNames: MoreStackRouteName[]
  routes: MoreStackRoute[]
  stale: boolean
  type: "stack"
}

export interface MoreStackRoute {
  key: string
  name: "More"
  params: undefined
  state?: MoreStackRouteState
}

export const determineTabBarVisibility = (route: MoreStackRoute): boolean => {
  if (route.state) {
    const routeState = route.state
    const currentRoute = routeState.routes[routeState.index]
    const routeName = currentRoute.name
    return routeName != Stacks.AffectedUserFlow
  } else {
    return true
  }
}

const MoreStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name={Screens.More} component={MoreScreen} />
      <Stack.Screen name={Screens.About} component={AboutScreen} />
      <Stack.Screen name={Screens.Licenses} component={LicensesScreen} />
      <Stack.Screen name={Screens.ENDebugMenu} component={ENDebugMenu} />
      <Stack.Screen
        name={Screens.LanguageSelection}
        component={LanguageSelection}
      />
      <Stack.Screen
        name={Screens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
      />
      <Stack.Screen
        name={Screens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
    </Stack.Navigator>
  )
}

export default MoreStack

