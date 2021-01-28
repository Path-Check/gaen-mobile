import env from "react-native-config"

const {
  CALLBACK_FORM_URL: formUrl,
  CALLBACK_OAUTH_URL: oauthUrl,
  CALLBACK_CLIENT_ID: clientId,
  CALLBACK_CLIENT_PUBLIC_KEY: clientPublicKey,
  CALLBACK_REFRESH_TOKEN: refreshToken,
  CALLBACK_REDIRECT_URI: redirectUri,
} = env

interface NetworkSuccess<T> {
  kind: "success"
  body?: T
}

interface NetworkFailure<U> {
  kind: "failure"
  error: U
  message?: string
}

export type NetworkResponse<T, U = "Unknown"> =
  | NetworkSuccess<T>
  | NetworkFailure<U>

interface CallbackInfo {
  firstname: string
  lastname: string
  phoneNumber: string
}

type PostGetNewAccessTokenError = "Unknown" | "AuthorizationFailed"

type Token = string

const postGetNewAccessToken = async (): Promise<
  NetworkResponse<Token, PostGetNewAccessTokenError>
> => {
  const endpoint = `${oauthUrl}token?refresh_token=${refreshToken}&grant_type=refresh_token&client_id=${clientId}&client_secret=${clientPublicKey}&redirect_uri=${redirectUri}`

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const { access_token } = await response.json()

    if (access_token) {
      return { kind: "success", body: access_token }
    } else {
      return { kind: "failure", error: "AuthorizationFailed" }
    }
  } catch (e) {
    return { kind: "failure", error: "Unknown", message: e.message }
  }
}

export type PostCallbackInfoError =
  | "AuthorizationFailed"
  | "InvalidRequest"
  | "Unknown"

export const postCallbackInfo = async ({
  firstname,
  lastname,
  phoneNumber,
}: CallbackInfo): Promise<NetworkResponse<null, PostCallbackInfoError>> => {
  const requestBody = {
    LA_First_Name__c: firstname,
    LA_Last_Name__c: lastname,
    LA_Mobile_Phone__c: phoneNumber,
  }

  const endpoint = formUrl

  try {
    const oauthResponse = await postGetNewAccessToken()

    if (oauthResponse.kind === "failure") {
      return oauthResponse
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oauthResponse.body}`,
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    if (response.ok) {
      return { kind: "success" }
    } else {
      return {
        kind: "failure",
        error: "InvalidRequest",
        message: `InvalidRequest: ${response.status} ${response.statusText}`,
      }
    }
  } catch (e) {
    return { kind: "failure", error: "InvalidRequest", message: e.message }
  }
}
