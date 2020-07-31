import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet } from "react-native"

import { usePermissionsContext, ENEnablement } from "../../PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"

import { Colors } from "../../styles"

const CodeInputScreen: FunctionComponent = () => {
  const { exposureNotifications } = usePermissionsContext()

  const hasExposureNotificationsEnabled = (): boolean => {
    const enabledState: ENEnablement = "ENABLED"
    return exposureNotifications.status[1] === enabledState
  }
  const isEnabled = hasExposureNotificationsEnabled()

  return (
    <View style={style.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        {isEnabled ? <CodeInputForm /> : <EnableExposureNotifications />}
      </SafeAreaView>
    </View>
  )
}

const style = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: Colors.faintGray,
  },
})

export default CodeInputScreen
