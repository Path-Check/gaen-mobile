import { Factory } from "fishery"

import {
  PermissionStatus,
  ENPermissionStatus,
  PermissionsContextState,
} from "../Device/PermissionsContext"

export default Factory.define<PermissionsContextState>(() => ({
  isBluetoothOn: true,
  locationPermissions: "RequiredOn",
  notification: {
    status: PermissionStatus.GRANTED,
    check: jest.fn(),
    request: jest.fn(),
  },
  exposureNotifications: {
    status: ENPermissionStatus.ENABLED,
    check: jest.fn(),
    request: jest.fn(),
  },
}))
