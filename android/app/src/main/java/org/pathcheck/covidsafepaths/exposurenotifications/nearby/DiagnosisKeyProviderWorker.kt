package org.pathcheck.covidsafepaths.exposurenotifications.nearby

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.ForegroundInfo
import androidx.work.WorkerParameters
import com.google.common.util.concurrent.FluentFuture
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors
import org.pathcheck.covidsafepaths.exposurenotifications.common.NotificationHelper
import org.pathcheck.covidsafepaths.exposurenotifications.common.TaskToFutureAdapter
import org.pathcheck.covidsafepaths.exposurenotifications.network.DiagnosisKeys
import org.pathcheck.covidsafepaths.exposurenotifications.network.KeyFileBatch
import java.util.concurrent.TimeUnit

class DiagnosisKeyProviderWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    private val diagnosisKeys = DiagnosisKeys(context)
    private val submitter = DiagnosisKeyFileSubmitter(context)

    override suspend fun doWork(): Result {

        return kotlin.runCatching {
            if(isEnabled()) {
                setForegroundAsync(createForegroundInfo())
            }
            diagnosisKeys.downloadBatchFiles().also {
                submitter.submitFiles(it)
            }
        }.getOrDefault(emptyList<KeyFileBatch>()).run {
            if(isEmpty()) {
                Result.failure()
            } else {
                Result.success()
            }
        }
    }

    private fun isEnabled(): Boolean {
        return FluentFuture.from(TaskToFutureAdapter
            .getFutureWithTimeout(
                ExposureNotificationClientWrapper.get(applicationContext).isEnabled,
                ProvideDiagnosisKeysWorker.IS_ENABLED_TIMEOUT.toMillis(),
                TimeUnit.MILLISECONDS,
                AppExecutors.getScheduledExecutor())).get()
    }

    private fun createForegroundInfo(): ForegroundInfo {
        val context = applicationContext
        return NotificationHelper.createWorkerNotification(context)
    }
}