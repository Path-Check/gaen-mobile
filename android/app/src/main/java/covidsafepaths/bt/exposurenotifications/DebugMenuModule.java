package covidsafepaths.bt.exposurenotifications;

import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;

import org.pathcheck.covidsafepaths.BuildConfig;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nonnull;

import covidsafepaths.bt.exposurenotifications.dto.RNDiagnosisKey;
import covidsafepaths.bt.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import covidsafepaths.bt.exposurenotifications.storage.ExposureNotificationSharedPreferences;
import covidsafepaths.bt.exposurenotifications.storage.RealmSecureStorageBte;
import covidsafepaths.bt.exposurenotifications.utils.CallbackMessages;
import covidsafepaths.bt.exposurenotifications.utils.RequestCodes;
import covidsafepaths.bt.exposurenotifications.utils.Util;

@ReactModule(name = DebugMenuModule.MODULE_NAME)
public class DebugMenuModule extends ReactContextBaseJavaModule {
    static final String MODULE_NAME = "DebugMenuModule";

    private ExposureNotificationSharedPreferences prefs;

    public DebugMenuModule(ReactApplicationContext context) {
        super(context);
        prefs = new ExposureNotificationSharedPreferences(context);
    }

    @Override
    public @Nonnull
    String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void fetchDebugLog(Promise promise) {
        promise.resolve("AppId: " + BuildConfig.ANDROID_APPLICATION_ID +
                "\nVersion: " + BuildConfig.VERSION_NAME +
                "\nVersionName: " + BuildConfig.VERSION_CODE +
                "\nLastProcessedFileName: " + RealmSecureStorageBte.INSTANCE.getLastProcessedKeyZipFileName() +
                "\nLastDetectionProcessDate: " + prefs.getLastDetectionProcessDate());
    }

    @ReactMethod
    public void forceAppCrash(Promise promise) throws Exception {
        throw new Exception("Force crash");
    }

    @ReactMethod
    public void fetchDiagnosisKeys(Promise promise) {
        ExposureNotificationClientWrapper client = ExposureNotificationClientWrapper.get(getReactApplicationContext());
        client.getTemporaryExposureKeyHistory()
                .addOnSuccessListener(keys -> {
                    List<RNDiagnosisKey> diagnosisKeys = new ArrayList<>();
                    for (TemporaryExposureKey key : keys) {
                        RNDiagnosisKey diagnosisKey = new RNDiagnosisKey(
                                key.getRollingStartIntervalNumber()
                        );
                        diagnosisKeys.add(diagnosisKey);
                    }

                    promise.resolve(Util.convertListToWritableArray(diagnosisKeys));
                })
                .addOnFailureListener(exception -> {
                    if (!(exception instanceof ApiException)) {
                        promise.reject(exception);
                        return;
                    }

                    ApiException apiException = (ApiException) exception;
                    if (apiException.getStatusCode() == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                        // TODO Refactor MainActivity/ExposureNotificationClientWrapper to call this method after permission is accepted
                        client.showPermissionDialog(getReactApplicationContext(), apiException, RequestCodes.REQUEST_GET_DIAGNOSIS_KEYS);
                        promise.reject(new Exception("Needs user permission, try again"));
                    } else {
                        promise.reject(exception);
                    }
                });
    }

    @ReactMethod
    public void simulateExposure(Promise promise) {
        promise.reject(new Exception("Not implemented"));
    }

    @ReactMethod
    public void simulateExposureDetectionError(Promise promise) {
        promise.reject(new Exception("Not implemented"));
    }

    @ReactMethod
    public void resetExposures(Promise promise) {
        RealmSecureStorageBte.INSTANCE.resetExposures();
        promise.resolve(null);
    }

    @ReactMethod
    public void detectExposuresNow(Promise promise) {
        ExposureNotificationClientWrapper.get(getReactApplicationContext())
                .isEnabled().addOnSuccessListener(
                enabled -> {
                    if (enabled) {
                        WorkManager workManager = WorkManager.getInstance(getReactApplicationContext());
                        workManager.enqueue(new OneTimeWorkRequest.Builder(ProvideDiagnosisKeysWorker.class).build());
                        promise.resolve(CallbackMessages.DEBUG_DETECT_EXPOSURES_SUCCESS);
                    } else {
                        promise.reject(new Exception(CallbackMessages.DEBUG_DETECT_EXPOSURES_ERROR_EN_NOT_ENABLED));
                    }
                })
                .addOnFailureListener(promise::reject);
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

    @ReactMethod
    public void showLastProcessedFilePath(Promise promise) {
        promise.resolve(RealmSecureStorageBte.INSTANCE.getLastProcessedKeyZipFileName());
    }
}
