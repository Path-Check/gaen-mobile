package org.pathcheck.covidsafepaths.helpers

import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.common.collect.ImmutableList
import com.google.common.io.BaseEncoding
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureKey
import org.pathcheck.covidsafepaths.exposurenotifications.network.DiagnosisKey

object DiagnosisKeyEncoding {
    private val BASE64 = BaseEncoding.base64()

    fun encodeDiagnosisKeys(tempKeys: List<TemporaryExposureKey>, shouldShuffle: Boolean): List<RNExposureKey> {
        return toDiagnosisKeysWithTransmissionRisk(tempKeys)?.map { diagnosisKey ->

            if (shouldShuffle) {
                diagnosisKey.keyBytes.shuffle()
            }

            RNExposureKey(
                BASE64.encode(diagnosisKey.keyBytes),
                diagnosisKey.rollingPeriod,
                diagnosisKey.intervalNumber,
                diagnosisKey.transmissionRisk
            )
        }.orEmpty()
    }

    /**
     * Transforms from EN API's TEK object to our network package's expression of it, applying a
     * default transmission risk. This default TR is temporary, while we determine that part of the EN
     * API's contract.
     */
    private fun toDiagnosisKeysWithTransmissionRisk(recentKeys: List<TemporaryExposureKey>): List<DiagnosisKey>? {
        val builder = ImmutableList.Builder<DiagnosisKey>()
        for (key in recentKeys) {
            builder.add(
                DiagnosisKey.newBuilder()
                    .setKeyBytes(key.keyData)
                    .setIntervalNumber(key.rollingStartIntervalNumber)
                    .setRollingPeriod(key.rollingPeriod) // Accepting the default transmission risk for now, which the DiagnosisKey.Builder
                    // comes with pre-set.
                    .build()
            )
        }
        return builder.build()
    }
}