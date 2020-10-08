package org.pathcheck.covidsafepaths.exposurenotifications.storage

import android.util.Base64
import androidx.annotation.VisibleForTesting
import com.bottlerocketstudios.vault.SharedPreferenceVault
import com.bottlerocketstudios.vault.SharedPreferenceVaultFactory
import com.google.android.gms.nearby.exposurenotification.DailySummary
import io.realm.Realm
import io.realm.RealmConfiguration
import io.realm.RealmResults
import java.security.SecureRandom
import org.pathcheck.covidsafepaths.MainApplication
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.ExposureEntity
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.KeyValues
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.KeyValues.Companion.LAST_PROCESSED_FILE_NAME_KEY
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.KeyValues.Companion.REVISION_TOKEN_KEY
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.SymptomLogEntry
import org.threeten.bp.Duration
import org.threeten.bp.Instant
import org.threeten.bp.temporal.ChronoUnit

/**
 * Modified from GPS target to support Exposure Notification on-device data
 */
object RealmSecureStorageBte {

    private const val SCHEMA_VERSION: Long = 7

    private const val MANUALLY_KEYED_PREF_FILE_NAME = "safepathsbte_enc_prefs"
    private const val MANUALLY_KEYED_KEY_FILE_NAME = "safepathsbte_enc_key"
    private const val MANUALLY_KEYED_KEY_ALIAS = "safepathsbte"
    private const val MANUALLY_KEYED_KEY_INDEX = 2
    private const val MANUALLY_KEYED_PRESHARED_SECRET = "" // This will not be used as we do not support < 18
    private const val KEY_REALM_ENCRYPTION_KEY = "KEY_REALM_ENCRYPTION_KEY"

    private val realmConfig: RealmConfiguration

    init {
        val encryptionKey = getEncryptionKey()

        val builder = RealmConfiguration.Builder()
            .encryptionKey(encryptionKey)
            .addModule(SafePathsBteRealmModule())
            .schemaVersion(SCHEMA_VERSION)
            .migration(Migration())

        builder.name("safepathsbte.realm")

        realmConfig = builder.build()
    }

    private fun getEncryptionKey(): ByteArray {
        val vault: SharedPreferenceVault =
            SharedPreferenceVaultFactory.getAppKeyedCompatAes256Vault(
                MainApplication.getContext(), MANUALLY_KEYED_PREF_FILE_NAME,
                MANUALLY_KEYED_KEY_FILE_NAME,
                MANUALLY_KEYED_KEY_ALIAS, MANUALLY_KEYED_KEY_INDEX,
                MANUALLY_KEYED_PRESHARED_SECRET
            )

        val existingKeyString = vault.getString(KEY_REALM_ENCRYPTION_KEY, null)

        return if (existingKeyString != null) {
            Base64.decode(existingKeyString, Base64.DEFAULT)
        } else {
            val newKey = ByteArray(64)
            SecureRandom().nextBytes(newKey)
            val newKeyString = Base64.encodeToString(newKey, Base64.DEFAULT)
            vault.edit().putString(KEY_REALM_ENCRYPTION_KEY, newKeyString).apply()
            newKey
        }
    }

    fun upsertLastProcessedKeyZipFileName(name: String) {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.insertOrUpdate(KeyValues(LAST_PROCESSED_FILE_NAME_KEY, name))
            }
        }
    }

    fun getLastProcessedKeyZipFileName(): String? {
        return getRealmInstance().use {
            it.where(KeyValues::class.java).equalTo("id", LAST_PROCESSED_FILE_NAME_KEY).findFirst()?.value
        }
    }

    fun upsertRevisionToken(revisionToken: String) {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.insertOrUpdate(KeyValues(REVISION_TOKEN_KEY, revisionToken))
            }
        }
    }

    fun getRevisionToken(): String? {
        return getRealmInstance().use {
            it.where(KeyValues::class.java).equalTo("id", REVISION_TOKEN_KEY).findFirst()?.value
        }
    }

    fun refreshWithDailySummaries(dailySummaries: List<DailySummary>): Boolean {
        var somethingAdded = false
        getRealmInstance().use {
            it.executeTransaction { db ->
                // Keep track of the exposures already handled to avoid showing the same notification multiple times.
                // The list passes as a parameter should have only those summaries that exceeded the threshold.
                val results: RealmResults<ExposureEntity> = db.where(ExposureEntity::class.java).findAll()
                val exposureEntities: MutableList<ExposureEntity> = db.copyFromRealm(results)
                for (dailySummary in dailySummaries) {
                    var found = false
                    val dateMillisSinceEpoch = Duration.ofDays(dailySummary.daysSinceEpoch.toLong()).toMillis()
                    for (i in exposureEntities.indices) {
                        if (exposureEntities[i].dateMillisSinceEpoch == dateMillisSinceEpoch) {
                            exposureEntities.removeAt(i)
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        // No existing ExposureEntity with the given date, must add an entity for this summary.
                        somethingAdded = true
                        db.insert(
                            ExposureEntity.create(dateMillisSinceEpoch, System.currentTimeMillis())
                        )
                    }
                }
            }
        }
        return somethingAdded
    }

    fun insertExposure(exposure: ExposureEntity) {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.insert(exposure)
            }
        }
    }

    fun getExposures(): List<ExposureEntity> {
        return getRealmInstance().use {
            it.copyFromRealm(it.where(ExposureEntity::class.java).findAll())
        }
    }

    fun resetExposures() {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.delete(ExposureEntity::class.java)
                db.where(KeyValues::class.java)
                    .equalTo("id", LAST_PROCESSED_FILE_NAME_KEY)
                    .findFirst()
                    ?.deleteFromRealm()
            }
        }
    }

    fun upsertLogEntry(logEntry: SymptomLogEntry) {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.insertOrUpdate(logEntry)
            }
        }
    }

    fun deleteLogEntry(id: String) {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.where(SymptomLogEntry::class.java)
                    .equalTo("id", id)
                    .findFirst()
                    ?.deleteFromRealm()
            }
        }
    }

    fun deleteSymptomLogs() {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.delete(SymptomLogEntry::class.java)
            }
        }
    }

    fun deleteSymptomLogsOlderThan(days: Long) {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.where(SymptomLogEntry::class.java)
                    .lessThan("date", daysAgo(days))
                    .findAll()
                    ?.deleteAllFromRealm()
            }
        }
    }

    fun getLogEntries(): List<SymptomLogEntry> {
        return getRealmInstance().use {
            it.copyFromRealm(it.where(SymptomLogEntry::class.java).findAll())
        }
    }

    @VisibleForTesting
    fun getRealmInstance(): Realm {
        return Realm.getInstance(realmConfig)
    }

    private fun daysAgo(days: Long): Long {
        return Instant.now().plus(-1 * days, ChronoUnit.DAYS).toEpochMilli()
    }
}