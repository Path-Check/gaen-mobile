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
      const body = `grant_type=password&client_id=CALLBACK_CLIENT_ID&client_secret=CALLBACK_CLIENT_SECRET&username=CALLBACK_USERNAME&password=CALLBACK_PASSWORD`

      const result = await postCallbackInfo({
        firstname,
        lastname,
        phoneNumber,
      })

      expect(fetchSpy).toHaveBeenCalledWith("CALLBACK_OAUTH_URL", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
      expect(fetchSpy).toHaveBeenCalledWith("CALLBACK_FORM_URL", {
        method: "POST",
        headers: {
          "content-type": "application/json",
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
        const requestCallBackResponse = { ok: false }
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

        expect(result).toEqual({ kind: "failure", error: "Unknown" })
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
        error: "InvalidRequest",
        message: errorMessage,
      })
    })
  })
})
