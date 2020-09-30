import React, { FunctionComponent } from "react"
import { View } from "react-native"
import { GlobalText } from "../components"
import { useTranslation } from "react-i18next"

export const CallYourHealthcareProvider: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <View>
      <GlobalText>
        {t("self_screener.guidance.call_your_healthcare_provider")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.stay_at_home")}</GlobalText>
      <GlobalText>{t("self_screener.guidance.dont_go_to_work")}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.dont_use_public_transport")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.seek_medical_care")}</GlobalText>
      <GlobalText>{t("self_screener.guidance.find_telehealth")}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.take_care_of_yourself")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.protect_others")}</GlobalText>
    </View>
  )
}

export const StayHomeExceptForMedicalCare: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <View>
      <GlobalText>{t("self_screener.guidance.stay_at_home")}</GlobalText>
      <GlobalText>{t("self_screener.guidance.dont_go_to_work")}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.dont_use_public_transport")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.seek_medical_care")}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.take_care_of_yourself")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.protect_others")}</GlobalText>
    </View>
  )
}

export const WatchForSymptoms: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <View>
      <GlobalText>
        {t("self_screener.guidance.watch_for_covid_symptoms")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.if_symptoms_develop")}</GlobalText>

      <GlobalText>
        {t("self_screener.guidance.may_help_you_feel_better")}
      </GlobalText>

      <GlobalText>{t("self_screener.guidance.rest")}</GlobalText>

      <GlobalText>{t("self_screener.guidance.drink_water")}</GlobalText>
      <GlobalText>{t("self_screener.guidance.cover_coughs")}</GlobalText>
      <GlobalText>{t("self_screener.guidance.clean_hands")}</GlobalText>
    </View>
  )
}

export const Quarantine: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <View>
      <GlobalText>{t("self_screener.guidance.stay_home_14_days")}</GlobalText>
      <GlobalText>{t("self_screener.guidance.take_temperature")}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.practice_social_distancing")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.stay_6_feet_away")}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.stay_away_from_higher_risk_people")}
      </GlobalText>
      <GlobalText>{t("self_screener.guidance.follow_cdc_guidance")}</GlobalText>
    </View>
  )
}
