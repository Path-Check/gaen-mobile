package org.pathcheck.covidsafepaths.exposurenotifications.nearby

import android.content.Context
import android.net.Uri
import android.util.Log
import androidx.concurrent.futures.CallbackToFutureAdapter
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.google.android.gms.nearby.exposurenotification.DailySummariesConfig
import com.google.android.gms.nearby.exposurenotification.DiagnosisKeysDataMapping
import com.google.android.gms.nearby.exposurenotification.Infectiousness.HIGH
import com.google.android.gms.nearby.exposurenotification.Infectiousness.STANDARD
import com.google.android.gms.nearby.exposurenotification.ReportType.CONFIRMED_CLINICAL_DIAGNOSIS
import com.google.android.gms.nearby.exposurenotification.ReportType.CONFIRMED_TEST
import com.google.android.gms.nearby.exposurenotification.ReportType.RECURSIVE
import com.google.android.gms.nearby.exposurenotification.ReportType.SELF_REPORT
import com.google.common.util.concurrent.ListenableFuture
import org.json.JSONException
import org.json.JSONObject
import org.pathcheck.covidsafepaths.BuildConfig
import org.pathcheck.covidsafepaths.exposurenotifications.network.RequestQueueSingleton
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences

/**
 * A simple class to own setting configuration for this app's use of the EN API, with attenuation
 * settings, etc.
 */
class ExposureConfigurations(context: Context) {
    companion object {
        private const val TAG = "ExposureConfigurations"
        private val configurationUri = Uri.parse(BuildConfig.ANDROID_EN_CONFIG_URL_V1_6)

        private const val DEFAULT_TRIGGER_THRESHOLD_WEIGHTED_DURATION = 15
        private val DEFAULT_ATTENUATION_DURATION_THRESHOLDS = listOf(55, 63, 70)
        private val DEFAULT_ATTENUATION_BUCKET_WEIGHTS = listOf(1.5, 1.0, 0.4, 0.0)
        private val DEFAULT_REPORT_TYPE_WEIGHTS = listOf(1.0, 0.0, 0.0, 0.0)
        private val DEFAULT_INFECTIOUSNESS_WEIGHT = listOf(0.3, 1.0)
        private const val DEFAULT_INFECTIOUSNESS_WHEN_DAY_SINCE_ONSET_MISSING = 1
        private val DEFAULT_DAYS_SINCE_ONSET_TO_INFECTIOUSNESS = mapOf(
            -14 to 0, -13 to 0, -12 to 0, -11 to 0, -10 to 0, -9 to 0, -8 to 0,
            -7 to 0, -6 to 0, -5 to 0, -4 to 0, -3 to 1, -2 to 2, -1 to 2,
            0 to 2, 1 to 2, 2 to 2, 3 to 2, 4 to 1, 5 to 0, 6 to 0,
            7 to 0, 8 to 0, 9 to 0, 10 to 0, 11 to 0, 12 to 0, 13 to 0, 14 to 0
        )
        private const val DEFAULT_REPORT_TYPE_WHEN_MISSING = 1
    }

    private val prefs = ExposureNotificationSharedPreferences(context)

