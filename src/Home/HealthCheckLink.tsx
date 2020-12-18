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
import { SvgXml } from "react-native-svg"

import { Text } from "../components"

import { Icons, Images } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../styles"

interface HealthCheckLinkProps {
  healthCheckUrl: string
}

const HealthCheckLink: FunctionComponent<HealthCheckLinkProps> = ({
  healthCheckUrl,
}) => {
  const { t } = useTranslation()

  const handleOnPress = async () => {
    const supported = await Linking.canOpenURL(healthCheckUrl)

    if (supported) {
      await Linking.openURL(healthCheckUrl)
    } else {
      Alert.alert(`Don't know how to open this URL: ${healthCheckUrl}`)
    }
  }

  return (
    <TouchableOpacity
      style={style.shareContainer}
      onPress={handleOnPress}
      accessibilityLabel={t("home.open_healthcheck")}
    >
      <View style={style.imageContainer}>
        <Image source={Images.HealthCheck} style={style.image} />
      </View>
      <View style={style.textContainer}>
        <Text style={style.shareText}>{t("home.open_healthcheck")}</Text>
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
    width: Iconography.small,
    height: Iconography.small,
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

export default HealthCheckLink
