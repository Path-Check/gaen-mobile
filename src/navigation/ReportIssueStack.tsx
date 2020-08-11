import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import ReportIssueForm from "./../ReportIssue/ReportIssueForm"
import { ReportIssueScreen, ReportIssueScreens } from "./index"

import { Colors, Headers } from "../styles"

type MoreStackParams = {
  [key in ReportIssueScreen]: undefined
}
const Stack = createStackNavigator<MoreStackParams>()

const SCREEN_OPTIONS: StackNavigationOptions = {
  headerStyle: {
    ...Headers.headerStyle,
  },
  headerTitleStyle: {
    ...Headers.headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
}

const ReportIssueStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name={ReportIssueScreens.ReportIssueForm}
        component={ReportIssueForm}
        options={{ headerTitle: t("screen_titles.report_issue") }}
      />
    </Stack.Navigator>
  )
}

export default ReportIssueStack
