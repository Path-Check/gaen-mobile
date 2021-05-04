package org.pathcheck.covidsafepaths.exposurenotifications.worker

import android.content.Context
import android.util.Log
import androidx.work.BackoffPolicy
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ListenableWorker
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequest
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.facebook.react.bridge.WritableArray
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.common.util.concurrent.FluentFuture
import com.google.common.util.concurrent.ListenableFuture
import java.util.concurrent.TimeUnit
import org.pathcheck.covidsafepaths.MainApplication
import org.pathcheck.covidsafepaths.bridge.EventSender
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util
import org.pathcheck.covidsafepaths.helpers.DiagnosisKeyEncoding.encodeDiagnosisKeys

class ChaffRequestWorker(
    context: Context,
    workerParams: WorkerParameters
) : ListenableWorker(context, workerParams) {

    companion object {
        private const val REPEAT_INTERVAL = 6L
        private const val TAG = "ChaffRequests"

        @JvmStatic
        fun scheduleWork(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val request = PeriodicWorkRequest.Builder(ChaffRequestWorker::class.java, REPEAT_INTERVAL, TimeUnit.HOURS)
                .setConstraints(constraints)
                .setBackoffCriteria(BackoffPolicy.LINEAR, PeriodicWorkRequest.MIN_BACKOFF_MILLIS, TimeUnit.MILLISECONDS)
                .build()

            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(TAG, ExistingPeriodicWorkPolicy.KEEP, request)
        }
    }

    private val app = context.applicationContext as? MainApplication
    private val reactContext = app?.reactNativeHost?.reactInstanceManager?.currentReactContext

    override fun startWork(): ListenableFuture<Result> {
        val wrapper = ExposureNotificationClientWrapper.get(reactContext)

        return FluentFuture.from(wrapper.requestPermissionToGetExposureKeys(reactContext))
            .transform(this::encodeKeys, AppExecutors.getBackgroundExecutor())
            .transform(
                { encodedKeyArray ->
                    if (encodedKeyArray != null) {
                        EventSender.sendChaffRequest(reactContext, encodedKeyArray)
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

    private fun encodeKeys(exposureKeys: List<TemporaryExposureKey>?): WritableArray? {
        return exposureKeys?.run {
            encodeDiagnosisKeys(exposureKeys, true).run {
                Util.convertListToWritableArray(this)
            }
        }
    }
}