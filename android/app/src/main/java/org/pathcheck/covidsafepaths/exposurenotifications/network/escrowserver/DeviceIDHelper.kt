package org.pathcheck.covidsafepaths.exposurenotifications.network.escrowserver

import android.content.Context
import android.util.Base64
import android.util.Log
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.safetynet.SafetyNet
import com.google.android.gms.safetynet.SafetyNetApi
import com.google.android.gms.tasks.Tasks.await
import com.google.common.io.BaseEncoding
import java.security.SecureRandom
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONException
import org.json.JSONObject
import org.pathcheck.covidsafepaths.BuildConfig

object DeviceIDHelper {
    const val TAG = "DeviceIDHelper"

    private val secureRandom = SecureRandom()
    private val BASE64_LOWER = BaseEncoding.base64()
    private const val RANDOM_TOKEN_BYTE_LENGTH = 32

    fun generateRandomToken(): String {
        val bytes =
            ByteArray(RANDOM_TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return BASE64_LOWER.encode(bytes)
    }

    private fun parse(jwsResult: String?): String? {
        if (jwsResult == null) {
            Log.w(TAG, "null results")
            return null
        }

        // the JWT (JSON WEB TOKEN) is just a 3 base64 encoded parts concatenated by a . character
        val jwtParts: List<String> = jwsResult.split(".")

        if (jwtParts.size != 3) {
            Log.w(TAG, "results size != 3 : ${jwtParts.size}")
            return null
        }

        // we're only really interested in the body/payload
        val decodedJWTPayload =
            String(Base64.decode(jwtParts[1], Base64.DEFAULT))

        Log.d(TAG, "decodedJWTPayload json:$decodedJWTPayload")
        var response = ""
        try {
            val root = JSONObject(decodedJWTPayload)
            if (root.has("nonce")) {
                response += "nonce:" + root.getString("nonce")
            }
            if (root.has("apkCertificateDigestSha256")) {
                val jsonArray = root.getJSONArray("apkCertificateDigestSha256")
                val certDigests =
                    arrayOfNulls<String>(jsonArray.length())
                for (i in 0 until jsonArray.length()) {
                    certDigests[i] = jsonArray.getString(i)
                }
                response += "\ncertDigests:" + certDigests
            }
            if (root.has("apkDigestSha256")) {
                response += "\napkDigestSha256:" + root.getString("apkDigestSha256")
            }
            if (root.has("apkPackageName")) {
                response += "\napkPackageName:" + root.getString("apkPackageName")
            }
            if (root.has("basicIntegrity")) {
                response += "\nbasicIntegrity:" + root.getBoolean("basicIntegrity")
            }
            if (root.has("ctsProfileMatch")) {
                response += "\nctsProfileMatch:" + root.getBoolean("ctsProfileMatch")
            }
            if (root.has("timestampMs")) {
                response += "\ntimestampMs:" + root.getLong("timestampMs")
            }
            if (root.has("advice")) {
                response += "\nadvice:" + root.getString("advice")
            }
            return response
        } catch (e: JSONException) {
            Log.e(TAG, "problem parsing decodedJWTPayload:" + e.message, e)
        }
        return null
    }

    suspend fun getDeviceID(nonceData: String, context: Context): String {
        if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context)
            == ConnectionResult.SUCCESS
        ) {
            // The SafetyNet Attestation API is available.
            Log.w(TAG, "SUCCESS")
        } else {
            // Prompt user to update Google Play services.
            Log.w(TAG, "FAILURE, DOWNLOAD GOOGLE PLAY SERVICES")
        }
        return withContext(Dispatchers.IO) {
            val client = SafetyNet.getClient(context)

            val nonce = nonceData.toByteArray()

            Log.w(TAG, "nonce compare:${String(nonce, Charsets.UTF_8)}:$nonceData")
            val task =
                client.attest(nonce, BuildConfig.SAFETY_NET_API_KEY)

            try {
                await(task)
            } catch (e: Exception) {
                Log.e("AttestationError:", e.message!!)
            }

            var attestResponse: SafetyNetApi.AttestationResponse? = null
            try {
                attestResponse = task.result
            } catch (e: Exception) {
                Log.e(TAG, e.message!!)
            }
            if (attestResponse == null) {
                return@withContext ""
            }
            val result = attestResponse
            Log.w(
                TAG,
                "response:${result.jwsResult.split(".").size}\n----------------------------------------\n"
            )

            Log.w(TAG, "response parse:${parse(result.jwsResult)}")

            result.jwsResult
        }
    }
}