package org.pathcheck.covidsafepaths.exposurenotifications.network.escrowserver

import android.content.Context
import android.util.Base64
import android.util.Log
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.common.hash.Hashing
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import java.nio.charset.StandardCharsets
import java.util.Date
import kotlin.math.floor
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.pathcheck.covidsafepaths.BuildConfig
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.EscrowVerificationKeySubmissionModule.Companion.NO_KEYS_ERROR_CODE
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Error
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Result
import retrofit2.Call
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

object EscrowVerificationClient {
    private const val TAG: String = "BackendService"

    private val retrofit: Retrofit by lazy {
        val okHttpClient = OkHttpClient.Builder()
            .also {
                val loggingInterceptor = HttpLoggingInterceptor { message ->
                    Log.d(TAG, message)
                }
                loggingInterceptor.level = HttpLoggingInterceptor.Level.BODY
                it.addInterceptor(loggingInterceptor)
            }
            .build()

        Retrofit.Builder()
            .baseUrl(BuildConfig.ESCROW_VERIFICATION_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(okHttpClient)
            .build()
    }
    private val service: IBackendService by lazy {
        retrofit.create(IBackendService::class.java)
    }

    private const val NULL_NONCE_CODE = 1000

    private var prefs: ExposureNotificationSharedPreferences? = null

    private fun getSharedPrefs(context: Context): ExposureNotificationSharedPreferences {
        if (prefs == null) {
            prefs = ExposureNotificationSharedPreferences(context)
        }

        return prefs!!
    }

    private suspend fun authenticate(context: Context): AuthResponse? =
        coroutineScope {
            withContext(Dispatchers.IO) {
                try {
                    // Get Nonce
                    val uID = DeviceIDHelper.generateRandomToken() + System.currentTimeMillis()
                    val nonceResponse: Response<NonceResponse> = service.getNonce(uID).execute()
                    if (!nonceResponse.isSuccessful) {
                        Log.w(TAG, "Auth successful")
                        val auth = AuthResponse()
                        auth.responseCode = nonceResponse.code()
                        return@withContext auth
                    }

                    val cookie = nonceResponse.headers()["set-cookie"]
                    val nonce = nonceResponse.body()?.nonceData

                    Log.w(TAG, "nonce:$nonce, cookie:$cookie")
                    if (nonce == null || cookie == null) {
                        val auth = AuthResponse()
                        auth.responseCode = NULL_NONCE_CODE
                        return@withContext auth
                    }

                    val deviceID = DeviceIDHelper.getDeviceID(nonce, context)

                    val resp = service.auth(cookie, deviceCode = deviceID).execute()

                    if (resp.isSuccessful) {
                        getSharedPrefs(context).setEscrowVerificationTokens(
                            resp.body()?.accessToken,
                            resp.body()?.refreshToken
                        )
                        resp.body()
                    } else {
                        val auth = AuthResponse()
                        auth.responseCode = resp.code()
                        if (resp.code() == 401) {
                            Log.w(TAG, "Authentication unauthorized")
                        } else {
                            Log.w(TAG, "Authentication error: ${resp.code()}")
                        }
                        auth
                    }
                } catch (e: Exception) {
                    null
                }
            }
        }

    private suspend fun refresh(context: Context): AuthResponse? =
        coroutineScope {
            withContext(Dispatchers.IO) {
                val prefs = getSharedPrefs(context)
                val resp = service.refreshToken(prefs.getEscrowVerificationRefreshToken("")).execute()

                if (resp.isSuccessful) {
                    Log.w(TAG, "Refresh token success")
                    prefs.setEscrowVerificationTokens(resp.body()?.accessToken, resp.body()?.refreshToken)
                    resp.body()
                } else {
                    val auth = AuthResponse()
                    auth.responseCode = resp.code()
                    if (resp.code() == 401) {
                        Log.w(TAG, "Re-authenticating")
                        authenticate(context)
                    } else {
                        auth
                    }
                }
            }
        }

    suspend fun postPositiveSubmission(
        context: Context,
        submission: PositiveSubmission,
        retries: Int = 3
    ): Result<Unit> =
        coroutineScope {
            withContext(Dispatchers.IO) {
                // Get Nonce
                val uID = DeviceIDHelper.generateRandomToken() + System.currentTimeMillis()
                val nonceResponse: Response<NonceResponse> = service.getNonce(uID).execute()
                if (!nonceResponse.isSuccessful) {
                    Log.w(TAG, "Post nonce failed")
                    return@withContext Result.Failure(
                        Error(nonceResponse.code(), nonceResponse.errorBody()?.string() ?: "")
                    )
                }

                val cookie = nonceResponse.headers()["set-cookie"]
                val nonce = nonceResponse.body()?.nonceData

                if (nonce == null || cookie == null) {
                    Log.w(TAG, "Post nonce failed nonce:$nonce, cookie:$cookie")
                    // Return success even if the nonce call failed
                    return@withContext Result.Success(Unit)
                }

                // Get Device code from SafetyNet
                submission.deviceVerificationPayload = DeviceIDHelper.getDeviceID(nonce, context)
                val gson = Gson()
                val sub_json = gson.toJson(submission)
                Log.w(TAG, "submission:")
                val maxLogSize = 1000
                for (i in 0..sub_json.length / maxLogSize) {
                    val start = i * maxLogSize
                    var end = (i + 1) * maxLogSize
                    end = if (end > sub_json.length) sub_json.length else end
                    Log.v(TAG, sub_json.substring(start, end))
                }

                submission.keys?.forEach { key -> Log.w(TAG, "Key:${key.keyData}") }
                try {
                    if (submission.keys!!.isEmpty()) {
                        Log.w(TAG, "There are no keys")
                        // Backend is not called, return a success
                        return@withContext Result.Failure(Error(NO_KEYS_ERROR_CODE, "NoKeysOnDevice"))
                    }
                } catch (e: KotlinNullPointerException) {
                    Log.e(TAG, "Keys are null")
                }

                val resp = service.postPositiveDiagnosis(
                    "Bearer " + getSharedPrefs(context).getEscrowVerificationAccessToken(""),
                    cookie,
                    submission
                ).execute()
                if (resp.isSuccessful) {
                    Log.w(TAG, "Success")
                    Result.Success(Unit)
                } else {
                    if (resp.code() == 401 && retries > 0) {
                        Log.w(TAG, "Refreshing token...")
                        val authResp = refresh(context)
                        if (authResp != null) {
                            getSharedPrefs(context).setEscrowVerificationTokens(
                                authResp.accessToken,
                                authResp.refreshToken
                            )
                            postPositiveSubmission(context, submission, retries - 1)
                        } else {
                            Log.w(TAG, "Auth error, couldn't refresh")
                            Result.Failure(Error(resp.code(), resp.errorBody()?.string() ?: ""))
                        }
                    } else {
                        Log.w(TAG, "Unknown error (${resp.code()}):${resp.errorBody()?.string()}|${resp.body()}")
                        Result.Failure(Error(resp.code(), resp.errorBody()?.string() ?: ""))
                    }
                }
            }
        }

    suspend fun postMetaInfo(
        context: Context,
        teks: List<TemporaryExposureKey>,
        phone_number: String
    ): Result<Unit> =
        coroutineScope {
            withContext(Dispatchers.IO) {
                // generate tek hmac (SHA-512 for now)
                val maxTimePeriod = floor((Date().time / (10 * 60 * 1000)).toDouble())
                val tekString = teks.mapNotNull { tek ->
                    if (tek.rollingPeriod + tek.rollingStartIntervalNumber <= maxTimePeriod) "${
                    Base64.encodeToString(
                        tek.keyData,
                        Base64.URL_SAFE
                    )
                    }.${tek.rollingStartIntervalNumber}.${tek.rollingPeriod}.${tek.transmissionRiskLevel}" else null
                }.joinToString(",")
                val tekHmac = Hashing.sha512()
                    .hashString(tekString, StandardCharsets.UTF_8)
                    .toString()

                val submission = MetaInfoSubmission(tekHmac, phone_number)

                try {
                    val resp = service.postMetaInfo(
                        "Bearer " + getSharedPrefs(context).getEscrowVerificationAccessToken(""),
                        submission
                    ).execute()
                    if (resp.isSuccessful) {
                        Log.w(TAG, "Success")
                        Result.Success(Unit)
                    } else {
                        if (resp.code() == 401) {
                            Log.w(TAG, "Refreshing token...")
                            val authResp = refresh(context)
                            if (authResp != null) {
                                getSharedPrefs(context).setEscrowVerificationTokens(
                                    authResp.accessToken,
                                    authResp.refreshToken
                                )
                                postMetaInfo(context, teks, phone_number)
                            } else {
                                Log.w(TAG, "Auth error, couldn't refresh")
                                Result.Failure(Error(resp.code(), resp.errorBody()?.string() ?: ""))
                            }
                        } else {
                            Log.w(TAG, "Unknown error (${resp.code()}):${resp.errorBody()?.string()}")
                            Result.Failure(Error(resp.code(), resp.errorBody()?.string() ?: ""))
                        }
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "MetaInfo EXCEPTION:${e.localizedMessage}")
                    Result.Failure(Error(600, e.localizedMessage ?: ""))
                }
            }
        }
}

