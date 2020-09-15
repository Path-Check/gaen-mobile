import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import { ReportIssueScreens, ConnectStackScreens } from "./index"
import ConnectScreen from "../Connect"
import ReportIssue from "../ReportIssue"

import { Headers } from "../styles"

const Stack = createStackNavigator()

const ConnectStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ConnectStackScreens.Connect}
        component={ConnectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ReportIssueScreens.ReportIssue}
        component={ReportIssue}
        options={{
          headerTitle: t("screen_titles.report_issue"),
          ...Headers.headerScreenOptions,
        }}
      />
    </Stack.Navigator>
  )
}

export default ConnectStack
