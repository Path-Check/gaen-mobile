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
//import { calculateHmac } from "./AffectedUserFlow/hmac"
//import * as API from "./AffectedUserFlow/verificationAPI"

type Posix = number

export interface ExposureState {
  exposureKeyDate: Date,
  exposureKeyCheckCount: number,
  exposureInfo: ExposureInfo,
  exposureKeys: ExposureKey[],
  getCurrentExposures: () => Promise<ExposureInfo>
  getExposureKeys: () => Promise<ExposureKey[]>
  getRevisionToken: () => Promise<string>
  lastExposureDetectionDate: Posix | null
  storeRevisionToken: (revisionToken: string) => Promise<void>
  refreshExposureInfo: () => void
  detectExposures: () => Promise<NativeModule.DetectExposuresResponse>
}

const initialState = {
  exposureKeyDate: new Date(),
  exposureKeyCheckCount: 0,
  exposureKeys: [],
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
  console.log("exposurePRovider start");
  const { trackEvent } = useProductAnalyticsContext()

  const [exposureInfo, setExposureInfo] = useState<ExposureInfo>([])
  const [exposureKeyDate, setExposureKeyDate] = useState<Date>(new Date())
  const [exposureKeyCheckCount, setExposureKeyCheckCount] = useState<number>(0)
  const [exposureKeys, setExposureKeys] = useState<ExposureKey[]>([])

  const [
    lastExposureDetectionDate,
    setLastExposureDetectionDate,
  ] = useState<Posix | null>(null)

  const getLastExposureDetectionDate = useCallback(() => {
    NativeModule.fetchLastExposureDetectionDate().then((detectionDate) => {
      setLastExposureDetectionDate(detectionDate)
    })
  }, [])

  /*const sendChaffRequest = useCallback(async () => {
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
        await trackEvent("epi_analytics", "chaff_request_hmac_failed")
      }
    } else {
      await trackEvent("epi_analytics", "chaff_request_failed")
    }
  }, [trackEvent])*/

  const refreshExposureInfo = useCallback(async () => {
    const exposureInfo = await NativeModule.getCurrentExposures()
    setExposureInfo(exposureInfo)

    const detectionDate = await NativeModule.fetchLastExposureDetectionDate()
    setLastExposureDetectionDate(detectionDate)
  }, [])

  const getExposureKeys = useCallback(async (): Promise<ExposureKey[]> => {
    const newDate = new Date();
    // reset if date bad 
    if (exposureKeyDate.getUTCDate() != newDate.getUTCDate()) {
      console.log("resetting keys date");
      setExposureKeyCheckCount(0)
    }

    // ensure date is set
    setExposureKeyDate(newDate)

    // if date is less than 3 grab it
    if (exposureKeyCheckCount < 3) {
      console.log("getting new keys")
      // increment key check count
      setExposureKeyCheckCount(exposureKeyCheckCount+1)

      //get keys
      const keys = await NativeModule.getExposureKeys()

      //set keys
      setExposureKeys(keys);

      return keys || [];
    }

    console.log("returning cached keys")

    // fall through return keys in state
    return exposureKeys || [];
  }, []);

  const detectExposures = async (): Promise<NativeModule.DetectExposuresResponse> => {
    const response = await NativeModule.detectExposures()
    if (response.kind === "success") {
      await refreshExposureInfo()
    }
    return response
  }

  useEffect(() => {
    // Exposures subscription
    const exposuresSubscription = NativeModule.subscribeToExposureEvents(
      (exposureInfo: ExposureInfo) => {
        setExposureInfo(exposureInfo)
        getLastExposureDetectionDate()
      },
    )
    getLastExposureDetectionDate()

    detectExposures()
    /*
    // Chaff subscription
    const chaffSubscription = NativeModule.subscribeToChaffRequestEvents(() => {
      sendChaffRequest()
    })
    sendChaffRequest()
    */
    return () => {
      exposuresSubscription.remove()
      //chaffSubscription.remove()
    }
    //}, [getLastExposureDetectionDate, sendChaffRequest])
  }, [getLastExposureDetectionDate])

  useEffect(() => {
    const subscription = NativeModule.subscribeToExposureEvents(() => {
      trackEvent("epi_analytics", "en_notification_received")
    })

    return () => {
      subscription.remove()
    }
  }, [trackEvent])

  return (
    <ExposureContext.Provider
      value={{
        exposureKeyDate,
        exposureKeyCheckCount,
        exposureKeys,
        exposureInfo,
        lastExposureDetectionDate,
        refreshExposureInfo,
        detectExposures,
        getCurrentExposures: NativeModule.getCurrentExposures,
        getExposureKeys,
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
