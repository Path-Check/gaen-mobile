package org.pathcheck.covidsafepaths.exposurenotifications.chaff

import android.content.Context
import android.util.Log
import androidx.annotation.VisibleForTesting
import com.facebook.react.bridge.WritableArray
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureKey
import org.pathcheck.covidsafepaths.exposurenotifications.utils.TimeProvider
import org.pathcheck.covidsafepaths.exposurenotifications.utils.TimeProviderImpl
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util
import java.security.SecureRandom
import java.util.concurrent.TimeUnit

class ChaffManager private constructor(
    context: Context,
    private val timeProvider: TimeProvider,
    private val secureRandom: SecureRandom) {

    private val sharedPreferences = context.getSharedPreferences(CHAFF_SHARED_PREF, Context.MODE_PRIVATE)
    private val currentTimeMillis get() = timeProvider.currentTimeInMillis
    private val currentTimeInHours get() = TimeUnit.MILLISECONDS.toHours(currentTimeMillis)
    private val lastFiredEventInHours: Long
        get() {
            val previousFiredTime = sharedPreferences.getLong(REQUEST_FIRED, 0L)
            return TimeUnit.MILLISECONDS.toHours(previousFiredTime)
        }

    fun shouldFire(): Boolean {
        return secureRandom.nextDouble() < EXECUTION_PROBABILITY && hasBeen24Hours()
    }

    fun save(chaffKeys: List<RNExposureKey>?) {
        saveTime()
        convertTemporaryKeysToJson(chaffKeys).also { json ->
            sharedPreferences
                .edit()
                .putString(CHAFF_JSON, json)
                .apply()
        }
    }

    fun getChaffKeys(): WritableArray? = convertToWriteableArray(getSavedRNExposureKeys())

    @VisibleForTesting
    fun getSavedRNExposureKeys(): List<RNExposureKey>? {
        return sharedPreferences.getString(CHAFF_JSON, "").let { json ->

            if (json.isNullOrEmpty()) {
                return null
            }
            val gson = Gson()
            val listType = TypeToken.getParameterized(List::class.java, RNExposureKey::class.java).type
            gson.fromJson(json, listType)
        }
    }

    private fun convertTemporaryKeysToJson(rnExposureKeys: List<RNExposureKey>?): String {
        val gson = Gson()
        return gson.toJson(rnExposureKeys).also {
            Log.d("Chaff Json Log", it)
        }
    }

    private fun saveTime() {
        sharedPreferences
            .edit()
            .putLong(REQUEST_FIRED, currentTimeMillis)
            .apply()
    }

    private fun hasBeen24Hours(): Boolean {
        return lastFiredEventInHours == 0L ||
            currentTimeInHours - lastFiredEventInHours >= TWENTY_FOUR_HOURS
    }

    private fun convertToWriteableArray(exposureKeys: List<RNExposureKey>?): WritableArray? {
        return Util.convertListToWritableArray(exposureKeys)
    }

    companion object {
        private const val CHAFF_SHARED_PREF = "ChaffManagerSharedPref"
        private const val REQUEST_FIRED = "requestFired"
        private const val CHAFF_JSON = "chaffJson"
        private const val EXECUTION_PROBABILITY = 1.0 / 12.0
        private const val TWENTY_FOUR_HOURS = 24

        private var chaffManager: ChaffManager? = null

        @JvmStatic
        @JvmOverloads
        fun getInstance(context: Context,
                        timeProvider: TimeProvider = TimeProviderImpl,
                        secureRandom: SecureRandom = SecureRandom()): ChaffManager {
            return chaffManager ?: ChaffManager(context, timeProvider, secureRandom).also {
                chaffManager = it
            }
        }
    }
}
