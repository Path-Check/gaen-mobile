package org.pathcheck.covidsafepaths.exposurenotifications;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.exposurenotification.ExposureWindow;
import com.google.android.gms.nearby.exposurenotification.ScanInstance;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureInformation;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences;

@ReactModule(name = ExposureHistoryModule.MODULE_NAME)
public class ExposureHistoryModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "ExposureHistoryModule";
  public static final String TAG = "ExposureHistoryModule";

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
  public void getCurrentExposures(final Callback callback) {
    ExposureNotificationClientWrapper exposureNotificationsClient =
        ExposureNotificationClientWrapper.get(getReactApplicationContext());
    exposureNotificationsClient.getExposureWindows()
        .addOnSuccessListener(exposureWindows -> {
          List<RNExposureInformation> exposures = new ArrayList<>();
          for (ExposureWindow window : exposureWindows) {
            long durationMinutes = 0;
            for (ScanInstance scan : window.getScanInstances()) {
              // We don't need a float type here, getSecondsSinceLastScan() is coarsened to 60-second increments
              durationMinutes += scan.getSecondsSinceLastScan() / 60;
            }
            RNExposureInformation exposure = new RNExposureInformation(
                window.getDateMillisSinceEpoch(),
                durationMinutes
            );
            exposures.add(exposure);
          }

          String json = new Gson().toJson(exposures);
          callback.invoke(json);
        });
  }

  @ReactMethod
  public void fetchLastDetectionDate(Promise promise) {
    Long lastDetectionDate = prefs.getLastDetectionProcessDate();
    // Convert to double, we cannot send longs through the RN bridge
    promise.resolve(lastDetectionDate != null ? lastDetectionDate.doubleValue() : null);
  }
}
