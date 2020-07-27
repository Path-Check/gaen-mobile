import React, { FunctionComponent } from "react"
import { TouchableOpacity, View, StyleSheet, Linking } from "react-native"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import env from "react-native-config"

import { ExposureHistoryStackParamList } from "../navigation"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { Screens, useStatusBarEffect } from "../navigation"
import { DateTimeUtils } from "../utils"

import { Spacing, Typography, Outlines } from "../styles"
import { Icons } from "../assets"

import { Colors, Iconography } from "../styles"

const {
  GAEN_AUTHORITY_NAME: healthAuthorityName,
  AUTHORITY_ADVICE_URL,
  DISPLAY_SELF_ASSESSMENT,
} = env

interface Props {
  route: RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
}

const ExposureDetail: FunctionComponent<Props> = ({ route }) => {
  useStatusBarEffect("light-content")
  const navigation = useNavigation()
  const { t } = useTranslation()
  const displayNextSteps =
    DISPLAY_SELF_ASSESSMENT === "true" || AUTHORITY_ADVICE_URL

  const { exposureDatum } = route.params

  const headerText = t("exposure_history.exposure_detail.header")
  const contentText = t("exposure_history.exposure_detail.content")

  const haGuidanceHeaderText = t(
    "exposure_history.exposure_detail.ha_guidance_header",
  )
  const haGuidanceSubheaderText = t(
    "exposure_history.exposure_detail.ha_guidance_subheader",
    {
      healthAuthorityName,
    },
  )
  const haGuidanceLinkText = t(
    "exposure_history.exposure_detail.ha_guidance_more",
  )

  const handleOnPressTakeAssessment = () => {
    AUTHORITY_ADVICE_URL
      ? Linking.openURL(AUTHORITY_ADVICE_URL)
      : navigation.navigate(Screens.SelfAssessment)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainerCircle}>
          <SvgXml
            xml={Icons.ExposureIcon}
            width={Iconography.extraLarge}
            height={Iconography.extraLarge}
          />
        </View>
        <RTLEnabledText>
          {DateTimeUtils.timeAgoInWords(exposureDatum.date)}
        </RTLEnabledText>
        <RTLEnabledText style={styles.headerText}>{headerText}</RTLEnabledText>
        <RTLEnabledText style={styles.contentText}>
          {contentText}
        </RTLEnabledText>
      </View>
      {displayNextSteps && (
        <View style={styles.haGuidanceContainer}>
          <RTLEnabledText style={styles.haGuidanceHeaderText}>
            {haGuidanceHeaderText}
          </RTLEnabledText>
          <RTLEnabledText style={styles.haGuidanceSubheaderText}>
            {haGuidanceSubheaderText}
          </RTLEnabledText>
          <TouchableOpacity onPress={handleOnPressTakeAssessment}>
            <RTLEnabledText style={styles.readMoreLink}>
              {haGuidanceLinkText}
            </RTLEnabledText>
            <SvgXml
              xml={Icons.Arrow}
              color={Colors.white}
              style={styles.readMoreArrow}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: Colors.white,
  },
  haGuidanceHeaderText: {
    ...Typography.footer,
    marginBottom: Spacing.medium,
  },
  haGuidanceSubheaderText: { marginBottom: Spacing.medium },
  headerText: {
    ...Typography.header3,
  },
  contentText: {
    ...Typography.mainContent,
    paddingTop: Spacing.small,
  },
  haGuidanceContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.medium,
    marginTop: Spacing.xxSmall,
  },
  iconContainerCircle: {
    ...Iconography.extraLargeIcon,
    ...Outlines.glowShadow,
    alignSelf: "center",
  },
  readMoreArrow: {
    marginLeft: Spacing.xxSmall,
  },
  readMoreLink: {
    color: Colors.primaryViolet,
  },
})

export default ExposureDetail
