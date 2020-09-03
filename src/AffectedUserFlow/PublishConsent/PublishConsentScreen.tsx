import React, { FunctionComponent, useState, useEffect } from "react"
import { View, Text, Button } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { StatusBar } from "../../components"
import { Screens, useStatusBarEffect } from "../../navigation"
import { useAffectedUserContext } from "../AffectedUserContext"
import PublishConsentForm from "./PublishConsentForm"
import { useExposureContext } from "../../ExposureContext"
import { useConfigurationContext } from "../../ConfigurationContext"

import { Colors } from "../../styles"

const PublishConsentScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const [revisionToken, setRevisionToken] = useState("")
  const { storeRevisionToken, getRevisionToken } = useExposureContext()
  const navigation = useNavigation()
  const { certificate, hmacKey, exposureKeys } = useAffectedUserContext()
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
      />
    )
  } else {
    return (
      <>
        <StatusBar backgroundColor={Colors.primaryLightBackground} />
        <View>
          <Text>Invalid State</Text>
          <Button
            onPress={() => {
              navigation.navigate(Screens.Home)
            }}
            title={"Go Back"}
          />
        </View>
      </>
    )
  }
}

export default PublishConsentScreen
