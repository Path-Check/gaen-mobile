import React, { FunctionComponent, useState, useEffect } from "react"
import { View, Text, Button } from "react-native"

import { StatusBar } from "../../components"
import { useStatusBarEffect } from "../../navigation"
import { useAffectedUserContext } from "../AffectedUserContext"
import PublishConsentForm from "./PublishConsentForm"
import { useExposureContext } from "../../ExposureContext"
import { useConfigurationContext } from "../../ConfigurationContext"

import { Colors } from "../../styles"

const PublishConsentScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const [revisionToken, setRevisionToken] = useState("")
  const { storeRevisionToken, getRevisionToken } = useExposureContext()
  const {
    certificate,
    hmacKey,
    exposureKeys,
    navigateOutOfStack,
    symptomOnsetDate,
  } = useAffectedUserContext()
  const { appPackageName, regionCodes } = useConfigurationContext()

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
        regionCodes={regionCodes}
        navigateOutOfStack={navigateOutOfStack}
        symptomOnsetDate={symptomOnsetDate}
      />
    )
  } else {
    return (
      <>
        <StatusBar backgroundColor={Colors.background.primaryLight} />
        <View>
          <Text>Invalid State</Text>
          <Button onPress={navigateOutOfStack} title={"Go Back"} />
        </View>
      </>
    )
  }
}

export default PublishConsentScreen
