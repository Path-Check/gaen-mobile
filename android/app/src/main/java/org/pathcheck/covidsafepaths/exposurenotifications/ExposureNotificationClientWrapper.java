package org.pathcheck.covidsafepaths.exposurenotifications;

import android.app.Activity;
import android.content.Context;
import android.content.IntentSender;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.android.gms.nearby.exposurenotification.ExposureSummary;
import com.google.android.gms.nearby.exposurenotification.ExposureWindow;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.android.gms.tasks.Task;

import java.io.File;
import java.util.List;

import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ExposureConfigurations;
import org.pathcheck.covidsafepaths.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.RequestCodes;
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util;

import static org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages.EN_STATUS_EVENT;

/**
 * Wrapper around {@link com.google.android.gms.nearby.Nearby} APIs.
 */
public class ExposureNotificationClientWrapper {

    private static ExposureNotificationClientWrapper INSTANCE;

    private final ExposureNotificationClient exposureNotificationClient;
    private final ExposureConfigurations config;

    public static ExposureNotificationClientWrapper get(Context context) {
        if (INSTANCE == null) {
            INSTANCE = new ExposureNotificationClientWrapper(context);
        }
        return INSTANCE;
    }

    ExposureNotificationClientWrapper(Context context) {
        exposureNotificationClient = Nearby.getExposureNotificationClient(context);
        config = new ExposureConfigurations(context);
    }

    public Task<Void> start(ReactContext context) {
        return exposureNotificationClient.start()
                .addOnSuccessListener(unused -> {
                    onExposureNotificationStateChanged(context, true);
                })
                .addOnFailureListener(exception -> {
                    onExposureNotificationStateChanged(context, false);
                    if (!(exception instanceof ApiException)) {
                        return;
                    }

                    ApiException apiException = (ApiException) exception;
                    if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                        showPermissionDialog(context, apiException, RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
                    }
                })
                .addOnCanceledListener(() -> {
                    onExposureNotificationStateChanged(context, false);
                });
    }

    public void showPermissionDialog(ReactContext reactContext, ApiException apiException, int requestCode) {
        try {
            Activity activity = reactContext.getCurrentActivity();
            if (activity != null) {
                apiException
                        .getStatus()
                        .startResolutionForResult(activity, requestCode);
            }
        } catch (IntentSender.SendIntentException e) {

        }
    }

    public Task<Void> stop(ReactContext context) {
        return exposureNotificationClient.stop()
                .addOnSuccessListener(unused -> {
                    onExposureNotificationStateChanged(context, false);
                })
                .addOnFailureListener(exception -> {
                    onExposureNotificationStateChanged(context, true);
                })
                .addOnCanceledListener(() -> {
                    onExposureNotificationStateChanged(context, true);
                });
    }

    public Task<Boolean> isEnabled() {
        return exposureNotificationClient.isEnabled();
    }

    public Task<List<TemporaryExposureKey>> getTemporaryExposureKeyHistory() {
        return exposureNotificationClient.getTemporaryExposureKeyHistory();
    }

    /**
     * Provides diagnosis key files with a stable token and {@link ExposureConfiguration} given by
     * {@link ExposureConfigurations}.
     */
    public Task<Void> provideDiagnosisKeys(List<File> files, String token) {
        return exposureNotificationClient.provideDiagnosisKeys(files, config.get(), token);
    }

    /**
     * Gets the {@link ExposureSummary} using the stable token.
     */
    public Task<ExposureSummary> getExposureSummary(String token) {
        return exposureNotificationClient.getExposureSummary(token);
    }

    public Task<List<ExposureWindow>> getExposureWindows() {
        return exposureNotificationClient.getExposureWindows(ExposureNotificationClient.TOKEN_A);
    }

    public void onExposureNotificationStateChanged(@Nullable ReactContext context, boolean enabled) {
        if (enabled) {
            ProvideDiagnosisKeysWorker.schedule(context);
        } else {
            ProvideDiagnosisKeysWorker.cancel(context);
        }

        if (context != null) {
            context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(EN_STATUS_EVENT, Util.getEnStatusWritableArray(enabled));
        }
    }
}
