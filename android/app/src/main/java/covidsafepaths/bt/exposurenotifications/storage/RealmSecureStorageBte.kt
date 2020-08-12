package covidsafepaths.bt.exposurenotifications.storage

import android.util.Base64
import androidx.annotation.VisibleForTesting
import androidx.concurrent.futures.CallbackToFutureAdapter
import com.bottlerocketstudios.vault.SharedPreferenceVault
import com.bottlerocketstudios.vault.SharedPreferenceVaultFactory
import com.google.android.gms.nearby.exposurenotification.ExposureWindow
import com.google.common.util.concurrent.ListenableFuture
import covidsafepaths.bt.MainApplication
import covidsafepaths.bt.exposurenotifications.storage.KeyValues.Companion.LAST_PROCESSED_FILE_NAME_KEY
import covidsafepaths.bt.exposurenotifications.storage.KeyValues.Companion.REVISION_TOKEN_KEY
import io.realm.Realm
import io.realm.RealmConfiguration
import io.realm.RealmResults
import java.security.SecureRandom


/**
 * Modified from GPS target to support Exposure Notification on-device data
 */
object RealmSecureStorageBte {

    private const val TAG = "RealmSecureStorage"
    private const val SCHEMA_VERSION: Long = 3

    private const val MANUALLY_KEYED_PREF_FILE_NAME = "safepathsbte_enc_prefs"
    private const val MANUALLY_KEYED_KEY_FILE_NAME = "safepathsbte_enc_key"
    private const val MANUALLY_KEYED_KEY_ALIAS = "safepathsbte"
    private const val MANUALLY_KEYED_KEY_INDEX = 2
    private const val MANUALLY_KEYED_PRESHARED_SECRET =
        "" // This will not be used as we do not support < 18
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

    fun insertDiagnosisAsync(positiveDiagnosis: PositiveDiagnosis): ListenableFuture<Void> {
        getRealmInstance().use {
            return CallbackToFutureAdapter.getFuture { completer: CallbackToFutureAdapter.Completer<Void> ->
                it.executeTransactionAsync(
                    { realm -> realm.insert(positiveDiagnosis) },
                    { completer.set(null) },
                    { e -> completer.setException(e) })
            }
        }
    }

    fun markDiagnosisSharedAsync(id: Long, shared: Boolean): ListenableFuture<Void> {
        getRealmInstance().use {
            return CallbackToFutureAdapter.getFuture { completer: CallbackToFutureAdapter.Completer<Void> ->
                it.executeTransactionAsync(
                    { realm ->
                        val diagnosis =
                            realm.where(PositiveDiagnosis::class.java).equalTo("id", id).findFirst()
                        diagnosis?.shared = shared
                    },
                    { completer.set(null) },
                    { e -> completer.setException(e) })
            }
        }
    }

    fun deleteDiagnosisAsync(id: Long): ListenableFuture<Void> {
        getRealmInstance().use {
            return CallbackToFutureAdapter.getFuture { completer: CallbackToFutureAdapter.Completer<Void> ->
                it.executeTransactionAsync(
                    { realm ->
                        val diagnosis =
                            realm.where(PositiveDiagnosis::class.java).equalTo("id", id).findFirst()
                        diagnosis?.deleteFromRealm()
                    },
                    { completer.set(null) },
                    { e -> completer.setException(e) })
            }
        }
    }

    fun getEncryptionKey(): ByteArray {
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

    fun refreshWithExposureWindows(exposureWindows: List<ExposureWindow>): Boolean {
        var somethingAdded = false
        getRealmInstance().use {
            it.executeTransaction { db ->
                // Keep track of the exposures already handled and remove them when we find matching windows.
                val results: RealmResults<ExposureEntity> = db.where(ExposureEntity::class.java).findAll()
                val exposureEntities: MutableList<ExposureEntity> = db.copyFromRealm(results)
                for (exposureWindow in exposureWindows) {
                    var found = false
                    for (i in exposureEntities.indices) {
                        if (exposureEntities[i].dateMillisSinceEpoch == exposureWindow.dateMillisSinceEpoch) {
                            exposureEntities.removeAt(i)
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        // No existing ExposureEntity with the given date, must add an entity for this window.
                        somethingAdded = true
                        db.insert(ExposureEntity
                            .create(exposureWindow.dateMillisSinceEpoch, System.currentTimeMillis()))
                    }
                }
            }
        }
        return somethingAdded
    }

    fun resetExposures() {
        getRealmInstance().use {
            it.executeTransaction { db ->
                db.delete(ExposureEntity::class.java)
                db.where(KeyValues::class.java).equalTo("id", LAST_PROCESSED_FILE_NAME_KEY).findFirst()?.deleteFromRealm()
            }
        }
    }

    @VisibleForTesting
    fun getRealmInstance(): Realm {
        return Realm.getInstance(realmConfig)
    }
}
