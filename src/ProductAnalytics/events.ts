export type Event =
  | "exposure_notification_recieved"
  | "verification_code_submitted"
  | "positive_test_result_shared"
  | "exposure_notifications_enabled"

export const event: Record<string, Event> = {
  enReceived: "exposure_notification_recieved",
  codeSubmitted: "verification_code_submitted",
  testResultShared: "positive_test_result_shared",
  enEnabled: "exposure_notifications_enabled",
}
