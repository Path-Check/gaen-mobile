import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import SymptomHistoryScreen from "../SymptomHistory/"
import SelectSymptomsScreen from "../SymptomHistory/SelectSymptoms"
import CallEmergencyServices from "../CallEmergencyServices"
import { Stacks, SymptomHistoryStackScreens } from "./index"
import { applyModalHeader } from "./ModalHeader"
import { SymptomEntry } from "../SymptomHistory/symptomHistory"

export type SymptomHistoryStackParams = {
  SymptomHistory: undefined
  AtRiskRecommendation: undefined
  SelectSymptoms: { symptomEntry: SymptomEntry }
  CallEmergencyServices: undefined
}
const Stack = createStackNavigator<SymptomHistoryStackParams>()

const SymptomHistoryStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name={SymptomHistoryStackScreens.SymptomHistory}
        component={SymptomHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SymptomHistoryStackScreens.SelectSymptoms}
        component={SelectSymptomsScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureEnabled: false,
          header: applyModalHeader(t("screen_titles.select_symptoms")),
        }}
      />
      <Stack.Screen
        name={SymptomHistoryStackScreens.CallEmergencyServices}
        component={CallEmergencyServices}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureEnabled: false,
          header: applyModalHeader("", () => {
            navigation.navigate(Stacks.SymptomHistory, {
              screen: SymptomHistoryStackScreens.SymptomHistory,
            })
          }),
        }}
      />
    </Stack.Navigator>
  )
}

export default SymptomHistoryStack
