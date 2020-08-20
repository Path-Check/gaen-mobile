package org.pathcheck.covidsafepaths.exposurenotifications.storage

import io.realm.annotations.RealmModule

@RealmModule(classes = [PositiveDiagnosis::class, KeyValues::class, ExposureEntity::class])
class SafePathsBteRealmModule