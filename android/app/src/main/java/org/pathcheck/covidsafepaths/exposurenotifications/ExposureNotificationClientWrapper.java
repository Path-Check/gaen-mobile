package org.pathcheck.covidsafepaths.exposurenotifications;

import static org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages.EN_STATUS_EVENT;

import android.app.Activity;
import android.content.Context;
import android.content.IntentSender;
import android.util.Log;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.android.gms.nearby.exposurenotification.ExposureWindow;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.android.gms.tasks.Task;
import java.io.File;
import java.util.List;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.RequestCodes;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util;

/**
 * Wrapper around {@link com.google.android.gms.nearby.Nearby} APIs.
 */
public class ExposureNotificationClientWrapper {

  private static ExposureNotificationClientWrapper INSTANCE;

  private final ExposureNotificationClient exposureNotificationClient;

  public static ExposureNotificationClientWrapper get(Context context) {
    if (INSTANCE == null) {
      INSTANCE = new ExposureNotificationClientWrapper(context);
    }
    return INSTANCE;
  }

  ExposureNotificationClientWrapper(Context context) {
    exposureNotificationClient = Nearby.getExposureNotificationClient(context);
  }

  public Task<Void> start(ReactContext context) {
    return exposureNotificationClient.start()
        .addOnSuccessListener(unused -> onExposureNotificationStateChanged(context, true))
        .addOnFailureListener(exception -> {
          onExposureNotificationStateChanged(context, false);
          if (!(exception instanceof ApiException)) {
            return;
          }

          ApiException apiException = (ApiException) exception;
          if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
            showPermissionDialog(context, apiException,
                RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
          }
        })
        .addOnCanceledListener(() -> onExposureNotificationStateChanged(context, false));
  }

  public void showPermissionDialog(ReactContext reactContext, ApiException apiException,
                                   int requestCode) {
    try {
      Activity activity = reactContext.getCurrentActivity();
      if (activity != null) {
        apiException
            .getStatus()
            .startResolutionForResult(activity, requestCode);
      }
    } catch (IntentSender.SendIntentException e) {
      Log.e("Permissions Dialog", e.toString());
    }
  }

  public Task<Void> stop(ReactContext context) {
    return exposureNotificationClient.stop()
        .addOnSuccessListener(unused -> onExposureNotificationStateChanged(context, false))
        .addOnFailureListener(exception -> onExposureNotificationStateChanged(context, true))
        .addOnCanceledListener(() -> onExposureNotificationStateChanged(context, true));
  }

  public Task<Boolean> isEnabled() {
    return exposureNotificationClient.isEnabled();
  }

  public Task<List<TemporaryExposureKey>> getTemporaryExposureKeyHistory() {
    return exposureNotificationClient.getTemporaryExposureKeyHistory();
  }

  public Task<Void> provideDiagnosisKeys(List<File> files) {
    // Calls to this method are limited to six per day, we are only calling it once a day.
    return exposureNotificationClient.provideDiagnosisKeys(files);
  }

  public Task<List<ExposureWindow>> getExposureWindows() {
    return exposureNotificationClient.getExposureWindows();
  }

  public boolean deviceSupportsLocationlessScanning() {
    return exposureNotificationClient.deviceSupportsLocationlessScanning();
  }

  public void onExposureNotificationStateChanged(@Nullable ReactContext context, boolean enabled) {
    if (enabled) {
      ProvideDiagnosisKeysWorker.schedule(context);
    } else {
      ProvideDiagnosisKeysWorker.cancel(context);
    }

    if (context != null) {
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(EN_STATUS_EVENT, Util.getEnStatusWritableArray(enabled));
    }
  }
}
