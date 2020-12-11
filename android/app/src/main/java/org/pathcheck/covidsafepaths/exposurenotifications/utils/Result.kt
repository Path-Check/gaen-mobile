package org.pathcheck.covidsafepaths.exposurenotifications.utils

sealed class Result<out R> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Failure(val error: Error) : Result<Nothing>()
}

open class Error(val code: Int, val message: String, val exception: Throwable? = null)