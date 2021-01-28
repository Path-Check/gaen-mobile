import React, { FunctionComponent } from "react"
import {
  Linking,
  Pressable,
  View,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { StatusBar, Text } from "../components"
import { useStatusBarEffect, Stacks } from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import Logger from "../logger"

import { Images, Icons } from "../assets"
import {
  Buttons,
  Colors,
  Iconography,
  Layout,
  Spacing,
  Typography,
} from "../styles"

export const Complete: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const {
    healthAuthorityHealthCheckUrl: healthCheckUrl,
  } = useConfigurationContext()

  const handleOnPressClose = () => {
    navigation.navigate("App", { screen: Stacks.Home })
  }

  const handleOnPressCompleteHealthCheck = (healthCheckUrl: string) => {
    return async () => {
      try {
        Linking.openURL(healthCheckUrl).then(() => {
          navigation.navigate("App", { screen: Stacks.Home })
        })
      } catch (e) {
        Logger.error("Failed to open healthCheckUrl: ", { healthCheckUrl })
        const alertMessage = t("home.could_not_open_link", {
          url: healthCheckUrl,
        })
        Alert.alert(alertMessage)
      }
    }
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <View style={style.headerContainer}>
        <Pressable
          style={style.closeIconContainer}
          onPress={handleOnPressClose}
        >
          <SvgXml
            xml={Icons.X}
            width={Iconography.xxSmall}
            height={Iconography.xxSmall}
            fill={Colors.neutral.shade100}
          />
        </Pressable>
      </View>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <Image source={Images.CheckInCircle} style={style.image} />
        <Text style={style.header}>
          {t("escrow_verification.complete.title")}
        </Text>
        <Text style={style.contentText}>
          {t("escrow_verification.complete.body")}
        </Text>
        {healthCheckUrl && (
          <Pressable
            style={style.button}
            onPress={handleOnPressCompleteHealthCheck(healthCheckUrl)}
            accessibilityLabel={t("escrow_verification.complete_healthcheck")}
          >
            <Text style={style.buttonText}>
              {t("escrow_verification.complete_healthcheck")}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  headerContainer: {
    alignItems: "flex-end",
    backgroundColor: Colors.background.primaryLight,
  },
  closeIconContainer: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Layout.oneTwentiethHeight,
    paddingBottom: Spacing.xxHuge,
    paddingHorizontal: Spacing.large,
  },
  image: {
    width: 230,
    height: 150,
    marginBottom: Spacing.medium,
    resizeMode: "cover",
  },
  header: {
    ...Typography.header.x60,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  contentText: {
    ...Typography.body.x30,
    textAlign: "center",
    marginBottom: Spacing.xxxLarge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
})

export default Complete
