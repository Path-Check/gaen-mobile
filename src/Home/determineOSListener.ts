import { Platform } from "react-native"

type ListenerMethod = "focus" | "change"

const determineOSListener = (): ListenerMethod => {
  return Platform.select({
    ios: "change",
    android: "focus",
    default: "change",
  })
}

export default determineOSListener
