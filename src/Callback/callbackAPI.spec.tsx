import { postCallbackInfo } from "./callbackAPI"

describe("postCallbackInfo", () => {
  describe("when the request succeeds", () => {
    it("posts to the call back endpoint with the returned token", async () => {
      const accessToken = "accessToken"
      const oauthResponse = {
        json: jest.fn().mockResolvedValueOnce({ access_token: accessToken }),
      }
      const requestCallBackResponse = { ok: true }
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy
        .mockResolvedValueOnce(oauthResponse)
        .mockResolvedValueOnce(requestCallBackResponse)
      const firstname = "firstname"
      const lastname = "lastname"
      const phoneNumber = "phoneNumber"

      const result = await postCallbackInfo({
        firstname,
        lastname,
        phoneNumber,
      })

      const oauthUrl = `CALLBACK_OAUTH_URLtoken?refresh_token=CALLBACK_REFRESH_TOKEN&grant_type=refresh_token&client_id=CALLBACK_CLIENT_ID&client_secret=CALLBACK_CLIENT_PUBLIC_KEY&redirect_uri=CALLBACK_REDIRECT_URI`
      const formUrl = "CALLBACK_FORM_URL"

      expect(fetchSpy).toHaveBeenCalledWith(oauthUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      expect(fetchSpy).toHaveBeenCalledWith(formUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          LA_First_Name__c: firstname,
          LA_Last_Name__c: lastname,
          LA_Mobile_Phone__c: phoneNumber,
        }),
      })
      expect(result).toEqual({ kind: "success" })
    })

    describe("on a failure response for the call back request", () => {
      it("returns an unknown failure response", async () => {
        const oauthResponse = {
          json: jest
            .fn()
            .mockResolvedValueOnce({ access_token: "accessToken" }),
        }
        const requestCallBackResponse = {
          ok: false,
          status: 999,
          statusText: "statusText",
        }
        const fetchSpy = jest.fn()
        ;(fetch as jest.Mock) = fetchSpy
        fetchSpy
          .mockResolvedValueOnce(oauthResponse)
          .mockResolvedValueOnce(requestCallBackResponse)

        const result = await postCallbackInfo({
          firstname: "firstname",
          lastname: "lastname",
          phoneNumber: "phoneNumber",
        })

        expect(result).toEqual({
          kind: "failure",
          error: "InvalidRequest",
          message: "InvalidRequest: 999 statusText",
        })
      })
    })

    describe("on a error for the call back request", () => {
      it("returns an exception failure response with the error", async () => {
        const errorMessage = "error"
        const oauthResponse = {
          json: jest
            .fn()
            .mockResolvedValueOnce({ access_token: "accessToken" }),
        }
        const fetchSpy = jest.fn()
        ;(fetch as jest.Mock) = fetchSpy
        fetchSpy
          .mockResolvedValueOnce(oauthResponse)
          .mockRejectedValueOnce(new Error(errorMessage))

        const result = await postCallbackInfo({
          firstname: "firstname",
          lastname: "lastname",
          phoneNumber: "phoneNumber",
        })

        expect(result).toEqual({
          kind: "failure",
          error: "InvalidRequest",
          message: errorMessage,
        })
      })
    })
  })

  describe("on a failure response for the oauth request", () => {
    it("returns an authorization failure response", async () => {
      const oauthResponse = {
        json: jest.fn().mockResolvedValueOnce({}),
      }
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockResolvedValueOnce(oauthResponse)

      const result = await postCallbackInfo({
        firstname: "firstname",
        lastname: "lastname",
        phoneNumber: "phoneNumber",
      })

      expect(result).toEqual({ kind: "failure", error: "AuthorizationFailed" })
    })
  })

  describe("on a error for the oauth request", () => {
    it("returns an exception failure response with the error", async () => {
      const errorMessage = "error"
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockRejectedValueOnce(new Error(errorMessage))

      const result = await postCallbackInfo({
        firstname: "firstname",
        lastname: "lastname",
        phoneNumber: "phoneNumber",
      })

      expect(result).toEqual({
        kind: "failure",
        error: "Unknown",
        message: errorMessage,
      })
    })
  })
})
