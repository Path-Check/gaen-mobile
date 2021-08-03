package org.pathcheck.covidsafepaths.exposurenotifications.chaff

import android.content.Context
import android.content.SharedPreferences
import android.os.SystemClock
import android.util.Log
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkStatic
import io.mockk.slot
import io.mockk.unmockkStatic
import java.security.SecureRandom
import java.util.concurrent.TimeUnit
import org.amshove.kluent.shouldBeFalse
import org.amshove.kluent.shouldBeTrue
import org.amshove.kluent.shouldHaveSize
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureKey
import org.pathcheck.covidsafepaths.exposurenotifications.utils.TimeProvider

internal class ChaffManagerTest {

    private val requestFiredSlot = slot<Long>()
    private val chaffJsonSlot = slot<String>()

    private val sharedPreferences: SharedPreferences = mockk {
        every {
            edit().putLong("requestFired", capture(requestFiredSlot)).apply()
        }.answers {
            // no-op
        }

        every {
            edit().putString("chaffJson", capture(chaffJsonSlot)).apply()
        } answers {
            // no-op
        }

        every {
            getString("chaffJson", "")
        }.answers {
            chaffJsonSlot.captured
        }

        every {
            getLong("requestFired", 0L)
        }.answers {
            requestFiredSlot.captured
        }
    }
    private val context: Context = mockk {
        every {
            getSharedPreferences("ChaffManagerSharedPref", Context.MODE_PRIVATE)
        }.returns(sharedPreferences)
    }

    private var mockDouble = 0.0
    private val secureRandomMock: SecureRandom = mockk {
        every {
            nextDouble()
        }.answers {
            mockDouble
        }
    }

    private var mockTime = 1627009456526L
    private val timeProviderMock: TimeProvider = mockk {
        every {
            currentTimeInMillis
        }.answers {
            mockTime
        }
    }

    private lateinit var chaffManager: ChaffManager

    @BeforeEach
    fun setUp() {
        chaffManager = ChaffManager.createChaffManager(context, timeProviderMock, secureRandomMock)

        mockkStatic(Log::class)
        mockkStatic(SystemClock::class)

        every {
            SystemClock.uptimeMillis()
        }.returns(0L)

        every {
            Log.d(any(), any())
        }.returns(0)
    }

    @AfterEach
    fun tearDown() {
        unmockkStatic(Log::class)
        unmockkStatic(SystemClock::class)

        requestFiredSlot.clear()
        chaffJsonSlot.clear()
    }

    @Test
    fun `Given we save the keys, when 24 hours has passed and the probability is true, then we should fire`() {
        val rnExposureKeys = listOf(
            RNExposureKey("This is the key", 1, 2, 3)
        )

        mockDouble = .04

        chaffManager.save(rnExposureKeys)

        mockTime += TimeUnit.HOURS.toMillis(24)

        chaffManager.shouldFire().shouldBeTrue()
    }

    @Test
    fun `Given we save the keys, when 24 hours has not passed and the probability is true, then we should not fire`() {
        val rnExposureKeys = listOf(
            RNExposureKey("This is the key", 1, 2, 3)
        )

        mockDouble = .05

        chaffManager.save(rnExposureKeys)

        mockTime += TimeUnit.HOURS.toMillis(20)

        chaffManager.shouldFire().shouldBeFalse()
    }

    @Test
    fun `Given we save the keys, when 24 hours has passed and the probability is false, then we should not fire`() {
        val rnExposureKeys = listOf(
            RNExposureKey("This is the key", 1, 2, 3)
        )

        mockDouble = .09

        chaffManager.save(rnExposureKeys)

        mockTime += TimeUnit.HOURS.toMillis(24)

        chaffManager.shouldFire().shouldBeFalse()
    }

    @Test
    fun `Given we have a list of RNExposureKeys, when we save, then get the saved keys they are parsed correctly`() {
        val rnExposureKeys = listOf(
            RNExposureKey("This is the key", 1, 2, 3)
        )
        chaffManager.save(rnExposureKeys)
        chaffManager.getSavedRNExposureKeys().run {
            this!!.shouldHaveSize(1)
            this[0].key = "This is the key"
        }
    }
}