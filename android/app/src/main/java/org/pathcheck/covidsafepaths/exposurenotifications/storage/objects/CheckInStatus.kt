package org.pathcheck.covidsafepaths.exposurenotifications.storage.objects

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableNativeMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import io.realm.RealmList
import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.threeten.bp.Instant
import java.util.ArrayList

open class CheckInStatus(
    @PrimaryKey
    var posixDate: Long = Instant.now().toEpochMilli(),
    var feelingGood: Boolean = true,
    var symptoms: RealmList<String> = RealmList(),
) : RealmObject() {
    companion object {
        fun fromReadableMap(map: ReadableMap): CheckInStatus {
            val symptoms = map.getArray("symptoms")
            val symptomsStrings = RealmList<String>()
            if (symptoms != null) {
                for (symptom in symptoms.toArrayList()) {
                    symptomsStrings.add(symptom?.toString())
                }
            }

            return CheckInStatus(
                map.getDouble("posixDate").toLong(),
                map.getBoolean("feelingGood"),
                symptomsStrings
            )
        }
    }

    fun toReadableMap(): ReadableMap {
        val map = WritableNativeMap()
        map.putDouble("posixDate", posixDate.toDouble())
        map.putBoolean("feelingGood", feelingGood)

        val array = WritableNativeArray()
        for (symptom in symptoms) {
            array.pushString(symptom)
        }
        map.putArray("symptoms", array)

        return map
    }
}