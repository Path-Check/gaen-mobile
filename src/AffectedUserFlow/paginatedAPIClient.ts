const baseUrl = "https://www.elections.huffingtonpost.com"
const fullUrl = `${baseUrl}/pollster/api/v2/polls`

const defaultHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

interface NetworkSuccess<T> {
  kind: "success"
  body: T
}
interface NetworkFailure<U> {
  kind: "failure"
  error: U
  message?: string
}

export type NetworkResponse<T, U = "Unknown"> =
  | NetworkSuccess<T>
  | NetworkFailure<U>

type CodeVerificationSuccess = VerifiedCodeResponse

export type CodeVerificationError =
  | "InvalidCode"
  | "VerificationCodeUsed"
  | "NetworkConnection"
  | "Unknown"

type TestType = "confirmed" | "likely"

interface VerifiedCodeResponse {
  error: string
  testDate: string
  testType: TestType
}

interface Poll {}

interface GetPollsResponse {
  count: number
  cursor: string
  next_cursor: string
  items: Poll[]
}

// export const getPolls = async (
//   cursor: string,
// ): Promise<NetworkResponse<GetPollsResponse>> => {}