    fun refresh(): ListenableFuture<Unit> {
        return CallbackToFutureAdapter.getFuture { completer: CallbackToFutureAdapter.Completer<Unit> ->
            val responseListener = Response.Listener<JSONObject> { json ->
                try {
                    Log.d(TAG, "Parsing configuration response")
                    val dailySummariesObject = json.getJSONObject("DailySummariesConfig")

                    val attenuationDurationThresholds =
                        dailySummariesObject.getJSONArray("attenuationDurationThresholds")
                    val attenuationDurationThresholdsList = mutableListOf<Int>()
                    for (i in 0 until attenuationDurationThresholds.length()) {
                        attenuationDurationThresholdsList.add(attenuationDurationThresholds.getInt(i))
                    }
                    prefs.setAttenuationDurationThresholds(attenuationDurationThresholdsList)

                    val attenuationBucketWeights = dailySummariesObject.getJSONArray("attenuationBucketWeights")
                    val attenuationBucketWeightsList = mutableListOf<Double>()
                    for (i in 0 until attenuationBucketWeights.length()) {
                        attenuationBucketWeightsList.add(attenuationBucketWeights.getDouble(i))
                    }
                    prefs.setAttenuationBucketWeights(attenuationBucketWeightsList)

                    val reportTypeWeights = dailySummariesObject.getJSONArray("reportTypeWeights")
                    val reportTypeWeightsList = mutableListOf<Double>()
                    for (i in 0 until reportTypeWeights.length()) {
                        reportTypeWeightsList.add(reportTypeWeights.getDouble(i))
                    }
                    prefs.setReportTypeWeights(reportTypeWeightsList)

                    val infectiousnessWeights = dailySummariesObject.getJSONArray("infectiousnessWeights")
                    val infectiousnessWeightsList = mutableListOf<Double>()
                    for (i in 0 until infectiousnessWeights.length()) {
                        infectiousnessWeightsList.add(infectiousnessWeights.getDouble(i))
                    }
                    prefs.setInfectiousnessWeights(infectiousnessWeightsList)

                    val daysSinceOnsetToInfectiousness =
                        dailySummariesObject.getJSONArray("daysSinceOnsetToInfectiousness")
                    val daysSinceOnsetToInfectiousnessMap = hashMapOf<Int, Int>()
                    for (i in 0 until daysSinceOnsetToInfectiousness.length()) {
                        val mapEntry = daysSinceOnsetToInfectiousness.getJSONArray(i)
                        daysSinceOnsetToInfectiousnessMap[mapEntry.getInt(0)] = mapEntry.getInt(1)
                    }
                    prefs.setDaysSinceOnsetToInfectiousness(daysSinceOnsetToInfectiousnessMap)

                    prefs.setInfectiousnessWhenDaysSinceOnsetMissing(
                        dailySummariesObject.getInt("infectiousnessWhenDaysSinceOnsetMissing")
                    )
                    prefs.setReportTypeWhenMissing(dailySummariesObject.getInt("reportTypeWhenMissing"))

                    prefs.setTriggerThresholdWeightedDuration(json.getInt("triggerThresholdWeightedDuration"))

                    Log.d(TAG, "Configuration refresh succeeded")
                    completer.set(null)
                } catch (exception: JSONException) {
                    Log.e(TAG, "Failed to parse configuration: $exception")
                    completer.setCancelled()
                }
            }
            val errorListener = Response.ErrorListener { exception ->
                Log.e(TAG, "Failed to fetch configuration: $exception")
                completer.setCancelled()
            }

            Log.d(TAG, "Fetching configuration file from $configurationUri")
            val request = JsonObjectRequest(configurationUri.toString(), null, responseListener, errorListener)
            request.setShouldCache(false)
            RequestQueueSingleton.get().add(request)
            request
        }
    }

    fun getDailySummariesConfig(): DailySummariesConfig {
        val reportTypeWeights = prefs.getReportTypeWeights(DEFAULT_REPORT_TYPE_WEIGHTS)
        val infectiousnessWeights = prefs.getInfectiousnessWeights(DEFAULT_INFECTIOUSNESS_WEIGHT)

        return DailySummariesConfig.DailySummariesConfigBuilder()
            .setAttenuationBuckets(
                prefs.getAttenuationDurationThresholds(DEFAULT_ATTENUATION_DURATION_THRESHOLDS),
                prefs.getAttenuationBucketWeights(DEFAULT_ATTENUATION_BUCKET_WEIGHTS)
            )
            .setReportTypeWeight(CONFIRMED_TEST, reportTypeWeights[0])
            .setReportTypeWeight(CONFIRMED_CLINICAL_DIAGNOSIS, reportTypeWeights[1])
            .setReportTypeWeight(SELF_REPORT, reportTypeWeights[2])
            .setReportTypeWeight(RECURSIVE, reportTypeWeights[3])
            .setInfectiousnessWeight(STANDARD, infectiousnessWeights[0])
            .setInfectiousnessWeight(HIGH, infectiousnessWeights[1])
            .build()
    }

    fun getDiagnosisKeysDataMapping(): DiagnosisKeysDataMapping {
        return DiagnosisKeysDataMapping.DiagnosisKeysDataMappingBuilder()
            .setInfectiousnessWhenDaysSinceOnsetMissing(
                prefs.getInfectiousnessWhenDaysSinceOnsetMissing(DEFAULT_INFECTIOUSNESS_WHEN_DAY_SINCE_ONSET_MISSING)
            )
            .setDaysSinceOnsetToInfectiousness(
                prefs.getDaysSinceOnsetToInfectiousness(DEFAULT_DAYS_SINCE_ONSET_TO_INFECTIOUSNESS)
            )
            .setReportTypeWhenMissing(
                prefs.getReportTypeWhenMissing(DEFAULT_REPORT_TYPE_WHEN_MISSING)
            )
            .build()
    }

    fun getTriggerThresholdWeightedDuration(): Int =
        prefs.getTriggerThresholdWeightedDuration(DEFAULT_TRIGGER_THRESHOLD_WEIGHTED_DURATION)
}