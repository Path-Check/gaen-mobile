import React, { FunctionComponent, useEffect } from "react"
import { StyleSheet, View, Text, Button as RNButton } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTestModeContext } from "../../TestModeContext"

import { useStatusBarEffect, Screens } from "../../navigation"
import { useAffectedUserContext } from "../AffectedUserContext"
import PublishConsentForm from "./PublishConsentForm"

const PublishConsentScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const navigation = useNavigation()
  const { testModeEnabled } = useTestModeContext()
  const {
    certificate,
    hmacKey,
    setExposureSubmissionCredentials,
  } = useAffectedUserContext()

  useEffect(() => {
    testModeEnabled &&
      setExposureSubmissionCredentials("fakeCertificate", "fakeHmac")
  })

  if (hmacKey && certificate) {
    return <PublishConsentForm hmacKey={hmacKey} certificate={certificate} />
  } else {
    return (
      <View style={style.container}>
        <Text>Invalid State</Text>
        <RNButton
          onPress={() => {
            navigation.navigate(Screens.Home)
          }}
          title={"Go Back"}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default PublishConsentScreen
