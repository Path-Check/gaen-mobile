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
import androidx.work.ListenableWorker;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkerParameters;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.ListenableFuture;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.common.NotificationHelper;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;

/**
 * Performs work for
 * {@value com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient#ACTION_EXPOSURE_STATE_UPDATED}
 * broadcast from exposure notification API.
 */
public class StateUpdatedWorker extends ListenableWorker {
  private static final String TAG = "StateUpdatedWorker";

  private final Context context;

  public StateUpdatedWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
    super(context, workerParams);
    this.context = context;
  }

  @NonNull
  @Override
  public ListenableFuture<Result> startWork() {
    Log.d(TAG, "Starting worker to get exposure windows, "
        + "compare them with the exposures stored in the local database "
        + "and show a notification if there is a new one");
    return FluentFuture.from(ExposureNotificationClientWrapper.get(context).getDailySummaries())
        .transform(RealmSecureStorageBte.INSTANCE::refreshWithDailySummaries, AppExecutors.getBackgroundExecutor())
        .transform((exposuresAdded) -> {
          if (exposuresAdded) {
            Log.d(TAG, "New exposures found, showing a notification");
            NotificationHelper.showPossibleExposureNotification(context);
          } else {
            Log.d(TAG, "No new exposures found");
          }
          return Result.success();
        }, AppExecutors.getLightweightExecutor())
        .catching(
            Exception.class,
            x -> {
              Log.e(TAG, "Failure to update app state (tokens, etc) from exposure summary.", x);
              return Result.failure();
            },
            AppExecutors.getLightweightExecutor()
        );
  }

  static void runOnce(Context context) {
    WorkManager.getInstance(context).enqueue(
        new OneTimeWorkRequest.Builder(StateUpdatedWorker.class).build());
  }
}