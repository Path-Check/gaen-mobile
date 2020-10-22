import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"

import Settings from "../Settings/"
import Legal from "../Settings/Legal"
import ENDebugMenu from "../Settings/ENDebugMenu"
import ENLocalDiagnosisKey from "../Settings/ENLocalDiagnosisKeyScreen"
import ExposureListDebug from "../Settings/ExposureListDebugScreen"
import DeleteConfirmation from "../Settings/DeleteConfirmation"
import { SettingsStackScreens } from "./index"
import { applyHeaderLeftBackButton } from "./HeaderLeftBackButton"

import { Headers } from "../styles"

const Stack = createStackNavigator()

const SettingsStack: FunctionComponent = () => {
  const defaultScreenOptions: StackNavigationOptions = {
    ...Headers.headerMinimalOptions,
    headerLeft: applyHeaderLeftBackButton(),
    headerRight: () => null,
  }

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name={SettingsStackScreens.Settings}
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SettingsStackScreens.Legal}
        component={Legal}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name={SettingsStackScreens.DeleteConfirmation}
        component={DeleteConfirmation}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name={SettingsStackScreens.ENDebugMenu}
        component={ENDebugMenu}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name={SettingsStackScreens.ExposureListDebugScreen}
        component={ExposureListDebug}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name={SettingsStackScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKey}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default SettingsStack
