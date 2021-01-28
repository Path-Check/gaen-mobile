import React, { FunctionComponent } from "react"
import { Alert, Pressable, Image, View, Share, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { useApplicationName } from "../Device/useApplicationInfo"
import Logger from "../logger"

import { Icons, Images } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../styles"

interface ShareLinkProps {
  appDownloadUrl: string
}

const ShareLink: FunctionComponent<ShareLinkProps> = ({ appDownloadUrl }) => {
  const { applicationName } = useApplicationName()
  const { t } = useTranslation()

  const handleOnPressShare = async () => {
    try {
      await Share.share({
        message: t("home.bluetooth.share_message", {
          applicationName,
          appDownloadUrl,
        }),
      })
    } catch (error) {
      Logger.error("Dashboard: Share link did not work", {
        appDownloadUrl,
        error: error.message,
      })
      Alert.alert(t("home.error.share_link_failed"))
    }
  }

  const imageSource = Images.ShareImage

  return (
    <Pressable
      style={style.shareContainer}
      onPress={handleOnPressShare}
      accessibilityLabel={t("home.bluetooth.share", { applicationName })}
    >
      <View style={style.shareImageContainer}>
        <Image source={imageSource} style={style.shareImage} />
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
    </Pressable>
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
