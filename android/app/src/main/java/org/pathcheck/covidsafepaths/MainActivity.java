package org.pathcheck.covidsafepaths;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;
import org.pathcheck.covidsafepaths.bridge.EventSender;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.helpers.BluetoothHelper;
import org.pathcheck.covidsafepaths.helpers.LocationHelper;

public class MainActivity extends ReactActivity {

  private BluetoothHelper bluetoothHelper;
  private LocationHelper locationHelper;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(savedInstanceState);

    bluetoothHelper = new BluetoothHelper(new BluetoothHelper.BluetoothCallback() {
      @Override
      public void onBluetoothAvailable() {
        EventSender.INSTANCE.sendBluetoothStatusChangedEvent(getReactContext(), true);
      }

      @Override
      public void onBluetoothUnavailable() {
        EventSender.INSTANCE.sendBluetoothStatusChangedEvent(getReactContext(), false);
      }
    });

    locationHelper = new LocationHelper(new LocationHelper.LocationCallback() {
      @Override
      public void onLocationAvailable() {
        EventSender.INSTANCE.sendLocationStatusChangedEvent(getReactContext(), true);
      }

      @Override
      public void onLocationUnavailable() {
        EventSender.INSTANCE.sendLocationStatusChangedEvent(getReactContext(), false);
      }
    });
  }

  @Override
  protected void onResume() {
    super.onResume();
    checkIfExposureNotificationsEnabled();
    bluetoothHelper.registerBluetoothStatusCallback(this);
    locationHelper.registerLocationStatusCallback(this);
  }

  @Override
  protected void onPause() {
    super.onPause();
    bluetoothHelper.unregisterBluetoothStatusCallback(this);
    locationHelper.unregisterLocationStatusCallback(this);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "COVIDSafePaths";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  /**
   * Must check every time the app resumes to handle the case when a different app on the device
   * requests Exposure Notifications. If that happens, our app loses access to Exposure Notifications.
   * Checking on resume will ensure the user is shown that Exposure Notifications are disabled in
   * this app.
   */
  private void checkIfExposureNotificationsEnabled() {
    ExposureNotificationClientWrapper exposureNotificationClient =
        ExposureNotificationClientWrapper.get(this);
    exposureNotificationClient.isEnabled()
        .addOnSuccessListener(enabled ->
            exposureNotificationClient.onExposureNotificationStateChanged(getReactContext(), enabled)
        );
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    ExposureNotificationClientWrapper.get(this)
        .onPermissionDialogResult(getReactContext(), requestCode, resultCode == RESULT_OK);
  }

  @Nullable
  private ReactContext getReactContext() {
    return getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
  }
}
