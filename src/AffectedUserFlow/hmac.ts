import RNSimpleCrypto from "react-native-simple-crypto"

import { ExposureKey } from "../exposureKey"

export const generateKey = async (): Promise<ArrayBuffer> => {
  return await RNSimpleCrypto.utils.randomBytes(32)
}

export const calculateHmac = async (
  exposureKeys: ExposureKey[],
): Promise<[string, string]> => {
  const exposureKeyMessage = serializeKeys(exposureKeys)

  const messageArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(
    exposureKeyMessage,
  )

  const hmacKey = await generateKey()

  const signatureArrayBuffer = await RNSimpleCrypto.HMAC.hmac256(
    messageArrayBuffer,
    hmacKey,
  )

  return [
    RNSimpleCrypto.utils.convertArrayBufferToBase64(signatureArrayBuffer),
    RNSimpleCrypto.utils.convertArrayBufferToBase64(hmacKey),
  ]
}

const serializeKeys = (exposureKeys: ExposureKey[]) => {
  return exposureKeys.map(serializeExposureKey).sort().join(",")
}

const serializeExposureKey = ({
  key,
  rollingStartNumber,
  rollingPeriod,
  transmissionRisk,
}: ExposureKey): string => {
  return [key, rollingStartNumber, rollingPeriod, transmissionRisk].join(".")
}
