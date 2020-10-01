import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { SvgXml } from "react-native-svg"

import { SelfScreenerProvider } from "../SelfScreenerContext"
import { SelfScreenerStackScreens, Stack as AllStacks } from "./index"

import SelfScreenerIntro from "../SelfScreener/SelfScreenerIntro"
import EmergencySymptomsQuestions from "../SelfScreener/EmergencySymptomsQuestions"
import NoEmergencySymptoms from "../SelfScreener/NoEmergencySymptoms"
import CallEmergencyServices from "../SelfScreener/CallEmergencyServices"
import GeneralSymptoms from "../SelfScreener/GeneralSymptoms"
import GeneralSymptomsSummary from "../SelfScreener/GeneralSymptomsSummary"
import UnderlyingConditions from "../SelfScreener/UnderlyingConditions"
import AgeRangeQuestion from "../SelfScreener/AgeRangeQuestion"
import Summary from "../SelfScreener/Summary"
import Guidance from "../SelfScreener/Guidance"

import { Icons } from "../assets"
import { Colors, Iconography, Spacing } from "../styles"

const Stack = createStackNavigator()

const backButton = () => <BackButton />
const BackButton = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={navigation.goBack}
      accessible
      accessibilityLabel={t("export.code_input_button_back")}
    >
      <View style={style.navigationButton}>
        <SvgXml
          xml={Icons.ArrowLeft}
          fill={Colors.black}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
        />
      </View>
    </TouchableOpacity>
  )
}

type SelfScreenerStackProps = {
  destinationOnCancel: AllStacks
}

const SelfScreenerStack: FunctionComponent<SelfScreenerStackProps> = ({
  destinationOnCancel,
}) => {
  const cancelButton = () => (
    <CancelButton destinationOnCancel={destinationOnCancel} />
  )
  const CancelButton: FunctionComponent<SelfScreenerStackProps> = ({
    destinationOnCancel,
  }) => {
    const { t } = useTranslation()
    const navigation = useNavigation()

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(destinationOnCancel)}
        accessible
        accessibilityLabel={t("export.code_input_button_cancel")}
      >
        <View style={style.navigationButton}>
          <SvgXml
            xml={Icons.X}
            fill={Colors.black}
            width={Iconography.xxSmall}
            height={Iconography.xxSmall}
          />
        </View>
      </TouchableOpacity>
    )
  }

  const navigationBarOptions: StackNavigationOptions = {
    title: "",
    headerStyle: { backgroundColor: Colors.secondary10 },
    headerLeft: backButton,
    headerRight: cancelButton,
    headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
  }

  return (
    <SelfScreenerProvider>
      <Stack.Navigator screenOptions={navigationBarOptions}>
        <Stack.Screen
          name={SelfScreenerStackScreens.SelfScreenerIntro}
          component={SelfScreenerIntro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.EmergencySymptomsQuestions}
          component={EmergencySymptomsQuestions}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.NoEmergencySymptoms}
          component={NoEmergencySymptoms}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.CallEmergencyServices}
          component={CallEmergencyServices}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.GeneralSymptoms}
          component={GeneralSymptoms}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.GeneralSymptomsSummary}
          component={GeneralSymptomsSummary}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.UnderlyingConditions}
          component={UnderlyingConditions}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.AgeRange}
          component={AgeRangeQuestion}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.Summary}
          component={Summary}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SelfScreenerStackScreens.Guidance}
          component={Guidance}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SelfScreenerProvider>
  )
}

const style = StyleSheet.create({
  navigationButton: {
    padding: Spacing.medium,
  },
})

export default SelfScreenerStack
