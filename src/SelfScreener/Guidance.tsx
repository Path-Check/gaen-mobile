import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Button, GlobalText } from "../components"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import { SymptomGroup } from "./selfScreener"
import { Stack, Stacks } from "../navigation"

import { Outlines, Colors, Spacing, Typography } from "../styles"

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
        <GlobalText style={style.bullet1}>
          {t("self_screener.guidance.call_your_healthcare_provider")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.stay_at_home")}
        </GlobalText>
        <View style={style.bullet3Container}>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.dont_go_to_work")}
          </GlobalText>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.dont_use_public_transport")}
          </GlobalText>
        </View>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.seek_medical_care")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.find_telehealth")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.take_care_of_yourself")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.protect_others")}
        </GlobalText>
      </>
    )
  }

  const StayHomeExceptForMedicalCare: FunctionComponent = () => {
    const { t } = useTranslation()

    return (
      <>
        <GlobalText style={style.bullet1}>
          {t("self_screener.guidance.stay_at_home")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.dont_go_to_work")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.dont_use_public_transport")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.seek_medical_care")}
        </GlobalText>
      </>
    )
  }

  const WatchForSymptoms: FunctionComponent = () => {
    const { t } = useTranslation()
    return (
      <>
        <GlobalText style={style.bullet1}>
          {t("self_screener.guidance.watch_for_covid_symptoms")}
        </GlobalText>
        <GlobalText style={style.bullet1}>
          {t("self_screener.guidance.if_symptoms_develop")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.may_help_you_feel_better")}
        </GlobalText>
        <View style={style.bullet3Container}>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.rest")}
          </GlobalText>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.drink_water")}
          </GlobalText>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.cover_coughs")}
          </GlobalText>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.clean_hands")}
          </GlobalText>
        </View>
      </>
    )
  }

  const Quarantine: FunctionComponent = () => {
    const { t } = useTranslation()

    return (
      <>
        <GlobalText style={style.bullet1}>
          {t("self_screener.guidance.stay_home_14_days")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.take_temperature")}
        </GlobalText>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.practice_social_distancing")}
        </GlobalText>
        <View style={style.bullet3Container}>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.stay_6_feet_away")}
          </GlobalText>
          <GlobalText style={style.bullet3}>
            {t("self_screener.guidance.stay_away_from_higher_risk_people")}
          </GlobalText>
        </View>
        <GlobalText style={style.bullet2}>
          {t("self_screener.guidance.follow_cdc_guidance")}
        </GlobalText>
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
        <GlobalText style={style.headerText}>
          {t("self_screener.guidance.guidance")}
        </GlobalText>
        <GlobalText style={style.subheaderText}>
          {introForSymptomGroup(symptomGroup)}
        </GlobalText>
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
    paddingBottom: Spacing.xxLarge,
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
    paddingVertical: Spacing.xLarge,
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
    backgroundColor: Colors.secondary10,
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.secondary75,
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
