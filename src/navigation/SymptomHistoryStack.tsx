import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import SymptomHistoryScreen from "../SymptomHistory/"
import SelectSymptomsScreen from "../SymptomHistory/SelectSymptoms"
import { SymptomHistoryStackScreens } from "./index"
import { applyModalHeader } from "./ModalHeader"
import { SymptomEntry } from "../SymptomHistory/symptomHistory"

export type SymptomHistoryStackParams = {
  SymptomHistory: undefined
  AtRiskRecommendation: undefined
  SelectSymptoms: { symptomEntry: SymptomEntry }
}
const Stack = createStackNavigator<SymptomHistoryStackParams>()

const SymptomHistoryStack: FunctionComponent = () => {
  const { t } = useTranslation()

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
    </Stack.Navigator>
  )
}

export default SymptomHistoryStack
