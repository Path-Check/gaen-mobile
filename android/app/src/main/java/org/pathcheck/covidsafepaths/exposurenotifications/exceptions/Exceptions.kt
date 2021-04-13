package org.pathcheck.covidsafepaths.exposurenotifications.exceptions

enum class ErrorCode(val code: Int) {
    SHARE_EXPOSURE_KEYS_DENIED(998)
}

interface ExposureException {
    val errorCode: ErrorCode
}

data class ShareExposureKeysException(private val wrappedThrowable: Throwable? = null) :
    Exception(), ExposureException {
    override val cause: Throwable? = wrappedThrowable
    override val message: String = "Cancelled Sharing By User"
    override val errorCode: ErrorCode = ErrorCode.SHARE_EXPOSURE_KEYS_DENIED
}