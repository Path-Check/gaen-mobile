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
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.pathcheck.covidsafepaths.MainActivity;

import java.util.List;

import javax.annotation.Nonnull;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.debug.DebugExposureNotificationUtils;
import covidsafepaths.bt.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import covidsafepaths.bt.exposurenotifications.notify.ShareDiagnosisManager;
import covidsafepaths.bt.exposurenotifications.utils.CallbackMessages;

@ReactModule(name = DebugMenuModule.MODULE_NAME)
public class DebugMenuModule extends ReactContextBaseJavaModule {
    static final String MODULE_NAME = "DebugMenuModule";

    private final ShareDiagnosisManager shareDiagnosisManager;

    public DebugMenuModule(ReactApplicationContext context) {
        super(context);
        shareDiagnosisManager = new ShareDiagnosisManager(context);
    }

    @Override
    public @Nonnull
    String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void submitExposureKeys() {
        Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).share();
        }
    }

    /**
     * Debug method to get a fake set of diagnosis keys and post them to the server.
     * Does NOT currently interact with GAEN API
     * Second value is success message, first value is error message
     */
    @ReactMethod
    public void submitExposureKeysDebug() {
        List<TemporaryExposureKey> debugTEKS = DebugExposureNotificationUtils.INSTANCE.getFakeRecentKeys();
        ListenableFuture<Boolean> shareKeysFuture = shareDiagnosisManager.submitKeysToService(debugTEKS);
        FutureCallback<Boolean> shareKeysCallback = new FutureCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                if (result) {
                    String successMessage = "Shared debug keys with server";
                    //callback.invoke(null, successMessage);
                    Log.d(MODULE_NAME, successMessage);
                } else {
                    this.onFailure(new Throwable("Error sharing debug keys with server"));
                }
            }

            @Override
            public void onFailure(Throwable t) {
                //callback.invoke(t.getMessage(), null);
                Log.e(MODULE_NAME, "Error sharing debug keys with server", t);
            }
        };
        Futures.addCallback(shareKeysFuture, shareKeysCallback, AppExecutors.getLightweightExecutor());
    }

    /**
     * For now, tie this to saving a positive diagnosis to the local db for testing
     */
    @ReactMethod
    public void simulatePositiveDiagnosis(Callback callback) {
        // TODO get callback to share with JS layer
        shareDiagnosisManager.saveNewDiagnosis(true);
    }

    @ReactMethod
    public void detectExposuresNow(Callback callback) {
        ExposureNotificationClientWrapper.get(getReactApplicationContext())
                .isEnabled().addOnSuccessListener(
                enabled -> {
                    if (enabled) {
                        ProvideDiagnosisKeysWorker.schedule(getReactApplicationContext());
                        callback.invoke(null, CallbackMessages.DEBUG_DETECT_EXPOSURES_SUCCESS);
                    } else {
                        callback.invoke(CallbackMessages.DEBUG_DETECT_EXPOSURES_ERROR_EN_NOT_ENABLED, null);
                    }
                })
                .addOnFailureListener(
                        exception -> {
                            if (!(exception instanceof ApiException)) {
                                callback.invoke(CallbackMessages.DEBUG_DETECT_EXPOSURES_ERROR_UNKNOWN, null);
                            } else {
                                ApiException apiException = (ApiException) exception;
                                callback.invoke(CallbackMessages.DEBUG_DETECT_EXPOSURES_ERROR + apiException.getStatus().toString(), null);
                            }
                        });
    }

    @ReactMethod
    public void toggleExposureNotifications(Promise promise) {
        ReactContext reactContext = getReactApplicationContext();
        ExposureNotificationClientWrapper exposureNotificationsClient = ExposureNotificationClientWrapper.get(reactContext);
        exposureNotificationsClient.isEnabled()
                .addOnSuccessListener(enabled -> {
                    if (enabled) {
                        exposureNotificationsClient.stop(reactContext)
                                .addOnSuccessListener(promise::resolve)
                                .addOnFailureListener(promise::reject);
                    } else {
                        exposureNotificationsClient.start(reactContext)
                                .addOnSuccessListener(promise::resolve)
                                .addOnFailureListener(promise::reject);
                    }
                })
                .addOnFailureListener(promise::reject);
    }
}
