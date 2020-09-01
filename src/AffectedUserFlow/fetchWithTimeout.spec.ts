import { fetchWithTimeout, TIMEOUT_ERROR } from "./fetchWithTimeout"

describe("fetchWithTimeout", () => {
  it("delegates attributes to fetch and bubbles up the result", async () => {
    const url = "url"
    const options = {}
    const fetchResolvedValue = "result"
    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockResolvedValueOnce(fetchResolvedValue)

    const result = await fetchWithTimeout(url, options)

    expect(fetchSpy).toHaveBeenCalledWith(url, options)
    expect(result).toEqual(fetchResolvedValue)
  })

  it("returns a timeout error if the fetch call hangs", async () => {
    const shortTimeout = 100
    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockReturnValueOnce(
      new Promise((resolve) => setTimeout(resolve, shortTimeout * 2)),
    )

    await expect(fetchWithTimeout("url", {}, shortTimeout)).rejects.toThrow(
      TIMEOUT_ERROR,
    )
  })
})