class AuthResponse {
    @SerializedName("token_type")
    var tokenType: String? = null

    @SerializedName("access_token")
    var accessToken: String? = null

    @SerializedName("expires_in")
    var expiresIn: Int = 0

    @SerializedName("refresh_token")
    var refreshToken: String? = null

    var responseCode: Int = 200
}

class ExposureKey(
    _keyData: ByteArray,
    _rollingPeriod: Int = 144,
    _transmissionRiskLevel: Int = 0,
    _rollingStartNumber: Int = 0
) {
    @SerializedName("key")
    var keyData: String = Base64.encodeToString(_keyData, Base64.URL_SAFE)

    @SerializedName("rollingPeriod")
    var rollingPeriod: Int = _rollingPeriod

    @SerializedName("transmissionRiskLevel")
    var transmissionRiskLevel: Int = _transmissionRiskLevel

    @SerializedName("rollingStartNumber")
    var rollingStartNumber: Int = _rollingStartNumber
}

class PositiveSubmission(
    _keys: List<ExposureKey>? = listOf<ExposureKey>(),
    _verifyCode: String? = null,
    _verifyDate: String? = null,
    _deviceVerificationPayload: String = "",
    _regions: String? = "US",
    _appPackageName: String? = "gov.adph.exposurenotifications",
    _platform: String? = "Android"
) {
    @SerializedName("temporaryExposureKeys")
    var keys: List<ExposureKey>? = _keys

    @SerializedName("verification_code")
    var verifyCode: String? = _verifyCode

    @SerializedName("test_date")
    var verifyDate: String? = _verifyDate

    @SerializedName("regions")
    var regions: String? = _regions

    @SerializedName("appPackageName")
    var appPackageName: String? = _appPackageName

    @SerializedName("platform")
    var platform: String? = _platform

    @SerializedName("deviceVerificationPayload")
    var deviceVerificationPayload: String = _deviceVerificationPayload
}

