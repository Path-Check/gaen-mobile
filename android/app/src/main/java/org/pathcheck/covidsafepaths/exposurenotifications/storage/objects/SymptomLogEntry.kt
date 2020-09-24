package org.pathcheck.covidsafepaths.exposurenotifications.storage.objects

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import io.realm.RealmList
import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import java.util.UUID
import org.threeten.bp.Instant

open class SymptomLogEntry(
    @PrimaryKey
    var id: String = UUID.randomUUID().toString(),
    var date: Long = Instant.now().toEpochMilli(),
    var symptoms: RealmList<String> = RealmList()
) : RealmObject() {
    companion object {
        fun fromReadableMap(map: ReadableMap): SymptomLogEntry {
            val symptoms = map.getArray("symptoms")
            val symptomsStrings = RealmList<String>()
            if (symptoms != null) {
                for (symptom in symptoms.toArrayList()) {
                    symptomsStrings.add(symptom?.toString())
                }
            }

            val id: String = if (map.hasKey("id")) {
                map.getString("id") ?: UUID.randomUUID().toString()
            } else {
                UUID.randomUUID().toString()
            }

            return SymptomLogEntry(
                id = id,
                date = map.getDouble("date").toLong(),
                symptoms = symptomsStrings
            )
        }
    }

    fun toReadableMap(): ReadableMap {
        val map = WritableNativeMap()
        map.putString("id", id)
        map.putDouble("date", date.toDouble())

        val array = WritableNativeArray()
        for (symptom in symptoms) {
            array.pushString(symptom)
        }
        map.putArray("symptoms", array)

        return map
    }
}