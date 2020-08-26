package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import android.app.Activity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import javax.annotation.Nonnull;
import org.pathcheck.covidsafepaths.MainActivity;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;

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
    Activity activity = getCurrentActivity();
    if (activity instanceof MainActivity) {
      ((MainActivity) activity).getExposureKeys(promise);
    }
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
