import { Platform } from "react-native"

import * as DateTimeUtils from "./dateTime"
import * as StorageUtils from "./storage"

const isPlatformiOS = (): boolean => {
  return Platform.OS === "ios"
}

const isPlatformAndroid = (): boolean => {
  return Platform.OS === "android"
}

export { DateTimeUtils, StorageUtils, isPlatformiOS, isPlatformAndroid }
