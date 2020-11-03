import Logger from "./logger"

export type OperationResponse = OperationSuccess | OperationFailure
export type OperationSuccess = { kind: "success" }
export type OperationFailure = { kind: "failure"; error: string }
export const failureResponse = (errorMessage: string): OperationResponse => {
  Logger.error(errorMessage)
  return { kind: "failure", error: errorMessage }
}
