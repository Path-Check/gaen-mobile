import React, { FunctionComponent } from "react"
import { Linking, View, StyleSheet } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"

import { usePermissionsContext } from "../../Device/PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"
import { applyHeaderLeftBackButton } from "../../navigation/HeaderLeftBackButton"
import { useAffectedUserContext } from "../AffectedUserContext"
import { AffectedUserFlowStackParamList } from "../../navigation/AffectedUserFlowStack"
import { useConfigurationContext } from "../../configuration"
import * as NativeModule from "../../gaen/nativeModule"

import { Colors } from "../../styles"

type CodeInputScreenRouteProp = RouteProp<
  AffectedUserFlowStackParamList,
  "AffectedUserCodeInput"
>

const CodeInputScreen: FunctionComponent = () => {
  const navigation = useNavigation()
  const route = useRoute<CodeInputScreenRouteProp>()
  const { navigateOutOfStack, setLinkCode } = useAffectedUserContext()
  const { exposureNotifications } = usePermissionsContext()
  const { enxRegion } = useConfigurationContext()
  const requestExposureNotifications = async () => {
    if (linkCode) {
      const response = await NativeModule.requestAuthorization()

      if (response.kind === "failure" && response.error === "Restricted") {
        Linking.openURL(`ens://v?c=${linkCode}&r=${enxRegion}`)
      }
    }
  }

  const linkCode: string | undefined = route?.params?.c || route?.params?.code

  if (linkCode) {
    setLinkCode(linkCode)
    requestExposureNotifications()
    navigation.setOptions({
      headerLeft: applyHeaderLeftBackButton(navigateOutOfStack),
    })
  }

  const isENActive = exposureNotifications.status === "Active"

  return (
    <View style={style.container}>
      {isENActive ? (
        <CodeInputForm linkCode={linkCode} />
      ) : (
        <EnableExposureNotifications />
      )}
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
