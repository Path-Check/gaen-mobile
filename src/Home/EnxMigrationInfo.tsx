import React, { FunctionComponent } from "react"
import {
  Linking,
  Alert,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native"
import { useTranslation } from "react-i18next"
import { Text } from "../components"
import Logger from "../logger"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../styles"
import { Icons, Images } from "../assets"
import { SvgXml } from "react-native-svg"

const EnxMigrationInfo: FunctionComponent = () => {
  const { t } = useTranslation()
  const onboardingUrl = "ens://onboarding?r=US-XX"

  const handleOnPress = async () => {
    try {
      await Linking.openURL(onboardingUrl)
    } catch (e) {
      Logger.error("Failed to open enx onboarding link: ", { onboardingUrl })
      const alertMessage = t("home.could_not_open_link", {
        url: onboardingUrl,
      })
      Alert.alert(alertMessage)
    }
  }

  return (
    <TouchableOpacity
      style={style.shareContainer}
      onPress={handleOnPress}
      accessibilityLabel={t("home.migrate_enx")}
    >
      <View style={style.imageContainer}>
        <Image source={Images.ExclamationInCircle} style={style.image} />
      </View>
      <View style={style.textContainer}>
        <Text style={style.shareText}>{t("home.migrate_enx")}</Text>
      </View>
      <SvgXml
        xml={Icons.ChevronRight}
        fill={Colors.neutral.shade75}
        width={Iconography.xxSmall}
        height={Iconography.xxSmall}
      />
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  shareContainer: {
    ...Affordances.floatingContainer,
    paddingVertical: Spacing.small,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.primary.shade100,
    borderWidth: Outlines.thin,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: Iconography.large,
    height: Iconography.large,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  shareText: {
    ...Typography.body.x30,
    ...Typography.style.medium,
    color: Colors.text.primary,
  },
})

export default EnxMigrationInfo
