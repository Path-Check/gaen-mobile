import React, { FunctionComponent, useState, useEffect } from "react"
import { View, Text, Button, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import { useStatusBarEffect, Screens } from "../../navigation"
import { useAffectedUserContext } from "../AffectedUserContext"
import PublishConsentForm from "./PublishConsentForm"
import { useExposureContext } from "../../ExposureContext"

const PublishConsentScreen: FunctionComponent = () => {
  useStatusBarEffect("light-content")
  const [revisionToken, setRevisionToken] = useState("")
  const { storeRevisionToken, getRevisionToken } = useExposureContext()
  const navigation = useNavigation()
  const { certificate, hmacKey, exposureKeys } = useAffectedUserContext()
  const appPackageName = Platform.select({
    ios: env.IOS_BUNDLE_ID,
    android: env.ANDROID_APPLICATION_ID,
  }) as string

  useEffect(() => {
    getRevisionToken().then((token) => {
      setRevisionToken(token)
    })
  }, [getRevisionToken])

  if (hmacKey && certificate) {
    return (
      <PublishConsentForm
        hmacKey={hmacKey}
        certificate={certificate}
        exposureKeys={exposureKeys}
        storeRevisionToken={storeRevisionToken}
        revisionToken={revisionToken}
        appPackageName={appPackageName}
        regionCodes={env.REGION_CODES.split(",")}
      />
    )
  } else {
    return (
      <View>
        <Text>Invalid State</Text>
        <Button
          onPress={() => {
            navigation.navigate(Screens.Home)
          }}
          title={"Go Back"}
        />
      </View>
    )
  }
}

export default PublishConsentScreen
