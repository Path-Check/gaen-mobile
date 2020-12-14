import React, { FunctionComponent } from "react"
import { TouchableHighlight, View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Text } from "../../components"
import * as Exposure from "../../exposure"

import { Icons } from "../../assets"
import { ExposureHistoryStackScreens } from "../../navigation"
import {
  Iconography,
  Colors,
  Spacing,
  Typography,
  Affordances,
} from "../../styles"
interface ExposureListItemProps {
  exposureDatum: Exposure.ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <TouchableHighlight
      underlayColor={Colors.secondary.shade50}
      style={style.container}
      onPress={() =>
        navigation.navigate(ExposureHistoryStackScreens.ExposureDetail, {
          exposureDatum,
        })
      }
    >
      <View style={style.innerContainer}>
        <View>
          <Text style={style.primaryText}>
            {t("exposure_history.possible_exposure")}
          </Text>
          <Text style={style.secondaryText}>
            {Exposure.toDateRangeString(exposureDatum)}
          </Text>
        </View>
        <SvgXml
          xml={Icons.ChevronRight}
          accessible
          accessibilityLabel={t("label.check")}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
          fill={Colors.primary.shade100}
        />
      </View>
    </TouchableHighlight>
  )
}

const style = StyleSheet.create({
  container: {
    ...Affordances.floatingContainer,
    marginBottom: Spacing.medium,
    marginHorizontal: Spacing.medium,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryText: {
    ...Typography.header.x10,
  },
  secondaryText: {
    ...Typography.body.x10,
    marginTop: Spacing.xxSmall,
    letterSpacing: Typography.letterSpacing.x20,
  },
})

export default ExposureListItem
