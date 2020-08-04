package covidsafepaths.bt.exposurenotifications;

import android.app.Activity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;

import org.pathcheck.covidsafepaths.MainActivity;

import javax.annotation.Nonnull;
import static covidsafepaths.bt.exposurenotifications.ExposureNotificationsModule.MODULE_NAME;

@ReactModule(name = MODULE_NAME)
public class ExposureKeyModule  extends ReactContextBaseJavaModule {
    public static final String MODULE_NAME = "ExposureKeyModule";
    private final ExposureNotificationClient exposureNotificationClient;
    public static String certificate;
    public static String hmacKey;

    public ExposureKeyModule(ReactApplicationContext context) {
        super(context);
        exposureNotificationClient = Nearby.getExposureNotificationClient(context);
    }

    @Override
    public @Nonnull
    String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void postDiagnosisKeys(String certificate, String hmacKey, Promise promise) {
        this.certificate = certificate;
        this.hmacKey = hmacKey;

        Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).share(promise);
        }
    }

    @ReactMethod
    public void fetchExposureKeys(final Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).getExposureKeys(promise);
        }
    }
}
