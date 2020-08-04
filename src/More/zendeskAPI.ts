import env from "react-native-config"

const defaultHeaders = {
  "content-type": "application/json",
}

type EnvironmentProps = {
  os: string
  osVersion: string
  appVersion: string
}

type FeedbackProps = {
  subject: string
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

export type FeedbackError = "Unknown" | "ZendeskError"

export type NetworkResponse<U = "Unknown"> = NetworkSuccess | NetworkFailure<U>

const OS_FIELD_KEY = "360033622032"
const OS_VERSION_FIELD_KEY = "360033618552"
const APP_VERSION_FIELD_KEY = "360033141172"

const environmentFields = ({ os, osVersion, appVersion }: EnvironmentProps) => {
  return {
    [OS_FIELD_KEY]: os,
    [OS_VERSION_FIELD_KEY]: osVersion,
    [APP_VERSION_FIELD_KEY]: appVersion,
  }
}

export const submitFeedback = async ({
  subject,
  name,
  body,
  environment,
}: FeedbackProps): Promise<NetworkResponse<FeedbackError>> => {
  const requestBody = {
    request: {
      subject,
      requester: { name },
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
      return { kind: "failure", error: "ZendeskError" }
    }
  } catch (e) {
    return { kind: "failure", error: "Unknown" }
  }
}
