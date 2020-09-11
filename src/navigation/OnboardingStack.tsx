import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"

import {
  OnboardingScreen as Screen,
  OnboardingScreens as Screens,
  Stack as DestinationStack,
} from "./index"
import Welcome from "../Onboarding/Welcome"
import OnboardingScreen from "../Onboarding/OnboardingScreen"
import useOnboardingData from "../Onboarding/useOnboardingData"

type OnboardingStackParams = {
  [key in Screen]: undefined
}

const Stack = createStackNavigator<OnboardingStackParams>()

const onboardingScreenOptions: StackNavigationOptions = {
  headerShown: false,
}

interface OnboardingStackProps {
  destinationOnSkip: DestinationStack
}

const OnboardingStack: FunctionComponent<OnboardingStackProps> = ({
  destinationOnSkip,
}) => {
  const onboardingScreens = useOnboardingData(destinationOnSkip)
  return (
    <Stack.Navigator screenOptions={onboardingScreenOptions}>
      <Stack.Screen name={Screens.Welcome} component={Welcome} />
      {onboardingScreens.map((onboardingScreenContent) => {
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
      })}
    </Stack.Navigator>
  )
}

const MemoizedOnboardingStack = React.memo(OnboardingStack)

export default MemoizedOnboardingStack
