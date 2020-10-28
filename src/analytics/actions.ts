import Matomo from "react-native-matomo-sdk"

import { Event } from "./events"

export const trackEvent = async (event: Event): Promise<void> => {
  Matomo.trackEvent("event", event)
}

export const trackScreenView = async (screen: string): Promise<void> => {
  Matomo.trackView([screen])
}
