package com.example.ui

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.AccessEvent
import com.example.data.AppDatabase
import com.example.data.NfcRepository
import com.example.data.NfcTag
import com.example.utils.SoundSynthesizer
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import kotlinx.coroutines.Job

data class CustomFrequencyAlert(
    val id: String = java.util.UUID.randomUUID().toString(),
    val label: String,
    val frequencyMHz: Float,
    val toleranceMHz: Float = 0.5f,
    val triggerVibration: Boolean = true,
    val triggerSound: Boolean = true,
    val triggerNotification: Boolean = true,
    val isEnabled: Boolean = true
)

class NfcViewModel(application: Application) : AndroidViewModel(application) {

    var customFrequencyAlerts by mutableStateOf<List<CustomFrequencyAlert>>(emptyList())
        private set

    fun loadCustomFrequencyAlerts() {
        val serialized = prefs.getString("custom_frequency_alerts_v2", "") ?: ""
        if (serialized.isEmpty()) {
            val defaultAlerts = listOf(
                CustomFrequencyAlert(label = "Fob Alert (LF 125 kHz)", frequencyMHz = 0.125f, toleranceMHz = 0.05f),
                CustomFrequencyAlert(label = "NFC Pulse (HF 13.56 MHz)", frequencyMHz = 13.56f, toleranceMHz = 0.15f),
                CustomFrequencyAlert(label = "Toll Beacon (UHF 915 MHz)", frequencyMHz = 915.0f, toleranceMHz = 10.0f)
            )
            saveCustomFrequencyAlerts(defaultAlerts)
            return
        }
        val list = mutableListOf<CustomFrequencyAlert>()
        try {
            val parts = serialized.split("||")
            for (p in parts) {
                if (p.isBlank()) continue
                val fields = p.split(";;")
                if (fields.size >= 8) {
                    list.add(
                        CustomFrequencyAlert(
                            id = fields[0],
                            label = fields[1],
                            frequencyMHz = fields[2].toFloatOrNull() ?: 13.56f,
                            toleranceMHz = fields[3].toFloatOrNull() ?: 0.5f,
                            triggerVibration = fields[4].toBoolean(),
                            triggerSound = fields[5].toBoolean(),
                            triggerNotification = fields[6].toBoolean(),
                            isEnabled = fields[7].toBoolean()
                        )
                    )
                }
            }
            customFrequencyAlerts = list
        } catch (e: Exception) {
            Log.e("NfcViewModel", "Failed to deserialize alerts: ${e.message}")
        }
    }

    fun saveCustomFrequencyAlerts(list: List<CustomFrequencyAlert>) {
        customFrequencyAlerts = list
        val sb = StringBuilder()
        for (alert in list) {
            sb.append(alert.id).append(";;")
                .append(alert.label).append(";;")
                .append(alert.frequencyMHz).append(";;")
                .append(alert.toleranceMHz).append(";;")
                .append(alert.triggerVibration).append(";;")
                .append(alert.triggerSound).append(";;")
                .append(alert.triggerNotification).append(";;")
                .append(alert.isEnabled).append("||")
        }
        prefs.edit().putString("custom_frequency_alerts_v2", sb.toString()).apply()
    }

    fun addCustomFrequencyAlert(alert: CustomFrequencyAlert) {
        val newList = customFrequencyAlerts.toMutableList()
        newList.add(alert)
        saveCustomFrequencyAlerts(newList)
    }

    fun updateCustomFrequencyAlert(alert: CustomFrequencyAlert) {
        val newList = customFrequencyAlerts.map {
            if (it.id == alert.id) alert else it
        }
        saveCustomFrequencyAlerts(newList)
    }

    fun deleteCustomFrequencyAlert(id: String) {
        val newList = customFrequencyAlerts.filter { it.id != id }
        saveCustomFrequencyAlerts(newList)
    }

