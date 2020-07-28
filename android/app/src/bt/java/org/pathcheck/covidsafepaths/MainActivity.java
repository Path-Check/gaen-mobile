package org.pathcheck.covidsafepaths;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.collect.ImmutableList;
import com.google.common.io.BaseEncoding;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;
import org.json.JSONObject;
import org.threeten.bp.Duration;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import covidsafepaths.bt.exposurenotifications.ExposureKey;
import covidsafepaths.bt.exposurenotifications.ExposureNotificationClientWrapper;
import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.common.TaskToFutureAdapter;
import covidsafepaths.bt.exposurenotifications.network.DiagnosisKey;
import covidsafepaths.bt.exposurenotifications.network.DiagnosisKeys;
import covidsafepaths.bt.exposurenotifications.utils.RequestCodes;
import covidsafepaths.bt.exposurenotifications.utils.Util;

public class MainActivity extends ReactActivity {

  private static final Duration GET_TEKS_TIMEOUT = Duration.ofSeconds(10);
  private static final BaseEncoding BASE64 = BaseEncoding.base64();
  private static final int DEFAULT_PERIOD = DiagnosisKey.DEFAULT_PERIOD;
  private static final int DEFAULT_TRANSMISSION_RISK = 1;
  private Promise getExposureKeysPromise;

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
    ExposureNotificationClientWrapper exposureNotificationClient = ExposureNotificationClientWrapper.get(this);
    exposureNotificationClient.isEnabled()
            .addOnSuccessListener(enabled -> {
              exposureNotificationClient.onExposureNotificationStateChanged(getReactContext(), enabled);
            });
  }

  public void showPermissionUploadKeys(ApiException apiException) {
    try {
      apiException
              .getStatus()
              .startResolutionForResult(
                      this, RequestCodes.REQUEST_CODE_UPLOAD_KEYS);
    }catch (IntentSender.SendIntentException e) {

    }
  }

  public void showPermissionShareKeys(ApiException apiException) {
    try {
      apiException
              .getStatus()
              .startResolutionForResult(
                      this, RequestCodes.REQUEST_CODE_GET_TEMP_EXPOSURE_KEY_HISTORY);
    }catch (IntentSender.SendIntentException e) {

    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    onResolutionComplete(requestCode, resultCode);
  }

  /**
   * Called when opt-in resolution is completed by user.
   *
   * <p>Modeled after {@code Activity#onActivityResult} as that's how the API sends callback to
   * apps.
   */
  public void onResolutionComplete(int requestCode, int resultCode) {
    if (requestCode == RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION) {
      ReactContext context = getReactContext();
      ExposureNotificationClientWrapper exposureNotificationClient = ExposureNotificationClientWrapper.get(context);
      if(resultCode == Activity.RESULT_OK) {
        exposureNotificationClient.start(context);
      } else {
        exposureNotificationClient.onExposureNotificationStateChanged(context, false);
      }
    } else if(requestCode == RequestCodes.REQUEST_CODE_GET_TEMP_EXPOSURE_KEY_HISTORY){
      if (resultCode == RESULT_OK) {
        getExposureKeys(getExposureKeysPromise);
      } else {
        // Don't share.
      }
    } else if(requestCode == RequestCodes.REQUEST_CODE_UPLOAD_KEYS){
      if (resultCode == RESULT_OK) {
        share();
      } else {
        // Don't share.
      }
    }
  }

  public void getExposureKeys(final Promise promise) {
    getExposureKeysPromise = promise;
    FluentFuture<ImmutableList<DiagnosisKey>> getKeys =
            FluentFuture.from(getRecentKeys())
                    .transform(
                            this::toDiagnosisKeysWithTransmissionRisk, AppExecutors.getLightweightExecutor());

    Futures.addCallback(
            getKeys,
            new FutureCallback<ImmutableList<DiagnosisKey>>() {
              @Override
              public void onSuccess(ImmutableList<DiagnosisKey> shared) {
                final List<ExposureKey> exposureKeys = new ArrayList<>();

                for (DiagnosisKey k : shared) {

                  final String key = BASE64.encode(k.getKeyBytes());
                  final int rollingPeriod = DEFAULT_PERIOD;
                  final int rollingStartNumber = k.getIntervalNumber();
                  final int transmissionRisk = DEFAULT_TRANSMISSION_RISK;

                  exposureKeys.add(new ExposureKey(key,
                                 rollingPeriod,
                                  rollingStartNumber,
                                  transmissionRisk));
                }

                getExposureKeysPromise.resolve(Util.getKeysAsWritableArray(exposureKeys));
              }

              @Override
              public void onFailure(Throwable exception) {
                if (!(exception instanceof ApiException)) {

                  return;
                }
                ApiException apiException = (ApiException) exception;
                if (apiException.getStatusCode()
                        == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                  showPermissionShareKeys(apiException);
                } else {

                }
              }
            },
            AppExecutors.getLightweightExecutor());

  }

  public void share() {
    FluentFuture<Boolean> getKeysAndSubmitToService =
            FluentFuture.from(getRecentKeys())
                    .transform(
                            this::toDiagnosisKeysWithTransmissionRisk, AppExecutors.getLightweightExecutor())
                    .transformAsync(this::submitKeysToService, AppExecutors.getBackgroundExecutor());

    Futures.addCallback(
            getKeysAndSubmitToService,
            new FutureCallback<Boolean>() {
              @Override
              public void onSuccess(Boolean shared) {


              }

              @Override
              public void onFailure(Throwable exception) {
                if (!(exception instanceof ApiException)) {

                  return;
                }
                ApiException apiException = (ApiException) exception;
                if (apiException.getStatusCode()
                        == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                  showPermissionUploadKeys(apiException);
                } else {

                }
              }
            },
            AppExecutors.getLightweightExecutor());
  }

  /** Gets recent (initially 14 days) Temporary Exposure Keys from Google Play Services. */
  private ListenableFuture<List<TemporaryExposureKey>> getRecentKeys() {
    return TaskToFutureAdapter.getFutureWithTimeout(
            ExposureNotificationClientWrapper.get(this).getTemporaryExposureKeyHistory(),
            GET_TEKS_TIMEOUT.toMillis(),
            TimeUnit.MILLISECONDS,
            AppExecutors.getScheduledExecutor());
  }

  /**
   * Submits the given Temporary Exposure Keys to the key sharing service, designating them as
   * Diagnosis Keys.
   *
   * @return a {@link ListenableFuture} of type {@link Boolean} of successfully submitted state
   */
  private ListenableFuture<Boolean> submitKeysToService(ImmutableList<DiagnosisKey> diagnosisKeys) {
    return FluentFuture.from(new DiagnosisKeys(this).upload(diagnosisKeys))
            .transform(
                    v -> {
                      // Successfully submitted
                      return true;
                    },
                    AppExecutors.getLightweightExecutor())
            .catching(
                    ApiException.class,
                    (e) -> {
                      // Not successfully submitted,
                      return false;
                    },
                    AppExecutors.getLightweightExecutor());
  }

  /**
   * Transforms from EN API's TEK object to our network package's expression of it, applying a
   * default transmission risk. This default TR is temporary, while we determine that part of the EN
   * API's contract.
   */
  private ImmutableList<DiagnosisKey> toDiagnosisKeysWithTransmissionRisk(
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

  @Nullable
  private ReactContext getReactContext() {
    return getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
  }
}
