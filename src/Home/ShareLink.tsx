import React, { FunctionComponent } from "react"
import { TouchableOpacity, Image, View, Share, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useConfigurationContext } from "../ConfigurationContext"
import { Text } from "../components"
import { useApplicationName } from "../Device/useApplicationInfo"

import { Icons, Images } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../styles"

const ShareLink: FunctionComponent = () => {
  const { applicationName } = useApplicationName()
  const { t } = useTranslation()
  const configuration = useConfigurationContext()

  const showShareLink = Boolean(configuration.appDownloadLink)

  const handleOnPressShare = async () => {
    try {
      await Share.share({
        message: t("home.bluetooth.share_message", {
          applicationName,
          appDownloadLink: configuration.appDownloadLink,
        }),
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  if (!showShareLink) {
    return null
  }

  return (
    <TouchableOpacity
      style={style.shareContainer}
      onPress={handleOnPressShare}
      accessibilityLabel={t("home.bluetooth.share", { applicationName })}
    >
      <View style={style.shareImageContainer}>
        <Image source={Images.HugEmoji} style={style.shareImage} />
      </View>
      <View style={style.shareTextContainer}>
        <Text style={style.shareText}>
          {t("home.bluetooth.share", { applicationName })}
        </Text>
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
  shareImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  shareImage: {
    width: Iconography.small,
    height: Iconography.small,
  },
  shareTextContainer: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  shareText: {
    ...Typography.body.x30,
    ...Typography.style.medium,
    color: Colors.text.primary,
  },
})

export default ShareLink
