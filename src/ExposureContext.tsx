import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
  useContext,
} from "react"

import { ExposureEventsStrategy } from "./tracingStrategy"
import { ExposureInfo } from "./exposure"

type Posix = number

interface ExposureState {
  exposureInfo: ExposureInfo
  hasBeenExposed: boolean
  userHasNewExposure: boolean
  observeExposures: () => void
  resetExposures: () => void
  getCurrentExposures: () => void
  lastExposureDetectionDate: Posix | null
}

const initialState = {
  exposureInfo: {},
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: (): void => {},
  resetExposures: (): void => {},
  getCurrentExposures: (): void => {},
  lastExposureDetectionDate: null,
}

const ExposureContext = createContext<ExposureState>(initialState)

interface ExposureProps {
  exposureEventsStrategy: ExposureEventsStrategy
}

const ExposureProvider: FunctionComponent<ExposureProps> = ({
  children,
  exposureEventsStrategy,
}) => {
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
  }, [])

  const getCurrentExposures = useCallback(() => {
    const cb = (exposureInfo: ExposureInfo) => {
      setExposureInfo(exposureInfo)
    }
    exposureEventsStrategy.getCurrentExposures(cb)
  }, [exposureEventsStrategy])

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
