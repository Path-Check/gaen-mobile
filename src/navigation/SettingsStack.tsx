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
import ReportIssue from "../Settings/ReportIssue"
import ENDebugMenu from "../Settings/ENDebugMenu"
import CallbackFormScreen from "../Settings/CallbackForm"
import ENLocalDiagnosisKey from "../Settings/ENLocalDiagnosisKeyScreen"
import ExposureListDebug from "../Settings/ExposureListDebugScreen"
import { SettingsScreens, SettingsScreen } from "./index"

import { Colors, Headers } from "../styles"

type SettingsStackParams = {
  [key in SettingsScreen]: undefined
}
const Stack = createStackNavigator<SettingsStackParams>()

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
      <Stack.Screen name={SettingsScreens.Settings} component={Settings} />
      <Stack.Screen
        name={SettingsScreens.CallbackForm}
        component={CallbackFormScreen}
      />
      <Stack.Screen
        name={SettingsScreens.Legal}
        component={Legal}
        options={{ headerTitle: t("screen_titles.legal") }}
      />
      <Stack.Screen
        name={SettingsScreens.ReportIssue}
        component={ReportIssue}
        options={{ headerTitle: t("screen_titles.report_issue") }}
      />
      <Stack.Screen
        name={SettingsScreens.ENDebugMenu}
        component={ENDebugMenu}
        options={{ headerTitle: t("screen_titles.debug") }}
      />
      <Stack.Screen
        name={SettingsScreens.ExposureListDebugScreen}
        component={ExposureListDebug}
        options={{ headerTitle: t("screen_titles.exposures") }}
      />
      <Stack.Screen
        name={SettingsScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKey}
      />
    </Stack.Navigator>
  )
}

export default SettingsStack
