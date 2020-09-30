package org.pathcheck.covidsafepaths.exposurenotifications;

import android.app.Activity;
import android.content.Context;
import android.content.IntentSender;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.concurrent.futures.CallbackToFutureAdapter;
import com.facebook.react.bridge.ReactContext;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.DailySummary;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.android.gms.tasks.Task;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.ListenableFuture;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.pathcheck.covidsafepaths.bridge.EventSender;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.common.TaskToFutureAdapter;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ExposureConfigurations;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.RequestCodes;
import org.threeten.bp.Duration;

/**
 * Wrapper around {@link com.google.android.gms.nearby.Nearby} APIs.
 */
public class ExposureNotificationClientWrapper {

  private static final Duration GET_DAILY_SUMMARIES_TIMEOUT = Duration.ofSeconds(120);
  private static final Duration SET_DIAGNOSIS_KEY_DATA_MAPPING_TIMEOUT = Duration.ofSeconds(30);
  private static final Duration PROVIDE_KEYS_TIMEOUT = Duration.ofMinutes(30);
  private static final String TAG = "ENClientWrapper";

  private static ExposureNotificationClientWrapper INSTANCE;

  private final ExposureNotificationClient exposureNotificationClient;
  private final ExposureConfigurations config;

  @Nullable private CallbackToFutureAdapter.Completer<Void> startTracingCompleter;
  @Nullable private CallbackToFutureAdapter.Completer<List<TemporaryExposureKey>> getKeysCompleter;

  public static ExposureNotificationClientWrapper get(Context context) {
    if (INSTANCE == null) {
      INSTANCE = new ExposureNotificationClientWrapper(context);
    }
    return INSTANCE;
  }

  ExposureNotificationClientWrapper(Context context) {
    exposureNotificationClient = Nearby.getExposureNotificationClient(context);
    config = new ExposureConfigurations(context);
  }

  public ListenableFuture<Void> requestPermissionToStartTracing(ReactContext context) {
    return CallbackToFutureAdapter.getFuture(completer -> exposureNotificationClient.start()
        .addOnSuccessListener(unused -> {
          if (startTracingCompleter != null) {
            startTracingCompleter.set(unused);
            startTracingCompleter = null;
          }

          onExposureNotificationStateChanged(context, true);
          completer.set(unused);
        })
        .addOnFailureListener(exception -> {
          if (exception instanceof ApiException) {
            ApiException apiException = (ApiException) exception;
            if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
              startTracingCompleter = completer;
              showPermissionDialog(context, apiException, RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
              return;
            }
          }

          if (startTracingCompleter != null) {
            startTracingCompleter.setException(exception);
            startTracingCompleter = null;
          }

          onExposureNotificationStateChanged(context, false);
          completer.setException(exception);
        })
    );
  }

