import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from "@react-navigation/stack"

import Assessment from "../SelfAssessment/index"

import { SelfAssessmentScreen, SelfAssessmentScreens } from "./index"

type SelfAssessmentStackParams = {
  [key in SelfAssessmentScreen]: undefined
}
const Stack = createStackNavigator<SelfAssessmentStackParams>()

const fade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: { opacity: current.progress },
})

const SCREEN_OPTIONS = {
  headerShown: false,
}

const SelfAssessmentStack: FunctionComponent = () => (
  <Stack.Navigator
    mode="modal"
    screenOptions={{
      ...SCREEN_OPTIONS,
      cardStyleInterpolator: fade,
      gestureEnabled: false,
    }}
  >
    <Stack.Screen
      name={SelfAssessmentScreens.SelfAssessment}
      component={Assessment}
    />
  </Stack.Navigator>
)

export default SelfAssessmentStack
