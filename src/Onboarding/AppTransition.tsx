import React, { FunctionComponent } from "react"
import { Button, View } from "react-native"

import { useOnboardingNavigation } from "./useOnboardingNavigation"

const AppTransition: FunctionComponent = () => {
  const { goToNextScreenFrom } = useOnboardingNavigation()

  const handleOnPressContinue = () => {
    goToNextScreenFrom("AppTransition")
  }

  return (
    <View>
      <Button title="Next" onPress={handleOnPressContinue} />
    </View>
  )
}

export default AppTransition