    fun triggerHapticFeedback() {
        val vibrator = getApplication<Application>().getSystemService(Context.VIBRATOR_SERVICE) as? android.os.Vibrator
        if (vibrator != null && vibrator.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(android.os.VibrationEffect.createOneShot(150, android.os.VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(150)
            }
        }
    }

    fun triggerMatchingCustomAlerts(carrierFreq: Float) {
        val matches = customFrequencyAlerts.filter { alert ->
            alert.isEnabled && Math.abs(carrierFreq - alert.frequencyMHz) <= alert.toleranceMHz
        }
        for (alert in matches) {
            if (alert.triggerVibration) {
                triggerHapticFeedback()
            }
            if (alert.triggerSound) {
                viewModelScope.launch {
                    try {
                        SoundSynthesizer.playBeep(if (carrierFreq < 1f) 1200 else if (carrierFreq < 100f) 1800 else 2400, 200)
                    } catch (e: Exception) {}
                }
            }
            if (alert.triggerNotification) {
                sendSystemNotification(
                    "🔔 CUSTOM FREQUENCY ALERT",
                    "Rule: \"${alert.label}\" triggered! Detected ${carrierFreq} MHz (Target: ${alert.frequencyMHz} MHz)"
                )
            }
        }
    }

    fun testHapticVibration() {
        triggerHapticFeedback()
    }

    fun testSoundBeep(frequencyHz: Int = 1800) {
        viewModelScope.launch {
            try {
                SoundSynthesizer.playBeep(frequencyHz, 300)
            } catch (e: Exception) {}
        }
    }

    private val repository: NfcRepository
    private val prefs = application.getSharedPreferences("nfc_alert_prefs", Context.MODE_PRIVATE)

    // Notification states
    var isNotificationsEnabled by mutableStateOf(prefs.getBoolean("is_notifications_enabled", true))
        private set

    var selectedNotificationTagId by mutableStateOf(prefs.getString("selected_notification_tag_id", "ANY") ?: "ANY")
        private set

    var customNotificationTitle by mutableStateOf(prefs.getString("custom_notification_title", "Elevator Key Detected!") ?: "Elevator Key Detected!")
        private set

    var customNotificationContent by mutableStateOf(prefs.getString("custom_notification_content", "Key {name} has verified entry in the system.") ?: "Key {name} has verified entry in the system.")
        private set

    companion object {
        private const val CHANNEL_ID = "nfc_alerts_channel"
        private const val CHANNEL_NAME = "NFC Key Detection Alerts"
    }

    init {
        val database = AppDatabase.getDatabase(application)
        repository = NfcRepository(database.nfcDao())
        createNotificationChannel()
        loadCustomFrequencyAlerts()

        // Link HCE transceiver logs directly into our compose visual ledger
        com.example.service.ElevatorKeyApduService.onApduLogged = { msg ->
            viewModelScope.launch {
                logHceApdu(msg)
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Triggered when configured NFC tags are scanned or emulated"
            }
            val manager = getApplication<Application>().getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    fun sendSystemNotification(title: String, message: String) {
        val context = getApplication<Application>()
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val intent = Intent(context, com.example.MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }
        val pendingIntent = PendingIntent.getActivity(context, 1001, intent, flags)

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        try {
            manager.notify(1002, builder.build())
        } catch (e: Exception) {
            Log.e("NfcViewModel", "Failed to dispatch system notification: ${e.message}")
        }
    }

    fun updateNotificationsEnabled(enabled: Boolean) {
        isNotificationsEnabled = enabled
        prefs.edit().putBoolean("is_notifications_enabled", enabled).apply()
    }

    fun updateSelectedNotificationTagId(tagId: String) {
        selectedNotificationTagId = tagId
        prefs.edit().putString("selected_notification_tag_id", tagId).apply()
    }

    fun updateCustomNotificationTitle(title: String) {
        customNotificationTitle = title
        prefs.edit().putString("custom_notification_title", title).apply()
    }

    fun updateCustomNotificationContent(content: String) {
        customNotificationContent = content
        prefs.edit().putString("custom_notification_content", content).apply()
    }

    // Exposed Flows from Room persistence
    val allTags: StateFlow<List<NfcTag>> = repository.allTagsFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val allEvents: StateFlow<List<AccessEvent>> = repository.allEventsFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // Current app configuration states
    var soundFrequency by mutableStateOf(1200) // Pitch factor frequency in Hz (800 - 2000)
    var encryptionSector by mutableStateOf(1)  // Sec key block index (0 to 15)
    var alertSeverity by mutableStateOf("SUCCESS") // SUCCESS, WARNING, CRITICAL, INFO
    var customAlertMessage by mutableStateOf("🛗 Elevator Key Scanned & Authorized!")
    
    // Simulator control forms
    var inputTagId by mutableStateOf("E4:8B:2A:7D")
    var inputTagName by mutableStateOf("Main Elevator Key Fob")
    var inputTagPayload by mutableStateOf("Card Type: MIFARE Classic 1K - Auth ID: 0x88F11A")

    // Active alert trigger overlay state
    var activeTriggeredAlert by mutableStateOf<AccessEvent?>(null)
        private set

    // NFC Status
    var isWritingMode by mutableStateOf(false)
    var isScanningModeActive by mutableStateOf(true)

    // Animated NFC Progress Scanning states
    var isProgressScanningActive by mutableStateOf(false)
    var scanProgressPercent by mutableStateOf(0f)
    var isScannerReadyState by mutableStateOf(true)
    var isScanFinishedSuccessfully by mutableStateOf(false)

    // Proximity & Real-time tag technology scanning state variables
    var lastScannedTagId by mutableStateOf("")
    var lastScannedTagType by mutableStateOf("")
    var lastScannedPayload by mutableStateOf("")
    var tagProximityConnected by mutableStateOf(false)
    var proximityDistanceCm by mutableStateOf(10.0f) // 10.0cm representing far/disconnected

    // Custom Scanned Toast Overlay Notification States
    var showScanToast by mutableStateOf(false)
    var scanToastTagId by mutableStateOf("")
    var scanToastTagName by mutableStateOf("")
    var scanToastTagType by mutableStateOf("")
    var scanToastPayload by mutableStateOf("")

    fun dismissScanToast() {
        showScanToast = false
    }

    // Frequency Monitoring and Unauthorized Alert levels
    var detectedFrequencyMHz by mutableStateOf(13.56f) // Initial baseline frequency in MHz (e.g. typical NFC is 13.56)
    var authorizedFrequencyMHz by mutableStateOf(13.56f) // Target authorized frequency
    var allowedFrequencyOffsetMHz by mutableStateOf(0.15f) // Authorized threshold offset (e.g. 0.15 MHz range)
    var isFrequencyAlertTriggered by mutableStateOf(false)
    var isFrequencyMonitoringActive by mutableStateOf(true)
    var signalSNRdB by mutableStateOf(24.5f) // Signal to Noise ratio
    var signalStrengthdBm by mutableStateOf(-48) // Signal strength in dBm
    var autoBlockUnauthorizedFrequencies by mutableStateOf(false)

    // Frequency Alarm System Configuration
    var isAlarmSoundEnabled by mutableStateOf(prefs.getBoolean("is_alarm_sound_enabled", true))
        private set
    var isVisualAlarmEnabled by mutableStateOf(prefs.getBoolean("is_visual_alarm_enabled", true))
        private set
    var alarmToneType by mutableStateOf(prefs.getString("alarm_tone_type", "SIREN_PULSE") ?: "SIREN_PULSE")
        private set
    var alarmPitchConfigHz by mutableStateOf(prefs.getInt("alarm_pitch_hz", 2200))
        private set
    var isAlarmCurrentlyRinging by mutableStateOf(false)

    private var alarmJob: Job? = null

    fun updateAlarmSoundEnabled(enabled: Boolean) {
        isAlarmSoundEnabled = enabled
        prefs.edit().putBoolean("is_alarm_sound_enabled", enabled).apply()
    }

    fun updateVisualAlarmEnabled(enabled: Boolean) {
        isVisualAlarmEnabled = enabled
        prefs.edit().putBoolean("is_visual_alarm_enabled", enabled).apply()
    }

    fun updateAlarmToneType(type: String) {
        alarmToneType = type
        prefs.edit().putString("alarm_tone_type", type).apply()
    }

    fun updateAlarmPitch(pitchHz: Float) {
        val hz = pitchHz.toInt()
        alarmPitchConfigHz = hz
        prefs.edit().putInt("alarm_pitch_hz", hz).apply()
    }

    fun silenceAlarm() {
        isAlarmCurrentlyRinging = false
        alarmJob?.cancel()
        alarmJob = null
    }

    fun triggerAlarmRinging() {
        if (!isFrequencyMonitoringActive) return
        if (isAlarmCurrentlyRinging) return
        
        isAlarmCurrentlyRinging = true
        
        alarmJob?.cancel()
        alarmJob = viewModelScope.launch {
            while (isAlarmCurrentlyRinging && isFrequencyMonitoringActive) {
                if (isAlarmSoundEnabled) {
                    try {
                        when (alarmToneType) {
                            "FAST_BEEP" -> {
                                SoundSynthesizer.playBeep(alarmPitchConfigHz, 120)
                                delay(120)
                            }
                            "SIREN_PULSE" -> {
                                SoundSynthesizer.playBeep(alarmPitchConfigHz - 300, 180)
                                delay(50)
                                SoundSynthesizer.playBeep(alarmPitchConfigHz + 300, 180)
                                delay(50)
                            }
                            "STEADY_TONE" -> {
                                SoundSynthesizer.playBeep(alarmPitchConfigHz, 400)
                                delay(50)
                            }
                        }
                    } catch (e: Exception) {
                        delay(200)
                    }
                } else {
                    delay(400)
                }
                
                // Live check if condition resolved
                val deviation = Math.abs(detectedFrequencyMHz - authorizedFrequencyMHz)
                val triggeredFreqAlert = deviation > allowedFrequencyOffsetMHz
                val triggeredRangeViolation = isRangeGuardActive && (detectedFrequencyMHz < rangeGuardMinMHz || detectedFrequencyMHz > rangeGuardMaxMHz)
                
                if (!triggeredFreqAlert && !triggeredRangeViolation) {
                    silenceAlarm()
                }
            }
        }
    }

    // Location-Based Range Guard and Boundary verification config
    var isRangeGuardActive by mutableStateOf(prefs.getBoolean("is_range_guard_active", true))
        private set
    var rangeGuardMinMHz by mutableStateOf(prefs.getFloat("range_guard_min_mhz", 13.00f))
        private set
    var rangeGuardMaxMHz by mutableStateOf(prefs.getFloat("range_guard_max_mhz", 14.10f))
        private set
    var isRangeGuardViolated by mutableStateOf(false)

    fun updateRangeGuardActive(active: Boolean) {
        isRangeGuardActive = active
        prefs.edit().putBoolean("is_range_guard_active", active).apply()
        checkRangeGuardViolation()
    }

    fun setRangeGuardBounds(min: Float, max: Float) {
        val finalMin = Math.round(min * 100f) / 100f
        val finalMax = Math.round(max * 100f) / 100f
        rangeGuardMinMHz = finalMin
        rangeGuardMaxMHz = finalMax
        prefs.edit().putFloat("range_guard_min_mhz", finalMin).apply()
        prefs.edit().putFloat("range_guard_max_mhz", finalMax).apply()
        checkRangeGuardViolation()
    }

    fun checkRangeGuardViolation() {
        if (!isRangeGuardActive) {
            isRangeGuardViolated = false
            return
        }
        val freq = detectedFrequencyMHz
        val violated = (freq < rangeGuardMinMHz || freq > rangeGuardMaxMHz)
        isRangeGuardViolated = violated
        if (violated) {
            triggerAlarmRinging()
        }
    }

    fun setAuthorizedFrequency(frequency: Float) {
        authorizedFrequencyMHz = Math.round(frequency * 100f) / 100f
        checkFrequencyAlert()
    }

    fun setFrequencyOffset(offset: Float) {
        allowedFrequencyOffsetMHz = Math.round(offset * 100f) / 100f
        checkFrequencyAlert()
    }

    fun detectNewSignalFrequency(frequency: Float) {
        detectedFrequencyMHz = Math.round(frequency * 100f) / 100f
        checkFrequencyAlert()
        checkRangeGuardViolation()
    }

    fun toggleFrequencyMonitoring() {
        isFrequencyMonitoringActive = !isFrequencyMonitoringActive
        if (!isFrequencyMonitoringActive) {
            isFrequencyAlertTriggered = false
            silenceAlarm()
        } else {
            checkFrequencyAlert()
        }
    }

    // Secure PIN Entry properties
    var securePin by mutableStateOf("1234")
    var isHistoryUnlocked by mutableStateOf(false)

    var pinDialogVisible by mutableStateOf(false)
    var pinDialogTitle by mutableStateOf("Security Handshake Required")
    var pinDialogSubtext by mutableStateOf("Please provide your 4-digit master access PIN.")
    var pinDialogErrorMsg by mutableStateOf("")
    var enteredPinBuffer by mutableStateOf("")
    private var onPinSuccessCallback: (() -> Unit)? = null

    fun requestPinRelease(title: String, subtext: String = "Please provide your 4-digit master access PIN.", onSuccess: () -> Unit) {
        enteredPinBuffer = ""
        pinDialogErrorMsg = ""
        pinDialogTitle = title
        pinDialogSubtext = subtext
        onPinSuccessCallback = onSuccess
        pinDialogVisible = true
    }

    fun submitPin(pin: String): Boolean {
        if (pin == securePin) {
            pinDialogVisible = false
            enteredPinBuffer = ""
            pinDialogErrorMsg = ""
            onPinSuccessCallback?.invoke()
            onPinSuccessCallback = null
            return true
        } else {
            pinDialogErrorMsg = "HANDSHAKE FAILED: Invalid 4-Digit credential PIN Code."
            enteredPinBuffer = ""
            try {
                viewModelScope.launch {
                    SoundSynthesizer.playBeep(220, 200)
                }
            } catch (e: Exception) { /* Ignore */ }
            return false
        }
    }

    fun checkFrequencyAlert() {
        if (!isFrequencyMonitoringActive) return
        val deviation = Math.abs(detectedFrequencyMHz - authorizedFrequencyMHz)
        val triggered = deviation > allowedFrequencyOffsetMHz
        isFrequencyAlertTriggered = triggered
        
        triggerMatchingCustomAlerts(detectedFrequencyMHz)

        if (triggered) {
            // Trigger customized system push notification if warning is enabled
            if (isNotificationsEnabled) {
                sendSystemNotification(
                    "⚠️ UNAUTHORIZED NFC SIGNAL",
                    "Detected $detectedFrequencyMHz MHz band signal. Safety Limit: ±$allowedFrequencyOffsetMHz MHz deviation."
                )
            }
            triggerAlarmRinging()
        }
    }

    fun onTagScannedWithFrequency(id: String, payload: String, typeName: String, carrierFreq: Float, tagType: String = "NfcA/NDEF", isSimulated: Boolean = false) {
        detectNewSignalFrequency(carrierFreq)
        val deviation = Math.abs(carrierFreq - authorizedFrequencyMHz)
        val isUnauthorized = deviation > allowedFrequencyOffsetMHz
        
        if (isUnauthorized && autoBlockUnauthorizedFrequencies) {
            viewModelScope.launch {
                val event = AccessEvent(
                    tagId = id,
                    tagName = typeName.ifBlank { "Unknown Tag" },
                    textPayload = "BLOCKED: Captured $carrierFreq MHz signal outside threshold. Block details: Payload = $payload",
                    eventType = "BLOCK_FREQ_ALERT",
                    alertToneFreqHz = 2400,
                    alertTriggeredText = "🚨 SECURE COIL SHIELDED: Auto-blocked unauthorized $carrierFreq MHz signal!"
                )
                repository.logAccessEvent(event)
                activeTriggeredAlert = event
                try {
                    SoundSynthesizer.playBeep(2400, 300)
                } catch (e: Exception) {}
            }
            return
        }

        // Standard scan
        onTagScanned(id, payload, typeName, tagType, isSimulated)
    }

    fun startProgressScan(onComplete: () -> Unit) {
        if (isProgressScanningActive) return
        isProgressScanningActive = true
        isScannerReadyState = false
        isScanFinishedSuccessfully = false
        scanProgressPercent = 0f
        proximityDistanceCm = 10.0f
        tagProximityConnected = false
        
        viewModelScope.launch {
            val steps = 20
            for (step in 1..steps) {
                if (!isProgressScanningActive) break
                delay(120) // total standard time 2400 ms calibration/sweep run
                val progress = step.toFloat() / steps.toFloat()
                scanProgressPercent = progress
                
                // Animate distance down to 0.1 cm representing tag proximity coupling
                proximityDistanceCm = 10.0f - (9.9f * progress)
                tagProximityConnected = proximityDistanceCm < 2.0f
                
                // Audio feedback beep at progressive frequencies representing antenna resonance matching
                try {
                    SoundSynthesizer.playBeep(soundFrequency + (step * 35), 45)
                } catch (e: Exception) {
                    // Ignore sound error
                }
            }
            if (isProgressScanningActive) {
                isScanFinishedSuccessfully = true
                isProgressScanningActive = false
                isScannerReadyState = true
                proximityDistanceCm = 0.1f
                tagProximityConnected = true
                onComplete()
            }
        }
    }

    fun stopProgressScan() {
        isProgressScanningActive = false
        isScannerReadyState = true
        scanProgressPercent = 0f
        proximityDistanceCm = 10.0f
        tagProximityConnected = false
    }

    // HCE Emulation States
    var isEmulating by mutableStateOf(false)
    var emulatedTagId by mutableStateOf("E4:8B:2A:7D")
    var emulatedTagName by mutableStateOf("Main Elevator Key Fob")
    var emulatedPayload by mutableStateOf("Card Type: MIFARE Classic 1K - Auth ID: 0x88F11A")
    var transmitPower by mutableStateOf(90f) // 10% to 100%
    var hceStandard by mutableStateOf("ISO-DEP (ISO 14443-4)")

    // Real-time HCE transceiver interactions log state
    var hceApduLog by mutableStateOf("Standby: Ready to transmit...")

    fun logHceApdu(msg: String) {
        val timestamp = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
        val loggedLine = "[$timestamp] $msg\n"
        hceApduLog = if (hceApduLog.startsWith("Standby") || hceApduLog.isBlank()) loggedLine else hceApduLog + loggedLine
        
        // Keep logs bounded to last 15 lines so UI layout stays pristine
        val lines = hceApduLog.split("\n")
        if (lines.size > 15) {
            hceApduLog = lines.takeLast(15).joinToString("\n")
        }
    }

    fun toggleEmulation() {
        isEmulating = !isEmulating
        
        // Synchronize with HCE core platform service
        com.example.service.ElevatorKeyApduService.isEmulationActive = isEmulating
        com.example.service.ElevatorKeyApduService.emulatedUid = emulatedTagId
        com.example.service.ElevatorKeyApduService.emulatedName = emulatedTagName
        com.example.service.ElevatorKeyApduService.emulatedPayload = emulatedPayload

        if (isEmulating) {
            isScanningModeActive = false
            hceApduLog = "Broadcasting initialized. Standby for reader coupling...\n"
            // Log access event for the active emulation broadcast initiation
            viewModelScope.launch {
                val event = AccessEvent(
                    tagId = emulatedTagId,
                    tagName = emulatedTagName,
                    textPayload = emulatedPayload,
                    eventType = "EMULATION_ACTIVE",
                    alertToneFreqHz = soundFrequency + 200,
                    alertTriggeredText = "📡 HCE Emulation Active: Broadcasting Key ID $emulatedTagId"
                )
                repository.logAccessEvent(event)
                try {
                    SoundSynthesizer.playBeep(soundFrequency + 200, 150)
                    SoundSynthesizer.playBeep(soundFrequency + 400, 200)
                } catch (e: Exception) {
                    // Ignore sound error
                }
            }
        } else {
            isScanningModeActive = true
            hceApduLog = "Standby: Ready to transmit..."
            viewModelScope.launch {
                val event = AccessEvent(
                    tagId = emulatedTagId,
                    tagName = emulatedTagName,
                    textPayload = emulatedPayload,
                    eventType = "EMULATION_INACTIVE",
                    alertToneFreqHz = soundFrequency - 100,
                    alertTriggeredText = "💤 HCE Emulation Deactivated"
                )
                repository.logAccessEvent(event)
                try {
                    SoundSynthesizer.playBeep(soundFrequency - 100, 150)
                } catch (e: Exception) {
                    // Ignore sound error
                }
            }
        }
    }

    // Adjust frequencies and sectors Up/Down helper routines
    fun adjustFrequencyUp() {
        if (soundFrequency < 3000) {
            soundFrequency += 120 // Up by approx standard pitch step
        }
    }

    fun adjustFrequencyDown() {
        if (soundFrequency > 200) {
            soundFrequency -= 120 // Down
        }
    }

    fun adjustSectorUp() {
        if (encryptionSector < 15) {
            encryptionSector += 1
        }
    }

    fun adjustSectorDown() {
        if (encryptionSector > 0) {
            encryptionSector -= 1
        }
    }

    /**
     * Executes the reading or writing trigger of a tag.
     * Logs the event securely to the SQLite Database.
     * Synthesizes audio alarm with the custom soundFrequency.
     */
    fun onTagScanned(id: String, payload: String, typeName: String, tagType: String = "NfcA/NDEF", isSimulated: Boolean = false) {
        viewModelScope.launch {
            // Update live scanned tag parameters to trigger proximity-based scanner UI details reactive updates
            lastScannedTagId = id
            lastScannedTagType = tagType
            lastScannedPayload = payload
            tagProximityConnected = true
            proximityDistanceCm = 0.1f // fully coupled

            // Check if there is an existing saved tag to preserve or look up its name
            val existingTag = repository.getTagById(id)
            val finalName = if (existingTag != null) {
                existingTag.name
            } else {
                typeName.ifBlank { "Unlabeled Tag" }
            }

            // Save/Update the scanned Tag in Room for future cloning or reference
            val nfcTag = NfcTag(
                tagId = id,
                name = finalName,
                textPayload = payload,
                encryptionKey = encryptionSector,
                tagType = tagType
            )
            repository.insertTag(nfcTag)

            // Compose the unique access event log
            val event = AccessEvent(
                tagId = id,
                tagName = nfcTag.name,
                textPayload = payload,
                eventType = if (isSimulated) "SCAN_SIMULATED" else "SCAN_PHYSICAL",
                alertToneFreqHz = soundFrequency,
                alertTriggeredText = customAlertMessage.ifBlank { "NFC Tag Registered" }
            )

            // Persist access log event
            repository.logAccessEvent(event)

            // Trigger active overlay alert
            activeTriggeredAlert = event

            // Display Android short Toast Notification with tag details
            try {
                Toast.makeText(
                    getApplication(),
                    "NFC Tag Discovered!\nName: ${nfcTag.name}\nUID: $id",
                    Toast.LENGTH_SHORT
                ).show()
            } catch (e: Exception) {
                // Fallback
            }

            // Trigger Compose success toast popup overlay
            scanToastTagId = id
            scanToastTagName = nfcTag.name
            scanToastTagType = tagType
            scanToastPayload = payload
            showScanToast = true

            // Automatically dismiss floating toast after 3500ms
            viewModelScope.launch {
                delay(3500)
                if (scanToastTagId == id) {
                    showScanToast = false
                }
            }

            // Trigger customized system push notification if matching configuration
            if (isNotificationsEnabled) {
                if (selectedNotificationTagId == "ANY" || selectedNotificationTagId == id) {
                    val formattedContent = customNotificationContent
                        .replace("{name}", nfcTag.name)
                        .replace("{id}", id)
                        .replace("{payload}", payload)
                    sendSystemNotification(customNotificationTitle, formattedContent)
                }
            }

            // Synthesize audio feedback safely using the customizable frequency pitch
            try {
                // If critical, play high dual chirp tone. Otherwise, simple pitch-adjustable chime
                if (alertSeverity == "CRITICAL") {
                    SoundSynthesizer.playBeep(soundFrequency, 180)
                    SoundSynthesizer.playBeep(soundFrequency + 200, 250)
                } else {
                    SoundSynthesizer.playBeep(soundFrequency, 300)
                }
            } catch (e: Exception) {
                Log.e("NfcViewModel", "Audio synthesizer beep failed: ${e.message}")
            }
        }
    }

    fun onTagWrittenSimulated(id: String, payload: String, deviceLabel: String) {
        viewModelScope.launch {
            val event = AccessEvent(
                tagId = id,
                tagName = deviceLabel,
                textPayload = payload,
                eventType = "CLONED_WRITE",
                alertToneFreqHz = soundFrequency + 400, // custom signal shift
                alertTriggeredText = "📝 Cloned Payload to tag sector $encryptionSector successfully"
            )
            repository.logAccessEvent(event)
            activeTriggeredAlert = event
            try {
                SoundSynthesizer.playBeep(soundFrequency + 400, 150)
                SoundSynthesizer.playBeep(soundFrequency + 600, 150)
            } catch (e: Exception) {
                // Ignore audio error
            }
        }
    }

    fun clearAlert() {
        activeTriggeredAlert = null
    }

    fun clearLogHistory() {
        viewModelScope.launch {
            repository.clearLogHistory()
        }
    }

    fun updateTagNickname(tagId: String, nickname: String) {
        viewModelScope.launch {
            repository.updateNickname(tagId, nickname)
        }
    }

    fun updateEventNickname(id: Int, nickname: String) {
        viewModelScope.launch {
            repository.updateEventNicknameById(id, nickname)
        }
    }

    fun exportHistoryToCsv(): String {
        val events = allEvents.value
        val sb = StringBuilder()
        // Headers consistent with DatabaseEntities properties
        sb.append("Event ID,RFID Tag Identifier (UID),Custom Tag Name,Decrypted Sector Payload,System Event Type,Signal Tone Pitch Freq (Hz),Triggered Alert Message,Human Readable Timestamp\n")
        
        val sdf = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
        
        for (event in events) {
            val id = event.id
            val tagId = escapeCsvField(event.tagId)
            val tagName = escapeCsvField(event.tagName)
            val payload = escapeCsvField(event.textPayload)
            val eventType = escapeCsvField(event.eventType)
            val freq = event.alertToneFreqHz
            val alertText = escapeCsvField(event.alertTriggeredText)
            val dateStr = sdf.format(java.util.Date(event.timestamp))
            
            sb.append("$id,$tagId,$tagName,$payload,$eventType,$freq,$alertText,$dateStr\n")
        }
        return sb.toString()
    }

    private fun escapeCsvField(field: String): String {
        if (field.contains(",") || field.contains("\"") || field.contains("\n") || field.contains("\r")) {
            val escaped = field.replace("\"", "\"\"")
            return "\"$escaped\""
        }
        return field
    }

    fun deleteSavedTag(tagId: String) {
        viewModelScope.launch {
            repository.deleteTag(tagId)
        }
    }

    fun applyPresetToInputs(id: String, name: String, payload: String, sector: Int, frequency: Int) {
        inputTagId = id
        inputTagName = name
        inputTagPayload = payload
        encryptionSector = sector
        soundFrequency = frequency
        
        emulatedTagId = id
        emulatedTagName = name
        emulatedPayload = payload

        // Synchronize with active HCE core service
        com.example.service.ElevatorKeyApduService.emulatedUid = id
        com.example.service.ElevatorKeyApduService.emulatedName = name
        com.example.service.ElevatorKeyApduService.emulatedPayload = payload
        
        viewModelScope.launch {
            try {
                SoundSynthesizer.playBeep(frequency, 120)
                delay(60)
                SoundSynthesizer.playBeep(frequency + 200, 150)
            } catch (e: Exception) {
                // Ignore beep error
            }
        }
    }

    fun selectTagForEmulation(id: String, name: String, payload: String) {
        emulatedTagId = id
        emulatedTagName = name
        emulatedPayload = payload

        // Synchronize with active HCE core service
        com.example.service.ElevatorKeyApduService.emulatedUid = id
        com.example.service.ElevatorKeyApduService.emulatedName = name
        com.example.service.ElevatorKeyApduService.emulatedPayload = payload
    }

    fun importPresetToInventory(id: String, name: String, payload: String, sector: Int) {
        viewModelScope.launch {
            val tag = NfcTag(
                tagId = id,
                name = name,
                textPayload = payload,
                encryptionKey = sector
            )
            repository.insertTag(tag)
            
            val event = AccessEvent(
                tagId = id,
                tagName = name,
                textPayload = payload,
                eventType = "PRESET_IMPORTED",
                alertToneFreqHz = soundFrequency,
                alertTriggeredText = "📥 Imported Preset Key: $name"
            )
            repository.logAccessEvent(event)
            activeTriggeredAlert = event
            
            try {
                SoundSynthesizer.playBeep(soundFrequency + 300, 200)
            } catch (e: Exception) {
                // Ignore
            }
        }
    }

    class Factory(private val application: Application) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            if (modelClass.isAssignableFrom(NfcViewModel::class.java)) {
                return NfcViewModel(application) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
