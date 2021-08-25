package org.pathcheck.covidsafepaths.exposurenotifications.nearby

import android.content.Context
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.core.Observable
import io.reactivex.rxjava3.disposables.CompositeDisposable
import io.reactivex.rxjava3.schedulers.Schedulers
import java.lang.ref.WeakReference
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationClientWrapper
import org.pathcheck.covidsafepaths.exposurenotifications.common.NotificationHelper
import org.pathcheck.covidsafepaths.exposurenotifications.network.DiagnosisKeys
import org.pathcheck.covidsafepaths.exposurenotifications.network.KeyFileBatch
import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences
import org.threeten.bp.Instant

class ProvideDiagnosisKeyService private constructor(context: Context) {
    private val diagnosisKeys = DiagnosisKeys(context)
    private val submitter = DiagnosisKeyFileSubmitter(context)
    private val disposables = CompositeDisposable()
    private val wrapper = ExposureNotificationClientWrapper.get(context)
    private val prefs = ExposureNotificationSharedPreferences(context)

    private val weakContext = WeakReference(context)

    private var listener: DownloadDiagnosisKeyListener? = null

    companion object {
        private var provideDiagnosisKeyService: ProvideDiagnosisKeyService? = null

        @JvmStatic
        fun getInstance(context: Context): ProvideDiagnosisKeyService {
            if (provideDiagnosisKeyService == null) {
                provideDiagnosisKeyService = ProvideDiagnosisKeyService(context)
            }

            return provideDiagnosisKeyService!!
        }
    }

    interface DownloadDiagnosisKeyListener {
        fun onSuccess()
        fun onError()
    }

    fun downloadKeys(listener: DownloadDiagnosisKeyListener) {
        this.listener = listener

        Observable.fromCallable {
            wrapper.isEnabled
        }
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .flatMap {
                if (it.result) {
                    sendNotification()
                    getDiagnosisKeys()
                } else {
                    Observable.error(NotEnabledException())
                }
            }
            .flatMap { list ->
                if (list.isEmpty()) {
                    Observable.just(list)
                } else {
                    Observable.fromFuture(submitter.submitFiles(list))
                }
            }
            .subscribe(::onSuccess, ::onError)
            .also { disposable ->
                disposables.add(disposable)
            }
    }

    fun cleanUp() {
        disposables.clear()
    }

    private fun getDiagnosisKeys(): Observable<List<KeyFileBatch>> {
        return diagnosisKeys.downloadBatchFiles().map {
            it.toList()
        }
    }

    // ToDo Make sure the notification displays
    private fun sendNotification() {
        Observable.fromCallable {
            weakContext.get()?.run weakContext@{
                NotificationHelper.triggerCheckingNotification(this@weakContext)
            }
        }
            .subscribeOn(AndroidSchedulers.mainThread())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe()
            .also { disposable ->
                disposables.add(disposable)
            }
    }

    private fun onSuccess(any: Any?) {
        prefs.lastDetectionProcessDate = Instant.now().toEpochMilli()
        listener?.onSuccess()
    }

    private fun onError(throwable: Throwable) {
        if (throwable is NotEnabledException) {
            listener?.onSuccess()
        } else {
            listener?.onError()
        }
    }
}

class NotEnabledException : Throwable()