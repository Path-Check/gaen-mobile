import Matomo from "react-native-matomo-sdk"
export const trackEvent = (event: string): Promise<string> => {
  return Promise.resolve(event)
}

export const trackScreenView = async (screen: string): Promise<void> => {
  Matomo.trackView([screen])
}
