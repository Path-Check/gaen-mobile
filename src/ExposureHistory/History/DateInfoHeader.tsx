import React, { FunctionComponent, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"

import { useExposureContext } from "../../ExposureContext"

import { GlobalText } from "../../components"
import { DateTimeUtils } from "../../utils"

import { Colors, Iconography, Typography } from "../../styles"
import { SvgXml } from "react-native-svg"
import { Icons } from "../../assets"

type Posix = number

interface DateInfoHeaderProps {
  lastDetectionDate: Posix | null
}

const DateInfoHeader: FunctionComponent<DateInfoHeaderProps> = ({
  lastDetectionDate,
}) => {
  const { t } = useTranslation()
  const { checkForNewExposures } = useExposureContext()
  const [refreshing, setRefreshing] = useState(false)

  const determineUpdatedAtText = (posix: Posix): string => {
    const updated = t("exposure_history.updated")
    const timeAgoInWords = DateTimeUtils.timeAgoInWords(posix)
    return ` • ${updated} ${timeAgoInWords}`
  }

  const lastDaysText = t("exposure_history.last_days")
  const updatedAtText = lastDetectionDate
    ? determineUpdatedAtText(lastDetectionDate)
    : ""

  const handleRefreshButtonPressed = async () => {
    setRefreshing(true)
    await checkForNewExposures()
    setRefreshing(false)
  }

  return (
    <View style={style.headerContainer}>
      <GlobalText style={style.subHeaderText}>
        <>
          {lastDaysText}
          {updatedAtText}
        </>
      </GlobalText>
      <TouchableOpacity
        testID={"refresh-button"}
        onPress={handleRefreshButtonPressed}
      >
        {refreshing ? (
          <SvgXml
            xml={Icons.Refresh}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
            fill={Colors.neutral75}
          />
        ) : (
          <SvgXml
            xml={Icons.Refresh}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
            fill={Colors.neutral140}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  subHeaderText: {
    ...Typography.header6,
    textTransform: "uppercase",
    color: Colors.neutral140,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
})

export default DateInfoHeader
