import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import MyHealthScreen from "../MyHealth/"
import SelectSymptomsScreen from "../MyHealth/SelectSymptoms"
import { MyHealthStackScreens } from "./index"
import { applyModalHeader } from "./ModalHeader"
import { useTranslation } from "react-i18next"

export type MyHealthStackParams = {
  MyHealth: undefined
  AtRiskRecommendation: undefined
  SelectSymptoms: { logEntry?: string }
}
const Stack = createStackNavigator<MyHealthStackParams>()

const MyHealthStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name={MyHealthStackScreens.MyHealth}
        component={MyHealthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={MyHealthStackScreens.SelectSymptoms}
        component={SelectSymptomsScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureEnabled: false,
          header: applyModalHeader(t("screen_titles.select_symptoms")),
        }}
      />
    </Stack.Navigator>
  )
}

export default MyHealthStack
