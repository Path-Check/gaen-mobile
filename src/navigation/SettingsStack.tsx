import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import MenuScreen from "../Settings/Menu"
import AboutScreen from "../Settings/About"
import LegalScreen from "../Settings/Legal"
import ENDebugMenu from "../Settings/ENDebugMenu"
import CallbackFormScreen from "../More/CallbackForm"
import ENLocalDiagnosisKeyScreen from "../Settings/ENLocalDiagnosisKeyScreen"
import ExposureListDebugScreen from "../Settings/ExposureListDebugScreen"

import { SettingsScreens, SettingsScreen } from "./index"

import { Colors, Headers } from "../styles"

type SettingsStackParams = {
  [key in SettingsScreen]: undefined
}
const Stack = createStackNavigator<SettingsStackParams>()

const defaultScreenOptions: StackNavigationOptions = {
  headerStyle: {
    ...Headers.headerStyle,
  },
  headerTitleStyle: {
    ...Headers.headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
  headerTitleAlign: "center",
}

const SettingsStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name={SettingsScreens.Menu}
        component={MenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={SettingsScreens.About} component={AboutScreen} />
      <Stack.Screen
        name={SettingsScreens.CallbackForm}
        component={CallbackFormScreen}
      />
      <Stack.Screen
        name={SettingsScreens.Legal}
        component={LegalScreen}
        options={{ headerTitle: t("screen_titles.legal") }}
      />
      <Stack.Screen
        name={SettingsScreens.ENDebugMenu}
        component={ENDebugMenu}
        options={{ headerTitle: t("screen_titles.debug") }}
      />
      <Stack.Screen
        name={SettingsScreens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
        options={{ headerTitle: t("screen_titles.exposures") }}
      />
      <Stack.Screen
        name={SettingsScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
    </Stack.Navigator>
  )
}

export default SettingsStack
