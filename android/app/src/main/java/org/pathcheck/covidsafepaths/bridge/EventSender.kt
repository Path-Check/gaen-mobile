package org.pathcheck.covidsafepaths.bridge

import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import org.pathcheck.covidsafepaths.exposurenotifications.utils.Util

object EventSender {
    private const val EN_STATUS_CHANGED_EVENT = "onEnabledStatusUpdated"
    private const val BLUETOOTH_STATUS_CHANGED_EVENT = "onBluetoothStatusUpdated"
    private const val LOCATION_STATUS_CHANGED_EVENT = "onLocationStatusUpdated"

    fun sendExposureNotificationStatusChanged(reactContext: ReactContext?, enabled: Boolean) {
        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(EN_STATUS_CHANGED_EVENT, Util.getEnStatusWritableArray(enabled))
    }

    fun sendBluetoothStatusChangedEvent(reactContext: ReactContext?, enabled: Boolean) {
        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(BLUETOOTH_STATUS_CHANGED_EVENT, enabled)
    }

    fun sendLocationStatusChangedEvent(reactContext: ReactContext?, enabled: Boolean) {
        reactContext
            ?.getJSModule(RCTDeviceEventEmitter::class.java)
            ?.emit(LOCATION_STATUS_CHANGED_EVENT, enabled)
    }
}