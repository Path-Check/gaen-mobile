import RNSimpleCrypto from "react-native-simple-crypto"

import { ExposureKey } from "../exposureKey"

const utf8ToBase64String = (input: string): string => {
  const utf8AsArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(input)
  return RNSimpleCrypto.utils.convertArrayBufferToBase64(utf8AsArrayBuffer)
}

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
  const serializer = allRisksAreZero(exposureKeys)
    ? serializeExposureKeyWithoutRisk
    : serializeFullExposureKey
  return exposureKeys
    .map(serializer)
    .sort((left: string, right: string) => {
      return left.localeCompare(right, "en", { sensitivity: "base" })
    })
    .join(",")
}

const serializeFullExposureKey = ({
  key,
  rollingPeriod,
  rollingStartNumber,
  transmissionRisk,
}: ExposureKey): string => {
  return [
    utf8ToBase64String(key),
    rollingPeriod,
    rollingStartNumber,
    transmissionRisk,
  ].join(".")
}

const serializeExposureKeyWithoutRisk = ({
  key,
  rollingPeriod,
  rollingStartNumber,
}: ExposureKey): string => {
  return [utf8ToBase64String(key), rollingPeriod, rollingStartNumber].join(".")
}

const allRisksAreZero = (exposureKeys: ExposureKey[]): boolean => {
  return (
    exposureKeys.filter(({ transmissionRisk }) => {
      return transmissionRisk > 0
    }).length === 0
  )
}
