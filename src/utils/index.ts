import dayjs from "dayjs"
import { Platform } from "react-native"
import semver from "semver"
import * as DateTimeUtils from "./dateTimeUtils"

const isPlatformiOS = (): boolean => {
  return Platform.OS === "ios"
}

const isPlatformAndroid = (): boolean => {
  return Platform.OS === "android"
}

const nowStr = (): string => {
  return dayjs().format("H:mm")
}

const isVersionGreater = (source: string, target: string): boolean => {
  return semver.gt(source, target)
}

export {
  DateTimeUtils,
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
  isVersionGreater,
}
