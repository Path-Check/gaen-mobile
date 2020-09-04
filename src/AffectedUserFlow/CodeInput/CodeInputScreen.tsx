import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"

import { usePermissionsContext, ENStatus } from "../../PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"

import { Colors } from "../../styles"

const CodeInputScreen: FunctionComponent = () => {
  const { exposureNotifications } = usePermissionsContext()

  const isEnabled = exposureNotifications.status === ENStatus.AUTHORIZED_ENABLED

  return (
    <View style={style.container}>
      {isEnabled ? <CodeInputForm /> : <EnableExposureNotifications />}
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
