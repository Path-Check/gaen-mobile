package org.pathcheck.covidsafepaths.helpers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.location.LocationManager
import androidx.core.location.LocationManagerCompat

class LocationHelper(
    private val callback: LocationCallback
) {

    companion object {
        fun isLocationEnabled(context: Context): Boolean {
            val manager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            return LocationManagerCompat.isLocationEnabled(manager)
        }
    }

    private val receiver = object : BroadcastReceiver() {
        var isGpsEnabled: Boolean = false
        var isNetworkEnabled: Boolean = false

        override fun onReceive(context: Context, intent: Intent) {
            intent.action?.let { action ->
                if (action.matches("android.location.PROVIDERS_CHANGED".toRegex())) {
                    val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
                    isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
                    isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)

                    if (isGpsEnabled || isNetworkEnabled) {
                        callback.onLocationAvailable()
                    } else {
                        callback.onLocationUnavailable()
                    }
                }
            }
        }
    }

    fun registerLocationStatusCallback(context: Context) {
        context.registerReceiver(
            receiver,
            IntentFilter("android.location.PROVIDERS_CHANGED")
        )
        // Receiver won't be called when you register
        if (isLocationEnabled(context))
            callback.onLocationAvailable()
        else
            callback.onLocationUnavailable()
    }

    fun unregisterLocationStatusCallback(context: Context) {
        context.unregisterReceiver(receiver)
    }

    interface LocationCallback {
        fun onLocationAvailable()
        fun onLocationUnavailable()
    }
}