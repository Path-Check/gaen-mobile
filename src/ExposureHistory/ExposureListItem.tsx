import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { TouchableHighlight, StyleSheet, View } from "react-native"
import { RTLEnabledText } from "../components/RTLEnabledText"
import { ExposureDatum } from "../exposure"
import { DateTimeUtils } from "../utils"
import { Colors, Spacing, Typography } from "../styles"
import { useTranslation } from "react-i18next"
import { Screens } from "../navigation"

interface Props {
  exposureDatum: ExposureDatum
}

// TODO: translation
const ExposureListItem: FunctionComponent<Props> = ({ exposureDatum }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  return (
    <View style={styles.section}>
      <TouchableHighlight
        underlayColor={Colors.underlayPrimaryBackground}
        style={styles.listItem}
        onPress={() => navigation.navigate(Screens.Exposure)}
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

export default ExposureListItem

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.medium,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
  section: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: Spacing.medium,
    borderRadius: 14,
  },
})
