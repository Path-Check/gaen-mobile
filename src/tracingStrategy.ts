import { ExposureEventsStrategy } from "./ExposureHistoryContext"
import { PermissionStrategy } from "./PermissionsContext"

export interface TracingStrategy {
  name: string
  exposureEventsStrategy: ExposureEventsStrategy
  permissionStrategy: PermissionStrategy
}
