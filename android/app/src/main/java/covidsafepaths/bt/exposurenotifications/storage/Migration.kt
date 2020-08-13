package covidsafepaths.bt.exposurenotifications.storage

import android.util.Log
import io.realm.DynamicRealm
import io.realm.FieldAttribute
import io.realm.RealmMigration
import io.realm.RealmObject
import io.realm.RealmObjectSchema

internal class Migration : RealmMigration {
    override fun migrate(realm: DynamicRealm, oldVersion: Long, newVersion: Long) {
        Log.d("Migration", "Running migration from version $oldVersion to $newVersion");
        val schema = realm.schema
        var version = oldVersion

        if (version == 1L) {
            schema.create("ExposureEntity")
                .addField("id", Long::class.java, FieldAttribute.PRIMARY_KEY)
                .addField("dateMillisSinceEpoch", Long::class.java)
                .addField("receivedTimestampMs", Long::class.java)
            version++
        }

        if (version == 2L) {
            schema.get("KeyValues")
                ?.renameField("lastDownloadedKeyZipFileName", "value")
                ?.removePrimaryKey()
                ?.transform { obj -> obj.setString("id", KeyValues.LAST_PROCESSED_FILE_NAME_KEY) }
                ?.addPrimaryKey("id")
        }
    }
}
