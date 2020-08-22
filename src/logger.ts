import Bugsnag from "@bugsnag/react-native"

type Loggable = Record<string, unknown>

class Logger {
  static error(message: string, data?: Loggable): void {
    if (__DEV__) {
      console.error(message, data)
    } else {
      if (data) {
        Bugsnag.addMetadata("data", data)
      }
      Bugsnag.notify(new Error(message))
    }
  }

  static event(message: string, data?: Loggable): void {
    if (__DEV__) {
      console.warn(message, data)
    } else {
      Bugsnag.leaveBreadcrumb(message, data)
    }
  }

  static addMetadata(section: string, data: Loggable): void {
    if (__DEV__) {
      console.log(`Adding to the metadata: ${section}`, data)
    } else {
      Bugsnag.addMetadata(section, data)
    }
  }
}

export default Logger
