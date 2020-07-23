import React from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import env from "react-native-config"

import { ExposureDatum, Possible, NoKnown, NoData } from "../exposure"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { DateTimeUtils } from "../utils"
import { Screens } from "../navigation"

import { Typography, Outlines, Colors, Buttons, Spacing } from "../styles"

interface ExposureDatumDetailsProps {
  exposureDatum: ExposureDatum
}

const ExposureDatumDetail = ({
  exposureDatum,
}: ExposureDatumDetailsProps): JSX.Element => {
  switch (exposureDatum.kind) {
    case "Possible": {
      return <PossibleExposureDetail datum={exposureDatum} />
    }
    case "NoKnown": {
      return <NoKnownExposureDetail datum={exposureDatum} />
    }
    case "NoData": {
      return <NoDataExposureDetail datum={exposureDatum} />
    }
  }
}

interface PossibleExposureDetailProps {
  datum: Possible
}

const PossibleExposureDetail = ({
  datum: { date, duration },
}: PossibleExposureDetailProps) => {
  const exposureDurationText = DateTimeUtils.durationToString(duration)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const displayNextSteps =
    env.DISPLAY_SELF_ASSESSMENT === "true" || env.AUTHORITY_ADVICE_URL
  const exposureDate = dayjs(date).format("dddd, MMM DD")
  const exposureTime = t("exposure_datum.possible.duration", {
    duration: exposureDurationText,
  })
  const explanationContent = t("exposure_datum.possible.explanation.bt", {
    duration: exposureDurationText,
  })
  const nextStepsButtonText = t("exposure_datum.possible.what_next")

  const handleOnPressNextSteps = () => {
    navigation.navigate(Screens.NextSteps)
  }

  return (
    <>
      <View style={styles.container}>
        <RTLEnabledText style={styles.date}>{exposureDate}</RTLEnabledText>
        <RTLEnabledText style={styles.info}>{exposureTime}</RTLEnabledText>
        <View style={styles.contentContainer}>
          <RTLEnabledText style={styles.content}>
            {explanationContent}
          </RTLEnabledText>
        </View>
        {displayNextSteps && (
          <NextStepsButton
            onPress={handleOnPressNextSteps}
            buttonText={nextStepsButtonText}
          />
        )}
      </View>
    </>
  )
}

interface NoKnownExposureDetailProps {
  datum: NoKnown
}

const NoKnownExposureDetail = ({
  datum: { date },
}: NoKnownExposureDetailProps) => {
  const { t } = useTranslation()
  const exposureDate = dayjs(date).format("dddd, MMM DD")
  const explanationContent = t("exposure_datum.no_known.explanation")
  return (
    <View style={styles.container}>
      <RTLEnabledText style={styles.date}>{exposureDate}</RTLEnabledText>
      <View style={styles.contentContainer}>
        <RTLEnabledText style={styles.content}>
          {explanationContent}
        </RTLEnabledText>
      </View>
    </View>
  )
}

interface NoDataExposureDetailProps {
  datum: NoData
}

interface NextStepsButtonProps {
  buttonText: string
  onPress: () => void
}

const NextStepsButton = ({ onPress, buttonText }: NextStepsButtonProps) => {
  return (
    <TouchableOpacity
      testID={"exposure-history-next-steps-button"}
      style={styles.nextStepsButton}
      onPress={onPress}
    >
      <RTLEnabledText style={styles.nextStepsButtonText}>
        {buttonText}
      </RTLEnabledText>
    </TouchableOpacity>
  )
}

const NoDataExposureDetail = ({
  datum: { date },
}: NoDataExposureDetailProps) => {
  const { t } = useTranslation()
  const exposureDate = dayjs(date).format("dddd, MMM DD")
  const explanationContent = t("exposure_datum.no_data.explanation")
  return (
    <View style={styles.container}>
      <RTLEnabledText style={styles.date}>{exposureDate}</RTLEnabledText>
      <View style={styles.contentContainer}>
        <RTLEnabledText style={styles.content}>
          {explanationContent}
        </RTLEnabledText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: Spacing.medium,
    ...Outlines.roundedBorder,
    borderColor: Colors.lighterGray,
  },
  date: {
    ...Typography.header6,
  },
  info: {
    lineHeight: Typography.largeLineHeight,
  },
  contentContainer: {
    paddingTop: Spacing.xxSmall,
  },
  content: {
    ...Typography.secondaryContent,
  },
  nextStepsButton: {
    ...Buttons.largeBlue,
    marginTop: Spacing.xLarge,
  },
  nextStepsButtonText: {
    ...Typography.buttonTextLight,
  },
})

export default ExposureDatumDetail
