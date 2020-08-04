import { submitFeedback } from "./zendeskAPI"

describe("submitFeedback", () => {
  it("sends a request to the zendesk api to create a new request", async () => {
    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockRejectedValueOnce("error")
    const subject = "subject"
    const name = "name"
    const body = "body"
    const environment = {
      os: "os",
      osVersion: "osVersion",
      appVersion: "appVersion",
    }

    await submitFeedback({ subject, name, body, environment })

    // The constants are taken from "__mocks__/react-native-config.js"
    expect(fetchSpy).toHaveBeenCalledWith("ZENDESK_URL", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        request: {
          subject,
          requester: { name },
          comment: { body },
          custom_fields: [
            {
              "360033622032": environment.os,
              "360033618552": environment.osVersion,
              "360033141172": environment.appVersion,
            },
          ],
        },
      }),
    })
  })

  describe("on a successful request", () => {
    it("returns a NetworkSuccess response", async () => {
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockResolvedValueOnce({ ok: true })

      const result = await submitFeedback({
        subject: "subject",
        name: "name",
        body: "body",
        environment: {
          os: "os",
          osVersion: "osVersion",
          appVersion: "appVersion",
        },
      })

      expect(result).toEqual({ kind: "success" })
    })
  })

  describe("on a failed request", () => {
    it("returns a NetworkFailure on zendesk for a non 200 result", async () => {
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockResolvedValueOnce({ ok: false })

      const result = await submitFeedback({
        subject: "subject",
        name: "name",
        body: "body",
        environment: {
          os: "os",
          osVersion: "osVersion",
          appVersion: "appVersion",
        },
      })

      expect(result).toEqual({ kind: "failure", error: "ZendeskError" })
    })

    it("returns an unknown NetworkFailure for a failed request", async () => {
      const fetchSpy = jest.fn()
      ;(fetch as jest.Mock) = fetchSpy
      fetchSpy.mockRejectedValueOnce("error")

      const result = await submitFeedback({
        subject: "subject",
        name: "name",
        body: "body",
        environment: {
          os: "os",
          osVersion: "osVersion",
          appVersion: "appVersion",
        },
      })

      expect(result).toEqual({ kind: "failure", error: "Unknown" })
    })
  })
})
