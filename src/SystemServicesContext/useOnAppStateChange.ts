import { useEffect } from "react"
import { AppState, Platform } from "react-native"

type ListenerMethod = "focus" | "change"

const useOnAppStateChange = (handleOnAppStateChange: () => void): void => {
  const determineOSListener = (): ListenerMethod => {
    return Platform.select({
      ios: "change",
      android: "focus",
      default: "change",
    })
  }

  useEffect(() => {
    AppState.addEventListener(determineOSListener(), () =>
      handleOnAppStateChange(),
    )
    return AppState.removeEventListener(determineOSListener(), () =>
      handleOnAppStateChange(),
    )
  }, [handleOnAppStateChange])
}

export default useOnAppStateChange
