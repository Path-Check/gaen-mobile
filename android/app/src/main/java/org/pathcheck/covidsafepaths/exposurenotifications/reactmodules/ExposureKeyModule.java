package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
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
import org.pathcheck.covidsafepaths.helpers.DiagnosisKeyEncoding;

@SuppressWarnings("unused")
@ReactModule(name = ExposureKeyModule.MODULE_NAME)
public class ExposureKeyModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "ExposureKeyModule";

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
        List<RNExposureKey> exposureKeys =
            DiagnosisKeyEncoding.INSTANCE.encodeDiagnosisKeys(result, false);
        promise.resolve(Util.convertListToWritableArray(exposureKeys));
      }

      @Override
      public void onFailure(@NotNull Throwable exception) {
        promise.reject(exception);
      }
    };
    Futures.addCallback(future, callback, AppExecutors.getLightweightExecutor());
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
