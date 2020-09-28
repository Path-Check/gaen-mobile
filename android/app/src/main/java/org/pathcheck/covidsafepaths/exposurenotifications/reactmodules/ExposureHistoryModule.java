package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import androidx.annotation.NonNull;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.exposurenotification.DailySummary;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.jetbrains.annotations.NotNull;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureInformation;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages;
import org.threeten.bp.Duration;

@SuppressWarnings("unused")
@ReactModule(name = ExposureHistoryModule.MODULE_NAME)
public class ExposureHistoryModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "ExposureHistoryModule";
  private static final String TAG = "ExposureHistoryModule";

  private ExposureNotificationSharedPreferences prefs;

  public ExposureHistoryModule(@NonNull ReactApplicationContext reactContext) {
    super(reactContext);
    prefs = new ExposureNotificationSharedPreferences(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void getCurrentExposures(final Promise promise) {
    ExposureNotificationClientWrapper exposureNotificationsClient =
        ExposureNotificationClientWrapper.get(getReactApplicationContext());

    FutureCallback<List<DailySummary>> callback = new FutureCallback<List<DailySummary>>() {
      @Override
      public void onSuccess(@NullableDecl List<DailySummary> result) {
        if (result == null) {
          promise.resolve(null);
          return;
        }

        List<RNExposureInformation> exposures = new ArrayList<>();
        for (DailySummary dailySummary : result) {
          RNExposureInformation exposure = new RNExposureInformation(
              Duration.ofDays(dailySummary.getDaysSinceEpoch()).toMillis(),
              Duration.ofSeconds((int) dailySummary.getSummaryData().getWeightedDurationSum()).toMinutes()
          );

          exposures.add(exposure);
        }

        String json = new Gson().toJson(exposures);
        promise.resolve(json);
      }

      @Override
      public void onFailure(@NotNull Throwable t) {
        promise.reject(t);
      }
    };

    Futures.addCallback(
        exposureNotificationsClient.getDailySummaries(),
        callback,
        AppExecutors.getLightweightExecutor()
    );
  }

  @ReactMethod
  public void fetchLastDetectionDate(Promise promise) {
    Long lastDetectionDate = prefs.getLastDetectionProcessDate();
    // Convert to double, we cannot send longs through the RN bridge
    promise.resolve(lastDetectionDate != null ? lastDetectionDate.doubleValue() : null);
  }

  @ReactMethod
  public void detectExposures(Promise promise) {
    ExposureNotificationClientWrapper.get(getReactApplicationContext())
        .isEnabled()
        .addOnSuccessListener(enabled -> {
          if (enabled) {
            WorkManager workManager = WorkManager.getInstance(getReactApplicationContext());
            workManager.enqueue(new OneTimeWorkRequest.Builder(ProvideDiagnosisKeysWorker.class).build());
            // We are not waiting until the job is completed.
            // Is there any way to pass the promise through all the workers?
            promise.resolve(CallbackMessages.DEBUG_DETECT_EXPOSURES_SUCCESS);
          } else {
            promise.reject(new Exception(CallbackMessages.DEBUG_DETECT_EXPOSURES_ERROR_EN_NOT_ENABLED));
          }
        })
        .addOnFailureListener(promise::reject);
  }
}
