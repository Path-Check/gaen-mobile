import React, { FunctionComponent } from "react"
import { TouchableHighlight, View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { RTLEnabledText } from "../../components/RTLEnabledText"
import { ExposureDatum } from "../../exposure"
import { DateTimeUtils } from "../../utils"

import { Icons } from "../../assets"
import { Screens } from "../../navigation"
import {
  Iconography,
  Colors,
  Spacing,
  Typography,
  Outlines,
} from "../../styles"

interface ExposureListItemProps {
  exposureDatum: ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <TouchableHighlight
      underlayColor={Colors.underlayPrimaryBackground}
      style={styles.container}
      onPress={() =>
        navigation.navigate(Screens.ExposureDetail, { exposureDatum })
      }
    >
      <View style={styles.innerContainer}>
        <View>
          <RTLEnabledText style={styles.primaryText}>
            {t("exposure_history.possible_exposure")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.secondaryText}>
            {DateTimeUtils.timeAgoInWords(exposureDatum.date)}
          </RTLEnabledText>
        </View>
        <SvgXml
          xml={Icons.ChevronRight}
          accessible
          accessibilityLabel={t("label.check_icon")}
          width={Iconography.xSmall}
          height={Iconography.xSmall}
          fill={Colors.royalBlue}
        />
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.xSmall,
    borderRadius: Outlines.largeBorderRadius,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryText: {
    ...Typography.bold,
  },
  secondaryText: {
    ...Typography.base,
    color: Colors.darkGray,
    textTransform: "uppercase",
    marginTop: Spacing.xxSmall,
    letterSpacing: Typography.mediumLetterSpacing,
  },
})

export default ExposureListItem
