package covidsafepaths.bt.exposurenotifications.nearby;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;

/**
 * Receiver registered for notifications of a potential exposure.
 */
public class ExposureNotificationBroadcastReceiver extends BroadcastReceiver {

//    private static final String TAG = "ENBroadcastReceiver";
//    private static final String EXPOSURE_ALERT_EVENT = "ExposureAlertEvent";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();

//        ReactContext reactContext = ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();

        if (ExposureNotificationClient.ACTION_EXPOSURE_STATE_UPDATED.equals(action)) {
            WorkManager workManager = WorkManager.getInstance(context);
            OneTimeWorkRequest workRequest = new OneTimeWorkRequest.Builder(StateUpdatedWorker.class)
                    .build();
            workManager.enqueue(workRequest);
            // Retrieve the boolean that represents whether there was an exposure or not.
//            ListenableFuture<WorkInfo> workInfo = workManager.getWorkInfoById(workRequest.getId());
//            workInfo.addListener(() -> {
//                try {
//                    boolean isExposed = workInfo.get().getOutputData().getBoolean(IS_EXPOSED_KEY, false);
//                    if (isExposed) {
//                        alertExposed((ReactContext) context);
//                    }
//                } catch (Exception e) {
//                    Log.e(TAG, "Error getting workInfo from StateUpdatedWorker", e);
//                }
//            }, AppExecutors.getLightweightExecutor());
        }
    }

//    // TODO what should this be called and what data should it contain?
//    private void alertExposed(ReactContext context) {
//        context
//                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                .emit(EXPOSURE_ALERT_EVENT, null);
//    }
}