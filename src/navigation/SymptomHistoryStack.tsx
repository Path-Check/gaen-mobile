import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"

import SymptomHistoryScreen from "../SymptomHistory/"
import SelectSymptomsForm from "../SymptomHistory/Form/SelectSymptoms"
import { Stacks, SymptomHistoryStackScreens } from "./index"
import { applyModalHeader } from "./ModalHeader"
import { SymptomEntry } from "../SymptomHistory/symptomHistory"
import CovidRecommendation from "../CovidRecommendation"
import CallEmergencyServices from "../CallEmergencyServices"

export type SymptomHistoryStackParams = {
  SymptomHistory: undefined
  AtRiskRecommendation: undefined
  SelectSymptoms: { symptomEntry: SymptomEntry }
  EmergencyRecommendation: undefined
  CovidRecommendation: undefined
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
        name={SymptomHistoryStackScreens.EmergencyRecommendation}
        component={EmergencyRecommendationScreen}
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
      <Stack.Screen
        name={SymptomHistoryStackScreens.CovidRecommendation}
        component={CovidRecommendationScreen}
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

const SelectSymptomsScreen: FunctionComponent = () => {
  const navigation = useNavigation()

  const route = useRoute<
    RouteProp<SymptomHistoryStackParams, "SelectSymptoms">
  >()

  const entry = route.params?.symptomEntry || {
    kind: "NoUserInput",
    date: Date.now(),
  }

  return (
    <SelectSymptomsForm
      entry={entry}
      showNoSymptoms
      onSubmitEmergencySymptoms={() =>
        navigation.navigate(SymptomHistoryStackScreens.EmergencyRecommendation)
      }
      onSubmitCovidSympotoms={() =>
        navigation.navigate(SymptomHistoryStackScreens.CovidRecommendation)
      }
      onSubmitNoSymptoms={() => navigation.goBack()}
    />
  )
}

const EmergencyRecommendationScreen: FunctionComponent = () => {
  return <CallEmergencyServices />
}

const CovidRecommendationScreen: FunctionComponent = () => {
  return <CovidRecommendation />
}

export default SymptomHistoryStack
