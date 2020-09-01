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
import javax.annotation.Nonnull;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.RequestCodes;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util;

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
    client.start(reactContext)
        .addOnSuccessListener(unused -> promise.resolve(CallbackMessages.GENERIC_SUCCESS))
        .addOnFailureListener(exception -> {
          if (!(exception instanceof ApiException)) {
            promise.reject(new Exception(CallbackMessages.ERROR_UNKNOWN));
            return;
          }
          ApiException apiException = (ApiException) exception;
          if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
            // TODO Call resolve after the dialog is closed
            promise.resolve(CallbackMessages.GENERIC_SUCCESS);
            client.showPermissionDialog(getReactApplicationContext(), apiException,
                RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
          } else {
            promise.reject(apiException);
          }
        })
        .addOnCanceledListener(() -> promise.reject(new Exception(CallbackMessages.CANCELLED)));
  }

  @ReactMethod
  public void getCurrentENPermissionsStatus(final Promise promise) {
    ExposureNotificationClientWrapper.get(getReactApplicationContext())
        .isEnabled()
        .addOnSuccessListener(enabled -> promise.resolve(Util.getEnStatusWritableArray(enabled)))
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
