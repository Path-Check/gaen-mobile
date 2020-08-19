import React, { useState, FunctionComponent } from "react"
import { View, StyleSheet, Button as RNButton } from "react-native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext, ENEnablement } from "../../PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"
import { useTestModeContext } from "../../TestModeContext"

import { Colors } from "../../styles"

const CodeInputScreen: FunctionComponent = () => {
  const [
    testerHasRequestedNextScreen,
    setTesterHasRequestedNextScreen,
  ] = useState(false)
  const { t } = useTranslation()
  const { exposureNotifications } = usePermissionsContext()
  const { testModeEnabled } = useTestModeContext()

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
      {testModeEnabled && testerHasRequestedNextScreen === false && (
        <RNButton
          title={t("common.go_to_next_screen")}
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
