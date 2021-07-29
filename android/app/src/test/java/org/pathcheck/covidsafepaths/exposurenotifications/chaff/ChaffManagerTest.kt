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
import org.amshove.kluent.shouldBeFalse
import org.amshove.kluent.shouldBeTrue
import org.amshove.kluent.shouldHaveSize
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.pathcheck.covidsafepaths.exposurenotifications.dto.RNExposureKey
import org.pathcheck.covidsafepaths.exposurenotifications.utils.TimeProvider
import java.security.SecureRandom
import java.util.concurrent.TimeUnit


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

    private val secureRandomMock: SecureRandom = mockk()

    private val timeProviderMock: TimeProvider = mockk()

    private val chaffManager = ChaffManager.getInstance(context, timeProviderMock, secureRandomMock)

    @BeforeEach
    fun setUp() {
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

        every {
            secureRandomMock.nextDouble()
        }.returns(.04)

        every {
            timeProviderMock.currentTimeInMillis
        }.returns(1627009456526L)

        chaffManager.save(rnExposureKeys)

        every {
            timeProviderMock.currentTimeInMillis
        }.returns(1627009456526L + TimeUnit.HOURS.toMillis(24))

        chaffManager.shouldFire().shouldBeTrue()
    }

    @Test
    fun `Given we save the keys, when 24 hours has not passed and the probability is true, then we should not fire`() {
        val rnExposureKeys = listOf(
            RNExposureKey("This is the key", 1, 2, 3)
        )

        every {
            secureRandomMock.nextDouble()
        }.returns(.05)

        every {
            timeProviderMock.currentTimeInMillis
        }.returns(1627009456526L)

        chaffManager.save(rnExposureKeys)

        every {
            timeProviderMock.currentTimeInMillis
        }.returns(1627009456526L + TimeUnit.HOURS.toMillis(24))

        chaffManager.shouldFire().shouldBeFalse()
    }

    @Test
    fun `Given we save the keys, when 24 hours has passed and the probability is false, then we should not fire`() {
        val rnExposureKeys = listOf(
            RNExposureKey("This is the key", 1, 2, 3)
        )

        every {
            secureRandomMock.nextDouble()
        }.returns(.09)

        every {
            timeProviderMock.currentTimeInMillis
        }.returns(1627009456526L)

        chaffManager.save(rnExposureKeys)

        every {
            timeProviderMock.currentTimeInMillis
        }.returns(1627009456526L + TimeUnit.HOURS.toMillis(24))

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