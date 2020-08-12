import env from "react-native-config"

const defaultHeaders = {
  "content-type": "application/json",
}

interface EnvironmentProps {
  os: string
  osVersion: string
  appVersion: string
}

interface ReportIssueProps {
  email: string
  name: string
  body: string
  environment: EnvironmentProps
}

interface NetworkSuccess {
  kind: "success"
}

interface NetworkFailure<U> {
  kind: "failure"
  error: U
}

export type ReportIssueError = "Unknown" | "ZendeskError" | "InvalidEmailError"

export type NetworkResponse<Error = "Unknown"> =
  | NetworkSuccess
  | NetworkFailure<Error>

const OS_FIELD_KEY = "360033622032"
const OS_VERSION_FIELD_KEY = "360033618552"
const APP_VERSION_FIELD_KEY = "360033141172"
const APP_NAME_FIELD_KEY = "360034051891"
const ISSUE_SUBJECT = `Issue from GAEN in ${env.DISPLAY_NAME}`
const ANONYMOUS = "Anonymous"

const environmentFields = ({ os, osVersion, appVersion }: EnvironmentProps) => {
  return {
    [OS_FIELD_KEY]: os,
    [OS_VERSION_FIELD_KEY]: osVersion,
    [APP_VERSION_FIELD_KEY]: appVersion,
    [APP_NAME_FIELD_KEY]: env.DISPLAY_NAME,
  }
}

const EMAIL_ERROR = "Email:"

interface ErrorDescription {
  description: string
}

interface ErrorDetails {
  requester: ErrorDescription[]
}

// Errors are of the form:
// {
//   "error": "RecordInvalid",
//   "description": "Record validation errors",
//   "details": {
//     "requester": [
//       {
//         "description": "Requester: Email:  not_really_an_email.com is not properly formatted"
//      }
//    ]
//  }
//}
const determineErrorNature = (
  errorDescription?: Record<string, unknown>,
): ReportIssueError => {
  if (errorDescription?.details) {
    const errorDetails = errorDescription.details as ErrorDetails
    const requesterErrors = errorDetails.requester
      .map((error) => {
        return error.description
      })
      .join(",")
    if (requesterErrors.indexOf(EMAIL_ERROR) !== -1) {
      return "InvalidEmailError"
    }
  }

  return "ZendeskError"
}

export const reportAnIssue = async ({
  email,
  name,
  body,
  environment,
}: ReportIssueProps): Promise<NetworkResponse<ReportIssueError>> => {
  const requestBody = {
    request: {
      subject: ISSUE_SUBJECT,
      requester: { name: name.length > 0 ? name : ANONYMOUS, email },
      comment: { body },
      custom_fields: [environmentFields(environment)],
    },
  }

  try {
    const response = await fetch(env.ZENDESK_URL, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(requestBody),
    })

    if (response.ok) {
      return { kind: "success" }
    } else {
      const responseJson = await response.json()
      return { kind: "failure", error: determineErrorNature(responseJson) }
    }
  } catch (e) {
    return { kind: "failure", error: "Unknown" }
  }
}
