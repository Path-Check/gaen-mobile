package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import androidx.annotation.NonNull;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureInformation;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.ExposureEntity;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages;

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
    List<ExposureEntity> exposures = RealmSecureStorageBte.INSTANCE.getExposures();
    List<RNExposureInformation> rnExposures = new ArrayList<>();

    for (ExposureEntity exposure : exposures) {
      RNExposureInformation rnExposure = new RNExposureInformation(
          exposure.getDateMillisSinceEpoch()
      );

      rnExposures.add(rnExposure);
    }

    String json = new Gson().toJson(rnExposures);
    promise.resolve(json);
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
