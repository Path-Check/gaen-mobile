import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
  useContext,
} from "react"

import gaenStrategy from "./gaen"
import { ExposureKey } from "./exposureKey"
import { ExposureInfo } from "./exposure"
import { AppState } from "react-native"

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
}

export const ExposureContext = createContext<ExposureState>(initialState)

const ExposureProvider: FunctionComponent = ({ children }) => {
  const {
    exposureInfoSubscription,
    getLastDetectionDate,
  } = exposureEventsStrategy

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

  useEffect(() => {
    const handleAppStateChange = async () => {
      const exposureInfos = await getCurrentExposures()
      setExposureInfo(exposureInfos)
    }

    AppState.addEventListener("change", handleAppStateChange)

    handleAppStateChange()

    return () => {
      AppState.removeEventListener("change", handleAppStateChange)
    }
  }, [])

  useEffect(() => {
    const subscription = exposureInfoSubscription(
      (exposureInfo: ExposureInfo) => {
        setExposureInfo(exposureInfo)
        getLastExposureDetectionDate()
      },
    )

    getLastExposureDetectionDate()

    return subscription.remove
  }, [exposureInfoSubscription, getLastExposureDetectionDate])

  return (
    <ExposureContext.Provider
      value={{
        exposureInfo,
        getCurrentExposures,
        getExposureKeys,
        getRevisionToken,
        lastExposureDetectionDate,
        storeRevisionToken,
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
