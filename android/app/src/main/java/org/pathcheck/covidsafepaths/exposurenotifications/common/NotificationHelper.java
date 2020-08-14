package org.pathcheck.covidsafepaths.exposurenotifications.common;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationCompat.Builder;
import androidx.core.app.NotificationManagerCompat;

import org.pathcheck.covidsafepaths.MainActivity;
import org.pathcheck.covidsafepaths.R;

import java.util.Objects;

import static org.pathcheck.covidsafepaths.MainActivity.ACTION_LAUNCH_FROM_EXPOSURE_NOTIFICATION;

/**
 * Helper class for managing notifications in the app.
 */
public final class NotificationHelper {

    private static final String EXPOSURE_NOTIFICATION_CHANNEL_ID = "EXPOSURE_NOTIFICATION_CHANNEL_ID";

    /**
     * Shows a notification, notifying of a possible exposure.
     */
    public static void showPossibleExposureNotification(Context context) {
        createNotificationChannel(context);
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(ACTION_LAUNCH_FROM_EXPOSURE_NOTIFICATION);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
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
        notificationManager.notify(0, builder.build());
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

    private NotificationHelper() {}
}