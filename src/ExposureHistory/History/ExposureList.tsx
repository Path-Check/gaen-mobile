import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import env from "react-native-config"
import { useTranslation } from "react-i18next"

import { ExposureDatum } from "../../exposure"
import ExposureListItem from "./ExposureListItem"
import ExposureSummary from "./ExposureSummary"
import { Text } from "../../components"

import { Spacing, Typography } from "../../styles"

interface ExposureListProps {
  exposures: ExposureDatum[]
}

const DEFAULT_QUARANTINE_LENGTH = 10

const ExposureList: FunctionComponent<ExposureListProps> = ({ exposures }) => {
  const { t } = useTranslation()

  const envQuarantineLength = Number(env.QUARANTINE_LENGTH)

  const quarantineLength = isNaN(envQuarantineLength)
    ? DEFAULT_QUARANTINE_LENGTH
    : envQuarantineLength

  const mostRecentExposure = exposures[0]

  return (
    <View>
      <Text style={style.subheaderText}>{t("exposure_history.summary")}</Text>
      <ExposureSummary
        exposure={mostRecentExposure}
        quarantineLength={quarantineLength}
      />
      <Text style={style.subheaderText}>
        {t("exposure_history.all_exposures")}
      </Text>
      <ExposureListTemp exposures={exposures} />
    </View>
  )
}

interface ExposureListTempProps {
  exposures: ExposureDatum[]
}

const ExposureListTemp: FunctionComponent<ExposureListTempProps> = ({
  exposures,
}) => {
  return (
    <View testID={"exposure-list"}>
      {exposures.map((exposure) => {
        return <ExposureListItem key={exposure.date} exposureDatum={exposure} />
      })}
    </View>
  )
}

const style = StyleSheet.create({
  subheaderText: {
    ...Typography.header.x10,
    marginHorizontal: Spacing.medium,
    marginBottom: Spacing.xSmall,
  },
})
export default ExposureList