class MetaInfoSubmission(_tek_sign: String, _phone_number: String) {
    @SerializedName("tek_sha512")
    var tek_sign: String = _tek_sign

    @SerializedName("phone_number")
    var phone_number: String = _phone_number
}

class NonceResponse {
    @SerializedName("nonce")
    var nonceData: String? = null
}

class SuccessResponse {
    @SerializedName("success")
    var success: Int? = null
}

interface IBackendService {
    @FormUrlEncoded
    @POST("authtracking/token")
    fun auth(
        @Header("Cookie") cookie: String,
        @Field("grant_type") grantType: String = "device_code",
        @Field("device_type") deviceType: String = "Android",
        @Field("device_code") deviceCode: String
    ): Call<AuthResponse>

    @FormUrlEncoded
    @POST("authtracking/token")
    fun refreshToken(
        @Field("refresh_token") refreshToken: String,
        @Field("grant_type") grantType: String = "refresh_token"
    ): Call<AuthResponse>

    @GET("authtracking/nonce")
    fun getNonce(@Header("uniqueID") uniqueID: String): Call<NonceResponse>

    @POST("verification/postVerificationCode")
    fun postPositiveDiagnosis(
        @Header("Authorization") accessToken: String,
        @Header("Cookie") cookie: String,
        @Body request: PositiveSubmission
    ): Call<SuccessResponse>

    @POST("verification/postMetaInfo")
    fun postMetaInfo(
        @Header("Authorization") accessToken: String,
        @Body request: MetaInfoSubmission
    ): Call<SuccessResponse>
}