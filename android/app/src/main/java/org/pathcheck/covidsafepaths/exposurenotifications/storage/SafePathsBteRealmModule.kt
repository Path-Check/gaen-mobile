package org.pathcheck.covidsafepaths.exposurenotifications.storage

import io.realm.annotations.RealmModule
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.ExposureEntity
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.KeyValues
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.SymptomLogEntry

@RealmModule(classes = [KeyValues::class, ExposureEntity::class, SymptomLogEntry::class])
class SafePathsBteRealmModule