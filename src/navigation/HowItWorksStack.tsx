import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { Stack as DestinationStack } from "./index"
import HowItWorksScreen from "../HowItWorks/HowItWorksScreen"
import useHowItWorksData, {
  HowItWorksScreenDatum,
} from "../HowItWorks/useHowItWorksData"

const Stack = createStackNavigator()

interface HowItWorksStackProps {
  destinationOnSkip: DestinationStack
}

const HowItWorksStack: FunctionComponent<HowItWorksStackProps> = ({
  destinationOnSkip,
}) => {
  const howItWorksScreens = useHowItWorksData(destinationOnSkip)

  const toStackScreen = (datum: HowItWorksScreenDatum, idx: number) => {
    const screenNumber = idx + 1
    const howItWorksScreenDisplayDatum = {
      screenNumber,
      ...datum,
    }
    return (
      <Stack.Screen
        key={howItWorksScreenDisplayDatum.header}
        name={howItWorksScreenDisplayDatum.name}
      >
        {(props) => (
          <HowItWorksScreen
            {...props}
            howItWorksScreenContent={howItWorksScreenDisplayDatum}
            destinationOnSkip={destinationOnSkip}
          />
        )}
      </Stack.Screen>
    )
  }

  return (
    <Stack.Navigator headerMode="none">
      {howItWorksScreens.map((data, idx) => toStackScreen(data, idx))}
    </Stack.Navigator>
  )
}

const MemoizedHowItWorksStack = React.memo(HowItWorksStack)

export default MemoizedHowItWorksStack
