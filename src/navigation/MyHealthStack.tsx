import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import MyHealthScreen from "../MyHealth/"
import SelectSymptomsScreen from "../MyHealth/SelectSymptoms"
import AtRiskRecommendationScreen from "../MyHealth/AtRiskRecommendation"
import { SymptomLogProvider } from "../MyHealth/SymptomLogContext"
import { MyHealthStackScreens } from "./index"

const Stack = createStackNavigator()

const MyHealthStack: FunctionComponent = () => {
  return (
    <SymptomLogProvider>
      <Stack.Navigator>
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
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={MyHealthStackScreens.AtRiskRecommendation}
          component={AtRiskRecommendationScreen}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SymptomLogProvider>
  )
}

export default MyHealthStack
