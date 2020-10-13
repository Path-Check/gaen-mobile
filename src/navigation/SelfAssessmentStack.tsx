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

import { SelfAssessmentProvider } from "../SelfAssessmentContext"
import { SelfAssessmentStackScreens, Stack as AllStacks } from "./index"

import SelfAssessmentIntro from "../SelfAssessment/SelfAssessmentIntro"
import EmergencySymptomsQuestions from "../SelfAssessment/EmergencySymptomsQuestions"
import HowAreYouFeeling from "../SelfAssessment/HowAreYouFeeling"
import CallEmergencyServices from "../SelfAssessment/CallEmergencyServices"
import GeneralSymptoms from "../SelfAssessment/GeneralSymptoms"
import UnderlyingConditions from "../SelfAssessment/UnderlyingConditions"
import AgeRangeQuestion from "../SelfAssessment/AgeRangeQuestion"
import Guidance from "../SelfAssessment/Guidance"
import { applyHeaderLeftBackButton } from "./HeaderLeftBackButton"

import { Icons } from "../assets"
import { Headers, Colors, Iconography, Spacing } from "../styles"

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

type SelfAssessmentStackProps = {
  destinationOnCancel: AllStacks
}

const SelfAssessmentStack: FunctionComponent<SelfAssessmentStackProps> = ({
  destinationOnCancel,
}) => {
  const cancelButton = () => (
    <CancelButton destinationOnCancel={destinationOnCancel} />
  )
  const CancelButton: FunctionComponent<SelfAssessmentStackProps> = ({
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
    headerStyle: { backgroundColor: Colors.primaryLightBackground },
    headerLeft: backButton,
    headerRight: cancelButton,
    headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
  }

  return (
    <SelfAssessmentProvider>
      <Stack.Navigator headerMode="screen" screenOptions={navigationBarOptions}>
        <Stack.Screen
          name={SelfAssessmentStackScreens.SelfAssessmentIntro}
          component={SelfAssessmentIntro}
          options={{
            ...Headers.headerMinimalOptions,
            headerLeft: applyHeaderLeftBackButton(),
            headerRight: () => null,
          }}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.EmergencySymptomsQuestions}
          component={EmergencySymptomsQuestions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.HowAreYouFeeling}
          component={HowAreYouFeeling}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.CallEmergencyServices}
          component={CallEmergencyServices}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.GeneralSymptoms}
          component={GeneralSymptoms}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.UnderlyingConditions}
          component={UnderlyingConditions}
        />
        <Stack.Screen
          name={SelfAssessmentStackScreens.AgeRange}
          component={AgeRangeQuestion}
        />
        <Stack.Screen name={SelfAssessmentStackScreens.Guidance}>
          {(props) => {
            return (
              <Guidance {...props} destinationOnCancel={destinationOnCancel} />
            )
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </SelfAssessmentProvider>
  )
}

const style = StyleSheet.create({
  navigationButton: {
    padding: Spacing.medium,
  },
})

export default SelfAssessmentStack
