import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
  useContext,
} from "react"

import gaenStrategy from "./gaen"
import { failureResponse, OperationResponse } from "./OperationResponse"
import { ExposureKey } from "./exposureKey"
import { ExposureInfo } from "./exposure"
import { checkForNewExposures as detectExposures } from "./gaen/nativeModule"
import { useProductAnalyticsContext } from "./ProductAnalytics/Context"

type Posix = number
const { exposureEventsStrategy } = gaenStrategy
const {
  getExposureKeys,
  storeRevisionToken,
  getRevisionToken,
  getCurrentExposures,
} = exposureEventsStrategy

export interface ExposureState {
  exposureInfo: ExposureInfo
  getCurrentExposures: () => Promise<ExposureInfo>
  getExposureKeys: () => Promise<ExposureKey[]>
  getRevisionToken: () => Promise<string>
  lastExposureDetectionDate: Posix | null
  storeRevisionToken: (revisionToken: string) => Promise<void>
  refreshExposureInfo: () => void
  checkForNewExposures: () => Promise<OperationResponse>
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
  checkForNewExposures: () => {
    return Promise.resolve({ kind: "success" as const })
  },
}

export const ExposureContext = createContext<ExposureState>(initialState)

const ExposureProvider: FunctionComponent = ({ children }) => {
  const {
    exposureInfoSubscription,
    getLastDetectionDate,
  } = exposureEventsStrategy
  const { trackEvent } = useProductAnalyticsContext()

  const [exposureInfo, setExposureInfo] = useState<ExposureInfo>([])

  const [
    lastExposureDetectionDate,
    setLastExposureDetectionDate,
  ] = useState<Posix | null>(null)

  const getLastExposureDetectionDate = useCallback(() => {
    getLastDetectionDate().then((detectionDate) => {
      setLastExposureDetectionDate(detectionDate)
    })
  }, [getLastDetectionDate])

  const refreshExposureInfo = async () => {
    const exposureInfo = await getCurrentExposures()
    setExposureInfo(exposureInfo)

    const detectionDate = await getLastDetectionDate()
    setLastExposureDetectionDate(detectionDate)
  }

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureInfo: ExposureInfo) => {
        trackEvent("epi_analytics", "event_emitted", "en_notification_received")
        setExposureInfo(exposureInfo)
        getLastExposureDetectionDate()
      },
    )

    getLastExposureDetectionDate()

    return subscription.remove
  }, [exposureInfoSubscription, getLastExposureDetectionDate])

  const checkForNewExposures = async (): Promise<OperationResponse> => {
    try {
      const response = await detectExposures()
      if (response.kind === "failure") {
        throw new Error(response.error)
      }
      await refreshExposureInfo()
      return { kind: "success" }
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  return (
    <ExposureContext.Provider
      value={{
        exposureInfo,
        getCurrentExposures,
        getExposureKeys,
        getRevisionToken,
        lastExposureDetectionDate,
        storeRevisionToken,
        refreshExposureInfo,
        checkForNewExposures,
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
