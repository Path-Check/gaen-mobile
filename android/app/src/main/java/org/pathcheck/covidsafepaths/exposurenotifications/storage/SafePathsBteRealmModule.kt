package org.pathcheck.covidsafepaths.exposurenotifications.storage

import io.realm.annotations.RealmModule
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.CheckInStatus
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.ExposureEntity
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.KeyValues

@RealmModule(classes = [KeyValues::class, ExposureEntity::class, CheckInStatus::class])
class SafePathsBteRealmModule