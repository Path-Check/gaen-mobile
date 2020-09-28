import Logger from "./logger"

export type OperationResult = "success" | "failure"
export type OperationResponse = { kind: OperationResult }
export const SUCCESS_RESPONSE: OperationResponse = { kind: "success" }
export const failureResponse = (errorMessage: string): OperationResponse => {
  Logger.error(errorMessage)
  return { kind: "failure" }
}
