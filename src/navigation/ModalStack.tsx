import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  HeaderBackButton,
  TransitionPresets,
} from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Stacks, ModalStackScreens, HomeStackScreens } from "./index"
import LanguageSelection from "../modals/LanguageSelection"
import ProtectPrivacy from "../modals/ProtectPrivacy"
import AffectedUserStack from "../AffectedUserFlow/"
import HowItWorksStack from "./HowItWorksStack"
import AnonymizedDataConsentScreen from "../modals/AnonymizedDataConsentScreen"
import SelfScreenerStack from "./SelfScreenerStack"
import ExposureDetectionStatus from "../Home/ExposureDetectionStatus"
import BluetoothInfo from "../Home/BluetoothInfo"
import ExposureNotificationsInfo from "../Home/ExposureNotificationsInfo"
import LocationInfo from "../Home/LocationInfo"
import CallbackStack from "./CallbackStack"

import { Colors } from "../styles"

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

const Stack = createStackNavigator()

const ModalStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ModalStackScreens.LanguageSelection}
        component={LanguageSelection}
        options={TransitionPresets.ModalTransition}
      />
      <Stack.Screen
        name={ModalStackScreens.ProtectPrivacy}
        component={ProtectPrivacy}
        options={TransitionPresets.ModalTransition}
      />
      <Stack.Screen
        name={Stacks.AffectedUserStack}
        component={AffectedUserStack}
        options={TransitionPresets.ModalTransition}
      />
      <Stack.Screen name={ModalStackScreens.HowItWorksReviewFromSettings}>
        {(props) => (
          <HowItWorksStack {...props} destinationOnSkip={Stacks.Settings} />
        )}
      </Stack.Screen>
      <Stack.Screen name={ModalStackScreens.HowItWorksReviewFromConnect}>
        {(props) => (
          <HowItWorksStack {...props} destinationOnSkip={Stacks.Connect} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={ModalStackScreens.AnonymizedDataConsent}
        component={AnonymizedDataConsentScreen}
      />
      <Stack.Screen
        name={ModalStackScreens.SelfScreenerFromExposureDetails}
        options={TransitionPresets.ModalTransition}
      >
        {(props) => {
          return (
            <SelfScreenerStack
              {...props}
              destinationOnCancel={Stacks.ExposureHistoryFlow}
            />
          )
        }}
      </Stack.Screen>
      <Stack.Screen
        name={ModalStackScreens.SelfScreenerFromHome}
        options={TransitionPresets.ModalTransition}
      >
        {(props) => {
          return (
            <SelfScreenerStack {...props} destinationOnCancel={Stacks.Home} />
          )
        }}
      </Stack.Screen>
      <Stack.Screen
        name={HomeStackScreens.ExposureDetectionStatus}
        component={ExposureDetectionStatus}
        options={{
          title: "",
          headerShown: true,
          headerLeft: headerLeft,
          headerStyle: { shadowColor: Colors.transparent },
        }}
      />
      <Stack.Screen
        name={HomeStackScreens.BluetoothInfo}
        component={BluetoothInfo}
      />
      <Stack.Screen
        name={HomeStackScreens.ExposureNotificationsInfo}
        component={ExposureNotificationsInfo}
      />
      <Stack.Screen
        name={HomeStackScreens.LocationInfo}
        component={LocationInfo}
      />
      <Stack.Screen
        name={ModalStackScreens.CallbackStack}
        component={CallbackStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default ModalStack
