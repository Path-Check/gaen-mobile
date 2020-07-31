package covidsafepaths.bt.exposurenotifications.storage

import io.realm.DynamicRealm
import io.realm.FieldAttribute
import io.realm.RealmMigration

internal class Migration: RealmMigration {
  override fun migrate(realm: DynamicRealm, oldVersion: Long, newVersion: Long) {
    val schema = realm.schema

    if (oldVersion == 1L) {
      schema.create("ExposureEntity")
        .addField("id", Long::class.java, FieldAttribute.PRIMARY_KEY)
        .addField("dateMillisSinceEpoch", Long::class.java)
        .addField("receivedTimestampMs", Long::class.java)
    }
  }
}
