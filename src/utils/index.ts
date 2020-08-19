import { Platform } from "react-native"
import env from "react-native-config"

import * as DateTimeUtils from "./dateTime"
import * as StorageUtils from "./storage"

const isPlatformiOS = (): boolean => {
  return Platform.OS === "ios"
}

const isPlatformAndroid = (): boolean => {
  return Platform.OS === "android"
}

const isTester = (): boolean => {
  return env.DEV === "TRUE"
}

export {
  DateTimeUtils,
  StorageUtils,
  isPlatformiOS,
  isPlatformAndroid,
  isTester,
}
