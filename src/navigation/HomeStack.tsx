import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Stacks, HomeStackScreens } from "./index"
import Home from "../Home"
import SelectSymptomsForm from "../SymptomHistory/Form/SelectSymptoms"
import { applyModalHeader } from "./ModalHeader"
import { useSymptomHistoryContext } from "../SymptomHistory/SymptomHistoryContext"
import CovidRecommendation from "../CovidRecommendation"
import CallEmergencyServices from "../CallEmergencyServices"

const Stack = createStackNavigator()

const HomeStack: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name={HomeStackScreens.Home}
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={HomeStackScreens.EnterSymptoms}
        component={EnterSymptomsScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureEnabled: false,
          header: applyModalHeader(t("screen_titles.select_symptoms")),
        }}
      />
      <Stack.Screen
        name={HomeStackScreens.EmergencyRecommendation}
        component={EmergencyRecommendationScreen}
        options={{
          gestureEnabled: false,
          header: applyModalHeader("", () => {
            navigation.navigate(Stacks.Home, {
              screen: HomeStackScreens.Home,
            })
          }),
        }}
      />
      <Stack.Screen
        name={HomeStackScreens.CovidRecommendation}
        component={CovidRecommendationScreen}
        options={{
          gestureEnabled: false,
          header: applyModalHeader("", () => {
            navigation.navigate(Stacks.Home, {
              screen: HomeStackScreens.Home,
            })
          }),
        }}
      />
    </Stack.Navigator>
  )
}

const EnterSymptomsScreen: FunctionComponent = () => {
  const navigation = useNavigation()
  const { symptomHistory } = useSymptomHistoryContext()
  const todaysEntry = symptomHistory[0]

  return (
    <SelectSymptomsForm
      showNoSymptoms={false}
      entry={todaysEntry}
      onSubmitEmergencySymptoms={() =>
        navigation.navigate(HomeStackScreens.EmergencyRecommendation)
      }
      onSubmitCovidSympotoms={() =>
        navigation.navigate(HomeStackScreens.CovidRecommendation)
      }
      onSubmitNoSymptoms={() => navigation.goBack()}
    />
  )
}

const EmergencyRecommendationScreen: FunctionComponent = () => {
  return <CallEmergencyServices />
}

const CovidRecommendationScreen: FunctionComponent = () => {
  const navigation = useNavigation()

  return (
    <CovidRecommendation
      onDismiss={() => navigation.navigate(HomeStackScreens.Home)}
    />
  )
}

export default HomeStack
