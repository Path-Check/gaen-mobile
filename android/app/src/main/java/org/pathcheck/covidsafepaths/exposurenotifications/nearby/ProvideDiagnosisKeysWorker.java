/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.pathcheck.covidsafepaths.exposurenotifications.nearby;

import android.content.Context;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.work.BackoffPolicy;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.ListenableWorker;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkRequest;
import androidx.work.WorkerParameters;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import java.util.concurrent.TimeUnit;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.common.TaskToFutureAdapter;
import org.pathcheck.covidsafepaths.exposurenotifications.network.DiagnosisKeys;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences;
import org.threeten.bp.Duration;
import org.threeten.bp.Instant;

/**
 * Performs work to provide diagnosis keys to the exposure notifications API.
 *
 * <p>This Worker will run every 12 hours.
 * It won't do anything if the index files have already been processed.
 */
public class ProvideDiagnosisKeysWorker extends ListenableWorker {

  private static final String TAG = "ProvideDiagnosisKeysWkr";

  private static final Duration IS_ENABLED_TIMEOUT = Duration.ofSeconds(10);
  public static final Duration JOB_INTERVAL = Duration.ofHours(12);
  public static final Duration JOB_FLEX_INTERVAL = Duration.ofHours(3);
  public static final String WORKER_NAME = "ProvideDiagnosisKeysWorker";

  private final DiagnosisKeys diagnosisKeys;
  private final DiagnosisKeyFileSubmitter submitter;

  private final ExposureNotificationSharedPreferences prefs;

  public ProvideDiagnosisKeysWorker(@NonNull Context context,
                                    @NonNull WorkerParameters workerParams) {
    super(context, workerParams);
    diagnosisKeys = new DiagnosisKeys(context);
    submitter = new DiagnosisKeyFileSubmitter(context);
    prefs = new ExposureNotificationSharedPreferences(context);
  }

  @NonNull
  @Override
  public ListenableFuture<Result> startWork() {
    Log.d(TAG, "Starting worker downloading diagnosis key files and submitting "
        + "them to the API for exposure detection, then storing the token used.");
    return FluentFuture.from(TaskToFutureAdapter
        .getFutureWithTimeout(
            ExposureNotificationClientWrapper.get(getApplicationContext()).isEnabled(),
            IS_ENABLED_TIMEOUT.toMillis(),
            TimeUnit.MILLISECONDS,
            AppExecutors.getScheduledExecutor()))
        .transformAsync((isEnabled) -> {
          // Only continue if it is enabled.
          if (isEnabled) {
            // Download diagnosis keys from Safe Paths servers
            return diagnosisKeys.download();
          } else {
            // Stop here because things aren't enabled. Will still return successful though.
            return Futures.immediateFailedFuture(new NotEnabledException());
          }
        }, AppExecutors.getBackgroundExecutor())
        // Submit downloaded files to EN client
        .transformAsync(submitter::submitFiles, AppExecutors.getBackgroundExecutor())
        .transform(done -> {
          // Keep track of the last date when the process did run
          prefs.setLastDetectionProcessDate(Instant.now().toEpochMilli());
          return Result.success();
        }, AppExecutors.getLightweightExecutor())
        .catching(NotEnabledException.class, x -> {
          // Not enabled. Return as success.
          return Result.success();
        }, AppExecutors.getBackgroundExecutor())
        .catching(Exception.class, x -> {
          Log.e(TAG, "Failure to provide diagnosis keys", x);
          return Result.failure();
        }, AppExecutors.getBackgroundExecutor());
    // TODO: consider a retry strategy
  }

  /**
   * Schedules a job that runs once a day to fetch diagnosis keys from a server and to provide them
   * to the exposure notifications API.
   *
   * <p>This job will only be run when idle, not low battery and with network connection.
   */
  public static void schedule(Context context) {
    WorkManager workManager = WorkManager.getInstance(context);
    PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(
        ProvideDiagnosisKeysWorker.class,
        JOB_INTERVAL.toHours(),
        TimeUnit.HOURS,
        JOB_FLEX_INTERVAL.toHours(),
        TimeUnit.HOURS)
        .setConstraints(new Constraints.Builder()
            .setRequiresBatteryNotLow(true)
            //.setRequiresDeviceIdle(true) commented out for testing purposes.
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build())
        .setBackoffCriteria(
            BackoffPolicy.EXPONENTIAL,
            WorkRequest.DEFAULT_BACKOFF_DELAY_MILLIS,
            TimeUnit.MILLISECONDS)
        .build();
    workManager
        .enqueueUniquePeriodicWork(WORKER_NAME, ExistingPeriodicWorkPolicy.KEEP, workRequest);
  }

  /**
   * Cancels enqueued daily work.
   */
  public static void cancel(Context context) {
    WorkManager.getInstance(context).cancelUniqueWork(WORKER_NAME);
  }

  private static class NotEnabledException extends Exception {
  }
}
