import env from "react-native-config"

const {
  CALLBACK_FORM_URL: callbackFormUrl,
  CALLBACK_OAUTH_URL: callbackOAuthUrl,
  CALLBACK_USERNAME: callbackUsername,
  CALLBACK_PASSWORD: callbackPassword,
  CALLBACK_CLIENT_ID: callbackClientId,
  CALLBACK_CLIENT_SECRET: callbackClientSecret,
} = env

interface NetworkSuccess {
  kind: "success"
}
interface NetworkFailure<U> {
  kind: "failure"
  error: U
  message?: string
}

export type NetworkResponse<U = "Unknown"> = NetworkSuccess | NetworkFailure<U>

export type PostCallbackInfoError =
  | "AuthorizationFailed"
  | "Unknown"
  | "InvalidRequest"

interface CallbackInfo {
  firstname: string
  lastname: string
  phoneNumber: string
}

export const postCallbackInfo = async ({
  firstname,
  lastname,
  phoneNumber,
}: CallbackInfo): Promise<NetworkResponse<PostCallbackInfoError>> => {
  const postOAuth = async () => {
    const oauthBody = `grant_type=password&client_id=${callbackClientId}&client_secret=${callbackClientSecret}&username=${callbackUsername}&password=${callbackPassword}`

    return fetch(callbackOAuthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: oauthBody,
    })
  }

  const requestBody = {
    LA_First_Name__c: firstname,
    LA_Last_Name__c: lastname,
    LA_Mobile_Phone__c: phoneNumber,
  }

  try {
    const oauthResponse = await postOAuth()
    const data = await oauthResponse.json()

    if (!data?.access_token) {
      return { kind: "failure", error: "AuthorizationFailed" }
    }

    const response = await fetch(callbackFormUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.access_token,
      },
      body: JSON.stringify(requestBody),
    })

    if (response.ok) {
      return { kind: "success" }
    } else {
      return { kind: "failure", error: "Unknown" }
    }
  } catch (e) {
    return { kind: "failure", error: "InvalidRequest", message: e.message }
  }
}
