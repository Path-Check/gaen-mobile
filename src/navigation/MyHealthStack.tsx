import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import MyHealthScreen from "../MyHealth/"
import SelectSymptomsScreen from "../MyHealth/SelectSymptoms"
import { MyHealthStackScreens } from "./index"

export type MyHealthStackParams = {
  MyHealth: undefined
  AtRiskRecommendation: undefined
  SelectSymptoms: { logEntry?: string }
}
const Stack = createStackNavigator<MyHealthStackParams>()

const MyHealthStack: FunctionComponent = () => {
  return (
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
    </Stack.Navigator>
  )
}

export default MyHealthStack
