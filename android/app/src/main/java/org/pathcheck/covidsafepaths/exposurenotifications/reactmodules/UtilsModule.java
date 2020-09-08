package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import android.content.Intent;
import android.provider.Settings;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import javax.annotation.Nonnull;

@SuppressWarnings("unused")
@ReactModule(name = UtilsModule.MODULE_NAME)
public class UtilsModule extends ReactContextBaseJavaModule {
  static final String MODULE_NAME = "UtilsModule";
  private static final String TAG = "UtilsModule";

  public UtilsModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public @Nonnull
  String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void openAppSettings() {
    // Navigate the user to the os settings as navigation to
    // bluetooth/location settings directly is not reliable for all devices
    Intent intent = new Intent(Settings.ACTION_SETTINGS);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    if (intent.resolveActivity(getReactApplicationContext().getPackageManager()) != null) {
      getReactApplicationContext().startActivity(intent);
    } else {
      // catch generic exception on settings navigation
      // most likely due to device / rom specific intent issue
      Log.e(TAG, "Cannot open settings screen");
    }
  }
}
