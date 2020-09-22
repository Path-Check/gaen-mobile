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
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onResume() {
    super.onResume();
    checkIfExposureNotificationsEnabled();
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
