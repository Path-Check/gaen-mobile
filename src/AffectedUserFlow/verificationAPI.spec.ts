import { postCode, postTokenAndHmac } from "./verificationAPI"

describe("postCode", () => {
  it("executes requests with default headers and serialized data", async () => {
    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockRejectedValueOnce("error")
    const code = "code"

    await postCode(code)

    // The constants are taken from "__mocks__/react-native-config.js"
    expect(fetchSpy).toHaveBeenCalledWith("GAEN_VERIFY_URL/api/verify", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        // The constants are taken from "__mocks__/react-native-config.js"
        "X-API-Key": "GAEN_VERIFY_API_TOKEN",
      },
      body: JSON.stringify({ code }),
    })
  })

  describe("on a successful request", () => {
    it("returns a verified code response", async () => {
      const testDate = "testDate"
      const testType = "testType"
      const token = "token"
      const error = ""
      const jsonResponse = {
        testtype: testType,
        testdate: testDate,
        token,
        error,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postCode("code")

      expect(result).toEqual({
        kind: "success",
        body: { testDate, testType, token, error },
      })
    })
  })

  describe("on a request that fails", () => {
    it("returns an unknown failure if the request errors", async () => {
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockRejectedValueOnce("error")

      const result = await postCode("code")

      expect(result).toEqual({ kind: "failure", error: "Unknown" })
    })

    it("returns InvalidCode error on an internal server error", async () => {
      const jsonResponse = {
        error: "internal server error",
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postCode("code")

      expect(result).toEqual({
        kind: "failure",
        error: "InvalidCode",
      })
    })

    it("returns VerificationCodeUsed error on code used error", async () => {
      const jsonResponse = {
        error: "verification code used",
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postCode("code")

      expect(result).toEqual({
        kind: "failure",
        error: "VerificationCodeUsed",
      })
    })

    it("returns Unknown error for other errors", async () => {
      const errorMessage = "unknown"
      const jsonResponse = {
        error: errorMessage,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postCode("code")

      expect(result).toEqual({
        kind: "failure",
        error: "Unknown",
        message: errorMessage,
      })
    })
  })
})

describe("postTokenAndHmac", () => {
  it("executes requests with default headers and serialized data", async () => {
    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockRejectedValueOnce("error")
    const token = "token"
    const ekeyhmac = "hmacDigest"

    await postTokenAndHmac(token, ekeyhmac)

    // The constants are taken from "__mocks__/react-native-config.js"
    expect(fetchSpy).toHaveBeenCalledWith("GAEN_VERIFY_URL/api/certificate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        // The constants are taken from "__mocks__/react-native-config.js"
        "X-API-Key": "GAEN_VERIFY_API_TOKEN",
      },
      body: JSON.stringify({ token, ekeyhmac }),
    })
  })

  describe("on a successful request", () => {
    it("returns a token verification success response", async () => {
      const certificate = "certificate"
      const error = ""
      const jsonResponse = {
        certificate,
        error,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postTokenAndHmac("token", "hmacDigest")

      expect(result).toEqual({
        kind: "success",
        body: { certificate, error },
      })
    })
  })

  describe("on a request that fails", () => {
    it("returns an unknown failure if the request errors", async () => {
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockRejectedValueOnce("error")

      const result = await postTokenAndHmac("token", "hmacDigest")

      expect(result).toEqual({ kind: "failure", error: "Unknown" })
    })

    it("returns TokenMetaDataMismatch error on a mismatch", async () => {
      const jsonResponse = {
        error: "token metadata mismatch",
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postTokenAndHmac("token", "hmac")

      expect(result).toEqual({
        kind: "failure",
        error: "TokenMetaDataMismatch",
      })
    })

    it("returns Unknown error for other errors", async () => {
      const errorMessage = "unknown"
      const jsonResponse = {
        error: errorMessage,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postTokenAndHmac("token", "hmacDigest")

      expect(result).toEqual({
        kind: "failure",
        error: "Unknown",
        message: errorMessage,
      })
    })
  })
})
