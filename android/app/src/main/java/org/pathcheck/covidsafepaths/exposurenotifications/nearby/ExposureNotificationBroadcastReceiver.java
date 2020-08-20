package org.pathcheck.covidsafepaths.exposurenotifications.nearby;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;

/**
 * Receiver registered for notifications of a potential exposure.
 * This receiver is called by the API after we pass them the keys: client.provideDiagnosisKeys()
 * Documentation: https://developers.google.com/android/exposure-notifications/exposure-notifications-api#broadcast-receivers
 */
public class ExposureNotificationBroadcastReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
    String action = intent.getAction();
    if (ExposureNotificationClient.ACTION_EXPOSURE_STATE_UPDATED.equals(action)
        || ExposureNotificationClient.ACTION_EXPOSURE_NOT_FOUND.equals(action)) {
      StateUpdatedWorker.runOnce(context);
    }
  }
}