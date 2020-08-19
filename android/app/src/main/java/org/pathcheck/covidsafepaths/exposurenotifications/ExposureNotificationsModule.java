package org.pathcheck.covidsafepaths.exposurenotifications;

import android.util.Log;

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
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.notify.ShareDiagnosisManager;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.RequestCodes;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util;

import javax.annotation.Nonnull;

import static org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationsModule.MODULE_NAME;

@ReactModule(name = MODULE_NAME)
public class ExposureNotificationsModule extends ReactContextBaseJavaModule {
    public static final String MODULE_NAME = "ENPermissionsModule";
    public static final String TAG = "ENModule";

    private final ExposureNotificationClient exposureNotificationClient;
    private final ShareDiagnosisManager shareDiagnosisManager;

    public ExposureNotificationsModule(ReactApplicationContext context) {
        super(context);
        exposureNotificationClient = Nearby.getExposureNotificationClient(context);
        shareDiagnosisManager = new ShareDiagnosisManager(context);
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
    public void requestExposureNotificationAuthorization(final Promise promise) {
        ReactContext reactContext = getReactApplicationContext();
        ExposureNotificationClientWrapper client = ExposureNotificationClientWrapper.get(reactContext);
        client.start(reactContext)
                .addOnSuccessListener(unused -> promise.resolve(CallbackMessages.GENERIC_SUCCESS))
                .addOnFailureListener(exception -> {
                    if (!(exception instanceof ApiException)) {
                        promise.reject(new Exception(CallbackMessages.ERROR_UNKNOWN));
                        return;
                    }
                    ApiException apiException = (ApiException) exception;
                    if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                        // TODO Call resolve after the dialog is closed
                        promise.resolve(CallbackMessages.GENERIC_SUCCESS);
                        client.showPermissionDialog(getReactApplicationContext(), apiException, RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
                    } else {
                        promise.reject(apiException);
                    }
                })
                .addOnCanceledListener(() -> promise.reject(new Exception(CallbackMessages.CANCELLED)));
    }

    @ReactMethod
    public void getCurrentENPermissionsStatus(final Promise promise) {
        ExposureNotificationClientWrapper.get(getReactApplicationContext())
                .isEnabled()
                .addOnSuccessListener(enabled -> promise.resolve(Util.getEnStatusWritableArray(enabled)))
                .addOnFailureListener(exception -> {
                    if (!(exception instanceof ApiException)) {
                        promise.reject(new Exception(CallbackMessages.ERROR_UNKNOWN));
                    } else {
                        promise.reject(exception);
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
