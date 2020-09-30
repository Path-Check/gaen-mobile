import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { SelfScreenerStackScreens } from "."
import SelfScreenerIntro from "../SelfScreener/SelfScreenerIntro"
import EmergencySymptomsQuestions from "../SelfScreener/EmergencySymptomsQuestions"
import NoEmergencySymptoms from "../SelfScreener/NoEmergencySymptoms"
import CallEmergencyServices from "../SelfScreener/CallEmergencyServices"
import GeneralSymptoms from "../SelfScreener/GeneralSymptoms"
import GeneralSymptomsSummary from "../SelfScreener/GeneralSymptomsSummary"
import UnderlyingConditions from "../SelfScreener/UnderlyingConditions"
import AgeRangeQuestion from "../SelfScreener/AgeRangeQuestion"
import Summary from "../SelfScreener/Summary"
import Guidance from "../SelfScreener/Guidance"
import { SelfScreenerProvider } from "../SelfScreenerContext"

const Stack = createStackNavigator()
const SelfAssessmentStack: FunctionComponent = () => {
  return (
    <SelfScreenerProvider>
      <Stack.Navigator>
        <Stack.Screen
          name={SelfScreenerStackScreens.SelfScreenerIntro}
          component={SelfScreenerIntro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.EmergencySymptomsQuestions}
          component={EmergencySymptomsQuestions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.NoEmergencySymptoms}
          component={NoEmergencySymptoms}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.CallEmergencyServices}
          component={CallEmergencyServices}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.GeneralSymptoms}
          component={GeneralSymptoms}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.GeneralSymptomsSummary}
          component={GeneralSymptomsSummary}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.UnderlyingConditions}
          component={UnderlyingConditions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.AgeRange}
          component={AgeRangeQuestion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.Summary}
          component={Summary}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.Guidance}
          component={Guidance}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SelfScreenerProvider>
  )
}

export default SelfAssessmentStack
