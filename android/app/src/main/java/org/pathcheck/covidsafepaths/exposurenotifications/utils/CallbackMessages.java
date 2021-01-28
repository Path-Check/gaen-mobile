package org.pathcheck.covidsafepaths.exposurenotifications.utils;

public final class CallbackMessages {

  private CallbackMessages() {
  }

  public static final String GENERIC_SUCCESS = "success";
  public static final String GENERIC_ERROR = "error";
  public static final String ERROR_UNKNOWN = "error unknown";
  public static final String DEBUG_DETECT_EXPOSURES_ERROR_EN_NOT_ENABLED =
      "Exposure notifications must be enabled to detect exposures.";
  public static final String DEBUG_DETECT_EXPOSURES_ERROR_UNKNOWN =
      "Unknown error detecting exposures.";
  public static final String DEBUG_DETECT_EXPOSURES_ERROR =
      "The following error occurred when attempting to detect exposures: ";
  public static final String DEBUG_DETECT_EXPOSURES_SUCCESS = "Detecting exposures now.";
  public static final String RESOLUTION_REQUIRED = "resolution required";
  public static final String CANCELLED = "cancelled";
  public static final String EN_ENABLEMENT_ENABLED = "ENABLED";
  public static final String EN_ENABLEMENT_DISABLED = "DISABLED";
  public static final String EN_AUTHORIZATION_AUTHORIZED = "AUTHORIZED";
  public static final String EN_AUTHORIZATION_UNAUTHORIZED = "UNAUTHORIZED";
  public static final String EN_STATUS_ACTIVE = "Active";
  public static final String EN_STATUS_DISABLED = "Disabled";
  public static final String EN_STATUS_BLUETOOTH_OFF = "BluetoothOff";
  public static final String EN_STATUS_LOCATION_OFF = "LocationOff";

  public static final String EN_ERROR_ALREADY_STARTED = "AlreadyStarted";
  public static final String EN_ERROR_NOT_SUPPORTED = "NotSupported";
  public static final String EN_ERROR_REJECTED_OPT_IN = "RejectedOptIn";
  public static final String EN_ERROR_SERVICE_DISABLED = "ServiceDisabled";
  public static final String EN_ERROR_BLUETOOTH_DISABLED = "BluetoothDisabled";
  public static final String EN_ERROR_TEMPORARILY_DISABLED = "TemporarilyDisabled";
  public static final String EN_ERROR_FAILED_DISK_IO = "FailedDiskIO";
  public static final String EN_ERROR_UNAUTHORIZED = "Unauthorized";
  public static final String EN_ERROR_RATE_LIMITED = "RateLimited";
  public static final String EN_ERROR_LOCATION_OFF = "LocationDisabled";
  public static final String EN_ERROR_UNKNOWN = "Unknown";
}
