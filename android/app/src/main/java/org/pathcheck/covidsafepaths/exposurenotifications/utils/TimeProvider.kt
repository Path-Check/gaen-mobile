package org.pathcheck.covidsafepaths.exposurenotifications.utils

interface TimeProvider {
    val currentTimeInMillis: Long
}

object TimeProviderImpl : TimeProvider {

    override val currentTimeInMillis: Long
        get() = System.currentTimeMillis()
}