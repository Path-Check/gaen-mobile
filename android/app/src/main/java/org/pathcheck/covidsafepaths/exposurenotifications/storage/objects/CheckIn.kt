package org.pathcheck.covidsafepaths.exposurenotifications.storage.objects

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.threeten.bp.Instant

open class CheckIn(
    @PrimaryKey
    var date: Long = Instant.now().toEpochMilli(),
    var status: Int = 0,
) : RealmObject() {
    companion object {
        fun fromReadableMap(map: ReadableMap): CheckIn {
            return CheckIn(
                date = map.getDouble("date").toLong(),
                status = map.getInt("status"),
            )
        }
    }

    fun toReadableMap(): ReadableMap {
        val map = WritableNativeMap()
        map.putDouble("date", date.toDouble())
        map.putInt("status", status)

        return map
    }
}