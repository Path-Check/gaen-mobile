import React, { FunctionComponent } from "react"
import { Linking, View, StyleSheet, TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

import { Text } from "../../components"
import { useConfigurationContext } from "../../ConfigurationContext"
import { useCustomCopy } from "../../configuration/useCustomCopy"

import { Colors, Typography, Spacing, Affordances } from "../../styles"
import { Icons } from "../../assets"

const NoExposures: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <View>
      <View style={style.noExposureCard}>
        <Text style={style.headerText}>
          {t("exposure_history.no_exposure_reports")}
        </Text>
        <Text style={style.subheaderText}>
          {t("exposure_history.no_exposure_reports_over_past")}
        </Text>
      </View>
      <HealthGuidelines />
    </View>
  )
}

const HealthGuidelines: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    healthAuthorityLearnMoreUrl,
    measurementSystem,
  } = useConfigurationContext()
  const { healthAuthorityName } = useCustomCopy()

  const handleOnPressHALink = () => {
    Linking.openURL(healthAuthorityLearnMoreUrl)
  }

  const stayApartRecommendationText =
    measurementSystem === "Imperial"
      ? t("exposure_history.health_guidelines.six_feet_apart")
      : t("exposure_history.health_guidelines.two_meters_apart")

  return (
    <View style={style.card}>
      <Text style={style.cardHeaderText}>
        {t("exposure_history.protect_yourself_and_others")}
      </Text>
      {Boolean(healthAuthorityLearnMoreUrl) && (
        <>
          <Text style={style.cardSubheaderText}>
            {t("exposure_history.review_guidance_from_ha", {
              healthAuthorityName,
            })}
          </Text>
          <TouchableOpacity
            onPress={handleOnPressHALink}
            style={style.learnMoreCtaContainer}
          >
            <Text style={style.learnMoreCta}>
              {t("exposure_history.learn_more")}
            </Text>
            <SvgXml
              xml={Icons.Arrow}
              fill={Colors.primary.shade125}
              style={style.ctaArrow}
            />
          </TouchableOpacity>
          <Text style={style.listHeading}>
            {t("exposure_history.health_guidelines.title")}
          </Text>
        </>
      )}
      <HealthGuidelineItem
        icon={Icons.WashHands}
        text={t("exposure_history.health_guidelines.wash_your_hands")}
      />
      <HealthGuidelineItem
        icon={Icons.House}
        text={t("exposure_history.health_guidelines.stay_home")}
      />
      <HealthGuidelineItem
        icon={Icons.Mask}
        text={t("exposure_history.health_guidelines.wear_a_mask")}
      />
      <HealthGuidelineItem
        icon={Icons.StayApart}
        text={stayApartRecommendationText}
      />
    </View>
  )
}

type HealthGuidelineItemProps = {
  text: string
  icon: string
}
const HealthGuidelineItem: FunctionComponent<HealthGuidelineItemProps> = ({
  text,
  icon,
}) => {
  return (
    <View style={style.listItem}>
      <View style={style.listItemIconContainer}>
        <SvgXml xml={icon} fill={Colors.primary.shade125} />
      </View>
      <Text style={style.listItemText}>{text}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  noExposureCard: {
    ...Affordances.floatingContainer,
    backgroundColor: Colors.primary.shade125,
    borderColor: Colors.primary.shade125,
    marginBottom: Spacing.small,
    marginHorizontal: Spacing.medium,
  },
  headerText: {
    ...Typography.header.x20,
    paddingBottom: Spacing.xxxSmall,
    color: Colors.neutral.white,
  },
  subheaderText: {
    ...Typography.body.x30,
    color: Colors.secondary.shade10,
  },
  card: {
    ...Affordances.floatingContainer,
    marginHorizontal: Spacing.medium,
  },
  cardHeaderText: {
    ...Typography.header.x40,
    paddingBottom: Spacing.xSmall,
  },
  cardSubheaderText: {
    ...Typography.body.x20,
    paddingBottom: Spacing.large,
  },
  learnMoreCtaContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Spacing.large,
  },
  learnMoreCta: {
    ...Typography.button.secondary,
    color: Colors.primary.shade125,
  },
  ctaArrow: {
    marginLeft: Spacing.xxSmall,
  },
  listHeading: {
    ...Typography.header.x20,
    paddingBottom: Spacing.medium,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: Spacing.small,
  },
  listItemIconContainer: {
    width: Spacing.huge,
  },
  listItemText: {
    ...Typography.body.x20,
  },
})

export default NoExposures
