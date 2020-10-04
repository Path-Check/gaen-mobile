package org.pathcheck.covidsafepaths.helpers

import android.bluetooth.BluetoothAdapter
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log

class BluetoothHelper(
    private val callback: BluetoothCallback
) {

    companion object {
        fun isBluetoothEnabled(): Boolean {
            val adapter = BluetoothAdapter.getDefaultAdapter()
            if (adapter == null) {
                Log.d("BluetoothHelper", "Device does not have bluetooth hardware")
                return false
            }
            return adapter.isEnabled
        }
    }

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            val action = intent.action
            if (BluetoothAdapter.ACTION_STATE_CHANGED == action) {
                when (intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1)) {
                    BluetoothAdapter.STATE_OFF -> {
                        callback.onBluetoothUnavailable()
                    }
                    BluetoothAdapter.STATE_ON -> {
                        callback.onBluetoothAvailable()
                    }
                }
            }
        }
    }

    fun registerBluetoothStatusCallback(context: Context) {
        context.registerReceiver(
            receiver,
            IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED)
        )
        // Receiver won't be called when you register
        if (isBluetoothEnabled())
            callback.onBluetoothAvailable()
        else
            callback.onBluetoothUnavailable()
    }

    fun unregisterBluetoothStatusCallback(context: Context) {
        context.unregisterReceiver(receiver)
    }

    interface BluetoothCallback {
        fun onBluetoothAvailable()
        fun onBluetoothUnavailable()
    }
}