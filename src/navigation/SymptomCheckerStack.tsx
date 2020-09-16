import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import { SymptomCheckerStackScreens } from "./index"
import SymptomCheckerScreen from "../SymptomChecker/"
import SelectSymptomsScreen from "../SymptomChecker/SelectSymptoms"

const Stack = createStackNavigator()

const SymptomCheckerStack: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SymptomCheckerStackScreens.SymptomChecker}
        component={SymptomCheckerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SymptomCheckerStackScreens.SelectSymptoms}
        component={SelectSymptomsScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          cardOverlayEnabled: true,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default SymptomCheckerStack
