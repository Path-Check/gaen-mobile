package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import static org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.ExposureNotificationsModule.MODULE_NAME;

import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import javax.annotation.Nonnull;
import org.jetbrains.annotations.NotNull;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages;
import org.pathcheck.covidsafepaths.helpers.BluetoothHelper;
import org.pathcheck.covidsafepaths.helpers.LocationHelper;

@SuppressWarnings("unused")
@ReactModule(name = MODULE_NAME)
public class ExposureNotificationsModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "ENPermissionsModule";
  private static final String TAG = "ENModule";

  private final ExposureNotificationClient exposureNotificationClient;

  public ExposureNotificationsModule(ReactApplicationContext context) {
    super(context);
    exposureNotificationClient = Nearby.getExposureNotificationClient(context);
  }

  @Override
  public @Nonnull
  String getName() {
    return MODULE_NAME;
  }

  /**
   * Method with the same name as iOS, just calls client "start" method which enables EN.
   */
  @ReactMethod
  public void requestExposureNotificationAuthorization(final Promise promise) {
    ReactContext reactContext = getReactApplicationContext();
    ExposureNotificationClientWrapper client = ExposureNotificationClientWrapper.get(reactContext);
    FutureCallback<Void> callback = new FutureCallback<Void>() {
      @Override
      public void onSuccess(Void result) {
        promise.resolve(CallbackMessages.EN_STATUS_ACTIVE);
      }

      @Override
      public void onFailure(@NotNull Throwable exception) {
        if (!client.deviceSupportsLocationlessScanning() && !LocationHelper.Companion.isLocationEnabled(reactContext)) {
          promise.resolve(CallbackMessages.EN_ERROR_LOCATION_OFF);
          return;
        }

        if (exception instanceof ApiException) {
          ApiException apiException = (ApiException) exception;
          promise.resolve(transformApiExceptionToJSString(apiException));
          return;
        }

        promise.reject(exception);
      }
    };

    Futures.addCallback(
        client.requestPermissionToStartTracing(reactContext),
        callback,
        AppExecutors.getLightweightExecutor());
  }

  private String transformApiExceptionToJSString(ApiException exception) {
    switch (exception.getStatusCode()) {
      case ExposureNotificationStatusCodes.FAILED_ALREADY_STARTED:
        return CallbackMessages.EN_ERROR_ALREADY_STARTED;
      case ExposureNotificationStatusCodes.FAILED_BLUETOOTH_DISABLED:
        return CallbackMessages.EN_ERROR_BLUETOOTH_DISABLED;
      case ExposureNotificationStatusCodes.FAILED_DISK_IO:
        return CallbackMessages.EN_ERROR_FAILED_DISK_IO;
      case ExposureNotificationStatusCodes.FAILED_NOT_SUPPORTED:
        return CallbackMessages.EN_ERROR_NOT_SUPPORTED;
      case ExposureNotificationStatusCodes.FAILED_RATE_LIMITED:
        return CallbackMessages.EN_ERROR_RATE_LIMITED;
      case ExposureNotificationStatusCodes.FAILED_REJECTED_OPT_IN:
        return CallbackMessages.EN_ERROR_REJECTED_OPT_IN;
      case ExposureNotificationStatusCodes.FAILED_SERVICE_DISABLED:
        return CallbackMessages.EN_ERROR_SERVICE_DISABLED;
      case ExposureNotificationStatusCodes.FAILED_TEMPORARILY_DISABLED:
        return CallbackMessages.EN_ERROR_TEMPORARILY_DISABLED;
      case ExposureNotificationStatusCodes.FAILED_UNAUTHORIZED:
        return CallbackMessages.EN_ERROR_UNAUTHORIZED;
    }

    return CallbackMessages.EN_ERROR_UNKNOWN;
  }

  @ReactMethod
  public void getCurrentENPermissionsStatus(final Promise promise) {
    ExposureNotificationClientWrapper client = ExposureNotificationClientWrapper.get(getReactApplicationContext());
    client
        .isEnabled()
        .addOnSuccessListener(enabled -> {
          if (!client.deviceSupportsLocationlessScanning()
              && !LocationHelper.Companion.isLocationEnabled(getReactApplicationContext())) {
            promise.resolve(CallbackMessages.EN_STATUS_LOCATION_OFF);
            return;
          }

          if (!BluetoothHelper.Companion.isBluetoothEnabled()) {
            promise.resolve(CallbackMessages.EN_STATUS_BLUETOOTH_OFF);
            return;
          }

          if (!enabled) {
            promise.resolve(CallbackMessages.EN_STATUS_DISABLED);
            return;
          }


          promise.resolve(CallbackMessages.EN_STATUS_ACTIVE);
        })
        .addOnFailureListener(
            exception -> {
              if (!(exception instanceof ApiException)) {
                promise.reject(new Exception(CallbackMessages.ERROR_UNKNOWN));
              } else {
                promise.reject(exception);
              }
            });
  }

  /**
   * Calls start on the Exposure Notifications API.
   */
  @ReactMethod
  public void startExposureNotifications(final Promise promise) {
    // Start EN
    exposureNotificationClient
        .start()
        .addOnSuccessListener(ignored -> {
          promise.resolve(null);
          scheduleDailyProvideDiagnosisKeys();
        })
        .addOnFailureListener(
            // Assumes exception handling at RN layer
            exception -> {
              Log.e(TAG, "Failed to start EN", exception);
              promise.reject(exception);
            })
        .addOnCanceledListener(() -> promise.reject("CANCEL", "Operation cancelled"));
  }

  /**
   * Schedule daily provision of keys from server to GAEN.
   */
  private void scheduleDailyProvideDiagnosisKeys() {
    ProvideDiagnosisKeysWorker.schedule(getReactApplicationContext());
  }

  /**
   * Calls stop on the Exposure Notifications API.
   */
  @ReactMethod
  public void stopExposureNotifications(final Promise promise) {
    exposureNotificationClient
        .stop()
        .addOnSuccessListener(ignored -> {
          promise.resolve(null);
          cancelDailyProvideDiagnosisKeys();
        })
        .addOnFailureListener(
            exception -> Log.w(TAG, "Failed to stop EN", exception))
        .addOnCanceledListener(() -> promise.reject("CANCEL", "Operation cancelled"));
  }

  /**
   * Cancel daily provision of keys from server to GAEN.
   */
  private void cancelDailyProvideDiagnosisKeys() {
    ProvideDiagnosisKeysWorker.cancel(getReactApplicationContext());
  }

  /**
   * Refresh isEnabled state from Exposure Notification API.
   */
  @ReactMethod
  public void getExposureNotificationStatus(final Promise promise) {
    exposureNotificationClient
        .isEnabled()
        .addOnSuccessListener(promise::resolve);
  }
}
