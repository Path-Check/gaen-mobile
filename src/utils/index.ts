import { Platform } from "react-native"
import env from "react-native-config"

import * as DateTimeUtils from "./dateTime"
import * as StorageUtils from "./storage"

const { AUTHORITY_ADVICE_URL, DISPLAY_SELF_ASSESSMENT } = env

const isPlatformiOS = (): boolean => {
  return Platform.OS === "ios"
}

const isPlatformAndroid = (): boolean => {
  return Platform.OS === "android"
}

const displaySelfAssessment = (): boolean => {
  return DISPLAY_SELF_ASSESSMENT === "true"
}

const displayNextSteps = (): boolean => {
  // converting url string to boolean to make this more explicit and to please typescript
  return displaySelfAssessment() || !!AUTHORITY_ADVICE_URL
}

export {
  DateTimeUtils,
  StorageUtils,
  isPlatformiOS,
  isPlatformAndroid,
  displaySelfAssessment,
  displayNextSteps,
}
