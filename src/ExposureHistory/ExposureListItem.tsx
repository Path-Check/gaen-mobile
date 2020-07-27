import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { TouchableHighlight, StyleSheet, View } from "react-native"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { ExposureDatum } from "../exposure"
import { DateTimeUtils } from "../utils"
import { Colors, Spacing, Typography, Outlines } from "../styles"
import { useTranslation } from "react-i18next"
import { Screens } from "../navigation"

interface ExposureListItemProps {
  exposureDatum: ExposureDatum
}

const ExposureListItem: FunctionComponent<ExposureListItemProps> = ({
  exposureDatum,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={Colors.underlayPrimaryBackground}
        style={styles.listItem}
        onPress={() =>
          navigation.navigate(Screens.ExposureDetail, { exposureDatum })
        }
      >
        <>
          <RTLEnabledText style={styles.listItemText}>
            {t("exposure_history.possible_exposure")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.listItemText}>
            {DateTimeUtils.timeAgoInWords(exposureDatum.date)}
          </RTLEnabledText>
        </>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: Spacing.medium,
    borderRadius: Outlines.largeBorderRadius,
  },
  listItem: {
    flex: 1,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.medium,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
})

export default ExposureListItem
