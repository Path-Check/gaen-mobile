package org.pathcheck.covidsafepaths.exposurenotifications.common;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationCompat.Builder;
import androidx.core.app.NotificationManagerCompat;
import androidx.work.ForegroundInfo;
import java.util.Objects;
import org.pathcheck.covidsafepaths.MainActivity;
import org.pathcheck.covidsafepaths.R;

/**
 * Helper class for managing notifications in the app.
 */
public final class NotificationHelper {

  private static final String EXPOSURE_NOTIFICATION_CHANNEL_ID = "EXPOSURE_NOTIFICATION_CHANNEL_ID";
  private static final String BACKGROUND_WORKER_NOTIFICATION_CHANNEL_ID = "EXPOSURE_CHECK_NOTIFICATION_CHANNEL_ID";

  private static final Integer EXPOSURE_NOTIFICATION_ID = 0;
  private static final Integer BACKGROUND_WORKER_NOTIFICATION_ID = 1;

  /**
   * Shows a notification, notifying of a possible exposure.
   */
  public static void showPossibleExposureNotification(Context context) {
    createNotificationChannel(context);
    Intent intent = new Intent(context, MainActivity.class);
    intent.setAction(Intent.ACTION_DEFAULT);
    intent.setData(Uri.parse("pathcheck://exposureHistory")); // Redirect to exposure history
    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
    NotificationCompat.Builder builder =
        new Builder(context, EXPOSURE_NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(context.getResources().getColor(R.color.colorPrimary, context.getTheme()))
            .setContentTitle(context.getString(R.string.exposure_notification_title))
            .setContentText(context.getString(R.string.exposure_notification_message))
            .setStyle(new NotificationCompat.BigTextStyle()
                .bigText(context.getString(R.string.exposure_notification_message)))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setContentIntent(pendingIntent)
            .setOnlyAlertOnce(true)
            .setAutoCancel(true)
            // Do not reveal this notification on a secure lockscreen.
            .setVisibility(NotificationCompat.VISIBILITY_SECRET);
    NotificationManagerCompat notificationManager = NotificationManagerCompat
        .from(context);
    notificationManager.notify(EXPOSURE_NOTIFICATION_ID, builder.build());
  }

  /**
   * Create notification that will be shown while we are checking exposures.
   */
  public static ForegroundInfo createWorkerNotification(Context context) {
    createBackgroundWorkerNotificationChannel(context);
    NotificationCompat.Builder builder =
        new Builder(context, BACKGROUND_WORKER_NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(context.getResources().getColor(R.color.colorPrimary, context.getTheme()))
            .setContentTitle(context.getString(R.string.background_worker_notification_title))
            .setOngoing(true);
    return new ForegroundInfo(BACKGROUND_WORKER_NOTIFICATION_ID, builder.build());
  }

  /**
   * Creates the notification channel for O and above.
   */
  private static void createNotificationChannel(Context context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel =
          new NotificationChannel(EXPOSURE_NOTIFICATION_CHANNEL_ID,
              context.getString(R.string.exposure_notification_channel_name),
              NotificationManager.IMPORTANCE_HIGH);
      channel.setDescription(context.getString(R.string.exposure_notification_channel_description));
      NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
      Objects.requireNonNull(notificationManager).createNotificationChannel(channel);
    }
  }

  /**
   * Creates the notification channel to show notifications when the device is checking exposures in background.
   */
  private static void createBackgroundWorkerNotificationChannel(Context context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel =
          new NotificationChannel(BACKGROUND_WORKER_NOTIFICATION_CHANNEL_ID,
              context.getString(R.string.background_worker_channel_name),
              NotificationManager.IMPORTANCE_HIGH);
      channel.setDescription(context.getString(R.string.background_worker_channel_description));
      NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
      Objects.requireNonNull(notificationManager).createNotificationChannel(channel);
    }
  }

  private NotificationHelper() {
  }
}