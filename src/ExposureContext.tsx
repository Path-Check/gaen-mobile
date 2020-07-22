import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
  useContext,
} from "react"

import { ExposureInfo } from "./exposure"
import gaenStrategy from "./gaen"
import { ExposureKey } from "./exposureKey"

type Posix = number
const { exposureEventsStrategy } = gaenStrategy
const { getExposureKeys, submitDiagnosisKeys } = exposureEventsStrategy

interface ExposureState {
  exposureInfo: ExposureInfo
  hasBeenExposed: boolean
  userHasNewExposure: boolean
  observeExposures: () => void
  resetExposures: () => void
  getCurrentExposures: () => void
  getExposureKeys: () => Promise<ExposureKey[]>
  lastExposureDetectionDate: Posix | null
  submitDiagnosisKeys: (certificate: string, hmac: string) => Promise<string>
}

const initialState = {
  exposureInfo: {},
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: (): void => {},
  resetExposures: (): void => {},
  getCurrentExposures: (): void => {},
  getExposureKeys,
  submitDiagnosisKeys,
  lastExposureDetectionDate: null,
}

const ExposureContext = createContext<ExposureState>(initialState)

const ExposureProvider: FunctionComponent = ({ children }) => {
  const {
    exposureInfoSubscription,
    getLastDetectionDate,
  } = exposureEventsStrategy

  const [exposureInfo, setExposureInfo] = useState<ExposureInfo>({})
  const [userHasNewExposure, setUserHasNewExposure] = useState<boolean>(false)

  const [
    lastExposureDetectionDate,
    setLastExposureDetectionDate,
  ] = useState<Posix | null>(null)

  const getLastExposureDetectionDate = useCallback(() => {
    getLastDetectionDate().then((detectionDate) => {
      setLastExposureDetectionDate(detectionDate)
    })
  }, [getLastDetectionDate])

  const getCurrentExposures = useCallback(() => {
    const cb = (exposureInfo: ExposureInfo) => {
      setExposureInfo(exposureInfo)
    }
    exposureEventsStrategy.getCurrentExposures(cb)
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

  useEffect(() => {
    getCurrentExposures()
  }, [getCurrentExposures])

  const observeExposures = () => {
    setUserHasNewExposure(false)
  }

  const resetExposures = () => {
    setUserHasNewExposure(true)
  }

  const hasBeenExposed = false
  return (
    <ExposureContext.Provider
      value={{
        exposureInfo,
        hasBeenExposed,
        userHasNewExposure,
        observeExposures,
        resetExposures,
        getCurrentExposures,
        getExposureKeys,
        submitDiagnosisKeys,
        lastExposureDetectionDate,
      }}
    >
      {children}
    </ExposureContext.Provider>
  )
}

const useExposureContext = (): ExposureState => {
  const context = useContext(ExposureContext)
  if (context === undefined) {
    throw new Error("TracingStrategyContext must be used with a provider")
  }
  return context
}

export { ExposureProvider, useExposureContext }
