import { NativeModules } from "react-native"

// Utils Module
const utilsModule = NativeModules.UtilsModule

export const openAppSettings = (): void => {
  utilsModule.openAppSettings()
}
