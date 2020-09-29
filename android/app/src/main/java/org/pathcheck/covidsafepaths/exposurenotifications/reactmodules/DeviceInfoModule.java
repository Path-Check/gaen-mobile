package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.location.LocationManager;
import androidx.annotation.NonNull;
import androidx.core.location.LocationManagerCompat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import javax.annotation.Nonnull;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.helpers.BluetoothHelper;

@SuppressWarnings("unused")
@ReactModule(name = DeviceInfoModule.MODULE_NAME)
public class DeviceInfoModule extends ReactContextBaseJavaModule {
  public static final String MODULE_NAME = "DeviceInfoModule";
  private static final String TAG = "DeviceInfoModule";

  public DeviceInfoModule(@NonNull ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public @Nonnull
  String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void getApplicationName(final Promise promise) {
    String appName = getReactApplicationContext()
        .getApplicationInfo()
        .loadLabel(getReactApplicationContext().getPackageManager()).toString();
    promise.resolve(appName);
  }

  @ReactMethod
  public void getBuildNumber(final Promise promise) {
    try {
      promise.resolve(Integer.toString(getPackageInfo().versionCode));
    } catch (Exception e) {
      promise.resolve("unknown");
    }
  }

  @ReactMethod
  public void getVersion(final Promise promise) {
    try {
      promise.resolve(getPackageInfo().versionName);
    } catch (Exception e) {
      promise.resolve("unknown");
    }
  }

  private PackageInfo getPackageInfo() throws Exception {
    return getReactApplicationContext()
        .getPackageManager()
        .getPackageInfo(getReactApplicationContext().getPackageName(), 0);
  }

  @ReactMethod
  public void isBluetoothEnabled(final Promise promise) {
    promise.resolve(BluetoothHelper.Companion.isBluetoothEnabled());
  }

  @ReactMethod
  public void isLocationEnabled(final Promise promise) {
    final LocationManager manager =
        (LocationManager) getReactApplicationContext().getSystemService(Context.LOCATION_SERVICE);
    if (manager != null) {
      promise.resolve(LocationManagerCompat.isLocationEnabled(manager));
    } else {
      promise.reject(new Exception("Location manager not found"));
    }
  }

  @ReactMethod
  public void deviceSupportsLocationlessScanning(final Promise promise) {
    ExposureNotificationClientWrapper client =
        ExposureNotificationClientWrapper.get(getReactApplicationContext());
    promise.resolve(client.deviceSupportsLocationlessScanning());
  }
}
