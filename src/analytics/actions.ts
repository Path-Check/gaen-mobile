import Matomo from "react-native-matomo-sdk"

import { Event } from "./events"

export const trackEvent = (event: Event): Promise<Event> => {
  return Promise.resolve(event)
}

export const trackScreenView = async (screen: string): Promise<void> => {
  Matomo.trackView([screen])
}
