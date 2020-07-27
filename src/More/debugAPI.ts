import env from "react-native-config"

const baseUrl = env.DEBUG_API_URL
const submitLogsUrl = `${baseUrl}/api/v1/submit_logs`

const defaultHeaders = {
  "content-type": "application/json",
  Authorization: `Bearer ${env.DEBUG_API_TOKEN}`,
}

export type Token = string

interface NetworkSuccess<T> {
  kind: "success"
  body: T
}
interface NetworkFailure<U> {
  kind: "failure"
  error: U
}

export type NetworkResponse<T, U = "Unknown"> =
  | NetworkSuccess<T>
  | NetworkFailure<U>

type SubmitLogsSuccess = "success"
export type SubmitLogsError = "Unknown"

type SubmitLogsRequest = {
  email: string
  payload: string
  description?: string
}

export const postDebugLog = async ({
  email,
  payload,
  description = "",
}: SubmitLogsRequest): Promise<
  NetworkResponse<SubmitLogsSuccess, SubmitLogsError>
> => {
  const body = JSON.stringify({
    log: {
      email,
      payload,
      description,
    },
  })
  const requestOptions = {
    method: "POST",
    headers: defaultHeaders,
    body,
  }

  try {
    const response = await fetch(submitLogsUrl, requestOptions)
    const json = await response.json()
    if (response.ok) {
      return { kind: "success", body: json.body }
    } else {
      switch (json.error) {
        default:
          return { kind: "failure", error: "Unknown" }
      }
    }
  } catch (e) {
    console.log(e)
    return { kind: "failure", error: "Unknown" }
  }
}
