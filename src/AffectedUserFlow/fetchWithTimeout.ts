const TIMEOUT_ERROR = "timeout"
const DEFAULT_TIMEOUT = 5000

const fetchWithTimeout = async (
  url: RequestInfo,
  options: RequestInit,
  timeoutInMs = DEFAULT_TIMEOUT,
): Promise<Response | unknown> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(TIMEOUT_ERROR))
    }, timeoutInMs)

    fetch(url, options)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
      .finally(() => {
        clearTimeout(timeoutId)
      })
  })
}

export { fetchWithTimeout, TIMEOUT_ERROR }
