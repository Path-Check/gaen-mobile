import React, { FunctionComponent } from "react"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Button, Text } from "../components"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import { SymptomGroup } from "./selfScreener"
import { Stack, Stacks } from "../navigation"

import { Outlines, Colors, Spacing, Typography } from "../styles"
import { Images } from "../assets"

interface GuidanceProps {
  destinationOnCancel?: Stack
}

const Guidance: FunctionComponent<GuidanceProps> = ({
  destinationOnCancel = Stacks.ExposureHistoryFlow,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { symptomGroup } = useSelfScreenerContext()

  if (symptomGroup === null) {
    return null
  }

  const handleOnPressDone = () => {
    navigation.navigate(destinationOnCancel)
  }

  const CallYourHealthcareProvider: FunctionComponent = () => {
    const { t } = useTranslation()
    return (
      <>
        <Text style={style.bullet1}>
          {t("self_screener.guidance.call_your_healthcare_provider")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.stay_at_home")}
        </Text>
        <View style={style.bullet3Container}>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.dont_go_to_work")}
          </Text>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.dont_use_public_transport")}
          </Text>
        </View>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.seek_medical_care")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.find_telehealth")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.take_care_of_yourself")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.protect_others")}
        </Text>
      </>
    )
  }

  const StayHomeExceptForMedicalCare: FunctionComponent = () => {
    const { t } = useTranslation()

    return (
      <>
        <Text style={style.bullet1}>
          {t("self_screener.guidance.stay_at_home")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.dont_go_to_work")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.dont_use_public_transport")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.seek_medical_care")}
        </Text>
      </>
    )
  }

  const WatchForSymptoms: FunctionComponent = () => {
    const { t } = useTranslation()
    return (
      <>
        <Text style={style.bullet1}>
          {t("self_screener.guidance.watch_for_covid_symptoms")}
        </Text>
        <Text style={style.bullet1}>
          {t("self_screener.guidance.if_symptoms_develop")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.may_help_you_feel_better")}
        </Text>
        <View style={style.bullet3Container}>
          <Text style={style.bullet3}>{t("self_screener.guidance.rest")}</Text>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.drink_water")}
          </Text>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.cover_coughs")}
          </Text>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.clean_hands")}
          </Text>
        </View>
      </>
    )
  }

  const Quarantine: FunctionComponent = () => {
    const { t } = useTranslation()

    return (
      <>
        <Text style={style.bullet1}>
          {t("self_screener.guidance.stay_home_14_days")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.take_temperature")}
        </Text>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.practice_social_distancing")}
        </Text>
        <View style={style.bullet3Container}>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.stay_6_feet_away")}
          </Text>
          <Text style={style.bullet3}>
            {t("self_screener.guidance.stay_away_from_higher_risk_people")}
          </Text>
        </View>
        <Text style={style.bullet2}>
          {t("self_screener.guidance.follow_cdc_guidance")}
        </Text>
      </>
    )
  }

  const introForSymptomGroup = (group: SymptomGroup) => {
    switch (group) {
      case SymptomGroup.PRIMARY_1:
        return t("self_screener.guidance.you_have_underlying_conditions")
      case SymptomGroup.PRIMARY_2:
      case SymptomGroup.SECONDARY_2:
      case SymptomGroup.PRIMARY_3:
      case SymptomGroup.SECONDARY_1:
        return t("self_screener.guidance.your_symptoms_might_be_related")
      case SymptomGroup.NON_COVID:
        return t("self_screener.guidance.monitor_your_symptoms")
      case SymptomGroup.ASYMPTOMATIC:
        return t("self_screener.guidance.feeling_fine")
      default:
        return t("self_screener.guidance.feeling_fine")
    }
  }

  const instructionsForSymptomGroup = (group: SymptomGroup) => {
    switch (group) {
      case SymptomGroup.PRIMARY_1:
      case SymptomGroup.PRIMARY_2:
      case SymptomGroup.SECONDARY_2:
        return <CallYourHealthcareProvider />
      case SymptomGroup.PRIMARY_3:
      case SymptomGroup.SECONDARY_1:
        return <StayHomeExceptForMedicalCare />
      case SymptomGroup.NON_COVID:
        return <WatchForSymptoms />
      case SymptomGroup.ASYMPTOMATIC:
        return <Quarantine />
      default:
        return <Quarantine />
    }
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.topScrollViewBackground} />
      <View style={style.headerContainer}>
        <Image source={Images.SelfScreenerIntro} style={style.image} />
        <Text style={style.headerText}>
          {t("self_screener.guidance.guidance")}
        </Text>
        <Text style={style.subheaderText}>
          {introForSymptomGroup(symptomGroup)}
        </Text>
      </View>
      <View style={style.bulletListContainer}>
        {instructionsForSymptomGroup(symptomGroup)}
      </View>
      <Button
        onPress={handleOnPressDone}
        label={t("common.done")}
        customButtonStyle={style.button}
        customButtonInnerStyle={style.buttonInner}
      />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingBottom: Spacing.xxxHuge,
  },
  topScrollViewBackground: {
    position: "absolute",
    top: "-100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.secondary10,
    height: "100%",
  },
  headerContainer: {
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
    backgroundColor: Colors.secondary10,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: Spacing.xLarge,
  },
  headerText: {
    ...Typography.header1,
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.header4,
    ...Typography.base,
    color: Colors.black,
  },
  bulletListContainer: {
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.primaryLightBackground,
    marginBottom: Spacing.xxLarge,
  },
  bullet1: {
    ...Typography.header4,
    color: Colors.primary100,
    marginBottom: Spacing.medium,
  },
  bullet2: {
    ...Typography.body1,
    ...Typography.mediumBold,
    color: Colors.primaryText,
    marginBottom: Spacing.small,
  },
  bullet3Container: {
    paddingLeft: Spacing.medium,
    paddingTop: Spacing.xxSmall,
    marginBottom: Spacing.small,
    borderLeftWidth: Outlines.hairline,
    borderLeftColor: Colors.neutral25,
  },
  bullet3: {
    ...Typography.body1,
    marginBottom: Spacing.xxSmall,
  },
  button: {
    width: "100%",
    paddingHorizontal: Spacing.large,
  },
  buttonInner: {
    width: "100%",
  },
})

export default Guidance
