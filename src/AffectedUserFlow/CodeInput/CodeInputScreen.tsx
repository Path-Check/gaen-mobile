import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"

import { usePermissionsContext } from "../../Device/PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"

import { Colors } from "../../styles"

const CodeInputScreen: FunctionComponent = () => {
  const { exposureNotifications } = usePermissionsContext()
  const isENActive = exposureNotifications.status === "Active"

  return (
    <View style={style.container}>
      {isENActive ? <CodeInputForm /> : <EnableExposureNotifications />}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
})

export default CodeInputScreen
