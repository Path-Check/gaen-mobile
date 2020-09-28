import env from "react-native-config"
import Bugsnag from "@bugsnag/react-native"

type Loggable = Record<string, unknown>

class Logger {
  static start(): void {
    const isStagingEnv = !__DEV__ && env.STAGING === "true"
    if (isStagingEnv) {
      Bugsnag.start()
    }
  }

  static error(message: string, data?: Loggable): void {
    if (__DEV__) {
      console.warn(message, data)
    } else if (env.STAGING === "true") {
      if (data) {
        Bugsnag.addMetadata("data", data)
      }
      Bugsnag.notify(new Error(message))
    }
  }

  static event(message: string, data?: Loggable): void {
    if (__DEV__) {
      console.warn(message, data)
    } else if (env.STAGING === "true") {
      Bugsnag.leaveBreadcrumb(message, data)
    }
  }

  static addMetadata(section: string, data: Loggable): void {
    if (__DEV__) {
      console.log(`Adding to the metadata: ${section}`, data)
    } else if (env.STAGING === "true") {
      Bugsnag.addMetadata(section, data)
    }
  }
}

export default Logger
