package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Nonnull;
import org.jetbrains.annotations.NotNull;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.common.NotificationHelper;
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNDiagnosisKey;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.ExposureEntity;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util;
import org.threeten.bp.Instant;

@SuppressWarnings("unused")
@ReactModule(name = DebugMenuModule.MODULE_NAME)
public class DebugMenuModule extends ReactContextBaseJavaModule {
  static final String MODULE_NAME = "DebugMenuModule";

  public DebugMenuModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public @Nonnull
  String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void fetchDiagnosisKeys(Promise promise) {
    ExposureNotificationClientWrapper client = ExposureNotificationClientWrapper.get(getReactApplicationContext());
    ReactContext reactContext = getReactApplicationContext();

    FutureCallback<List<TemporaryExposureKey>> callback = new FutureCallback<List<TemporaryExposureKey>>() {
      @Override
      public void onSuccess(List<TemporaryExposureKey> result) {
        List<RNDiagnosisKey> diagnosisKeys = new ArrayList<>();
        for (TemporaryExposureKey key : result) {
          RNDiagnosisKey diagnosisKey = new RNDiagnosisKey(key.getRollingStartIntervalNumber());
          diagnosisKeys.add(diagnosisKey);
        }

        promise.resolve(Util.convertListToWritableArray(diagnosisKeys));
      }

      @Override
      public void onFailure(@NotNull Throwable exception) {
        promise.reject(exception);
      }
    };

    Futures.addCallback(
        client.requestPermissionToGetExposureKeys(reactContext),
        callback,
        AppExecutors.getLightweightExecutor()
    );
  }

  @ReactMethod
  public void simulateExposure(Promise promise) {
    RealmSecureStorageBte.INSTANCE.insertExposure(
        ExposureEntity.create(getRandomExposureDate(), Instant.now().toEpochMilli())
    );
    NotificationHelper.showPossibleExposureNotification(getReactApplicationContext());
    promise.resolve(null);
  }

  /**
   * Get a random date between the last 14 days and now.
   * @return random exposure date
   */
  private Long getRandomExposureDate() {
    SecureRandom random = new SecureRandom();
    int randomDayMillis = random.nextInt(13) * 24 * 60 * 60 * 1000;

    return Instant.now().toEpochMilli() - randomDayMillis;
  }

  @ReactMethod
  public void simulateExposureDetectionError(Promise promise) {
    promise.reject(new Exception("Not implemented"));
  }

  @ReactMethod
  public void resetExposures(Promise promise) {
    RealmSecureStorageBte.INSTANCE.resetExposures();
    promise.resolve(null);
  }

  @ReactMethod
  public void toggleExposureNotifications(Promise promise) {
    ReactContext reactContext = getReactApplicationContext();
    ExposureNotificationClientWrapper exposureNotificationsClient =
        ExposureNotificationClientWrapper.get(reactContext);
    exposureNotificationsClient.isEnabled()
        .addOnSuccessListener(enabled -> {
          if (enabled) {
            exposureNotificationsClient.stopTracing(reactContext)
                .addOnSuccessListener(promise::resolve)
                .addOnFailureListener(promise::reject);
          } else {
            FutureCallback<Void> callback = new FutureCallback<Void>() {
              @Override
              public void onSuccess(Void result) {
                promise.resolve(result);
              }

              @Override
              public void onFailure(@NotNull Throwable exception) {
                promise.reject(exception);
              }
            };

            Futures.addCallback(
                exposureNotificationsClient.requestPermissionToStartTracing(reactContext),
                callback,
                AppExecutors.getLightweightExecutor());
          }
        })
        .addOnFailureListener(promise::reject);
  }

  @ReactMethod
  public void showLastProcessedFilePath(Promise promise) {
    promise.resolve(RealmSecureStorageBte.INSTANCE.getLastProcessedKeyZipFileName());
  }
}
