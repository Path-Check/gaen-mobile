import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import { Stacks, ModalStackScreens } from "./index"
import LanguageSelection from "../modals/LanguageSelection"
import ProtectPrivacy from "../modals/ProtectPrivacy"
import AffectedUserStack from "../AffectedUserFlow/"
import HowItWorksStack from "./HowItWorksStack"
import AnonymizedDataConsentScreen from "../modals/AnonymizedDataConsentScreen"
import SelfScreenerStack from "./SelfScreenerStack"

const Stack = createStackNavigator()

const ModalStack: FunctionComponent = () => {
  return (
    <Stack.Navigator headerMode="none">
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
        options={{
          headerShown: false,
        }}
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
        options={{
          headerShown: false,
        }}
      >
        {(props) => {
          return (
            <SelfScreenerStack {...props} destinationOnCancel={Stacks.Home} />
          )
        }}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default ModalStack
