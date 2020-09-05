package org.pathcheck.covidsafepaths.exposurenotifications.nearby;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;

/**
 * Receiver registered for notifications of a potential exposure.
 * This receiver is called by the API after we pass them the keys via
 * {@link ExposureNotificationClientWrapper#provideDiagnosisKeys}
 *
 * @see <a href="Documentation">https://developers.google.com/android/exposure-notifications/exposure-notifications-api#broadcast-receivers</a>
 */
public class ExposureNotificationBroadcastReceiver extends BroadcastReceiver {
  private static final String TAG = "ENBroadcastReceiver";

  @Override
  public void onReceive(Context context, Intent intent) {
    String action = intent.getAction();
    Log.d(TAG, "Broadcast receiver invoked with action: " + action);
    if (ExposureNotificationClient.ACTION_EXPOSURE_STATE_UPDATED.equals(action)
        || ExposureNotificationClient.ACTION_EXPOSURE_NOT_FOUND.equals(action)) {
      StateUpdatedWorker.runOnce(context);
    }
  }
}