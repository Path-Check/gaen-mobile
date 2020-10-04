import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
  HeaderBackButton,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import Settings from "../Settings/"
import Legal from "../Settings/Legal"
import ENDebugMenu from "../Settings/ENDebugMenu"
import ENLocalDiagnosisKey from "../Settings/ENLocalDiagnosisKeyScreen"
import ExposureListDebug from "../Settings/ExposureListDebugScreen"
import { SettingsStackScreens } from "./index"

import { Colors, Headers } from "../styles"

const Stack = createStackNavigator()

const headerLeft = () => {
  return <HeaderLeft />
}

const HeaderLeft = () => {
  const navigation = useNavigation()

  return (
    <HeaderBackButton
      labelVisible={false}
      tintColor={Colors.white}
      onPress={() => navigation.goBack()}
    />
  )
}

const SettingsStack: FunctionComponent = () => {
  const { t } = useTranslation()

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
    headerLeft: headerLeft,
  }

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={SettingsStackScreens.Settings} component={Settings} />
      <Stack.Screen
        name={SettingsStackScreens.Legal}
        component={Legal}
        options={{ headerTitle: t("screen_titles.legal") }}
      />
      <Stack.Screen
        name={SettingsStackScreens.ENDebugMenu}
        component={ENDebugMenu}
        options={{ headerTitle: t("screen_titles.debug") }}
      />
      <Stack.Screen
        name={SettingsStackScreens.ExposureListDebugScreen}
        component={ExposureListDebug}
        options={{ headerTitle: t("screen_titles.exposures") }}
      />
      <Stack.Screen
        name={SettingsStackScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKey}
      />
    </Stack.Navigator>
  )
}

export default SettingsStack
