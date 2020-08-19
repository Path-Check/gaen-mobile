import React, { useState, FunctionComponent } from "react"
import { View, StyleSheet, Button as RNButton } from "react-native"

import { usePermissionsContext, ENEnablement } from "../../PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"
import { isTester } from "../../utils"

import { Colors } from "../../styles"

const CodeInputScreen: FunctionComponent = () => {
  const [
    testerHasRequestedNextScreen,
    setTesterHasRequestedNextScreen,
  ] = useState(false)
  const { exposureNotifications } = usePermissionsContext()

  const handleOnPressNextScreen = () => {
    setTesterHasRequestedNextScreen(true)
  }

  const hasExposureNotificationsEnabled = (): boolean => {
    const enabledState: ENEnablement = "ENABLED"
    return exposureNotifications.status[1] === enabledState
  }
  const isEnabled = hasExposureNotificationsEnabled()

  return (
    <View style={style.container}>
      {isEnabled || testerHasRequestedNextScreen ? (
        <CodeInputForm />
      ) : (
        <EnableExposureNotifications />
      )}
      {isTester && testerHasRequestedNextScreen === false && (
        <RNButton
          title="Go to next screen"
          onPress={handleOnPressNextScreen}
          color={Colors.danger100}
        />
      )}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
})

export default CodeInputScreen
