import React, { FunctionComponent } from "react"
import { TouchableOpacity, Image, View, Share, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useConfigurationContext } from "../ConfigurationContext"
import { GlobalText } from "../components"
import { useApplicationName } from "../hooks/useApplicationInfo"

import { Icons, Images } from "../assets"
import { Spacing, Colors, Typography, Outlines, Iconography } from "../styles"

export const ShareLink: FunctionComponent = () => {
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
      accessibilityLabel={t("home.bluetooth.share")}
    >
      <View style={style.shareImageContainer}>
        <Image source={Images.HugEmoji} style={style.shareImage} />
      </View>
      <View style={style.shareTextContainer}>
        <GlobalText style={style.shareText}>
          {t("home.bluetooth.share")}
        </GlobalText>
      </View>
      <View style={style.shareIconContainer}>
        <SvgXml
          xml={Icons.Share}
          width={Iconography.small}
          height={Iconography.small}
        />
      </View>
    </TouchableOpacity>
  )
}

const rightColumnWidth = 70
const style = StyleSheet.create({
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.small,
    backgroundColor: Colors.secondary10,
    borderBottomColor: Colors.neutral10,
    borderBottomWidth: Outlines.hairline,
  },
  shareImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary50,
    borderRadius: Outlines.borderRadiusMax,
    width: Iconography.medium,
    height: Iconography.medium,
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
    ...Typography.header4,
    lineHeight: Typography.smallLineHeight,
  },
  shareIconContainer: {
    width: rightColumnWidth,
    alignItems: "center",
    justifyContent: "center",
  },
})
