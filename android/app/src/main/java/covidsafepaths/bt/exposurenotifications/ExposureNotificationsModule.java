package covidsafepaths.bt.exposurenotifications;

import android.app.Activity;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.checkerframework.checker.nullness.compatqual.NullableDecl;

import javax.annotation.Nonnull;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.nearby.ExposureConfigurations;
import covidsafepaths.bt.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import covidsafepaths.bt.exposurenotifications.notify.ShareDiagnosisManager;
import covidsafepaths.bt.exposurenotifications.utils.CallbackMessages;
import covidsafepaths.bt.exposurenotifications.utils.Util;

import static covidsafepaths.bt.exposurenotifications.ExposureNotificationsModule.MODULE_NAME;

@ReactModule(name = MODULE_NAME)
public class ExposureNotificationsModule extends ReactContextBaseJavaModule {
    public static final String MODULE_NAME = "ENPermissionsModule";
    public static final String TAG = "ENModule";

    private final ExposureNotificationClient exposureNotificationClient;
    private final ShareDiagnosisManager shareDiagnosisManager;
    private final ExposureConfigurations config;

    public ExposureNotificationsModule(ReactApplicationContext context) {
        super(context);
        exposureNotificationClient = Nearby.getExposureNotificationClient(context);
        shareDiagnosisManager = new ShareDiagnosisManager(context);
        // TODO keep or discard config wrapper class? where will attenuation thresholds be set?
        config = new ExposureConfigurations(context);
    }

    @Override
    public @Nonnull
    String getName() {
        return MODULE_NAME;
    }

    /**
     * // TODO confirm behavior across platforms
     * Method with the same name as iOS, just calls client "start" method which enables EN
     */
    @ReactMethod
    public void requestExposureNotificationAuthorization(final Callback callback) {
        ReactContext reactContext = getReactApplicationContext();
        ExposureNotificationClientWrapper exposureNotificationClient = ExposureNotificationClientWrapper.get(reactContext);
        exposureNotificationClient.start(reactContext)
                .addOnSuccessListener(unused -> {
                    callback.invoke(CallbackMessages.GENERIC_SUCCESS);
                })
                .addOnFailureListener(exception -> {
                    if (!(exception instanceof ApiException)) {
                        callback.invoke(CallbackMessages.ERROR_UNKNOWN);
                        return;
                    }
                    ApiException apiException = (ApiException) exception;
                    if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                        callback.invoke(CallbackMessages.GENERIC_SUCCESS);
                        Activity activity = getCurrentActivity();
                        if (activity != null) {
                            exposureNotificationClient.showPermissionDialog(activity, apiException);
                        }
                    } else {
                        callback.invoke(apiException.getStatus().toString());
                    }
                })
                .addOnCanceledListener(() -> {
                    callback.invoke(CallbackMessages.CANCELLED);
                });
    }

    @ReactMethod
    public void getCurrentENPermissionsStatus(final Callback callback) {
        ExposureNotificationClientWrapper.get(getReactApplicationContext())
                .isEnabled().addOnSuccessListener(
                enabled -> {
                    callback.invoke(Util.getEnStatusWritableArray(enabled));
                })
                .addOnFailureListener(
                        exception -> {
                            if (!(exception instanceof ApiException)) {
                                callback.invoke(CallbackMessages.ERROR_UNKNOWN);
                            } else {
                                ApiException apiException = (ApiException) exception;
                                callback.invoke(apiException.getStatus().toString());
                            }
                        });
    }

    /**
     * Calls start on the Exposure Notifications API.
     */
    @ReactMethod
    public void startExposureNotifications(final Promise promise) {
        // Start EN
        exposureNotificationClient
                .start()
                .addOnSuccessListener((Void aVoid) -> {
                    promise.resolve(aVoid);
                    scheduleDailyProvideDiagnosisKeys();
                })
                .addOnFailureListener(
                        // Assumes exception handling at RN layer
                        exception -> {
                            Log.e(TAG, "Failed to start EN", exception);
                            promise.reject(exception);
                        })
                .addOnCanceledListener(() -> promise.reject("CANCEL", "Operation cancelled"));


    }

    /**
     * Schedule daily provision of keys from server to GAEN
     */
    private void scheduleDailyProvideDiagnosisKeys() {
        ProvideDiagnosisKeysWorker.schedule(getReactApplicationContext());
    }

    /**
     * Calls stop on the Exposure Notifications API.
     */
    @ReactMethod
    public void stopExposureNotifications(final Promise promise) {
        exposureNotificationClient
                .stop()
                .addOnSuccessListener((Void aVoid) -> {
                    promise.resolve(aVoid);
                    cancelDailyProvideDiagnosisKeys();
                })
                .addOnFailureListener(
                        exception -> Log.w(TAG, "Failed to stop EN", exception))
                .addOnCanceledListener(() -> promise.reject("CANCEL", "Operation cancelled"));
    }

    /**
     * Cancel daily provision of keys from server to GAEN
     */
    private void cancelDailyProvideDiagnosisKeys() {
        ProvideDiagnosisKeysWorker.cancel(getReactApplicationContext());
    }

    /**
     * Refresh isEnabled state from Exposure Notification API.
     */
    @ReactMethod
    public void getExposureNotificationStatus(final Promise promise) {
        exposureNotificationClient
                .isEnabled()
                .addOnSuccessListener(promise::resolve);
    }

    /**
     * Once user consents, upload diagnosis keys to app server.
     * // TODO if there is a flow to save a new diagnosis before the user consents to share,
     * // use "updateDiagnosisShared" on success
     */
    @ReactMethod
    public void sharePositiveDiagnosis(final Promise promise) {
        ListenableFuture<Boolean> shareDiagnosisFuture = shareDiagnosisManager.share();
        FutureCallback<Boolean> shareDiagnosisCallback = new FutureCallback<Boolean>() {
            @Override
            public void onSuccess(@NullableDecl Boolean result) {
                shareDiagnosisManager.saveNewDiagnosis(true);
                promise.resolve(result);
            }

            @Override
            public void onFailure(Throwable t) {
                shareDiagnosisManager.saveNewDiagnosis(false);
                promise.reject(t);
            }
        };
        Futures.addCallback(shareDiagnosisFuture, shareDiagnosisCallback, AppExecutors.getLightweightExecutor());
    }
}