  /**
   * Gets recent (initially 14 days) Temporary Exposure Keys from Google Play Services.
   */
  public ListenableFuture<List<TemporaryExposureKey>> requestPermissionToGetExposureKeys(ReactContext context) {
    return CallbackToFutureAdapter.getFuture(completer -> exposureNotificationClient.getTemporaryExposureKeyHistory()
        .addOnSuccessListener(keys -> {
          if (getKeysCompleter != null) {
            getKeysCompleter.set(keys);
            getKeysCompleter = null;
          }

          completer.set(keys);
        })
        .addOnFailureListener(exception -> {
          if (exception instanceof ApiException) {
            ApiException apiException = (ApiException) exception;
            if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
              getKeysCompleter = completer;
              showPermissionDialog(context, apiException, RequestCodes.REQUEST_CODE_GET_TEMP_EXPOSURE_KEY_HISTORY);
              return;
            }
          }

          if (getKeysCompleter != null) {
            getKeysCompleter.setException(exception);
            getKeysCompleter = null;
          }

          completer.setException(exception);
        })
    );
  }

  public void showPermissionDialog(ReactContext reactContext, ApiException apiException, int requestCode) {
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

  public void onPermissionDialogResult(ReactContext context, int requestCode, boolean resultOk) {
    if (requestCode == RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION) {
      if (resultOk) {
        requestPermissionToStartTracing(context);
      } else {
        onExposureNotificationStateChanged(context, false);
        if (startTracingCompleter != null) {
          startTracingCompleter.setException(new Exception("Cancelled by user"));
          startTracingCompleter = null;
        }
      }
    } else if (requestCode == RequestCodes.REQUEST_CODE_GET_TEMP_EXPOSURE_KEY_HISTORY) {
      if (resultOk) {
        requestPermissionToGetExposureKeys(context);
      } else {
        if (getKeysCompleter != null) {
          getKeysCompleter.setException(new Exception("Cancelled by user"));
          getKeysCompleter = null;
        }
      }
    }
  }

  public Task<Void> stopTracing(ReactContext context) {
    return exposureNotificationClient.stop()
        .addOnSuccessListener(unused -> onExposureNotificationStateChanged(context, false))
        .addOnFailureListener(exception -> onExposureNotificationStateChanged(context, true))
        .addOnCanceledListener(() -> onExposureNotificationStateChanged(context, true));
  }

  public Task<Boolean> isEnabled() {
    return exposureNotificationClient.isEnabled();
  }

  public ListenableFuture<Void> provideDiagnosisKeys(List<File> files) {
    // Update the configuration each time we download keys
    return FluentFuture.from(config.refresh())
        .catching(Exception.class, exception -> {
          Log.d(TAG, "Config refresh failed: " + exception);
          // Ignore the error, use the default config
          return null;
        }, AppExecutors.getLightweightExecutor())
        .transformAsync((done) -> setDiagnosisKeysDataMapping(), AppExecutors.getBackgroundExecutor())
        .catching(Exception.class, exception -> {
          Log.d(TAG, "setDiagnosisKeysDataMapping failed: " + exception);
          // Ignore the error, if called twice within 7 days,
          // the second call has no effect and raises an exception with status code FAILED_RATE_LIMITED.
          return null;
        }, AppExecutors.getLightweightExecutor())
        .transformAsync((done) -> provideDiagnosisKeysFuture(files), AppExecutors.getBackgroundExecutor());
  }

  private ListenableFuture<Void> provideDiagnosisKeysFuture(List<File> files) {
    // Calls to this method are limited to six per day, we are only calling it once a day.
    Log.d(TAG, "provideDiagnosisKeys called with " + files.size() + " files");
    return TaskToFutureAdapter.getFutureWithTimeout(
        exposureNotificationClient.provideDiagnosisKeys(files),
        PROVIDE_KEYS_TIMEOUT.toMillis(),
        TimeUnit.MILLISECONDS,
        AppExecutors.getScheduledExecutor());
  }

  private ListenableFuture<Void> setDiagnosisKeysDataMapping() {
    // https://developers.google.com/android/exposure-notifications/exposure-notifications-api#methods
    // In v1.6, these settings are applied at matching time, when calling provideDiagnosisKeys().
    // It won't modify ExposureWindow objects for keys provided in past calls.
    Log.d(TAG, "setDiagnosisKeysDataMapping called with config " + config.getDiagnosisKeysDataMapping());
    return TaskToFutureAdapter.getFutureWithTimeout(
        exposureNotificationClient.setDiagnosisKeysDataMapping(config.getDiagnosisKeysDataMapping()),
        SET_DIAGNOSIS_KEY_DATA_MAPPING_TIMEOUT.toMillis(),
        TimeUnit.MILLISECONDS,
        AppExecutors.getScheduledExecutor());
  }

  public ListenableFuture<List<DailySummary>> getDailySummaries() {
    return FluentFuture.from(
        TaskToFutureAdapter.getFutureWithTimeout(
            exposureNotificationClient.getDailySummaries(config.getDailySummariesConfig()),
            GET_DAILY_SUMMARIES_TIMEOUT.toMillis(),
            TimeUnit.MILLISECONDS,
            AppExecutors.getScheduledExecutor())
    ).transform(summaries -> {
      if (summaries == null) {
        return null;
      }

      List<DailySummary> filteredSummaries = new ArrayList<>();
      for (DailySummary summary : summaries) {
        long exposureDurationMinutes = Duration
            .ofSeconds((int) summary.getSummaryData().getWeightedDurationSum())
            .toMinutes();

        if (exposureDurationMinutes >= config.getTriggerThresholdWeightedDuration()) {
          filteredSummaries.add(summary);
        }
      }

      Log.d(TAG, "Returning " + filteredSummaries.size() + " summaries out of " + summaries.size());
      return filteredSummaries;
    }, AppExecutors.getLightweightExecutor());
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

    EventSender.INSTANCE.sendExposureNotificationStatusChanged(context, enabled);
  }
}
