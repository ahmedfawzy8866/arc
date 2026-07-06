package com.example

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.ui.NfcViewModel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assert.assertFalse
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Elevator Key NFC", appName)
  }

  @Test
  fun testFrequencyAlarmTriggeringAndMuting() {
    val app = ApplicationProvider.getApplicationContext<Application>()
    val viewModel = NfcViewModel(app)
    
    // Set standard baseline
    viewModel.setAuthorizedFrequency(13.56f)
    viewModel.setFrequencyOffset(0.15f)
    
    // De-activate alarm sound to prevent AudioTrack errors during testing
    viewModel.updateAlarmSoundEnabled(false)
    
    // Initially alarm should not be ringing
    assertFalse(viewModel.isAlarmCurrentlyRinging)
    
    // Trigger unauthorized frequency (14.50 MHz is way outside 13.56 +- 0.15)
    viewModel.detectNewSignalFrequency(14.50f)
    
    // Since 14.50 is outside, alarm should trigger
    assertTrue(viewModel.isAlarmCurrentlyRinging)
    
    // User silences alarm
    viewModel.silenceAlarm()
    assertFalse(viewModel.isAlarmCurrentlyRinging)
  }

  @Test
  fun testSelectTagForEmulation() {
    val app = ApplicationProvider.getApplicationContext<Application>()
    val viewModel = NfcViewModel(app)
    
    // Select custom tag parameters
    viewModel.selectTagForEmulation(
      id = "AB:CD:12:34",
      name = "West Wing Gate Key",
      payload = "Format: NDEF Text Payload"
    )
    
    // Check if the emulation states are updated correctly
    assertEquals("AB:CD:12:34", viewModel.emulatedTagId)
    assertEquals("West Wing Gate Key", viewModel.emulatedTagName)
    assertEquals("Format: NDEF Text Payload", viewModel.emulatedPayload)
    
    // Check synchronized values in APDU Service
    assertEquals("AB:CD:12:34", com.example.service.ElevatorKeyApduService.emulatedUid)
    assertEquals("West Wing Gate Key", com.example.service.ElevatorKeyApduService.emulatedName)
    assertEquals("Format: NDEF Text Payload", com.example.service.ElevatorKeyApduService.emulatedPayload)
  }
}
