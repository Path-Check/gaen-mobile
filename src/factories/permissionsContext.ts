import { Factory } from "fishery"

import { PermissionsContextState } from "../Device/PermissionsContext"

export default Factory.define<PermissionsContextState>(() => ({
  isBluetoothOn: true,
  locationPermissions: "RequiredOn",
  notification: {
    status: "Granted" as const,
    check: jest.fn(),
    request: jest.fn(),
  },
  exposureNotifications: {
    status: "Enabled",
    check: jest.fn(),
    request: jest.fn(),
  },
}))
