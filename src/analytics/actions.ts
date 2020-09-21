import Matomo from "react-native-matomo"
export const trackEvent = (event: string): Promise<string> => {
  return Promise.resolve(event)
}

export const trackScreenView = async (screen: string): Promise<void> => {
  Matomo.trackScreen(screen, screen)
}
