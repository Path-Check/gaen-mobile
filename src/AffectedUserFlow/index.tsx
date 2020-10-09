import React, { FunctionComponent } from "react"
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { AffectedUserProvider } from "./AffectedUserContext"
import Start from "./Start"
import CodeInput from "./CodeInput/CodeInputScreen"
import Complete from "./Complete"
import PublishConsent from "./PublishConsent/PublishConsentScreen"
import {
  AffectedUserFlowStackScreen,
  AffectedUserFlowStackScreens,
} from "../navigation"

import { Colors, Headers } from "../styles"

type AffectedUserFlowStackParams = {
  [key in AffectedUserFlowStackScreen]: undefined
}

const headerLeft = () => <HeaderLeft />
const HeaderLeft = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <HeaderBackButton
      tintColor={Colors.primary150}
      onPress={() => navigation.goBack()}
      label={t("screen_titles.home")}
    />
  )
}

const Stack = createStackNavigator<AffectedUserFlowStackParams>()

const AffectedUserStack: FunctionComponent = () => {
  return (
    <AffectedUserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserStart}
          component={Start}
          options={{ ...Headers.headerMinimalOptions, headerLeft: headerLeft }}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserCodeInput}
          component={CodeInput}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserPublishConsent}
          component={PublishConsent}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserComplete}
          component={Complete}
        />
      </Stack.Navigator>
    </AffectedUserProvider>
  )
}

export default AffectedUserStack
