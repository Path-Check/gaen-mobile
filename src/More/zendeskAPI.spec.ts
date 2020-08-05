import { reportAnIssue } from "./zendeskAPI"

describe("reportAnIssue", () => {
  it("creates a new request using the zendesk api", async () => {
    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockRejectedValueOnce("error")
    const email = "email"
    const name = "name"
    const body = "body"
    const environment = {
      os: "os",
      osVersion: "osVersion",
      appVersion: "appVersion",
    }

    await reportAnIssue({ email, name, body, environment })

    // The constants are taken from "__mocks__/react-native-config.js"
    expect(fetchSpy).toHaveBeenCalledWith("ZENDESK_URL", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        request: {
          // The constants are taken from "__mocks__/react-native-config.js"
          subject: "Issue from GAEN mobile application DISPLAY_NAME",
          requester: { name, email },
          comment: { body },
          custom_fields: [
            {
              "360033622032": environment.os,
              "360033618552": environment.osVersion,
              "360033141172": environment.appVersion,
              "360034051891": "DISPLAY_NAME",
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

      const result = await reportAnIssue({
        email: "email",
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

      const result = await reportAnIssue({
        email: "email",
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

      const result = await reportAnIssue({
        email: "email",
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
