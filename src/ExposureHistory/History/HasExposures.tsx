import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import env from "react-native-config"
import { useTranslation } from "react-i18next"

import { ExposureDatum } from "../../exposure"
import ExposureListItem from "./ExposureListItem"
import ExposureSummary from "./ExposureSummary"
import NextSteps from "./NextSteps"
import { Text } from "../../components"

import { Colors, Outlines, Spacing, Typography } from "../../styles"

interface HasExposuresProps {
  exposures: ExposureDatum[]
}

const DEFAULT_QUARANTINE_LENGTH = 10

const HasExposures: FunctionComponent<HasExposuresProps> = ({ exposures }) => {
  const { t } = useTranslation()

  const envQuarantineLength = Number(env.QUARANTINE_LENGTH)

  const quarantineLength = isNaN(envQuarantineLength)
    ? DEFAULT_QUARANTINE_LENGTH
    : envQuarantineLength

  const mostRecentExposure = exposures[0]

  return (
    <View style={style.container}>
      <View style={style.sectionContainer}>
        <Text style={style.subheaderText}>
          {t("exposure_history.exposure_report")}
        </Text>
        <ExposureSummary
          exposure={mostRecentExposure}
          quarantineLength={quarantineLength}
        />
      </View>

      <View style={{ ...style.sectionContainer, paddingBottom: Spacing.small }}>
        <Text style={style.subheaderText}>
          {t("exposure_history.possible_exposures")}
        </Text>
        <Text style={style.bodyText}>
          {t("exposure_history.your_device_exchanged")}
        </Text>
        <ExposureList exposures={exposures} />
      </View>

      <View
        style={{ ...style.sectionContainer, paddingBottom: Spacing.xSmall }}
      >
        <Text style={style.subheaderText}>
          {t("exposure_history.next_steps")}
        </Text>
        <NextSteps />
      </View>
    </View>
  )
}

interface ExposureListProps {
  exposures: ExposureDatum[]
}

const ExposureList: FunctionComponent<ExposureListProps> = ({ exposures }) => {
  return (
    <View testID={"exposure-list"}>
      {exposures.map((exposure) => {
        return <ExposureListItem key={exposure.date} exposureDatum={exposure} />
      })}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.medium,
  },
  sectionContainer: {
    marginBottom: Spacing.medium,
    paddingBottom: Spacing.xLarge,
    borderColor: Colors.neutral.shade10,
    borderBottomWidth: Outlines.hairline,
  },
  subheaderText: {
    ...Typography.header.x30,
    ...Typography.style.semibold,
    marginBottom: Spacing.xSmall,
  },
  bodyText: {
    ...Typography.body.x20,
    marginBottom: Spacing.medium,
  },
})

export default HasExposures
