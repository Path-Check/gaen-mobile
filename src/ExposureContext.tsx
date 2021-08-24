import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
  useContext,
} from "react"

import { ExposureKey } from "./exposureKey"
import { ExposureInfo } from "./exposure"
import { useProductAnalyticsContext } from "./ProductAnalytics/Context"
import * as NativeModule from "./gaen/nativeModule"
import { calculateHmac } from "./AffectedUserFlow/hmac"
import * as API from "./AffectedUserFlow/verificationAPI"

type Posix = number

export interface ExposureState {
  exposureInfo: ExposureInfo
  getCurrentExposures: () => Promise<ExposureInfo>
  getExposureKeys: () => Promise<ExposureKey[]>
  getRevisionToken: () => Promise<string>
  lastExposureDetectionDate: Posix | null
  storeRevisionToken: (revisionToken: string) => Promise<void>
  refreshExposureInfo: () => void
  detectExposures: () => Promise<NativeModule.DetectExposuresResponse>
}

const initialState = {
  exposureInfo: [],
  getCurrentExposures: () => {
    return Promise.resolve([])
  },
  getExposureKeys: () => {
    return Promise.resolve([])
  },
  getRevisionToken: () => {
    return Promise.resolve("")
  },
  lastExposureDetectionDate: null,
  storeRevisionToken: () => {
    return Promise.resolve()
  },
  refreshExposureInfo: () => {},
  detectExposures: () => {
    return Promise.resolve({ kind: "success" as const })
  },
}

export const ExposureContext = createContext<ExposureState>(initialState)

const ExposureProvider: FunctionComponent = ({ children }) => {
  const { trackEvent } = useProductAnalyticsContext()

  const [exposureInfo, setExposureInfo] = useState<ExposureInfo>([])

  const [
    lastExposureDetectionDate,
    setLastExposureDetectionDate,
  ] = useState<Posix | null>(null)

  const getLastExposureDetectionDate = useCallback(() => {
    NativeModule.fetchLastExposureDetectionDate().then((detectionDate) => {
      setLastExposureDetectionDate(detectionDate)
    })
  }, [])

  const sendChaffRequest = useCallback(async () => {
    const code = Math.random().toString().substring(2, 10)
    const response = await API.postCode(code, true)

    if (response.kind === "success") {
      const token = response.body.token
      const exposureKeys = await NativeModule.fetchChaffKeys()
      const [hmacDigest] = await calculateHmac(exposureKeys)

      const certResponse = await API.postTokenAndHmac(token, hmacDigest, true)

      if (certResponse.kind === "success") {
        await trackEvent("epi_analytics", "chaff_request_sent")
      } else {
        await trackEvent("epi_analytics", "chaff_request_failed")
      }
    } else {
      await trackEvent("epi_analytics", "chaff_request_failed")
    }
  }, [trackEvent])

  const refreshExposureInfo = useCallback(async () => {
    const exposureInfo = await NativeModule.getCurrentExposures()
    setExposureInfo(exposureInfo)

    const detectionDate = await NativeModule.fetchLastExposureDetectionDate()
    setLastExposureDetectionDate(detectionDate)
  }, [])

  useEffect(() => {
    // Exposures subscription
    const exposuresSubscription = NativeModule.subscribeToExposureEvents(
      (exposureInfo: ExposureInfo) => {
        setExposureInfo(exposureInfo)
        getLastExposureDetectionDate()
      },
    )
    getLastExposureDetectionDate()

    // Chaff subscription
    const chaffSubscription = NativeModule.subscribeToChaffRequestEvents(() => {
      sendChaffRequest()
    })
    sendChaffRequest()

    return () => {
      exposuresSubscription.remove()
      chaffSubscription.remove()
    }
  }, [getLastExposureDetectionDate, sendChaffRequest])

  useEffect(() => {
    const subscription = NativeModule.subscribeToExposureEvents(() => {
      trackEvent("epi_analytics", "en_notification_received")
    })

    return () => {
      subscription.remove()
    }
  }, [trackEvent])

  const detectExposures = async (): Promise<NativeModule.DetectExposuresResponse> => {
    const response = await NativeModule.detectExposures()
    if (response.kind === "success") {
      await refreshExposureInfo()
    }
    return response
  }

  return (
    <ExposureContext.Provider
      value={{
        exposureInfo,
        lastExposureDetectionDate,
        refreshExposureInfo,
        detectExposures,
        getCurrentExposures: NativeModule.getCurrentExposures,
        getExposureKeys: NativeModule.getExposureKeys,
        getRevisionToken: NativeModule.getRevisionToken,
        storeRevisionToken: NativeModule.storeRevisionToken,
      }}
    >
      {children}
    </ExposureContext.Provider>
  )
}

const useExposureContext = (): ExposureState => {
  const context = useContext(ExposureContext)
  if (context === undefined) {
    throw new Error("ExposureContext must be used with a provider")
  }
  return context
}

export { ExposureProvider, useExposureContext }
