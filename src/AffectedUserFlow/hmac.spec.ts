import RNSimpleCrypto from "react-native-simple-crypto"

import { calculateHmac } from "./hmac"

describe("calculateHmac", () => {
  const mockRandomBytesGeneration = () => {
    const randomBytes = new ArrayBuffer(1)
    jest
      .spyOn(RNSimpleCrypto.utils, "randomBytes")
      .mockResolvedValueOnce(randomBytes)
    return randomBytes
  }

  const mockConvertUtf8ToArray = () => {
    const convertUtf8ToArrayBufferSpy = jest.spyOn(
      RNSimpleCrypto.utils,
      "convertUtf8ToArrayBuffer",
    )
    const messageArrayBuffer = new ArrayBuffer(2)
    convertUtf8ToArrayBufferSpy.mockReturnValueOnce(messageArrayBuffer)

    return [convertUtf8ToArrayBufferSpy, messageArrayBuffer]
  }

  const mockHmac256 = () => {
    const hmac256Spy = jest.spyOn(RNSimpleCrypto.HMAC, "hmac256")
    const signatureBuffer = new ArrayBuffer(3)
    hmac256Spy.mockResolvedValueOnce(signatureBuffer)

    return [hmac256Spy, signatureBuffer]
  }

  const mockConvertArrayBufferToBase64 = () => {
    const convertArrayBufferToBase64Spy = jest.spyOn(
      RNSimpleCrypto.utils,
      "convertArrayBufferToBase64",
    )
    const base64TekKey = "base64TekKey"
    convertArrayBufferToBase64Spy.mockReturnValueOnce(base64TekKey)
    const base64Signature = "base64Signature"
    convertArrayBufferToBase64Spy.mockReturnValueOnce(base64Signature)
    const base64Key = "base64Key"
    convertArrayBufferToBase64Spy.mockReturnValueOnce(base64Key)

    return [
      convertArrayBufferToBase64Spy,
      base64Signature,
      base64Key,
      base64TekKey,
    ]
  }

  it("serializes and encrypts the exposure keys into a payload", async () => {
    const randomBytes = mockRandomBytesGeneration()
    const [
      convertUtf8ToArrayBufferSpy,
      messageArrayBuffer,
    ] = mockConvertUtf8ToArray()
    const [hmac256Spy, signatureBuffer] = mockHmac256()
    const [
      convertArrayBufferToBase64Spy,
      base64Signature,
      base64Key,
      base64TekKey,
    ] = mockConvertArrayBufferToBase64()
    const key = "key"
    const rollingPeriod = 1
    const rollingStartNumber = 1
    const transmissionRisk = 1
    const exposureKey = {
      key,
      rollingPeriod,
      rollingStartNumber,
      transmissionRisk,
    }
    const serializedKey = `${base64TekKey}.${rollingPeriod}.${rollingStartNumber}.${transmissionRisk}`

    const hmacKey = await calculateHmac([exposureKey])

    expect(convertUtf8ToArrayBufferSpy).toHaveBeenCalledWith(serializedKey)
    expect(hmac256Spy).toHaveBeenCalledWith(messageArrayBuffer, randomBytes)
    expect(convertArrayBufferToBase64Spy).toHaveBeenCalledWith(signatureBuffer)
    expect(convertArrayBufferToBase64Spy).toHaveBeenCalledWith(randomBytes)
    expect(hmacKey).toEqual([base64Signature, base64Key])
    jest.resetAllMocks()
  })

  it("does not include the risk if all keys have risk of 0", async () => {
    const [convertUtf8ToArrayBufferSpy, ,] = mockConvertUtf8ToArray()
    mockHmac256()
    const [, , , base64TekKey] = mockConvertArrayBufferToBase64()
    const key = "key"
    const rollingPeriod = 1
    const rollingStartNumber = 1
    const transmissionRisk = 0
    const exposureKey = {
      key,
      rollingPeriod,
      rollingStartNumber,
      transmissionRisk,
    }
    const serializedKey = `${base64TekKey}.${rollingPeriod}.${rollingStartNumber}`
    await calculateHmac([exposureKey])

    expect(convertUtf8ToArrayBufferSpy).toHaveBeenCalledWith(serializedKey)
    jest.resetAllMocks()
  })
})
