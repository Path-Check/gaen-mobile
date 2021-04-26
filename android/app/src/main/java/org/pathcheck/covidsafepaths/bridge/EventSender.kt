package org.pathcheck.covidsafepaths.bridge

import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.google.gson.Gson
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureInformation
import org.pathcheck.covidsafepaths.exposurenotifications.utils.CallbackMessages

object EventSender {
    private const val EN_STATUS_CHANGED_EVENT = "onEnabledStatusUpdated"
    private const val BLUETOOTH_STATUS_CHANGED_EVENT = "onBluetoothStatusUpdated"
    private const val LOCATION_STATUS_CHANGED_EVENT = "onLocationStatusUpdated"
    private const val EN_EXPOSURE_RECORD_UPDATED_CHANGED_EVENT = "onExposureRecordUpdated"

    fun sendExposureNotificationStatusChanged(
        reactContext: ReactContext?,
        enabled: Boolean
    ) {
        var status = CallbackMessages.EN_STATUS_ACTIVE
        if (!enabled) {
            status = CallbackMessages.EN_STATUS_DISABLED
        }
        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(
                EN_STATUS_CHANGED_EVENT,
                status
            )
    }

    fun sendBluetoothStatusChangedEvent(
        reactContext: ReactContext?,
        enabled: Boolean
    ) {
        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(
                BLUETOOTH_STATUS_CHANGED_EVENT,
                enabled
            )
    }

    fun sendLocationStatusChangedEvent(
        reactContext: ReactContext?,
        enabled: Boolean
    ) {
        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(
                LOCATION_STATUS_CHANGED_EVENT,
                enabled
            )
    }

    fun sendExposureRecordUpdatedChangedEvent(
        reactContext: ReactContext?,
        exposures: List<RNExposureInformation>
    ) {
        val exposureJson = Gson().toJson(exposures)

        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(EN_EXPOSURE_RECORD_UPDATED_CHANGED_EVENT, exposureJson)
    }
}