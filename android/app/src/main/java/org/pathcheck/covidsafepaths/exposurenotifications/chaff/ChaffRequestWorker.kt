package org.pathcheck.covidsafepaths.exposurenotifications.chaff

import android.content.Context
import android.util.Log
import androidx.work.*
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.common.util.concurrent.FluentFuture
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import org.pathcheck.covidsafepaths.MainApplication
import org.pathcheck.covidsafepaths.bridge.EventSender
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureKey
import org.pathcheck.covidsafepaths.helpers.DiagnosisKeyEncoding
import java.util.concurrent.TimeUnit

class ChaffRequestWorker(
    application: Context,
    workerParams: WorkerParameters
) : ListenableWorker(application, workerParams) {

    companion object {
        private const val TAG = "ChaffRequests"

        @JvmStatic
        fun scheduleWork(context: Context) {
            val chaffManager = ChaffManager.getInstance(context)

            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val request = PeriodicWorkRequest.Builder(
                    ChaffRequestWorker::class.java,
                    chaffManager.getRepeatWorkerIntervalInMinutes(),
                    TimeUnit.MINUTES)
                .setConstraints(constraints)
                .setBackoffCriteria(BackoffPolicy.LINEAR, PeriodicWorkRequest.MIN_BACKOFF_MILLIS, TimeUnit.MILLISECONDS)
                .build()

            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(TAG, ExistingPeriodicWorkPolicy.REPLACE, request)
        }
    }

    private val app = application as? MainApplication
    private val reactContext = app?.reactNativeHost?.reactInstanceManager?.currentReactContext
    private val chaffManager = ChaffManager.getInstance(application)

    override fun startWork(): ListenableFuture<Result> {
        val wrapper = ExposureNotificationClientWrapper.get(app)

        if (!chaffManager.shouldFire()) {
            return Futures.immediateFuture(Result.success())
        }

        return FluentFuture.from(wrapper.requestPermissionToGetExposureKeys(reactContext))
            .transform(
                { exposureKeys ->
                    if (exposureKeys != null) {
                        chaffManager.save(encodeKeys(exposureKeys))
                        EventSender.sendChaffRequest(reactContext)
                        Result.success()
                    } else {
                        Result.failure()
                    }
                },
                AppExecutors.getBackgroundExecutor()
            )
            .catching(
                Exception::class.java,
                { exception ->
                    Log.e(
                        "ChaffRequestWorker",
                        "Failure to update app state (tokens, etc) from exposure summary.", exception
                    )
                    Result.failure()
                },
                AppExecutors.getLightweightExecutor()
            )
    }

    private fun encodeKeys(exposureKeys: List<TemporaryExposureKey>?): List<RNExposureKey>? {
        return exposureKeys?.run {
            DiagnosisKeyEncoding.encodeDiagnosisKeys(exposureKeys, true)
        }
    }
}