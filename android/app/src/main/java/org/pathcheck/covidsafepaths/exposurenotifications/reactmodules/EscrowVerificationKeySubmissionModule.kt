package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.common.util.concurrent.FutureCallback
import com.google.common.util.concurrent.Futures
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.floor
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors
import org.pathcheck.covidsafepaths.exposurenotifications.network.escrowserver.EscrowVerificationClient
import org.pathcheck.covidsafepaths.exposurenotifications.network.escrowserver.ExposureKey
import org.pathcheck.covidsafepaths.exposurenotifications.network.escrowserver.PositiveSubmission
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Result

@ReactModule(name = ExposureKeyModule.MODULE_NAME)
class EscrowVerificationKeySubmissionModule(context: ReactApplicationContext?) : ReactContextBaseJavaModule(context) {
    companion object {
        const val MODULE_NAME = "EscrowVerificationKeySubmissionModule"
    }

    override fun getName(): String {
        return MODULE_NAME
    }

    @ReactMethod
    fun submitPhoneNumber(phoneNumber: String, promise: Promise) {
        val future = ExposureNotificationClientWrapper.get(reactApplicationContext)
            .requestPermissionToGetExposureKeys(reactApplicationContext)

        val callback: FutureCallback<List<TemporaryExposureKey>> = object : FutureCallback<List<TemporaryExposureKey>> {
            override fun onSuccess(keys: List<TemporaryExposureKey>?) {
                GlobalScope.launch(Dispatchers.IO) {
                    keys?.let { exposureKeys ->
                        val result = EscrowVerificationClient.postMetaInfo(
                            reactApplicationContext,
                            exposureKeys,
                            phoneNumber
                        )

                        when (result) {
                            is Result.Success -> promise.resolve(null)
                            is Result.Failure -> promise.reject(result.error.code.toString(), result.error.message)
                        }
                        return@launch
                    }

                    promise.reject(Exception("No exposure keys"))
                }
            }

            override fun onFailure(exception: Throwable) {
                promise.reject(exception)
            }
        }
        Futures.addCallback(future, callback, AppExecutors.getLightweightExecutor())
    }

    @ReactMethod
    fun submitDiagnosisKeys(verificationCode: String, date: Double, promise: Promise) {
        val future = ExposureNotificationClientWrapper.get(reactApplicationContext)
            .requestPermissionToGetExposureKeys(reactApplicationContext)

        val callback: FutureCallback<List<TemporaryExposureKey>> = object : FutureCallback<List<TemporaryExposureKey>> {
            override fun onSuccess(keys: List<TemporaryExposureKey>?) {
                GlobalScope.launch(Dispatchers.IO) {
                    keys?.let { exposureKeys ->
                        val maxTimePeriod = floor((Date().time / (10 * 60 * 1000)).toDouble())
                        val sendingKeys = exposureKeys.mapNotNull { temp ->
                            if (temp.keyData != null &&
                                (temp.rollingPeriod + temp.rollingStartIntervalNumber <= maxTimePeriod)
                            ) ExposureKey(
                                temp.keyData,
                                temp.rollingPeriod,
                                temp.transmissionRiskLevel,
                                temp.rollingStartIntervalNumber
                            ) else null
                        }

                        val testDate = Date(date.toLong())
                        val result = EscrowVerificationClient.postPositiveSubmission(
                            reactApplicationContext,
                            PositiveSubmission(
                                _keys = sendingKeys,
                                _verifyCode = verificationCode,
                                _verifyDate = SimpleDateFormat("MM/dd/yyyy", Locale.US).format(testDate)
                            )
                        )

                        when (result) {
                            is Result.Success -> promise.resolve(null)
                            is Result.Failure -> promise.reject(result.error.code.toString(), result.error.message)
                        }
                        return@launch
                    }

                    promise.reject(Exception("No exposure keys"))
                }
            }

            override fun onFailure(exception: Throwable) {
                promise.reject(exception)
            }
        }
        Futures.addCallback(future, callback, AppExecutors.getLightweightExecutor())
    }
}