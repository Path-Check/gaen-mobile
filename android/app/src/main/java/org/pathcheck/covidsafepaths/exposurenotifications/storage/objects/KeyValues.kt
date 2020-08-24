package org.pathcheck.covidsafepaths.exposurenotifications.storage.objects

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey

/**
 * A catch all class for storing key value pairs.
 */
open class KeyValues(
    @PrimaryKey
    var id: String = "",
    var value: String? = null
) : RealmObject() {
    companion object {
        const val LAST_PROCESSED_FILE_NAME_KEY = "LAST_PROCESSED_FILE_NAME"
        const val REVISION_TOKEN_KEY = "REVISION_TOKEN"
    }
}