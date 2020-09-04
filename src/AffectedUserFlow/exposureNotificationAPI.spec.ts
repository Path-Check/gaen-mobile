import {
  postDiagnosisKeys,
  PostKeysNoOpReason,
  PostKeysError,
} from "./exposureNotificationAPI"
import { ExposureKey } from "../exposureKey"
import { fetchWithTimeout, TIMEOUT_ERROR } from "./fetchWithTimeout"

jest.mock("./fetchWithTimeout")

describe("postDiagnosisKeys", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("executes requests with default headers and serialized data", async () => {
    const exposureKeys: ExposureKey[] = []
    const regionCodes: string[] = []
    const certificate = "certificate"
    const hmacKey = "hmacKey"
    const appPackageName = "appPackageName"
    const revisionToken = "revisionToken"

    const fetchWithTimeoutSpy = fetchWithTimeout as jest.Mock
    fetchWithTimeoutSpy.mockRejectedValueOnce("error")

    await postDiagnosisKeys(
      exposureKeys,
      regionCodes,
      certificate,
      hmacKey,
      appPackageName,
      revisionToken,
    )

    // The constants are taken from "__mocks__/react-native-config.js"
    expect(fetchWithTimeoutSpy).toHaveBeenCalledWith(
      "POST_DIAGNOSIS_KEYS_URL",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          temporaryExposureKeys: exposureKeys,
          regions: regionCodes,
          appPackageName,
          verificationPayload: certificate,
          hmackey: hmacKey,
          padding: "",
          revisionToken,
        }),
      },
      5000,
    )
  })

  describe("on a successful request", () => {
    it("returns a success response with the revisionToken", async () => {
      const revisionToken = "revisionToken"

      ;(fetchWithTimeout as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ revisionToken }),
      })

      const result = await postDiagnosisKeys(
        [],
        [],
        "certificate",
        "hmacKey",
        "appPackageName",
        "revisionToken",
      )

      expect(result).toEqual({
        kind: "success",
        revisionToken,
      })
    })
  })

  describe("on a no op response", () => {
    it("returns a NoTokenForExistingKeys response if the error corresponds", async () => {
      const newKeysInserted = 0
      const message = "no revision token, but sent existing keys"
      const jsonResponse = {
        error: message,
        insertedExposures: newKeysInserted,
      }

      ;(fetchWithTimeout as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postDiagnosisKeys(
        [],
        [],
        "certificate",
        "hmacKey",
        "appPackageName",
        "revisionToken",
      )

      expect(result).toEqual({
        kind: "no-op",
        reason: PostKeysNoOpReason.NoTokenForExistingKeys,
        newKeysInserted,
        message,
      })
    })
  })

  describe("on a retry response", () => {
    it("retries and returns the next not retry response", async () => {
      const successResponse = {
        revisionToken: "revisionToken",
      }

      const fetchWithTimeoutSpy = fetchWithTimeout as jest.Mock

      fetchWithTimeoutSpy
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: jest.fn().mockResolvedValueOnce({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(successResponse),
        })

      const result = await postDiagnosisKeys(
        [],
        [],
        "certificate",
        "hmacKey",
        "appPackageName",
        "revisionToken",
      )

      expect(result).toEqual({
        kind: "success",
        ...successResponse,
      })
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(2)
    })

    it("retries a max of 3 times and returns that last response", async () => {
      const internalError = "internal_error"
      const retryResponse = {
        error: internalError,
      }

      const fetchWithTimeoutSpy = fetchWithTimeout as jest.Mock

      fetchWithTimeoutSpy
        .mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValueOnce(retryResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValueOnce(retryResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValueOnce(retryResponse),
        })

      const result = await postDiagnosisKeys(
        [],
        [],
        "certificate",
        "hmacKey",
        "appPackageName",
        "revisionToken",
      )

      expect(result).toEqual({
        kind: "failure",
        nature: PostKeysError.InternalServerError,
        message: internalError,
      })
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe("on a request that fails", () => {
    describe("when the error is a catched exception", () => {
      it("returns the error message if the request errors", async () => {
        const errorMessage = "errorMessage"
        ;(fetchWithTimeout as jest.Mock).mockRejectedValueOnce(
          new Error(errorMessage),
        )

        const result = await postDiagnosisKeys(
          [],
          [],
          "certificate",
          "hmacKey",
          "appPackageName",
          "revisionToken",
        )

        expect(result).toEqual({
          kind: "failure",
          nature: PostKeysError.RequestFailed,
          message: errorMessage,
        })
      })
    })

    describe("when the error is a timeout", () => {
      it("returns a timeout failure", async () => {
        const timeoutError = new Error(TIMEOUT_ERROR)
        ;(fetchWithTimeout as jest.Mock).mockRejectedValueOnce(timeoutError)

        const result = await postDiagnosisKeys(
          [],
          [],
          "certificate",
          "hmacKey",
          "appPackageName",
          "revisionToken",
        )

        expect(result).toEqual({
          kind: "failure",
          nature: PostKeysError.Timeout,
          message: TIMEOUT_ERROR,
        })
      })
    })

    describe("when the error is a failed response from the server", () => {
      it("returns the error on the response ", async () => {
        const error = "error"

        ;(fetchWithTimeout as jest.Mock).mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValueOnce({ error }),
        })

        const result = await postDiagnosisKeys(
          [],
          [],
          "certificate",
          "hmacKey",
          "appPackageName",
          "revisionToken",
        )

        expect(result).toEqual({
          kind: "failure",
          nature: PostKeysError.Unknown,
          message: error,
        })
      })
    })
  })
})
