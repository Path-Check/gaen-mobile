import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import {
  OnboardingScreen as Screen,
  OnboardingScreens as Screens,
  Stack as DestinationStack,
} from "./index"
import Welcome from "../Onboarding/Welcome"
import OnboardingScreen from "../Onboarding/OnboardingScreen"
import useOnboardingData, {
  OnboardingScreenContent,
} from "../Onboarding/useOnboardingData"

type OnboardingStackParams = {
  [key in Screen]: undefined
}

const Stack = createStackNavigator<OnboardingStackParams>()

interface OnboardingStackProps {
  destinationOnSkip: DestinationStack
  displayWelcomeScreen?: boolean
}

const OnboardingStack: FunctionComponent<OnboardingStackProps> = ({
  destinationOnSkip,
  displayWelcomeScreen,
}) => {
  const onboardingScreens = useOnboardingData(destinationOnSkip)

  const toStackScreen = (data: OnboardingScreenContent, idx: number) => {
    const screenNumber = idx + 1
    const onboardingScreenContent = {
      screenNumber,
      ...data,
    }
    return (
      <Stack.Screen
        key={onboardingScreenContent.header}
        name={onboardingScreenContent.name}
      >
        {(props) => (
          <OnboardingScreen
            {...props}
            onboardingScreenContent={onboardingScreenContent}
            destinationOnSkip={destinationOnSkip}
          />
        )}
      </Stack.Screen>
    )
  }

  return (
    <Stack.Navigator headerMode="none">
      {displayWelcomeScreen && (
        <Stack.Screen name={Screens.Welcome} component={Welcome} />
      )}
      {onboardingScreens.map((data, idx) => toStackScreen(data, idx))}
    </Stack.Navigator>
  )
}

const MemoizedOnboardingStack = React.memo(OnboardingStack)

export default MemoizedOnboardingStack
