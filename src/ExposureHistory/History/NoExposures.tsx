import React, { FunctionComponent } from "react"
import env from "react-native-config"
import { Linking, View, StyleSheet, TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

import { RTLEnabledText } from "../../components/RTLEnabledText"
import { Colors, Typography, Spacing, Outlines } from "../../styles"
import { Icons } from "../../assets"

const {
  GAEN_AUTHORITY_NAME: healthAuthorityName,
  AUTHORITY_ADVICE_URL: healthAuthorityLink,
} = env
const NoExposures: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <View>
      <View style={style.noExposureCard}>
        <RTLEnabledText style={style.headerText}>
          {t("exposure_history.no_exposure_reports")}
        </RTLEnabledText>
        <RTLEnabledText style={style.subheaderText}>
          {t("exposure_history.no_exposure_reports_over_past")}
        </RTLEnabledText>
      </View>
      <HealthGuidelines />
    </View>
  )
}

const HealthGuidelines: FunctionComponent = () => {
  const { t } = useTranslation()
  const handleOnPressHALink = () => {
    Linking.openURL(healthAuthorityLink)
  }

  return (
    <View style={style.card}>
      <RTLEnabledText style={style.cardHeaderText}>
        {t("exposure_history.protect_yourself_and_others")}
      </RTLEnabledText>
      {Boolean(healthAuthorityLink) && (
        <>
          <RTLEnabledText style={style.cardSubheaderText}>
            {t("exposure_history.review_guidance_from_ha", {
              healthAuthorityName,
            })}
          </RTLEnabledText>
          <TouchableOpacity
            onPress={handleOnPressHALink}
            style={style.learnMoreCtaContainer}
          >
            <RTLEnabledText style={style.learnMoreCta}>
              {t("exposure_history.learn_more")}
            </RTLEnabledText>
            <SvgXml
              xml={Icons.Arrow}
              fill={Colors.primaryViolet}
              style={style.ctaArrow}
            />
          </TouchableOpacity>
          <RTLEnabledText style={style.listHeading}>
            {t("exposure_history.health_guidelines.title")}
          </RTLEnabledText>
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
        icon={Icons.SixFeet}
        text={t("exposure_history.health_guidelines.six_feet_apart")}
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
        <SvgXml xml={icon} fill={Colors.primaryViolet} />
      </View>
      <RTLEnabledText style={style.listItemText}>{text}</RTLEnabledText>
    </View>
  )
}

const style = StyleSheet.create({
  noExposureCard: {
    backgroundColor: Colors.primaryViolet,
    ...Outlines.roundedBorder,
    borderColor: Colors.primaryViolet,
    padding: Spacing.large,
  },
  headerText: {
    ...Typography.mainContent,
    ...Typography.bold,
    paddingBottom: Spacing.xxxSmall,
    color: Colors.white,
  },
  subheaderText: {
    ...Typography.description,
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
    ...Outlines.roundedBorder,
    borderColor: Colors.white,
    padding: Spacing.large,
    marginTop: Spacing.large,
  },
  cardHeaderText: {
    ...Typography.header6,
    paddingBottom: Spacing.xSmall,
  },
  cardSubheaderText: {
    ...Typography.description,
    paddingBottom: Spacing.xSmall,
  },
  learnMoreCtaContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Spacing.large,
  },
  learnMoreCta: {
    color: Colors.primaryViolet,
  },
  ctaArrow: {
    marginLeft: Spacing.xxSmall,
  },
  listHeading: {
    ...Typography.mainContent,
    ...Typography.bold,
    paddingBottom: Spacing.large,
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
    color: Colors.darkGray,
  },
})

export default NoExposures
