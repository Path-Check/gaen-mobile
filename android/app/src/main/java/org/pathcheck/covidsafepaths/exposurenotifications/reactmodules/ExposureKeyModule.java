package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.collect.ImmutableList;
import com.google.common.io.BaseEncoding;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Nonnull;
import org.jetbrains.annotations.NotNull;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureKey;
import org.pathcheck.covidsafepaths.exposurenotifications.network.DiagnosisKey;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util;

@SuppressWarnings("unused")
@ReactModule(name = ExposureKeyModule.MODULE_NAME)
public class ExposureKeyModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "ExposureKeyModule";
  private static final BaseEncoding BASE64 = BaseEncoding.base64();

  public ExposureKeyModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public @Nonnull
  String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void fetchExposureKeys(final Promise promise) {
    ListenableFuture<List<TemporaryExposureKey>> future =
        ExposureNotificationClientWrapper.get(getReactApplicationContext())
            .requestPermissionToGetExposureKeys(getReactApplicationContext());

    FutureCallback<List<TemporaryExposureKey>> callback = new FutureCallback<List<TemporaryExposureKey>>() {
      @Override
      public void onSuccess(List<TemporaryExposureKey> result) {
        final List<RNExposureKey> exposureKeys = new ArrayList<>();

        List<DiagnosisKey> diagnosisKeys = toDiagnosisKeysWithTransmissionRisk(result);
        for (DiagnosisKey k : diagnosisKeys) {
          final String key = BASE64.encode(k.getKeyBytes());

          exposureKeys.add(new RNExposureKey(
              key,
              k.getRollingPeriod(),
              k.getIntervalNumber(),
              k.getTransmissionRisk()
          ));
        }

        promise.resolve(Util.convertListToWritableArray(exposureKeys));
      }

      @Override
      public void onFailure(@NotNull Throwable exception) {
        promise.reject(exception);
      }
    };
    Futures.addCallback(future, callback, AppExecutors.getLightweightExecutor());
  }

  /**
   * Transforms from EN API's TEK object to our network package's expression of it, applying a
   * default transmission risk. This default TR is temporary, while we determine that part of the EN
   * API's contract.
   */
  private List<DiagnosisKey> toDiagnosisKeysWithTransmissionRisk(
      List<TemporaryExposureKey> recentKeys) {
    ImmutableList.Builder<DiagnosisKey> builder = new ImmutableList.Builder<>();
    for (TemporaryExposureKey k : recentKeys) {
      builder.add(
          DiagnosisKey.newBuilder()
              .setKeyBytes(k.getKeyData())
              .setIntervalNumber(k.getRollingStartIntervalNumber())
              .setRollingPeriod(k.getRollingPeriod())
              // Accepting the default transmission risk for now, which the DiagnosisKey.Builder
              // comes with pre-set.
              .build());
    }
    return builder.build();
  }

  @ReactMethod
  public void storeRevisionToken(String revisionToken, final Promise promise) {
    RealmSecureStorageBte.INSTANCE.upsertRevisionToken(revisionToken);
    promise.resolve(null);
  }

  @ReactMethod
  public void getRevisionToken(final Promise promise) {
    promise.resolve(RealmSecureStorageBte.INSTANCE.getRevisionToken());
  }
}
