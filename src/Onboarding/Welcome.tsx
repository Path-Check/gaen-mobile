import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native"

import { RTLEnabledText } from "../components/RTLEnabledText"
import EulaModal from "./EulaModal"
import { getLocalNames } from "../locales/languages"

import { Images } from "../assets"
import { Colors } from "../styles"
import { Screens } from "../navigation"

const width = Dimensions.get("window").width

const Welcome: FunctionComponent = () => {
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}
    >
      <ImageBackground
        source={Images.ConcentricCircles}
        style={styles.backgroundImage}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.mainContainer}>
          <View
            style={{
              paddingTop: 60,
              position: "absolute",
              alignSelf: "center",
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate(Screens.LanguageSelection)}
              style={styles.languageSelector}
            >
              <RTLEnabledText style={styles.languageSelectorText}>
                {languageName}
              </RTLEnabledText>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <RTLEnabledText style={styles.mainText}>
              {t("label.launch_screen1_header")}
            </RTLEnabledText>
          </View>
          <View style={styles.footerContainer}>
            <EulaModal
              onPressModalContinue={() =>
                navigation.navigate(Screens.PersonalPrivacy)
              }
              selectedLocale={localeCode}
            />
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    width: width * 0.75,
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  mainText: {
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    lineHeight: 35,
    color: Colors.white,
    fontSize: 26,
  },
  languageSelector: {
    borderWidth: 1,
    borderColor: Colors.white,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 100,
  },
  languageSelectorText: {
    fontSize: 16,
    color: Colors.white,
    paddingVertical: 4,
    paddingHorizontal: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    padding: 24,
    width: "100%",
  },
})

export default Welcome
