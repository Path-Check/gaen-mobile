import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
} from "@react-navigation/stack"

import { SelfAssessmentProvider } from "../SelfAssessmentContext"
import { SelfAssessmentStackScreens, Stack as AllStacks } from "./index"

import SelfAssessmentIntro from "../SelfAssessment/SelfAssessmentIntro"
import EmergencySymptomsQuestions from "../SelfAssessment/EmergencySymptomsQuestions"
import HowAreYouFeeling from "../SelfAssessment/HowAreYouFeeling"
import CallEmergencyServices from "../SelfAssessment/CallEmergencyServices"
import GeneralSymptoms from "../SelfAssessment/GeneralSymptoms"
import UnderlyingConditions from "../SelfAssessment/UnderlyingConditions"
import AgeRangeQuestion from "../SelfAssessment/AgeRangeQuestion"
import Guidance from "../SelfAssessment/Guidance"
import { applyHeaderLeftBackButton } from "./HeaderLeftBackButton"

import { Headers } from "../styles"

const Stack = createStackNavigator()

type SelfAssessmentStackProps = {
  destinationOnCancel: AllStacks
}

const SelfAssessmentStack: FunctionComponent<SelfAssessmentStackProps> = ({
  destinationOnCancel,
}) => {
  const navigationBarOptions: StackNavigationOptions = {
    headerShown: false,
    headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
  }

  const defaultScreenOptions = {
    ...Headers.headerMinimalOptions,
    headerLeft: applyHeaderLeftBackButton(),
    headerRight: () => null,
  }

  return (
    <SelfAssessmentProvider>
      <Stack.Navigator headerMode="screen" screenOptions={navigationBarOptions}>
        <Stack.Screen
          name={SelfAssessmentStackScreens.SelfAssessmentIntro}
          component={SelfAssessmentIntro}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.EmergencySymptomsQuestions}
          component={EmergencySymptomsQuestions}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.HowAreYouFeeling}
          component={HowAreYouFeeling}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.CallEmergencyServices}
          component={CallEmergencyServices}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.GeneralSymptoms}
          component={GeneralSymptoms}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.UnderlyingConditions}
          component={UnderlyingConditions}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.AgeRange}
          component={AgeRangeQuestion}
          options={defaultScreenOptions}
        />
        <Stack.Screen name={SelfAssessmentStackScreens.Guidance}>
          {(props) => {
            return (
              <Guidance {...props} destinationOnCancel={destinationOnCancel} />
            )
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </SelfAssessmentProvider>
  )
}

export default SelfAssessmentStack
