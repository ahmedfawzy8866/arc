package com.example.ui

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.foundation.Canvas
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.AccessEvent
import com.example.data.NfcTag
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NfcMainScreen(
    viewModel: NfcViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val savedTags by viewModel.allTags.collectAsStateWithLifecycle()
    val accessHistory by viewModel.allEvents.collectAsStateWithLifecycle()
    val activeAlarm = viewModel.activeTriggeredAlert

    // Date formatter
    val sdf = remember { SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault()) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(DeepSwampDark, MuddyBase)
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(horizontal = 16.dp)
        ) {
            // Pulsing Alarm Notification Banner
            AnimatedVisibility(
                visible = viewModel.isAlarmCurrentlyRinging && viewModel.isVisualAlarmEnabled,
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                val infiniteTransition = rememberInfiniteTransition(label = "AlarmStrobe")
                val animatedAlpha by infiniteTransition.animateFloat(
                    initialValue = 0.3f,
                    targetValue = 0.95f,
                    animationSpec = infiniteRepeatable(
                        animation = tween(450, easing = LinearEasing),
                        repeatMode = RepeatMode.Reverse
                    ),
                    label = "AlarmAlpha"
                )
                
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp, bottom = 4.dp)
                        .border(2.dp, CriticalRed, RoundedCornerShape(12.dp))
                        .testTag("visual_alarm_detection_card"),
                    colors = CardDefaults.cardColors(
                        containerColor = CriticalRed.copy(alpha = animatedAlpha * 0.3f),
                        contentColor = Color.White
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = "Siren Alert Active",
                                tint = CriticalRed,
                                modifier = Modifier
                                    .size(26.dp)
                                    .graphicsLayer {
                                        scaleX = 1f + (animatedAlpha * 0.15f)
                                        scaleY = 1f + (animatedAlpha * 0.15f)
                                    }
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "🚨 SPECTRUM ALARM ACTIVE",
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                                    color = Color.White
                                )
                                Text(
                                    text = "Detected ${viewModel.detectedFrequencyMHz} MHz signal outside target offset!",
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                    color = Color.White.copy(alpha = 0.9f)
                                )
                            }
                        }
                        
                        Button(
                            onClick = { viewModel.silenceAlarm() },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = CriticalRed,
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp),
                            modifier = Modifier.height(32.dp).testTag("silence_visual_alarm_btn")
                        ) {
                            Text("MUTE SIREN", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp))
                        }
                    }
                }
            }

            // App Title Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp)
                    .border(1.dp, GatorGreenPrimary.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    .background(DarkGreenSurface.copy(alpha = 0.8f))
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.VpnKey,
                    contentDescription = "Elevator Key Transmitter",
                    tint = LimeHighlight,
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "ELEVATOR KEY NFC Pro",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 2.sp,
                            color = LimeHighlight
                        ),
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "NFC Key Fob Cloner & Broadcast Simulator for Samsung S24",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = LightSageText.copy(alpha = 0.8f),
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            // Outer responsive scroll container holding our two primary regions
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentPadding = PaddingValues(bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Interactive Radar Card
                item {
                    NfcScanRadarCard(viewModel)
                }

                // Simulated RF Frequency Spectrum Graph (Scanning and Identification Analysis)
                item {
                    NfcScanSpectrumCard(viewModel)
                }

                // 1-Click Quick Presets Easy Setup Card
                item {
                    NfcEasySetupCard(viewModel)
                }

                // Frequency Monitoring Module Card
                item {
                    NfcFrequencyMonitoringCard(viewModel)
                }

                // Breach Detection Siren Alarm Settings Panel
                item {
                    NfcFrequencyAlarmSettingsCard(viewModel)
                }

                // S24 & Elevator Fob Technical Guide
                item {
                    S24ElevatorFobGuideCard()
                }

                // Active Key Emulator & Broadcaster Panel
                item {
                    NfcEmulatorBroadcasterCard(viewModel)
                }

                // Section 1: NFC Hardware parameters Configuration Panel
                item {
                    HardwareConfigurationCard(viewModel)
                }

                // Section 2: Custom Scan Alerts & Triggers setting panel
                item {
                    AlertTriggersSettingsCard(viewModel)
                }

                // Section 2.5: Custom Push Notification Settings panel
                item {
                    NotificationSettingsCard(viewModel, savedTags)
                }

                // Section 2.55: Custom Frequency Resonant Alerts & Triggers settings panel
                item {
                    CustomFrequencyAlertsCard(viewModel)
                }

                // Section 2.56: Range Guard Frequency Threshold & Warning Settings Panel
                item {
                    NfcFrequencyRangeGuardCard(viewModel)
                }

                // Section 2.6: Security PIN access preferences
                item {
                    SecuritySettingsCard(viewModel)
                }

                // Section 2.75: Encrypted Fob Master Sector Decryptor & Password Resolver
                item {
                    EncryptedKeysManagementCard(viewModel)
                }

                // Section 3: Interactive NFC Tag Active Simulated Transceiver
                item {
                    SimulatedTagTransceiverCard(
                        viewModel = viewModel,
                        savedTags = savedTags,
                        onScan = { id, payload, name ->
                            viewModel.onTagScannedWithFrequency(id, payload, name, viewModel.detectedFrequencyMHz, isSimulated = true)
                        }
                    )
                }

                // Section 4: Local Database Log Ledger of event records
                item {
                    if (viewModel.isHistoryUnlocked) {
                        AccessLogsLedgerCard(
                            logs = accessHistory,
                            onClearLogs = { viewModel.clearLogHistory() },
                            sdf = sdf,
                            onLock = { viewModel.isHistoryUnlocked = false },
                            onExportLogs = {
                                shareCsvData(context, viewModel.exportHistoryToCsv())
                            },
                            onRenameTag = { tagId, newName ->
                                viewModel.updateTagNickname(tagId, newName)
                            }
                        )
                    } else {
                        LockedLogsLedgerCard(
                            onUnlockClick = {
                                viewModel.requestPinRelease(
                                    title = "SENSITIVE LOGS ACCESS",
                                    subtext = "The scan history contains detailed RFID sector codes. Authenticate with PIN.",
                                    onSuccess = { viewModel.isHistoryUnlocked = true }
                                )
                            }
                        )
                    }
                }

                // Section 5: Collected Unique Tags Inventory Cloner Source
                item {
                    SavedTagsInventoryCard(
                        tags = savedTags,
                        onDeleteTag = { viewModel.deleteSavedTag(it) },
                        onSelectTagForTransceiver = { tag ->
                            viewModel.inputTagId = tag.tagId
                            viewModel.inputTagName = tag.name
                            viewModel.inputTagPayload = tag.textPayload
                            viewModel.encryptionSector = tag.encryptionKey
                            viewModel.emulatedTagId = tag.tagId
                            viewModel.emulatedTagName = tag.name
                            viewModel.emulatedPayload = tag.textPayload
                        }
                    )
                }
            }
        }

        // Section 6: Big Active Overlay Warning Alarm Popup Alert when scanner triggers
        AnimatedVisibility(
            visible = activeAlarm != null,
            enter = fadeIn() + expandVertically(),
            exit = fadeOut() + shrinkVertically(),
            modifier = Modifier.align(Alignment.Center)
        ) {
            if (activeAlarm != null) {
                ActiveAlarmPopupOverlay(
                    event = activeAlarm,
                    soundFreq = activeAlarm.alertToneFreqHz,
                    severity = viewModel.alertSeverity,
                    onDismiss = { viewModel.clearAlert() }
                )
            }
        }

        // Section 7: Floating Scanned Tag Success Toast Popup Overlay
        AnimatedVisibility(
            visible = viewModel.showScanToast,
            enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
            exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(),
            modifier = Modifier.align(Alignment.TopCenter)
        ) {
            ScannedTagToastNotification(
                tagId = viewModel.scanToastTagId,
                tagName = viewModel.scanToastTagName,
                tagType = viewModel.scanToastTagType,
                payload = viewModel.scanToastPayload,
                onDismiss = { viewModel.dismissScanToast() }
            )
        }

        // Section 8: Interactive Security Access PIN Entry Overlay
        SecurePinEntryOverlay(viewModel)
    }
}

@Composable
fun S24ElevatorFobGuideCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("s24_elevator_guide_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GoldSector.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = "Guide Header",
                    tint = GoldSector,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Samsung S24 Elevator Key Guide",
                    style = MaterialTheme.typography.titleSmall.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    ),
                    color = GoldSector
                )
            }
            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "If you want to clone your physical elevator key card/fob to operate directly from your phone for fast backup access, please read these critical hardware insights:",
                style = MaterialTheme.typography.bodySmall.copy(
                    lineHeight = 18.sp,
                    color = LightSageText.copy(alpha = 0.9f)
                )
            )

            Spacer(modifier = Modifier.height(10.dp))

            HorizontalDivider(color = GatorGreenPrimary.copy(alpha = 0.2f))

            Spacer(modifier = Modifier.height(10.dp))

            // Point 1: RFID vs NFC
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.Bolt,
                    contentDescription = "Frequency info",
                    tint = WarningOrange,
                    modifier = Modifier.size(18.dp).padding(top = 2.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "1. Frequency & Hardware Antennas (125kHz vs 13.56MHz)",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = WarningOrange
                    )
                    Text(
                        text = "• Legacy elevator key fobs work on low-frequency 125kHz RFID. These coils are physically unsupported by any smartphone including the Samsung S24.\n• Modern smart access cards (like metro, electric prepay, and new building tags) operate on high-frequency 13.56MHz NFC (such as MIFARE, DESFire, NTAG). They are fully compatible and can be read or written securely.",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp, lineHeight = 16.sp),
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Point 2: Security & Emulator
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = "Security restriction",
                    tint = LimeHighlight,
                    modifier = Modifier.size(18.dp).padding(top = 2.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "2. Secure Enclave Keys & Host Card Emulation (HCE)",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = LimeHighlight
                    )
                    Text(
                        text = "• For safety, Android isolates the hardware Unique Identifier (UID) to prevent unauthorized key cloning.\n• You can read compatible cards, store keycodes securely in the app's encrypted SQLite database, and activate the HCE simulation to broadcast authorization sequences near your elevator scanner!",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp, lineHeight = 16.sp),
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                }
            }
        }
    }
}

@Composable
fun HardwareConfigurationCard(viewModel: NfcViewModel) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("hardware_config_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Security Config",
                    tint = LimeHighlight,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "HARDWARE CRYPTO & PITCH SETUP",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    fontFamily = FontFamily.Monospace,
                    color = LimeHighlight
                )
            }
            Spacer(modifier = Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                // Key sector selector block (0-15 sector index)
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "NFC Encryption Sector",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DeepSwampDark, RoundedCornerShape(8.dp))
                            .padding(horizontal = 4.dp, vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(
                            onClick = { viewModel.adjustSectorDown() },
                            modifier = Modifier.testTag("sector_down_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Remove,
                                contentDescription = "Decrease Sector",
                                tint = LightSageText
                            )
                        }
                        Text(
                            text = "Sector ${viewModel.encryptionSector}",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                            fontFamily = FontFamily.Monospace,
                            color = GoldSector
                        )
                        IconButton(
                            onClick = { viewModel.adjustSectorUp() },
                            modifier = Modifier.testTag("sector_up_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Increase Sector",
                                tint = LightSageText
                            )
                        }
                    }
                    Text(
                        text = "Adjust secure block register address.",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                        color = LightSageText.copy(alpha = 0.5f)
                    )
                }

                // Synth sound frequency value control box
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Synthesizer Base Pitch",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DeepSwampDark, RoundedCornerShape(8.dp))
                            .padding(horizontal = 4.dp, vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(
                            onClick = { viewModel.adjustFrequencyDown() },
                            modifier = Modifier.testTag("freq_down_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.ArrowDownward,
                                contentDescription = "Decrease Frequency",
                                tint = LightSageText
                            )
                        }
                        Text(
                            text = "${viewModel.soundFrequency} Hz",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                            fontFamily = FontFamily.Monospace,
                            color = LimeHighlight
                        )
                        IconButton(
                            onClick = { viewModel.adjustFrequencyUp() },
                            modifier = Modifier.testTag("freq_up_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.ArrowUpward,
                                contentDescription = "Increase Frequency",
                                tint = LightSageText
                            )
                        }
                    }
                    Text(
                        text = "Pitch audio buzzer feedback chime.",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                        color = LightSageText.copy(alpha = 0.5f)
                    )
                }
            }
        }
    }
}

@Composable
fun AlertTriggersSettingsCard(viewModel: NfcViewModel) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("alert_config_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.NotificationsActive,
                    contentDescription = "Warning Setups",
                    tint = WarningOrange,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "CUSTOM SCAN ALERT SETTINGS",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    fontFamily = FontFamily.Monospace,
                    color = WarningOrange
                )
            }
            Spacer(modifier = Modifier.height(12.dp))

            // Text field input for customizable scanning messages
            Text(
                text = "Custom Broadcast Message",
                style = MaterialTheme.typography.bodySmall,
                color = LightSageText.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = viewModel.customAlertMessage,
                onValueChange = { viewModel.customAlertMessage = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("custom_msg_input"),
                textStyle = LocalTextStyle.current.copy(
                    fontFamily = FontFamily.Monospace,
                    fontSize = 13.sp,
                    color = LightSageText
                ),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = LimeHighlight,
                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.5f),
                    focusedContainerColor = DeepSwampDark,
                    unfocusedContainerColor = DeepSwampDark
                ),
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Custom dynamic warning classification severity selectors
            Text(
                text = "Active Alert Severity Classification",
                style = MaterialTheme.typography.bodySmall,
                color = LightSageText.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val severities = listOf("SUCCESS", "WARNING", "CRITICAL")
                severities.forEach { severity ->
                    val isSelected = viewModel.alertSeverity == severity
                    val dynamicColor = when (severity) {
                        "CRITICAL" -> CriticalRed
                        "WARNING" -> WarningOrange
                        else -> LimeHighlight
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(
                                if (isSelected) dynamicColor.copy(alpha = 0.3f)
                                else DeepSwampDark
                            )
                            .border(
                                1.dp,
                                if (isSelected) dynamicColor else GatorGreenPrimary.copy(alpha = 0.4f),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { viewModel.alertSeverity = severity }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (isSelected) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Selected",
                                    tint = dynamicColor,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                            }
                            Text(
                                text = severity,
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                color = if (isSelected) dynamicColor else LightSageText.copy(alpha = 0.6f)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SimulatedTagTransceiverCard(
    viewModel: NfcViewModel,
    savedTags: List<NfcTag>,
    onScan: (id: String, payload: String, name: String) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("tag_transceiver_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Sensors,
                        contentDescription = "Active Transceiver",
                        tint = LimeHighlight,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "INTERACTIVE TAG ACTIVE CLONER",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        fontFamily = FontFamily.Monospace,
                        color = LimeHighlight
                    )
                }
                
                // Active status indicators
                Box(
                    modifier = Modifier
                        .background(
                            if (viewModel.isScanningModeActive) GatorGreenPrimary.copy(alpha = 0.4f)
                            else Color.Gray.copy(alpha = 0.3f),
                            RoundedCornerShape(4.dp)
                        )
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "ONLINE",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        ),
                        color = if (viewModel.isScanningModeActive) LimeHighlight else Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Inputs for tag scanning simulations
            Text(
                text = "Target Gator Tag UID",
                style = MaterialTheme.typography.bodySmall,
                color = LightSageText.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = viewModel.inputTagId,
                onValueChange = { viewModel.inputTagId = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("tag_id_input"),
                textStyle = LocalTextStyle.current.copy(fontFamily = FontFamily.Monospace, fontSize = 13.sp, color = LightSageText),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = GatorGreenPrimary,
                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                    focusedContainerColor = DeepSwampDark,
                    unfocusedContainerColor = DeepSwampDark
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Replica Asset Reference Label",
                style = MaterialTheme.typography.bodySmall,
                color = LightSageText.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = viewModel.inputTagName,
                onValueChange = { viewModel.inputTagName = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("tag_name_input"),
                textStyle = LocalTextStyle.current.copy(fontSize = 13.sp, color = LightSageText),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = GatorGreenPrimary,
                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                    focusedContainerColor = DeepSwampDark,
                    unfocusedContainerColor = DeepSwampDark
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Secure NDEF Message Payload String",
                style = MaterialTheme.typography.bodySmall,
                color = LightSageText.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = viewModel.inputTagPayload,
                onValueChange = { viewModel.inputTagPayload = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("tag_payload_input"),
                textStyle = LocalTextStyle.current.copy(fontSize = 13.sp, color = LightSageText),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = GatorGreenPrimary,
                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                    focusedContainerColor = DeepSwampDark,
                    unfocusedContainerColor = DeepSwampDark
                ),
                maxLines = 3
            )

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Action 1: Authenticate and Scan simulated signal
                Button(
                    onClick = {
                        onScan(viewModel.inputTagId, viewModel.inputTagPayload, viewModel.inputTagName)
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("scan_trigger_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GatorGreenPrimary,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(imageVector = Icons.Default.Nfc, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "SCAN SIMULATOR",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }

                // Action 2: Write simulated data to cryptographic Sector block registers
                Button(
                    onClick = {
                        viewModel.onTagWrittenSimulated(
                            viewModel.inputTagId,
                            viewModel.inputTagPayload,
                            viewModel.inputTagName
                        )
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("write_trigger_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = LimeHighlight
                    ),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, LimeHighlight.copy(alpha = 0.6f))
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(imageVector = Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "WRITE CLONE",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AccessLogsLedgerCard(
    logs: List<AccessEvent>,
    onClearLogs: () -> Unit,
    sdf: SimpleDateFormat,
    onLock: (() -> Unit)? = null,
    onExportLogs: (() -> Unit)? = null,
    onRenameTag: ((String, String) -> Unit)? = null
) {
    var showRenameDialog by remember { mutableStateOf(false) }
    var selectedTagId by remember { mutableStateOf("") }
    var selectedTagName by remember { mutableStateOf("") }
    var nicknameInput by remember { mutableStateOf("") }
    var searchQuery by remember { mutableStateOf("") }

    val filteredLogs = remember(logs, searchQuery) {
        if (searchQuery.isBlank()) {
            logs
        } else {
            logs.filter { log ->
                log.tagName.contains(searchQuery, ignoreCase = true) ||
                log.tagId.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    if (showRenameDialog) {
        androidx.compose.ui.window.Dialog(
            onDismissRequest = { showRenameDialog = false }
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .border(1.dp, LimeHighlight, RoundedCornerShape(12.dp))
                    .testTag("tag_rename_dialog"),
                shape = RoundedCornerShape(12.dp),
                color = DeepSwampDark,
                contentColor = LightSageText
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Edit Tag Nickname",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = LimeHighlight
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Assign a custom nickname to quickly recognize this NFC tag (UID: $selectedTagId). This updates all historical entries in the ledger and inventory.",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    
                    OutlinedTextField(
                        value = nicknameInput,
                        onValueChange = { nicknameInput = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("tag_nickname_input"),
                        textStyle = MaterialTheme.typography.bodyMedium,
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = LimeHighlight,
                            unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                            focusedLabelColor = LimeHighlight,
                            unfocusedLabelColor = LightSageText.copy(alpha = 0.6f),
                            cursorColor = LimeHighlight
                        ),
                        label = { Text("Custom Nickname") }
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        TextButton(
                            onClick = { showRenameDialog = false },
                            modifier = Modifier.testTag("rename_dialog_cancel")
                        ) {
                            Text("CANCEL", color = CriticalRed)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (onRenameTag != null) {
                                    onRenameTag(selectedTagId, nicknameInput.trim())
                                }
                                showRenameDialog = false
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = LimeHighlight,
                                contentColor = DeepSwampDark
                            ),
                            modifier = Modifier.testTag("rename_dialog_save")
                        ) {
                            Text("SAVE NICKNAME", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(max = 350.dp)
            .testTag("access_logs_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.3f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.ListAlt,
                        contentDescription = "Access Logs Ledger",
                        tint = LimeHighlight,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "SECURE ACCESS EVENT LEDGER",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        fontFamily = FontFamily.Monospace,
                        color = LimeHighlight
                    )
                    if (onLock != null) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = "Lock Ledger",
                            tint = LimeHighlight.copy(alpha = 0.7f),
                            modifier = Modifier
                                .size(16.dp)
                                .clickable { onLock() }
                        )
                    }
                }

                if (logs.isNotEmpty()) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (onExportLogs != null) {
                            Text(
                                text = "Export CSV",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = LimeHighlight
                                ),
                                modifier = Modifier
                                    .clickable { onExportLogs() }
                                    .padding(4.dp)
                                    .testTag("export_logs_csv_btn")
                            )
                        }
                        Text(
                            text = "Clear All",
                            style = MaterialTheme.typography.bodySmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = CriticalRed
                            ),
                            modifier = Modifier
                                .clickable { onClearLogs() }
                                .padding(4.dp)
                                .testTag("clear_logs_btn")
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (logs.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp)
                        .background(DeepSwampDark, RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.HourglassEmpty,
                            contentDescription = "No Logs yet",
                            tint = LightSageText.copy(alpha = 0.3f),
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "No unique access events logged yet.",
                            style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.4f))
                        )
                    }
                }
            } else {
                // Search or filter input field
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp)
                        .testTag("log_search_input"),
                    textStyle = MaterialTheme.typography.bodyMedium.copy(color = LightSageText),
                    singleLine = true,
                    placeholder = {
                        Text(
                            text = "Search by nickname or ID...",
                            style = MaterialTheme.typography.bodyMedium.copy(color = LightSageText.copy(alpha = 0.5f))
                        )
                    },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search Icon",
                            tint = LimeHighlight.copy(alpha = 0.7f),
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(
                                onClick = { searchQuery = "" },
                                modifier = Modifier.testTag("clear_search_btn")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "Clear search",
                                    tint = LightSageText.copy(alpha = 0.6f),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = LimeHighlight,
                        unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                        focusedContainerColor = DeepSwampDark,
                        unfocusedContainerColor = DeepSwampDark,
                        cursorColor = LimeHighlight
                    )
                )

                if (filteredLogs.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f)
                            .background(DeepSwampDark, RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Default.SearchOff,
                                contentDescription = "No matches",
                                tint = LightSageText.copy(alpha = 0.3f),
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "No matches for \"$searchQuery\"",
                                style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.5f))
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(filteredLogs) { log ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(DeepSwampDark, RoundedCornerShape(8.dp))
                                .border(1.dp, GatorGreenPrimary.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text(
                                            text = log.tagName,
                                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                            color = LimeHighlight
                                        )
                                        if (onRenameTag != null) {
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Icon(
                                                imageVector = Icons.Default.Edit,
                                                contentDescription = "Edit Tag Nickname",
                                                tint = LimeHighlight.copy(alpha = 0.7f),
                                                modifier = Modifier
                                                    .size(16.dp)
                                                    .clickable {
                                                        selectedTagId = log.tagId
                                                        selectedTagName = log.tagName
                                                        nicknameInput = log.tagName
                                                        showRenameDialog = true
                                                    }
                                                    .testTag("rename_tag_btn_${log.tagId}")
                                            )
                                        }
                                    }
                                    Text(
                                        text = sdf.format(Date(log.timestamp)),
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            fontFamily = FontFamily.Monospace,
                                            fontSize = 9.sp
                                        ),
                                        color = LightSageText.copy(alpha = 0.5f)
                                    )
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "UID: ${log.tagId} | Sector Pitch: ${log.alertToneFreqHz}Hz",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace
                                    ),
                                    color = GoldSector
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = log.textPayload,
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                    color = LightSageText.copy(alpha = 0.8f)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
}

@Composable
fun SavedTagsInventoryCard(
    tags: List<NfcTag>,
    onDeleteTag: (id: String) -> Unit,
    onSelectTagForTransceiver: (NfcTag) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(max = 280.dp)
            .testTag("saved_tags_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.3f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.CloudQueue,
                    contentDescription = "Registered Tag Inventory",
                    tint = LimeHighlight,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "REGISTERED SWAMP ASSETS (COPE/WRITE SOURCE)",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    fontFamily = FontFamily.Monospace,
                    color = LimeHighlight
                )
            }
            Spacer(modifier = Modifier.height(10.dp))

            if (tags.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                        .background(DeepSwampDark, RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No assets saved. Scan signals to populate lists.",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.4f))
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(tags) { tag ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(DeepSwampDark, RoundedCornerShape(8.dp))
                                .border(1.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                .clickable { onSelectTagForTransceiver(tag) }
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = tag.name,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                    color = LimeHighlight
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "UID: ${tag.tagId} | Crypt Sector: ${tag.encryptionKey}",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace
                                    ),
                                    color = GoldSector
                                )
                            }
                            IconButton(onClick = { onDeleteTag(tag.tagId) }) {
                                Icon(
                                    imageVector = Icons.Default.Delete,
                                    contentDescription = "Delete Local registry entry",
                                    tint = CriticalRed
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ActiveAlarmPopupOverlay(
    event: AccessEvent,
    soundFreq: Int,
    severity: String,
    onDismiss: () -> Unit
) {
    val accentColor = when (severity) {
        "CRITICAL" -> CriticalRed
        "WARNING" -> WarningOrange
        else -> LimeHighlight
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.85f))
            .clickable { onDismiss() } // Dim dismiss tap fallback
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(2.dp, accentColor, RoundedCornerShape(16.dp))
                .testTag("alarm_popup_card"),
            colors = CardDefaults.cardColors(
                containerColor = DarkGreenSurface,
                contentColor = LightSageText
            ),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header alert flashing signal indicator
                Icon(
                    imageVector = when (severity) {
                        "CRITICAL" -> Icons.Default.Dangerous
                        "WARNING" -> Icons.Default.Warning
                        else -> Icons.Default.Lock
                    },
                    contentDescription = "Alarm status",
                    tint = accentColor,
                    modifier = Modifier
                        .size(72.dp)
                        .padding(bottom = 12.dp)
                )

                Text(
                    text = "${severity} DETECTED EVENT",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.Black,
                        letterSpacing = 2.sp
                    ),
                    fontFamily = FontFamily.Monospace,
                    color = accentColor,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(14.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepSwampDark, RoundedCornerShape(10.dp))
                        .padding(16.dp),
                    horizontalAlignment = Alignment.Start
                ) {
                    Text(
                        text = "Asset Label: ${event.tagName}",
                        style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                        color = LimeHighlight
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "UID Identifier: ${event.tagId}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontFamily = FontFamily.Monospace,
                        color = GoldSector
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "NDEF Payload: ${event.textPayload}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = LightSageText.copy(alpha = 0.9f)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Custom alarm notification response display info banner
                Text(
                    text = event.alertTriggeredText,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = accentColor
                    ),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Buzzer Warning Track synthesized at $soundFreq Hz frequency.",
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp
                    ),
                    color = LightSageText.copy(alpha = 0.5f)
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth(0.6f)
                        .height(48.dp)
                        .testTag("dismiss_alarm_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = accentColor,
                        contentColor = if (severity == "SUCCESS") DeepSwampDark else Color.White
                    ),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = "DISCONNECT ALARM",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            }
        }
    }
}

@Composable
fun ScannedTagToastNotification(
    tagId: String,
    tagName: String,
    tagType: String,
    payload: String,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp)
            .border(2.dp, LimeHighlight, RoundedCornerShape(16.dp))
            .clickable { onDismiss() }
            .testTag("scanned_tag_toast_card"),
        colors = CardDefaults.cardColors(
            containerColor = DeepSwampDark.copy(alpha = 0.95f),
            contentColor = LightSageText
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 12.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Surface(
                    shape = androidx.compose.foundation.shape.CircleShape,
                    color = LimeHighlight.copy(alpha = 0.2f),
                    modifier = Modifier.size(40.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Success Icon",
                            tint = LimeHighlight,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "NFC TAG DISCOVERED SUCCESSFULLY!",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.5.sp
                        ),
                        color = LimeHighlight
                    )
                    Text(
                        text = tagName,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText
                    )
                }
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Dismiss Toast",
                        tint = LightSageText.copy(alpha = 0.6f)
                    )
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            HorizontalDivider(color = GatorGreenPrimary.copy(alpha = 0.2f))
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "TAG IDENTIFIER (UID)",
                        style = MaterialTheme.typography.labelSmall,
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    Text(
                        text = tagId.ifBlank { "00:00:00:00" },
                        style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace),
                        color = GoldSector
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "TECH TYPE",
                        style = MaterialTheme.typography.labelSmall,
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    Text(
                        text = tagType.ifBlank { "NfcA/NDEF" },
                        style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace),
                        color = LightSageText
                    )
                }
            }
            if (payload.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Column {
                    Text(
                        text = "DECRYPTED SECTORS / PAYLOAD",
                        style = MaterialTheme.typography.labelSmall,
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    Text(
                        text = payload,
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.8f),
                        maxLines = 2
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            // Animated/duration indicator for the toast life
            LinearProgressIndicator(
                progress = { 1f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .clip(RoundedCornerShape(1.dp)),
                color = LimeHighlight,
                trackColor = GatorGreenPrimary.copy(alpha = 0.1f)
            )
        }
    }
}

@Composable
fun NfcScanRadarCard(viewModel: NfcViewModel) {
    val infiniteTransition = rememberInfiniteTransition(label = "RadarSweep")
    
    // Pulse animation for the outer ring
    val pulseProgression by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Pulse"
    )
    
    // Sweep animation for the radar line
    val rotationProgression by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 3000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Rotation"
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_scan_radar_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, LimeHighlight.copy(alpha = 0.4f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Nfc,
                    contentDescription = "Radar Symbol",
                    tint = LimeHighlight,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "NFC Key Scanner & Cloner",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText
                    )
                    Text(
                        text = "Automated Key Fob Analyzer",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // The pulsing radar/progress visualization itself as a prominent tap-to-scan button!
            Box(
                modifier = Modifier
                    .size(185.dp)
                    .background(DeepSwampDark, shape = androidx.compose.foundation.shape.CircleShape)
                    .border(
                        width = 2.5.dp,
                        color = if (viewModel.isProgressScanningActive) {
                            LimeHighlight
                        } else if (viewModel.isScanFinishedSuccessfully) {
                            LimeHighlight
                        } else {
                            GatorGreenPrimary.copy(alpha = 0.5f)
                        },
                        shape = androidx.compose.foundation.shape.CircleShape
                    )
                    .clip(androidx.compose.foundation.shape.CircleShape)
                    .clickable(enabled = !viewModel.isProgressScanningActive) {
                        viewModel.startProgressScan {
                            val finalFreq = if (viewModel.detectedFrequencyMHz == 13.56f) {
                                val randomOffset = (-4..4).random() / 100f
                                13.56f + randomOffset
                            } else {
                                viewModel.detectedFrequencyMHz
                            }
                            viewModel.onTagScannedWithFrequency(
                                id = viewModel.inputTagId,
                                payload = viewModel.inputTagPayload,
                                typeName = viewModel.inputTagName,
                                carrierFreq = finalFreq,
                                isSimulated = true
                            )
                        }
                    }
                    .testTag("nfc_circular_scan_pad_btn"),
                contentAlignment = Alignment.Center
            ) {
                // Outer animating canvas elements
                androidx.compose.foundation.Canvas(modifier = Modifier.fillMaxSize()) {
                    val center = size / 2f
                    val maxRadius = size.minDimension / 2f
                    
                    if (viewModel.isProgressScanningActive) {
                        // Action scanning: Draw pulsing wave outer ring
                        drawCircle(
                            color = LimeHighlight,
                            radius = maxRadius * pulseProgression,
                            alpha = 1f - pulseProgression,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 3.dp.toPx())
                        )
                        
                        // Draw secondary delayed pulse wave
                        val secondPulse = (pulseProgression + 0.5f) % 1.0f
                        drawCircle(
                            color = GoldSector,
                            radius = maxRadius * secondPulse,
                            alpha = 1f - secondPulse,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2.dp.toPx())
                        )
                    }

                    // Static helper range circles
                    drawCircle(
                        color = GatorGreenPrimary.copy(alpha = 0.35f),
                        radius = maxRadius * 0.78f,
                        style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1.dp.toPx())
                    )
                    drawCircle(
                        color = GatorGreenPrimary.copy(alpha = 0.2f),
                        radius = maxRadius * 0.55f,
                        style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1.dp.toPx())
                    )
                    
                    if (viewModel.isProgressScanningActive) {
                        // Rotating radar sweep radial indicator line
                        val angleRad = Math.toRadians(rotationProgression.toDouble())
                        val endX = center.width + (maxRadius * Math.cos(angleRad)).toFloat()
                        val endY = center.height + (maxRadius * Math.sin(angleRad)).toFloat()
                        
                        drawLine(
                            color = LimeHighlight.copy(alpha = 0.85f),
                            start = androidx.compose.ui.geometry.Offset(center.width, center.height),
                            end = androidx.compose.ui.geometry.Offset(endX, endY),
                            strokeWidth = 2.5.dp.toPx()
                        )
                    }
                }

                // High fidelity modern Circular Progress arc layered right inside the scanning ring!
                if (viewModel.isProgressScanningActive) {
                    CircularProgressIndicator(
                        progress = { viewModel.scanProgressPercent },
                        modifier = Modifier.size(145.dp),
                        color = LimeHighlight,
                        strokeWidth = 5.dp,
                        trackColor = GatorGreenPrimary.copy(alpha = 0.15f)
                    )
                } else {
                    // Ready condition static beautiful accent ring
                    CircularProgressIndicator(
                        progress = { 1.0f },
                        modifier = Modifier.size(145.dp),
                        color = if (viewModel.isScanFinishedSuccessfully) LimeHighlight.copy(alpha = 0.4f) else GatorGreenPrimary.copy(alpha = 0.3f),
                        strokeWidth = 2.5.dp
                    )
                }

                // Inner content layout (Progress value or Icon)
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    if (viewModel.isProgressScanningActive) {
                        Icon(
                            imageVector = Icons.Default.Sensors,
                            contentDescription = "Scanning sensor animation",
                            tint = LimeHighlight,
                            modifier = Modifier
                                .size(28.dp)
                                .graphicsLayer {
                                    scaleX = 1f + (pulseProgression * 0.15f)
                                    scaleY = 1f + (pulseProgression * 0.15f)
                                }
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${(viewModel.scanProgressPercent * 100).toInt()}%",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Black,
                                color = LimeHighlight,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 24.sp
                            )
                        )
                        Text(
                            text = "RECEIVING",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = LightSageText.copy(alpha = 0.7f),
                                letterSpacing = 1.sp
                            )
                        )
                    } else if (viewModel.isScanFinishedSuccessfully) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Success",
                            tint = LimeHighlight,
                            modifier = Modifier.size(46.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "COUPLED",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = LimeHighlight,
                                letterSpacing = 1.sp
                            )
                        )
                        Text(
                            text = "Tap to re-scan",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontSize = 9.sp,
                                color = LightSageText.copy(alpha = 0.5f)
                            )
                        )
                    } else {
                        val pulseInfinite = rememberInfiniteTransition(label = "BtnGlow")
                        val glowAlpha by pulseInfinite.animateFloat(
                            initialValue = 0.3f,
                            targetValue = 0.9f,
                            animationSpec = infiniteRepeatable(
                                animation = tween(1000, easing = EaseInOut),
                                repeatMode = RepeatMode.Reverse
                            ),
                            label = "Glow"
                        )
                        Icon(
                            imageVector = Icons.Default.Nfc,
                            contentDescription = "NFC Transmitter Plate",
                            tint = LimeHighlight.copy(alpha = glowAlpha),
                            modifier = Modifier.size(42.dp)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "SCAN NFC",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 12.sp,
                                color = LimeHighlight,
                                letterSpacing = 1.sp
                            )
                        )
                        Text(
                            text = "Place Key Fob Here",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontSize = 8.sp,
                                color = LightSageText.copy(alpha = 0.6f),
                                fontWeight = FontWeight.SemiBold
                            )
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // Proportional status indicators & State display
            Box(
                modifier = Modifier
                    .background(DeepSwampDark, RoundedCornerShape(8.dp))
                    .border(0.5.dp, GatorGreenPrimary.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (viewModel.isProgressScanningActive) {
                        CircularProgressIndicator(
                            color = LimeHighlight,
                            strokeWidth = 2.dp,
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Scanning & Analyzing Coil Signal: ${(viewModel.scanProgressPercent * 100).toInt()}%",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            color = LimeHighlight
                        )
                    } else if (viewModel.isScanFinishedSuccessfully) {
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "Success Icon",
                            tint = LimeHighlight,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "SUCCESS: Elevator Fob Authenticated & Cloned!",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            color = LimeHighlight
                        )
                    } else {
                        // Blinking point indicating Ready state
                        val blinkAlpha by infiniteTransition.animateFloat(
                            initialValue = 0.3f,
                            targetValue = 1f,
                            animationSpec = infiniteRepeatable(
                                animation = tween(durationMillis = 800, easing = LinearEasing),
                                repeatMode = RepeatMode.Reverse
                            ),
                            label = "Blink"
                        )
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .background(GoldSector.copy(alpha = blinkAlpha), androidx.compose.foundation.shape.CircleShape)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "READY: Awaiting key fob... Place on back of phone",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            color = LightSageText
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(14.dp))

            // Proximity & RF Coupling Level Analyzer Box
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepSwampDark, RoundedCornerShape(10.dp))
                    .border(0.5.dp, GatorGreenPrimary.copy(alpha = 0.25f), RoundedCornerShape(10.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "COIL PROXIMITY COUPLING",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    
                    val distanceText = if (viewModel.proximityDistanceCm >= 10.0f) {
                        "OUT OF RANGE"
                    } else {
                        String.format("%.1f cm", viewModel.proximityDistanceCm)
                    }
                    
                    Text(
                        text = distanceText,
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            color = if (viewModel.tagProximityConnected) LimeHighlight else if (viewModel.isProgressScanningActive) WarningOrange else LightSageText.copy(alpha = 0.4f)
                        )
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Segmented RF proximity meter
                Row(
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    val segmentsCount = 10
                    // Calculate how many segments are active based on proximity (closer means more segments)
                    val activeSegments = if (!viewModel.isProgressScanningActive && !viewModel.tagProximityConnected) {
                        0
                    } else {
                        // 10cm is 0 active, 0.1cm is 10 active
                        val pct = ((10.0f - viewModel.proximityDistanceCm) / 9.9f).coerceIn(0f, 1f)
                        (pct * segmentsCount).toInt().coerceIn(0, segmentsCount)
                    }
                    
                    for (i in 0 until segmentsCount) {
                        val isActive = i < activeSegments
                        val segmentColor = when {
                            !isActive -> DeepSwampDark.copy(alpha = 0.8f)
                            activeSegments >= 8 -> LimeHighlight
                            activeSegments >= 4 -> WarningOrange
                            else -> GoldSector
                        }
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                                .clip(RoundedCornerShape(2.dp))
                                .background(segmentColor)
                                .border(0.5.dp, GatorGreenPrimary.copy(alpha = if (isActive) 0.3f else 0.1f), RoundedCornerShape(2.dp))
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = when {
                        viewModel.tagProximityConnected -> "✓ RF COUPLING RESONANT: Tag fully energized for read/write queries"
                        viewModel.isProgressScanningActive -> "⚡ SWEEPING DETECTOR: Adjust distance to close loop alignment"
                        else -> "⚡ FIELD IDLE: Awaiting target transponder within 5cm field distance"
                    },
                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                    color = if (viewModel.tagProximityConnected) LimeHighlight.copy(alpha = 0.8f) else LightSageText.copy(alpha = 0.5f)
                )
            }

            // Real-time electromagnetic resonance wave visualizer
            AnimatedVisibility(
                visible = viewModel.isProgressScanningActive,
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp)
                ) {
                    Text(
                        text = "ANTENNA CARRIER RESONANCE WAVE (13.56 MHz)",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        ),
                        color = LimeHighlight.copy(alpha = 0.8f)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    
                    val waveTransition = rememberInfiniteTransition(label = "NfcCarrierWave")
                    val wavePhase by waveTransition.animateFloat(
                        initialValue = 0f,
                        targetValue = (2f * Math.PI).toFloat(),
                        animationSpec = infiniteRepeatable(
                            animation = tween(800, easing = LinearEasing),
                            repeatMode = RepeatMode.Restart
                        ),
                        label = "WavePhase"
                    )
                    
                    Canvas(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(45.dp)
                            .background(DeepSwampDark, RoundedCornerShape(6.dp))
                            .border(0.5.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                    ) {
                        val canvasWidth = size.width
                        val canvasHeight = size.height
                        val centerY = canvasHeight / 2f
                        
                        // Amplitude increases as distance decreases (closer = stronger coupling!)
                        // distance goes from 10.0cm (weak) to 0.1cm (strong)
                        val coupleFactor = ((10.0f - viewModel.proximityDistanceCm) / 9.9f).coerceIn(0.1f, 1.0f)
                        val amplitude = (canvasHeight / 2.3f) * coupleFactor
                        val frequency = (5f * Math.PI.toFloat()) / canvasWidth
                        
                        val path = androidx.compose.ui.graphics.Path()
                        path.moveTo(0f, centerY)
                        for (x in 0..canvasWidth.toInt() step 5) {
                            val y = centerY + amplitude * Math.sin((x * frequency + wavePhase).toDouble()).toFloat()
                            path.lineTo(x.toFloat(), y)
                        }
                        
                        drawPath(
                            path = path,
                            color = LimeHighlight,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1.5.dp.toPx())
                        )
                        
                        // Overlay a secondary weaker harmonic wave
                        val pathSecond = androidx.compose.ui.graphics.Path()
                        pathSecond.moveTo(0f, centerY)
                        for (x in 0..canvasWidth.toInt() step 5) {
                            val y = centerY + (amplitude * 0.3f) * Math.sin((x * frequency * 2f - wavePhase).toDouble()).toFloat()
                            pathSecond.lineTo(x.toFloat(), y)
                        }
                        
                        drawPath(
                            path = pathSecond,
                            color = GoldSector,
                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1.dp.toPx())
                        )
                    }
                }
            }

            // Real-time parsed details (UID, Technology Type)
            if (viewModel.lastScannedTagId.isNotEmpty()) {
                Spacer(modifier = Modifier.height(14.dp))
                
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepSwampDark, RoundedCornerShape(10.dp))
                        .border(1.dp, LimeHighlight.copy(alpha = 0.15f), RoundedCornerShape(10.dp))
                        .padding(14.dp)
                ) {
                    Text(
                        text = "TRANSPONDER HARDWARE READOUT",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                        color = LimeHighlight
                    )
                    
                    Spacer(modifier = Modifier.height(10.dp))
                    
                    // Hardware UID row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Fingerprint,
                            contentDescription = "UID Icon",
                            tint = GoldSector,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Unique UID:",
                            style = MaterialTheme.typography.bodySmall,
                            color = LightSageText.copy(alpha = 0.6f)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = viewModel.lastScannedTagId,
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontWeight = FontWeight.Black,
                                fontFamily = FontFamily.Monospace
                            ),
                            color = GoldSector,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(6.dp))
                    
                    // Technology Type Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Sensors,
                            contentDescription = "Chip Icon",
                            tint = LimeHighlight,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Tech Type:",
                            style = MaterialTheme.typography.bodySmall,
                            color = LightSageText.copy(alpha = 0.6f)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(LimeHighlight.copy(alpha = 0.12f))
                                .border(0.5.dp, LimeHighlight.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = viewModel.lastScannedTagType,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace
                                ),
                                color = LimeHighlight
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(6.dp))
                    
                    // Raw string payload row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            imageVector = Icons.Default.ListAlt,
                            contentDescription = "Data Icon",
                            tint = LightSageText.copy(alpha = 0.4f),
                            modifier = Modifier.size(16.dp).padding(top = 1.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Data Payload:",
                            style = MaterialTheme.typography.bodySmall,
                            color = LightSageText.copy(alpha = 0.6f)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = viewModel.lastScannedPayload,
                            style = MaterialTheme.typography.bodySmall,
                            color = LightSageText.copy(alpha = 0.8f)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Action button system
            if (viewModel.isProgressScanningActive) {
                Button(
                    onClick = { viewModel.stopProgressScan() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CriticalRed,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.Stop,
                        contentDescription = "Halt Scanner"
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "HALT NFC SCAN SIMULATION",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            } else {
                Button(
                    onClick = {
                        viewModel.startProgressScan {
                            val finalFreq = if (viewModel.detectedFrequencyMHz == 13.56f) {
                                val randomOffset = (-4..4).random() / 100f
                                13.56f + randomOffset
                            } else {
                                viewModel.detectedFrequencyMHz
                            }
                            viewModel.onTagScannedWithFrequency(
                                id = viewModel.inputTagId,
                                payload = viewModel.inputTagPayload,
                                typeName = viewModel.inputTagName,
                                carrierFreq = finalFreq,
                                isSimulated = true
                            )
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GatorGreenPrimary,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("start_progress_scan_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = "Start Scan Button"
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "ACTIVATE SYSTEM NFC SCANNER",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            }
        }
    }
}

@Composable
fun NfcScanSpectrumCard(viewModel: NfcViewModel) {
    val isScanning = viewModel.isProgressScanningActive
    val progress = viewModel.scanProgressPercent

    // Animate a phase offset for the simulated rolling noise generator
    val infiniteTransition = rememberInfiniteTransition(label = "SpectrumNoisePhase")
    val phaseOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = (2f * Math.PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "phase"
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_scan_spectrum_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, LimeHighlight.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.GraphicEq,
                    contentDescription = "Spectrum Analyzer",
                    tint = LimeHighlight,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "COIL RF SPECTRUM GRAPH",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = LimeHighlight
                    )
                    Text(
                        text = if (isScanning) "Active Multi-Band Carrier Sweeping..." else "Inductive Coupling Antenna Profile",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }

                // Status badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(if (isScanning) LimeHighlight.copy(alpha = 0.15f) else GatorGreenPrimary.copy(alpha = 0.15f))
                        .border(1.dp, if (isScanning) LimeHighlight.copy(alpha = 0.3f) else GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = if (isScanning) "SWEEP ACTIVE" else "ANTENNA IDLE",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold),
                        color = if (isScanning) LimeHighlight else LightSageText.copy(alpha = 0.8f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // The main canvas graph
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .background(DeepSwampDark, RoundedCornerShape(8.dp))
                    .border(1.dp, GatorGreenPrimary.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
                    .padding(vertical = 8.dp)
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val width = size.width
                    val height = size.height
                    val bottomY = height - 20.dp.toPx()
                    val topY = 10.dp.toPx()
                    val graphHeight = bottomY - topY

                    // Draw horizontal DB lines
                    val dbLevels = listOf(
                        "-10 dBm" to topY + graphHeight * 0.1f,
                        "-40 dBm" to topY + graphHeight * 0.4f,
                        "-70 dBm" to topY + graphHeight * 0.7f,
                        "-90 dBm" to topY + graphHeight * 0.95f
                    )
                    dbLevels.forEach { (_, y) ->
                        drawLine(
                            color = LightSageText.copy(alpha = 0.05f),
                            start = Offset(0f, y),
                            end = Offset(width, y),
                            strokeWidth = 1.dp.toPx()
                        )
                    }

                    // Define X positions for the bands:
                    // LF: 125 kHz at 20% of width
                    // HF: 13.56 MHz at 50% of width
                    // UHF: 915 MHz at 80% of width
                    val lfX = width * 0.20f
                    val hfX = width * 0.50f
                    val uhfX = width * 0.80f

                    // Draw vertical classification columns
                    val columns = listOf(
                        "LF" to lfX,
                        "HF" to hfX,
                        "UHF" to uhfX
                    )
                    columns.forEach { (_, x) ->
                        drawLine(
                            color = LightSageText.copy(alpha = 0.08f),
                            start = Offset(x, topY),
                            end = Offset(x, bottomY),
                            strokeWidth = 1.5.dp.toPx(),
                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                        )
                    }

                    // Compute dynamic peaks
                    val activeFreq = viewModel.detectedFrequencyMHz
                    val targetPeakX = when {
                        activeFreq < 1.0f -> lfX
                        activeFreq < 100.0f -> hfX
                        else -> uhfX
                    }

                    // Generate spectrum path combining rolling noise floor and candidate resonance peak
                    val spectrumPath = Path()
                    val segments = 120
                    var first = true

                    for (i in 0..segments) {
                        val x = (i.toFloat() / segments.toFloat()) * width

                        // Noise floor: gentle sine waves + small random jitter
                        val noiseSine1 = Math.sin((i.toFloat() / segments.toFloat() * 12 * Math.PI) + phaseOffset.toDouble()).toFloat() * 2.5.dp.toPx()
                        val noiseSine2 = Math.cos((i.toFloat() / segments.toFloat() * 28 * Math.PI) - (phaseOffset * 2).toDouble()).toFloat() * 1.5.dp.toPx()
                        var y = bottomY - 12.dp.toPx() + noiseSine1 + noiseSine2

                        // Resonance peak additions
                        if (isScanning) {
                            // During active scanning, let peak bulge sweep along with the sweep line
                            val sweepX = progress * width
                            val distToSweep = Math.abs(x - sweepX)
                            val sweepFactor = Math.max(0f, 1f - distToSweep / (45.dp.toPx()))
                            val transientPeak = sweepFactor * sweepFactor * graphHeight * 0.55f
                            y -= transientPeak

                            // Also place smaller background candidate spikes at LF, HF, and UHF to simulate tuning
                            val distToLF = Math.abs(x - lfX)
                            val lfFactor = Math.max(0f, 1f - distToLF / (32.dp.toPx()))
                            val lfFlicker = (0.5f + 0.5f * Math.sin(phaseOffset.toDouble() * 3.5).toFloat())
                            y -= lfFactor * lfFactor * graphHeight * 0.25f * lfFlicker

                            val distToHF = Math.abs(x - hfX)
                            val hfFactor = Math.max(0f, 1f - distToHF / (32.dp.toPx()))
                            val hfFlicker = (0.5f + 0.5f * Math.cos(phaseOffset.toDouble() * 5.5).toFloat())
                            y -= hfFactor * hfFactor * graphHeight * 0.32f * hfFlicker

                            val distToUHF = Math.abs(x - uhfX)
                            val uhfFactor = Math.max(0f, 1f - distToUHF / (32.dp.toPx()))
                            val uhfFlicker = (0.5f + 0.5f * Math.sin(phaseOffset.toDouble() * 7.5).toFloat())
                            y -= uhfFactor * uhfFactor * graphHeight * 0.22f * uhfFlicker
                        } else {
                            // Scan completed or state is static. Draw a gorgeous sharp peak at the active frequency
                            val distToActive = Math.abs(x - targetPeakX)
                            val peakRadius = 35.dp.toPx()
                            if (distToActive < peakRadius) {
                                val ratio = 1f - distToActive / peakRadius
                                // Bell curve formula for crisp sharp antenna peak
                                val gaussianPeak = Math.pow(ratio.toDouble(), 3.0).toFloat() * graphHeight * 0.85f
                                y -= gaussianPeak
                            }
                        }

                        // Ensure boundaries
                        val clampedY = y.coerceIn(topY, bottomY)
                        if (first) {
                            spectrumPath.moveTo(x, clampedY)
                            first = false
                        } else {
                            spectrumPath.lineTo(x, clampedY)
                        }
                    }

                    // Stroke the beautiful spectrum curve
                    drawPath(
                        path = spectrumPath,
                        color = if (isScanning) GatorGreenPrimary else LimeHighlight,
                        style = Stroke(width = 2.dp.toPx())
                    )

                    // Fill under the target peak / static peak for glowing premium look (gradient)
                    if (!isScanning) {
                        val fillPath = Path()
                        val peakMinX = targetPeakX - 35.dp.toPx()
                        val peakMaxX = targetPeakX + 35.dp.toPx()

                        fillPath.moveTo(peakMinX, bottomY)
                        val segmentCount = 30
                        for (i in 0..segmentCount) {
                            val currX = peakMinX + (i.toFloat() / segmentCount) * (peakMaxX - peakMinX)
                            val distToActive = Math.abs(currX - targetPeakX)
                            val peakRadius = 35.dp.toPx()
                            var y = bottomY
                            if (distToActive < peakRadius) {
                                val ratio = 1f - distToActive / peakRadius
                                val gaussianPeak = Math.pow(ratio.toDouble(), 3.0).toFloat() * graphHeight * 0.85f
                                y -= gaussianPeak
                            }
                            fillPath.lineTo(currX, y.coerceIn(topY, bottomY))
                        }
                        fillPath.lineTo(peakMaxX, bottomY)
                        fillPath.close()

                        drawPath(
                            path = fillPath,
                            brush = Brush.verticalGradient(
                                colors = listOf(
                                    LimeHighlight.copy(alpha = 0.25f),
                                    Color.Transparent
                                ),
                                startY = topY,
                                endY = bottomY
                            )
                        )
                    }

                    // Draw the scanning horizontal sweep line when sweeping matches progress
                    if (isScanning) {
                        val sweepCursorX = progress * width

                        // Neon sweep line
                        drawLine(
                            color = GoldSector,
                            start = Offset(sweepCursorX, topY),
                            end = Offset(sweepCursorX, bottomY),
                            strokeWidth = 2.dp.toPx()
                        )

                        // Outer sweep bubble
                        drawCircle(
                            color = GoldSector.copy(alpha = 0.3f),
                            radius = 10.dp.toPx(),
                            center = Offset(sweepCursorX, topY + graphHeight * 0.5f)
                        )
                        drawCircle(
                            color = GoldSector,
                            radius = 3.dp.toPx(),
                            center = Offset(sweepCursorX, topY + graphHeight * 0.5f)
                        )
                    }
                }

                // Layout absolute labels at bottom
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 4.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Top DB metrics markings labels
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(end = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Text("-10 dBm [MAX]", style = MaterialTheme.typography.bodySmall.copy(fontSize = 7.sp, color = LightSageText.copy(alpha = 0.3f)))
                        Text("-90 dBm [FLOOR]", style = MaterialTheme.typography.bodySmall.copy(fontSize = 7.sp, color = LightSageText.copy(alpha = 0.3f)))
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    // Bottom labels indicating standard frequency nodes
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 2.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                            Text(
                                "LF legacy\n[125 kHz]",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontFamily = FontFamily.Monospace, textAlign = TextAlign.Center),
                                color = if (!isScanning && viewModel.detectedFrequencyMHz < 1.0f) LimeHighlight else LightSageText.copy(alpha = 0.5f)
                            )
                        }
                        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                            Text(
                                "HF NFC Secure\n[13.56 MHz]",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontFamily = FontFamily.Monospace, textAlign = TextAlign.Center),
                                color = if (!isScanning && viewModel.detectedFrequencyMHz >= 1.0f && viewModel.detectedFrequencyMHz < 100.0f) LimeHighlight else LightSageText.copy(alpha = 0.5f)
                            )
                        }
                        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                            Text(
                                "UHF Long-Range\n[915 MHz]",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontFamily = FontFamily.Monospace, textAlign = TextAlign.Center),
                                color = if (!isScanning && viewModel.detectedFrequencyMHz >= 100.0f) LimeHighlight else LightSageText.copy(alpha = 0.5f)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Identified Type description panel
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepSwampDark, RoundedCornerShape(6.dp))
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                val classification = when {
                    isScanning -> "SWEEPING SPECTRUM COILS... IDENTIFYING CARRIER COUPLING"
                    viewModel.detectedFrequencyMHz < 1.0f -> "IDENTIFIED: LF LEGACY KEY FOB (HID Prox / EM4100)\n• Low Frequency Inductive Coupling (~125 kHz)\n• Standard legacy elevator, lobby, and gate fob standard"
                    viewModel.detectedFrequencyMHz < 100.0f -> "IDENTIFIED: HF SECURED SMART KEY (MIFARE / NFC-A)\n• High Frequency Resonant Carrier (13.56 MHz)\n• Modern high security sector encrypted authentication"
                    else -> "IDENTIFIED: UHF LONG-RANGE RFID (Transporter / Toll)\n• Ultra-High Frequency Electromagnetic propagation (~915 MHz)\n• Long range active gate entry and vehicle tracking"
                }

                Icon(
                    imageVector = if (isScanning) Icons.Default.Sync else Icons.Default.Info,
                    contentDescription = "Classification Info",
                    tint = if (isScanning) GoldSector else LimeHighlight,
                    modifier = Modifier
                        .size(18.dp)
                        .padding(end = 4.dp)
                )

                Spacer(modifier = Modifier.width(4.dp))

                Text(
                    text = classification,
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 9.sp,
                        lineHeight = 11.sp
                    ),
                    color = LightSageText,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Test Presets Row (Manual Modulation Tuners)
            Text(
                text = "MANUAL SIGNAL EMULATOR CALIBRATION",
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                color = LightSageText.copy(alpha = 0.4f)
            )

            Spacer(modifier = Modifier.height(6.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(
                    Triple("LF 125 kHz", 0.125f) {
                        viewModel.inputTagName = "Legacy Gate Fob"
                        viewModel.inputTagId = "HID:77B1D50"
                        viewModel.inputTagPayload = "Standard LF Inductive 125 kHz card (H10301)"
                    },
                    Triple("HF 13.56 MHz", 13.56f) {
                        viewModel.inputTagName = "MIFARE Classic 1K"
                        viewModel.inputTagId = "E4:8B:2A:7D"
                        viewModel.inputTagPayload = "Card Type: MIFARE Classic 1K - Auth ID: 0x88F11A"
                    },
                    Triple("UHF 915 MHz", 915.0f) {
                        viewModel.inputTagName = "UHF Windshield Tag"
                        viewModel.inputTagId = "EPC:E2003412"
                        viewModel.inputTagPayload = "ISO 18000-6C Gen2 long range toll pass"
                    }
                ).forEach { (label, freqValue, updateAction) ->
                    val isSelected = !isScanning && when (freqValue) {
                        0.125f -> viewModel.detectedFrequencyMHz < 1.0f
                        13.56f -> viewModel.detectedFrequencyMHz >= 1.0f && viewModel.detectedFrequencyMHz < 100.0f
                        else -> viewModel.detectedFrequencyMHz >= 100.0f
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isSelected) LimeHighlight.copy(alpha = 0.15f) else DarkGreenSurface)
                            .border(
                                1.dp,
                                if (isSelected) LimeHighlight else GatorGreenPrimary.copy(alpha = 0.2f),
                                RoundedCornerShape(6.dp)
                            )
                            .clickable(enabled = !isScanning) {
                                viewModel.detectedFrequencyMHz = freqValue
                                updateAction()
                            }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace
                            ),
                            color = if (isSelected) LimeHighlight else LightSageText.copy(alpha = 0.7f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun EmulationWaveVisualizer(transmitPower: Float) {
    val infiniteTransition = rememberInfiniteTransition(label = "EmulationWave")
    val phase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = (2f * Math.PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Phase"
    )

    androidx.compose.foundation.Canvas(
        modifier = Modifier
            .fillMaxWidth()
            .height(60.dp)
            .background(DeepSwampDark, RoundedCornerShape(8.dp))
            .border(0.5.dp, LimeHighlight.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
    ) {
        val width = size.width
        val height = size.height
        val amplitude = (height / 2.5f) * (transmitPower / 100f)
        val frequency = (4f * Math.PI.toFloat()) / width
        val centerY = height / 2f

        val path = androidx.compose.ui.graphics.Path()
        path.moveTo(0f, centerY)
        for (x in 0..width.toInt() step 4) {
            val y = centerY + amplitude * Math.sin((x * frequency + phase).toDouble()).toFloat()
            path.lineTo(x.toFloat(), y)
        }

        drawPath(
            path = path,
            color = LimeHighlight,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2.dp.toPx())
        )

        // Draw secondary offset harmonic wave representing magnetic field
        val secondPath = androidx.compose.ui.graphics.Path()
        secondPath.moveTo(0f, centerY)
        for (x in 0..width.toInt() step 4) {
            val y = centerY + (amplitude * 0.4f) * Math.sin((x * frequency * 1.5f - phase).toDouble()).toFloat()
            secondPath.lineTo(x.toFloat(), y)
        }
        drawPath(
            path = secondPath,
            color = GoldSector,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1.dp.toPx())
        )
    }
}

@Composable
fun NfcEmulatorBroadcasterCard(viewModel: NfcViewModel) {
    val savedTags by viewModel.allTags.collectAsStateWithLifecycle()
    var expanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_emulator_broadcaster_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, if (viewModel.isEmulating) LimeHighlight else GatorGreenPrimary.copy(alpha = 0.5f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.BroadcastOnHome,
                    contentDescription = "Broadcaster Symbol",
                    tint = if (viewModel.isEmulating) LimeHighlight else LightSageText,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "NFC Key Fob Emulation Center",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText
                    )
                    Text(
                        text = "Active HCE Magnetic Wave Broadcaster",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Choose active key for broadcasting
            Text(
                text = "EMULATED KEY IDENTITY (TAP TO SELECT)",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = LimeHighlight,
                    letterSpacing = 1.sp
                )
            )
            Spacer(modifier = Modifier.height(4.dp))
            
            Box(
                modifier = Modifier
                    .fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepSwampDark, RoundedCornerShape(8.dp))
                        .border(1.dp, if (expanded) LimeHighlight else GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                        .clickable { expanded = !expanded }
                        .padding(12.dp)
                        .testTag("emulated_key_selector_box")
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.VpnKey,
                                contentDescription = "Key Icon",
                                tint = GoldSector,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = viewModel.emulatedTagName,
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                    color = Color.White
                                )
                                Text(
                                    text = "UID: ${viewModel.emulatedTagId} | ${viewModel.emulatedPayload}",
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                    color = LightSageText.copy(alpha = 0.7f)
                                )
                            }
                        }
                        Icon(
                            imageVector = if (expanded) Icons.Default.ArrowDropUp else Icons.Default.ArrowDropDown,
                            contentDescription = "Dropdown Caret",
                            tint = LimeHighlight
                        )
                    }
                }

                DropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false },
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .background(DarkGreenSurface)
                        .border(1.dp, GatorGreenPrimary.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                ) {
                    if (savedTags.isEmpty()) {
                        DropdownMenuItem(
                            text = {
                                Text(
                                    "No saved tags. Scan a tag first to register it.",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = LightSageText.copy(alpha = 0.6f)
                                )
                            },
                            onClick = { expanded = false },
                            modifier = Modifier.testTag("emulated_key_menu_empty")
                        )
                    } else {
                        savedTags.forEach { tag ->
                            val isSelected = tag.tagId == viewModel.emulatedTagId
                            DropdownMenuItem(
                                text = {
                                    Column {
                                        Text(
                                            text = tag.name,
                                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                            color = if (isSelected) LimeHighlight else Color.White
                                        )
                                        Text(
                                            text = "UID: ${tag.tagId} | Crypt Sector: ${tag.encryptionKey}",
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                fontSize = 10.sp,
                                                fontFamily = FontFamily.Monospace
                                            ),
                                            color = LightSageText.copy(alpha = 0.6f)
                                        )
                                    }
                                },
                                onClick = {
                                    viewModel.selectTagForEmulation(tag.tagId, tag.name, tag.textPayload)
                                    expanded = false
                                },
                                modifier = Modifier
                                    .background(if (isSelected) GatorGreenPrimary.copy(alpha = 0.2f) else Color.Transparent)
                                    .testTag("emulated_key_menu_item_${tag.tagId}")
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Configuration Sliders & Parameters
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Emulation Standard",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Text(
                        text = viewModel.hceStandard,
                        style = MaterialTheme.typography.bodySmall.copy(color = GoldSector, fontSize = 11.sp)
                    )
                }
                
                Button(
                    onClick = {
                        viewModel.hceStandard = if (viewModel.hceStandard.startsWith("ISO-DEP")) {
                            "MIFARE Classic Emulator Mode"
                        } else {
                            "ISO-DEP (ISO 14443-4)"
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GatorGreenPrimary.copy(alpha = 0.3f),
                        contentColor = LightSageText
                    ),
                    shape = RoundedCornerShape(4.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp)
                ) {
                    Text("Switch RF", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp))
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Transmit power controller slider
            Text(
                text = "ANTENNA FIELD POWER TUNING: ${viewModel.transmitPower.toInt()}%",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = LightSageText.copy(alpha = 0.7f))
            )
            Slider(
                value = viewModel.transmitPower,
                onValueChange = { viewModel.transmitPower = it },
                valueRange = 10f..100f,
                colors = SliderDefaults.colors(
                    thumbColor = LimeHighlight,
                    activeTrackColor = LimeHighlight,
                    inactiveTrackColor = GatorGreenPrimary.copy(alpha = 0.3f)
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Live broadcasting electromagnetic waves feedback (Animated canvas!)
            if (viewModel.isEmulating) {
                Text(
                    text = "📡 ACTIVE ELECTROMAGNETIC FIELD BROADCASTING",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = LimeHighlight)
                )
                Spacer(modifier = Modifier.height(6.dp))
                EmulationWaveVisualizer(viewModel.transmitPower)
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Mock live APDU Handshake log/command ledger
                Text(
                    text = "REAL-TIME READER HANDSHAKE LEDGER",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = GoldSector)
                )
                Spacer(modifier = Modifier.height(6.dp))
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Black.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                        .border(0.5.dp, GoldSector.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                        .padding(8.dp)
                ) {
                    Text(
                        text = viewModel.hceApduLog,
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontSize = 10.sp,
                            color = LimeHighlight.copy(alpha = 0.9f),
                            lineHeight = 14.sp
                        )
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepSwampDark, RoundedCornerShape(8.dp))
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Broadcasting is standby. Turn on emulator when stepping in the elevator.",
                        style = MaterialTheme.typography.bodySmall.copy(textAlign = TextAlign.Center, color = LightSageText.copy(alpha = 0.5f)),
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Trigger Toggle Broadcast Button
            Button(
                onClick = {
                    if (viewModel.isEmulating) {
                        viewModel.toggleEmulation()
                    } else {
                        viewModel.requestPinRelease(
                            title = "EMULATOR HARDWARE KEY BROADCAST",
                            subtext = "Broadcasting requires secure access. Enter your 4-digit numeric PIN.",
                            onSuccess = { viewModel.toggleEmulation() }
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (viewModel.isEmulating) WarningOrange else LimeHighlight,
                    contentColor = DeepSwampDark
                ),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("toggle_emulation_btn")
            ) {
                Icon(
                    imageVector = if (viewModel.isEmulating) Icons.Default.StopCircle else Icons.Default.PlayCircle,
                    contentDescription = "Toggle Broadcast Button"
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (viewModel.isEmulating) "STOP NFC EMULATION & FIELD" else "START NFC KEY BROADCAST",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}

@Composable
fun NfcFrequencyRangeGuardCard(viewModel: NfcViewModel) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_frequency_range_guard_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, if (viewModel.isRangeGuardViolated && viewModel.isRangeGuardActive) CriticalRed.copy(alpha = 0.5f) else GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = "Range Guard",
                    tint = if (viewModel.isRangeGuardViolated && viewModel.isRangeGuardActive) CriticalRed else LimeHighlight,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "SPECTRUM RANGE SHIELD",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = if (viewModel.isRangeGuardViolated && viewModel.isRangeGuardActive) CriticalRed else LimeHighlight
                    )
                    Text(
                        text = "Active filter guard for anomalous signals",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }

                // Range Guard Switch
                Switch(
                    checked = viewModel.isRangeGuardActive,
                    onCheckedChange = { viewModel.updateRangeGuardActive(it) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = LimeHighlight,
                        checkedTrackColor = GatorGreenPrimary.copy(alpha = 0.5f),
                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                        uncheckedTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.scale(0.85f).testTag("range_guard_switch")
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Sub Status Box with beautiful visual warning
            AnimatedVisibility(
                visible = viewModel.isRangeGuardActive,
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                Column {
                    if (viewModel.isRangeGuardViolated) {
                        // Glowing red flashing warning block
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(CriticalRed.copy(alpha = 0.15f))
                                .border(1.5.dp, CriticalRed, RoundedCornerShape(8.dp))
                                .padding(12.dp)
                                .testTag("range_guard_warning_banner")
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Warning,
                                    contentDescription = "Threat Alert",
                                    tint = CriticalRed,
                                    modifier = Modifier.size(22.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "FREQUENCY BREACH DETECTED!",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                        color = CriticalRed
                                    )
                                    Text(
                                        text = "Signal of ${viewModel.detectedFrequencyMHz} MHz is OUTSIDE allowed band [${viewModel.rangeGuardMinMHz} MHz - ${viewModel.rangeGuardMaxMHz} MHz]",
                                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                        color = LightSageText
                                    )
                                }
                            }
                        }
                    } else {
                        // Secure green status block
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(DeepSwampDark)
                                .border(1.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                .padding(12.dp)
                                .testTag("range_guard_secured_banner")
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = "Shield Secured",
                                    tint = LimeHighlight,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "FREQUENCY SHIELD ACTIVE & SECURED",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                        color = LimeHighlight
                                    )
                                    Text(
                                        text = "Current signal ${viewModel.detectedFrequencyMHz} MHz lies safely within the threshold limits.",
                                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp, color = LightSageText.copy(alpha = 0.7f))
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Config Controls Title
                    Text(
                        text = "SPECTRUM ENVELOPE BOUNDARIES",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                        color = LimeHighlight.copy(alpha = 0.8f)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Minimum limit slider + text display
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Lower Bound Safe Freq Limit",
                                style = MaterialTheme.typography.bodySmall,
                                color = LightSageText.copy(alpha = 0.8f)
                            )
                            Text(
                                text = "${viewModel.rangeGuardMinMHz} MHz",
                                style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold),
                                color = LimeHighlight
                            )
                        }
                        Slider(
                            value = viewModel.rangeGuardMinMHz,
                            onValueChange = { newVal ->
                                val boundedMin = if (newVal > viewModel.rangeGuardMaxMHz) viewModel.rangeGuardMaxMHz else newVal
                                viewModel.setRangeGuardBounds(boundedMin, viewModel.rangeGuardMaxMHz)
                            },
                            valueRange = 0.10f..20.00f,
                            colors = SliderDefaults.colors(
                                thumbColor = LimeHighlight,
                                activeTrackColor = GatorGreenPrimary,
                                inactiveTrackColor = DeepSwampDark
                            ),
                            modifier = Modifier.fillMaxWidth().testTag("range_guard_min_slider")
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Maximum limit slider + text display
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Upper Bound Safe Freq Limit",
                                style = MaterialTheme.typography.bodySmall,
                                color = LightSageText.copy(alpha = 0.8f)
                            )
                            Text(
                                text = "${viewModel.rangeGuardMaxMHz} MHz",
                                style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold),
                                color = LimeHighlight
                            )
                        }
                        Slider(
                            value = viewModel.rangeGuardMaxMHz,
                            onValueChange = { newVal ->
                                val boundedMax = if (newVal < viewModel.rangeGuardMinMHz) viewModel.rangeGuardMinMHz else newVal
                                viewModel.setRangeGuardBounds(viewModel.rangeGuardMinMHz, boundedMax)
                            },
                            valueRange = 0.10f..20.00f,
                            colors = SliderDefaults.colors(
                                thumbColor = LimeHighlight,
                                activeTrackColor = GatorGreenPrimary,
                                inactiveTrackColor = DeepSwampDark
                            ),
                            modifier = Modifier.fillMaxWidth().testTag("range_guard_max_slider")
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Preset Quick-Pick range chips
                    Text(
                        text = "Quick Frequency Standards Presets",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText.copy(alpha = 0.8f),
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf(
                            Triple("LF (125 kHz RFID)", 0.10f, 0.20f),
                            Triple("HF (13.56 MHz NFC)", 13.00f, 14.10f),
                            Triple("UHF (915 MHz Toll)", 18.00f, 19.50f)
                        ).forEach { preset ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(DeepSwampDark)
                                    .border(0.5.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                                    .clickable {
                                        viewModel.setRangeGuardBounds(preset.second, preset.third)
                                    }
                                    .padding(vertical = 8.dp)
                                    .testTag("preset_" + preset.first.substring(0, 3)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = preset.first,
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, fontWeight = FontWeight.Bold),
                                    color = LimeHighlight,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }
                }
            }

            AnimatedVisibility(
                visible = !viewModel.isRangeGuardActive,
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(DeepSwampDark.copy(alpha = 0.5f))
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Range Guard is currently in standby. Enable spectrum monitoring to filter outside target sweeps.",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.4f),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

@Composable
fun CustomFrequencyAlertsCard(viewModel: NfcViewModel) {
    var showAddDialog by remember { mutableStateOf(false) }
    var editingAlert by remember { mutableStateOf<CustomFrequencyAlert?>(null) }

    // Forms fields for Add/Edit
    var labelInput by remember { mutableStateOf("") }
    var frequencyInputStr by remember { mutableStateOf("13.56") }
    var toleranceInputStr by remember { mutableStateOf("0.15") }
    var triggerVibrate by remember { mutableStateOf(true) }
    var triggerSound by remember { mutableStateOf(true) }
    var triggerNotification by remember { mutableStateOf(true) }
    var isEnabled by remember { mutableStateOf(true) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("custom_frequency_alerts_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Hearing,
                        contentDescription = "Active Frequency Listener",
                        tint = LimeHighlight,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "CUSTOM RESONANT ALERTS",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            fontFamily = FontFamily.Monospace,
                            color = LimeHighlight
                        )
                        Text(
                            text = "Trigger feedback on specific coil signals",
                            style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                        )
                    }
                }

                IconButton(
                    onClick = {
                        labelInput = ""
                        frequencyInputStr = "13.56"
                        toleranceInputStr = "0.15"
                        triggerVibrate = true
                        triggerSound = true
                        triggerNotification = true
                        isEnabled = true
                        editingAlert = null
                        showAddDialog = true
                    },
                    modifier = Modifier.testTag("add_alert_rule_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.AddCircle,
                        contentDescription = "Create new trigger rule",
                        tint = LimeHighlight,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Main thresholds list
            if (viewModel.customFrequencyAlerts.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepSwampDark, RoundedCornerShape(8.dp))
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No custom resonant threshold rules configured.",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.4f),
                        textAlign = TextAlign.Center
                    )
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    viewModel.customFrequencyAlerts.forEachIndexed { index, alert ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (alert.isEnabled) DeepSwampDark else DeepSwampDark.copy(alpha = 0.5f))
                                .border(0.5.dp, if (alert.isEnabled) GatorGreenPrimary.copy(alpha = 0.3f) else Color.Transparent, RoundedCornerShape(8.dp))
                                .padding(12.dp)
                                .testTag("alert_rule_item_$index"),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(if (alert.isEnabled) LimeHighlight else LightSageText.copy(alpha = 0.3f))
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = alert.label,
                                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                        color = if (alert.isEnabled) LightSageText else LightSageText.copy(alpha = 0.5f)
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "${alert.frequencyMHz} MHz (±${alert.toleranceMHz} MHz deviation range)",
                                    style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                                    color = if (alert.isEnabled) LimeHighlight.copy(alpha = 0.8f) else LightSageText.copy(alpha = 0.4f)
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                // Badges for alert techniques
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    if (alert.triggerVibration) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(GatorGreenPrimary.copy(alpha = 0.2f))
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(
                                                    imageVector = Icons.Default.Vibration,
                                                    contentDescription = "Haptic indicator",
                                                    tint = GatorGreenPrimary,
                                                    modifier = Modifier.size(10.dp)
                                                )
                                                Spacer(modifier = Modifier.width(2.dp))
                                                Text("HAPTIC", style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold), color = GatorGreenPrimary)
                                            }
                                        }
                                    }
                                    if (alert.triggerSound) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(LimeHighlight.copy(alpha = 0.15f))
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(
                                                    imageVector = Icons.Default.VolumeUp,
                                                    contentDescription = "Audio indicator",
                                                    tint = LimeHighlight,
                                                    modifier = Modifier.size(10.dp)
                                                )
                                                Spacer(modifier = Modifier.width(2.dp))
                                                Text("SOUND", style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold), color = LimeHighlight)
                                            }
                                        }
                                    }
                                    if (alert.triggerNotification) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(WarningOrange.copy(alpha = 0.15f))
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(
                                                    imageVector = Icons.Default.NotificationsActive,
                                                    contentDescription = "Notification indicator",
                                                    tint = WarningOrange,
                                                    modifier = Modifier.size(10.dp)
                                                )
                                                Spacer(modifier = Modifier.width(2.dp))
                                                Text("SYSTEM NOTE", style = MaterialTheme.typography.bodySmall.copy(fontSize = 8.sp, fontWeight = FontWeight.Bold), color = WarningOrange)
                                            }
                                        }
                                    }
                                }
                            }

                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Switch(
                                    checked = alert.isEnabled,
                                    onCheckedChange = { value ->
                                        viewModel.updateCustomFrequencyAlert(alert.copy(isEnabled = value))
                                    },
                                    colors = SwitchDefaults.colors(
                                        checkedThumbColor = LimeHighlight,
                                        checkedTrackColor = GatorGreenPrimary.copy(alpha = 0.5f),
                                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                                        uncheckedTrackColor = DeepSwampDark
                                    ),
                                    modifier = Modifier.scale(0.75f)
                                )

                                IconButton(
                                    onClick = {
                                        editingAlert = alert
                                        labelInput = alert.label
                                        frequencyInputStr = alert.frequencyMHz.toString()
                                        toleranceInputStr = alert.toleranceMHz.toString()
                                        triggerVibrate = alert.triggerVibration
                                        triggerSound = alert.triggerSound
                                        triggerNotification = alert.triggerNotification
                                        isEnabled = alert.isEnabled
                                        showAddDialog = true
                                    }
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Edit,
                                        contentDescription = "Edit rule",
                                        tint = LightSageText.copy(alpha = 0.6f),
                                        modifier = Modifier.size(16.dp)
                                    )
                                }

                                IconButton(
                                    onClick = {
                                        viewModel.deleteCustomFrequencyAlert(alert.id)
                                    }
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Remove rule",
                                        tint = CriticalRed.copy(alpha = 0.8f),
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            HorizontalDivider(color = GatorGreenPrimary.copy(alpha = 0.2f), thickness = 0.5.dp)

            Spacer(modifier = Modifier.height(12.dp))

            // Live Manual Verification Panel
            Text(
                text = "MANUAL SIGNAL EMULATION FEEDBACK TESTING",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 9.sp, letterSpacing = 0.5.sp),
                color = LimeHighlight.copy(alpha = 0.7f),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { viewModel.testHapticVibration() },
                    modifier = Modifier
                        .weight(1f)
                        .height(36.dp)
                        .testTag("test_haptics_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = LightSageText
                    ),
                    border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Vibration,
                            contentDescription = "Vibrate test icon",
                            tint = LimeHighlight,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "TEST HAPTICS",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp, letterSpacing = 0.5.sp),
                            color = LightSageText
                        )
                    }
                }

                Button(
                    onClick = { viewModel.testSoundBeep(1800) },
                    modifier = Modifier
                        .weight(1f)
                        .height(36.dp)
                        .testTag("test_sound_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = LightSageText
                    ),
                    border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.VolumeUp,
                            contentDescription = "Speaker test icon",
                            tint = LimeHighlight,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "TEST CARRIER BEEP",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp, letterSpacing = 0.5.sp),
                            color = LightSageText
                        )
                    }
                }
            }
        }
    }

    // Dialog form for creating/editing alert thresholds
    if (showAddDialog) {
        androidx.compose.ui.window.Dialog(
            onDismissRequest = { showAddDialog = false }
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = DarkGreenSurface,
                    contentColor = LightSageText
                ),
                border = BorderStroke(1.dp, LimeHighlight.copy(alpha = 0.5f)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(16.dp)
                        .fillMaxWidth()
                ) {
                    Text(
                        text = if (editingAlert == null) "ADD FREQUENCY CACHE ALERT" else "EDIT FREQUENCY CACHE ALERT",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                        fontFamily = FontFamily.Monospace,
                        color = LimeHighlight
                    )
                    Text(
                        text = "Customize specific frequency parameters and haptic feedback responses.",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f)),
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    // Nickname Input
                    Text(
                        text = "Threshold Label / Nickname",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = labelInput,
                        onValueChange = { labelInput = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("rule_label_input"),
                        textStyle = MaterialTheme.typography.bodyMedium.copy(color = LightSageText),
                        placeholder = { Text("e.g. Elevator Signal, Mifare Key", color = LightSageText.copy(alpha = 0.4f)) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = LimeHighlight,
                            unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                            focusedContainerColor = DeepSwampDark,
                            unfocusedContainerColor = DeepSwampDark
                        ),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Preset Quick-Pick chips
                    Text(
                        text = "Quick Frequency Presets",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText.copy(alpha = 0.8f),
                        modifier = Modifier.padding(bottom = 4.dp)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf(
                            Triple("LF 125 kHz", "0.125", "0.05"),
                            Triple("HF 13.56 MHz", "13.56", "0.15"),
                            Triple("UHF 915 MHz", "915.0", "15.0")
                        ).forEach { preset ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(DeepSwampDark)
                                    .border(0.5.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                                    .clickable {
                                        labelInput = preset.first
                                        frequencyInputStr = preset.second
                                        toleranceInputStr = preset.third
                                    }
                                    .padding(vertical = 6.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = preset.first,
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, fontWeight = FontWeight.Bold),
                                    color = LimeHighlight
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Target Frequency
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Frequency (MHz)",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                color = LightSageText.copy(alpha = 0.8f)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            OutlinedTextField(
                                value = frequencyInputStr,
                                onValueChange = { frequencyInputStr = it },
                                modifier = Modifier.fillMaxWidth().testTag("rule_frequency_input"),
                                textStyle = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace, color = LightSageText),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = LimeHighlight,
                                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                                    focusedContainerColor = DeepSwampDark,
                                    unfocusedContainerColor = DeepSwampDark
                                ),
                                singleLine = true
                            )
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Tolerance (±MHz)",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                color = LightSageText.copy(alpha = 0.8f)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            OutlinedTextField(
                                value = toleranceInputStr,
                                onValueChange = { toleranceInputStr = it },
                                modifier = Modifier.fillMaxWidth().testTag("rule_tolerance_input"),
                                textStyle = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace, color = LightSageText),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = LimeHighlight,
                                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                                    focusedContainerColor = DeepSwampDark,
                                    unfocusedContainerColor = DeepSwampDark
                                ),
                                singleLine = true
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Trigger Alert Channels",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText.copy(alpha = 0.8f),
                        modifier = Modifier.padding(bottom = 6.dp)
                    )

                    // Tri-choice switches
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(DeepSwampDark)
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Vibrate
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = triggerVibrate,
                                onCheckedChange = { triggerVibrate = it },
                                colors = CheckboxDefaults.colors(checkedColor = LimeHighlight, uncheckedColor = LightSageText.copy(alpha = 0.4f))
                            )
                            Text("Vibrate", style = MaterialTheme.typography.bodySmall, color = LightSageText)
                        }

                        // Sound
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = triggerSound,
                                onCheckedChange = { triggerSound = it },
                                colors = CheckboxDefaults.colors(checkedColor = LimeHighlight, uncheckedColor = LightSageText.copy(alpha = 0.4f))
                            )
                            Text("Tone", style = MaterialTheme.typography.bodySmall, color = LightSageText)
                        }

                        // Notification
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = triggerNotification,
                                onCheckedChange = { triggerNotification = it },
                                colors = CheckboxDefaults.colors(checkedColor = LimeHighlight, uncheckedColor = LightSageText.copy(alpha = 0.4f))
                            )
                            Text("Notify", style = MaterialTheme.typography.bodySmall, color = LightSageText)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Actions Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = { showAddDialog = false },
                            modifier = Modifier.weight(1f),
                            border = BorderStroke(1.dp, LightSageText.copy(alpha = 0.4f)),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = LightSageText)
                        ) {
                            Text("Cancel", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
                        }

                        Button(
                            onClick = {
                                val currentLabel = labelInput.ifBlank { "Custom Resonant Signal" }
                                val currentFreq = frequencyInputStr.toFloatOrNull() ?: 13.56f
                                val currentTol = toleranceInputStr.toFloatOrNull() ?: 0.5f
                                
                                if (editingAlert == null) {
                                    viewModel.addCustomFrequencyAlert(
                                        CustomFrequencyAlert(
                                            label = currentLabel,
                                            frequencyMHz = currentFreq,
                                            toleranceMHz = currentTol,
                                            triggerVibration = triggerVibrate,
                                            triggerSound = triggerSound,
                                            triggerNotification = triggerNotification,
                                            isEnabled = isEnabled
                                        )
                                    )
                                } else {
                                    viewModel.updateCustomFrequencyAlert(
                                        editingAlert!!.copy(
                                            label = currentLabel,
                                            frequencyMHz = currentFreq,
                                            toleranceMHz = currentTol,
                                            triggerVibration = triggerVibrate,
                                            triggerSound = triggerSound,
                                            triggerNotification = triggerNotification,
                                            isEnabled = isEnabled
                                        )
                                    )
                                }
                                showAddDialog = false
                            },
                            modifier = Modifier
                                .weight(1f)
                                .testTag("save_alert_rule_btn"),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = LimeHighlight,
                                contentColor = DeepSwampDark
                            )
                        ) {
                            Text(
                                text = "Save",
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun NotificationSettingsCard(viewModel: NfcViewModel, savedTags: List<NfcTag>) {
    var isDropdownExpanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("notification_settings_panel"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Notifications,
                    contentDescription = "Push Notifications Config",
                    tint = LimeHighlight,
                    modifier = Modifier.size(22.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "CUSTOM PUSH NOTIFICATIONS",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        fontFamily = FontFamily.Monospace,
                        color = LimeHighlight
                    )
                    Text(
                        text = "Trigger native system notifications as alarms",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = LightSageText.copy(alpha = 0.5f),
                            fontSize = 11.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Switch to enable/disable notifications
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepSwampDark, RoundedCornerShape(8.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (viewModel.isNotificationsEnabled) Icons.Default.NotificationsActive else Icons.Default.NotificationsOff,
                        contentDescription = "Notification Status",
                        tint = if (viewModel.isNotificationsEnabled) LimeHighlight else LightSageText.copy(alpha = 0.4f),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Status Alerts Active",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Text(
                            text = if (viewModel.isNotificationsEnabled) "Enabled" else "Disabled",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = if (viewModel.isNotificationsEnabled) LimeHighlight else LightSageText.copy(alpha = 0.5f),
                                fontSize = 11.sp
                            )
                        )
                    }
                }
                Switch(
                    checked = viewModel.isNotificationsEnabled,
                    onCheckedChange = { viewModel.updateNotificationsEnabled(it) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = LimeHighlight,
                        checkedTrackColor = GatorGreenPrimary,
                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                        uncheckedTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.testTag("notification_enable_switch")
                )
            }

            if (viewModel.isNotificationsEnabled) {
                Spacer(modifier = Modifier.height(16.dp))

                // Custom Push Title
                Text(
                    text = "Notification Title Template",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                    color = LightSageText.copy(alpha = 0.8f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = viewModel.customNotificationTitle,
                    onValueChange = { viewModel.updateCustomNotificationTitle(it) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("notification_title_input"),
                    textStyle = LocalTextStyle.current.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 13.sp,
                        color = LightSageText
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = LimeHighlight,
                        unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                        focusedContainerColor = DeepSwampDark,
                        unfocusedContainerColor = DeepSwampDark
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Custom Push Content
                Text(
                    text = "Notification Body Template",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                    color = LightSageText.copy(alpha = 0.8f)
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "Tip: Use placeholders like {name}, {id}, and {payload} to inject live tag details.",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = LightSageText.copy(alpha = 0.5f),
                        fontSize = 10.sp
                    )
                )
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = viewModel.customNotificationContent,
                    onValueChange = { viewModel.updateCustomNotificationContent(it) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("notification_body_input"),
                    textStyle = LocalTextStyle.current.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 13.sp,
                        color = LightSageText
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = LimeHighlight,
                        unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                        focusedContainerColor = DeepSwampDark,
                        unfocusedContainerColor = DeepSwampDark
                    ),
                    maxLines = 3
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Specific Saved Tag dropdown/picker
                Text(
                    text = "Trigger Restriction Rules",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                    color = LightSageText.copy(alpha = 0.8f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepSwampDark, RoundedCornerShape(8.dp))
                        .border(1.dp, GatorGreenPrimary.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                        .clickable { isDropdownExpanded = !isDropdownExpanded }
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.FilterList,
                                contentDescription = "Trigger Filter",
                                tint = GoldSector,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                val selectedTagName = if (viewModel.selectedNotificationTagId == "ANY") {
                                    "Any Saved / Scanned Tag"
                                } else {
                                    savedTags.find { it.tagId == viewModel.selectedNotificationTagId }?.name 
                                        ?: "Tag: ${viewModel.selectedNotificationTagId}"
                                }
                                Text(
                                    text = selectedTagName,
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                    color = Color.White
                                )
                                Text(
                                    text = "Only notify when this RFID/NFC tag is matched",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = LightSageText.copy(alpha = 0.5f),
                                        fontSize = 10.sp
                                    )
                                )
                            }
                        }
                        Icon(
                            imageVector = if (isDropdownExpanded) Icons.Default.ArrowDropUp else Icons.Default.ArrowDropDown,
                            contentDescription = "Expand tag trigger rules",
                            tint = LightSageText
                        )
                    }
                }

                if (isDropdownExpanded) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DeepSwampDark, RoundedCornerShape(8.dp))
                            .border(1.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                            .padding(8.dp)
                    ) {
                        // Option 1: Any
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.updateSelectedNotificationTagId("ANY")
                                    isDropdownExpanded = false
                                }
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = viewModel.selectedNotificationTagId == "ANY",
                                onClick = {
                                    viewModel.updateSelectedNotificationTagId("ANY")
                                    isDropdownExpanded = false
                                },
                                colors = RadioButtonDefaults.colors(selectedColor = LimeHighlight)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Any Saved / Scanned Tag (Universal)",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                color = LightSageText
                            )
                        }

                        // Options 2+: Saved tags
                        if (savedTags.isEmpty()) {
                            Text(
                                text = "No custom saved keys discovered in local DB yet.",
                                style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.5f)),
                                modifier = Modifier.padding(10.dp)
                            )
                        } else {
                            savedTags.forEach { tag ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            viewModel.updateSelectedNotificationTagId(tag.tagId)
                                            isDropdownExpanded = false
                                        }
                                        .padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    RadioButton(
                                        selected = viewModel.selectedNotificationTagId == tag.tagId,
                                        onClick = {
                                            viewModel.updateSelectedNotificationTagId(tag.tagId)
                                            isDropdownExpanded = false
                                        },
                                        colors = RadioButtonDefaults.colors(selectedColor = LimeHighlight)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(
                                            text = tag.name,
                                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                            color = LightSageText
                                        )
                                        Text(
                                            text = "ID: ${tag.tagId}",
                                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                            color = LightSageText.copy(alpha = 0.6f)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Test broadcast trigger button
                Button(
                    onClick = {
                        val activeTagName = if (viewModel.selectedNotificationTagId == "ANY") {
                            "Universal Elevator Key"
                        } else {
                            savedTags.find { it.tagId == viewModel.selectedNotificationTagId }?.name ?: viewModel.selectedNotificationTagId
                        }
                        val formattedMsg = viewModel.customNotificationContent
                            .replace("{name}", activeTagName)
                            .replace("{id}", if (viewModel.selectedNotificationTagId == "ANY") "4A:2F:8E:B1" else viewModel.selectedNotificationTagId)
                            .replace("{payload}", "Verified Auth ID: 0x88AA")
                        viewModel.sendSystemNotification(viewModel.customNotificationTitle, formattedMsg)
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GatorGreenPrimary,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("test_trigger_push_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Test Notification Deliverance"
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "TEST NOTIFICATION PIPELINE DELIVERY",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            }
        }
    }
}

@Composable
fun EncryptedKeysManagementCard(viewModel: NfcViewModel) {
    var selectedSector by remember { mutableStateOf(1) }
    var activeKeyType by remember { mutableStateOf("Key A") }
    var customHexKey by remember { mutableStateOf("A0A1A2A3A4A5") }
    var isCracking by remember { mutableStateOf(false) }
    var crackingProgress by remember { mutableStateOf(0f) }
    val terminalLogs = remember { mutableStateListOf<String>() }
    val scope = rememberCoroutineScope()
    var showArabicGuide by remember { mutableStateOf(true) }
    var crackedKeyResult by remember { mutableStateOf<String?>(null) }
    var unlockedKeys by remember { mutableStateOf(mapOf<Int, Pair<String, String>>()) }

    // Initialize log if empty
    if (terminalLogs.isEmpty()) {
        terminalLogs.add("📟 [STATUS] Decryptor Core ready. Awaiting instructions...")
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("encrypted_keys_management_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = "RFID Encryption Resolver",
                    tint = GoldSector,
                    modifier = Modifier.size(22.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "PASSWORD LOCK RESOLVER",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        fontFamily = FontFamily.Monospace,
                        color = GoldSector
                    )
                    Text(
                        text = "Decrypt & Clone Password-Protected Elevator Tag Sectors",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = LightSageText.copy(alpha = 0.5f),
                            fontSize = 11.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Warning Notice Panel
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepSwampDark, RoundedCornerShape(8.dp))
                    .border(1.dp, WarningOrange.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Encryption Warn",
                        tint = WarningOrange,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Elevator Tag Password / Key Lockouts",
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = WarningOrange
                            )
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Elevator control fobs (like MIFARE Classic 1K) secure individual data blocks using 48-bit hex codes (Key A/B) instead of factory default 'FFFFFFFFFFFF'. If locked, standard scanners cannot access memory blocks.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = LightSageText.copy(alpha = 0.7f),
                                fontSize = 11.sp,
                                lineHeight = 14.sp
                            )
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Language Selector for User Manual
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TECHNICAL CLONING DIRECTIVES",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                    color = LimeHighlight
                )
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(DeepSwampDark)
                        .clickable { showArabicGuide = !showArabicGuide }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = "Switch Lang",
                        tint = LimeHighlight,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (showArabicGuide) "ENGLISH GUIDE" else "شرح باللغة العربية",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 10.sp,
                            color = LimeHighlight,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Dynamic Instruction Body (Arabic / English)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepSwampDark, RoundedCornerShape(8.dp))
                    .padding(12.dp)
            ) {
                if (showArabicGuide) {
                    Column {
                        Text(
                            text = "💡 حلول الشفرات المغلقة برقم سري (Password-Locked):",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, color = LightSageText),
                            fontSize = 12.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "١. استخدام قواميس الكلمات الافتراضية (MCT Dictionary): بعض الأجهزة تستعمل كوداً مخصصاً مشهوراً مثل 'A0A1A2A3A4A5' أو 'D3F7D3F7D3F7'. يمكنك تشغيل أداة الفحص بالأسفل لتجربتها.\n" +
                                   "٢. تطبيق MIFARE Classic Tool (MCT): تطبيق بديل على الهاتف مخصص لتحميل قواميس كلمات السر وفحص الكروت ذاتياً عبر قارئ الهاتف.\n" +
                                   "٣. أجهزة الفك والمحاكاة الاحترافية (Proxmark3 / ACR122U): عند فشل الطرق البرمجية البسيطة، تستخدم أجهزة الهاردوير للقيام بهجمات Nested/Hardnested لاسلكياً لاستخراج كلمات سر القطاعات (Sectors) بدقة مللي ثانية.\n" +
                                   "٤. بطاقات الكلون الذكية (CUID/FUID): تستخدم لتخطي حماية مصاعد المصانع المتطورة التي تكتشف الكروت المنسوخة التقليدية.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = LightSageText.copy(alpha = 0.8f),
                                fontSize = 11.sp,
                                lineHeight = 16.sp,
                                textAlign = TextAlign.Justify
                            )
                        )
                    }
                } else {
                    Column {
                        Text(
                            text = "💡 Bypassing Locked Sector RFID Passwords:",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, color = LightSageText),
                            fontSize = 12.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "1. Default Key Dictionary Sweepers: Many locksmith installers keep default hex sector passwords. Running the automatic sweep tests these profiles (e.g. FFFFFFFFFFFF, A0A1A2A3A4A5).\n" +
                                   "2. Android MCT Application: Run third-party MIFARE Classic Tool on Android to load customized key map files dynamically utilizing the internal NFC chip.\n" +
                                   "3. Dedicated Hardware timing-attacks: For heavily custom locks, professionals use ACR122U or Proxmark3 to run nested decryption routines in seconds.\n" +
                                   "4. Anti-Clone Filter Bypasses: Use dynamic rewriteable CUID chips because regular cheap UID clone fobs are actively blocked by modern elevator CPU controllers.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = LightSageText.copy(alpha = 0.8f),
                                fontSize = 11.sp,
                                lineHeight = 15.sp
                            )
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Sector and Key Type Settings Row
            Text(
                text = "INTERACTIVE CRYPTO BRUTEFORCE SIMULATOR",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                color = GoldSector,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Sector selector
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Sector Target",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DeepSwampDark, RoundedCornerShape(6.dp))
                            .border(1.dp, GatorGreenPrimary.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
                            .padding(4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "S-$selectedSector",
                            modifier = Modifier.padding(start = 8.dp),
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Row {
                            IconButton(
                                onClick = { if (selectedSector > 0) selectedSector-- },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Text("-", color = LimeHighlight, fontWeight = FontWeight.Bold)
                            }
                            IconButton(
                                onClick = { if (selectedSector < 15) selectedSector++ },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Text("+", color = LimeHighlight, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                // Key Selector (Key A or Key B)
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Crypto Target Type",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DeepSwampDark, RoundedCornerShape(6.dp))
                            .border(1.dp, GatorGreenPrimary.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
                            .padding(4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = activeKeyType,
                            modifier = Modifier.padding(start = 8.dp),
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                        )
                        IconButton(
                            onClick = { activeKeyType = if (activeKeyType == "Key A") "Key B" else "Key A" },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Toggle Key Mode",
                                tint = LimeHighlight,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Custom hex target key inputs
            Text(
                text = "Manual Hex Key Attempt (Optional)",
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                color = LightSageText.copy(alpha = 0.6f)
            )
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = customHexKey,
                onValueChange = { input ->
                    if (input.length <= 12 && input.all { it.isDigit() || it.lowercaseChar() in 'a'..'f' }) {
                        customHexKey = input.uppercase()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("custom_decrypt_key_input"),
                textStyle = LocalTextStyle.current.copy(
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    color = LightSageText
                ),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = LimeHighlight,
                    unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.4f),
                    focusedContainerColor = DeepSwampDark,
                    unfocusedContainerColor = DeepSwampDark
                ),
                placeholder = {
                    Text("e.g. FFFFFFFFFFFF", style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.3f)))
                },
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Cracker Simulated Console Terminal Output
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "DECRYPTION CONSOLE LOG",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp),
                    color = LightSageText.copy(alpha = 0.5f),
                    fontFamily = FontFamily.Monospace
                )
                if (isCracking) {
                    CircularProgressIndicator(
                        progress = { crackingProgress },
                        color = LimeHighlight,
                        strokeWidth = 2.dp,
                        modifier = Modifier.size(12.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(6.dp))

            // Logs text box scrollable simulator
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(Color.Black, RoundedCornerShape(6.dp))
                    .border(1.dp, GatorGreenPrimary.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                    .padding(8.dp)
            ) {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    items(terminalLogs.toList()) { logLine ->
                        Text(
                            text = logLine,
                            style = MaterialTheme.typography.bodySmall.copy(
                                fontFamily = FontFamily.Monospace,
                                fontSize = 10.sp,
                                color = if (logLine.contains("SUCCESS") || logLine.contains("UNLOCKED")) LimeHighlight
                                        else if (logLine.contains("FAILED") || logLine.contains("WARN")) WarningOrange
                                        else LightSageText.copy(alpha = 0.8f)
                            )
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Unlock and sweep control buttons
            if (isCracking) {
                Button(
                    onClick = { isCracking = false },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CriticalRed,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Default.Stop, contentDescription = "Halt Decrypt")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("HALT BRUTEFORCE SWEEP", fontWeight = FontWeight.Bold)
                }
            } else {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Start Automatic Dictionary Sweep Button
                    Button(
                        onClick = {
                            isCracking = true
                            crackingProgress = 0f
                            terminalLogs.clear()
                            terminalLogs.add("📡 Initializing wireless magnetic coupling...")
                            crackedKeyResult = null

                            scope.launch {
                                val keysToTest = listOf(
                                    "FFFFFFFFFFFF",
                                    "A0A1A2A3A4A5",
                                    "B0B1B2B3B4B5",
                                    customHexKey.ifBlank { "D3F7D3F7D3F7" },
                                    "000000000000",
                                    "4D3A9F5E2C1B",
                                    "D3F7D3F7D3F7",
                                    "AABBCCDDEEFF"
                                )

                                for (i in keysToTest.indices) {
                                    if (!isCracking) break
                                    val currentKey = keysToTest[i]
                                    crackingProgress = (i + 1).toFloat() / keysToTest.size

                                    // Print check log
                                    terminalLogs.add("🔒 [TEST] Sector $selectedSector ($activeKeyType) -> Trying Key: $currentKey")
                                    
                                    // Acoustic feedback representing RF ping frequency
                                    try {
                                        com.example.utils.SoundSynthesizer.playBeep(viewModel.soundFrequency + (i * 80), 80)
                                    } catch (e: Exception) { /* Silent fallback */ }

                                    kotlinx.coroutines.delay(280)

                                    // Let's design sector unlock match: Let's assume index 3 (which represents custom key, or index 1, or FFFFFFFFFFFF) will match
                                    if (i == 1 || currentKey == customHexKey) {
                                        // Key found!
                                        terminalLogs.add("✅ [SUCCESS] SECTOR $selectedSector UNLOCKED!")
                                        terminalLogs.add("🔑 Discovered $activeKeyType Match: $currentKey")
                                        crackedKeyResult = currentKey
                                        unlockedKeys = unlockedKeys + (selectedSector to (activeKeyType to currentKey))
                                        
                                        // Play victory chime
                                        try {
                                            com.example.utils.SoundSynthesizer.playBeep(viewModel.soundFrequency + 400, 150)
                                            com.example.utils.SoundSynthesizer.playBeep(viewModel.soundFrequency + 800, 250)
                                        } catch (e: Exception) {}
                                        
                                        // Pre-fill fields for HCE emulation or scanner logs
                                        viewModel.customAlertMessage = "🔓 Secured Sector Unlock: $currentKey!"
                                        break
                                    } else {
                                        terminalLogs.add("❌ [FAILED] Auth failure with Key $currentKey")
                                    }
                                }

                                if (crackedKeyResult == null && isCracking) {
                                    terminalLogs.add("⚠️ [COMPLETED] Dictionary exhausted. No default elevator sector password matched.")
                                }
                                isCracking = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = GatorGreenPrimary,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("start_decrypt_btn")
                    ) {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = "Crack Password")
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("RUN SCANNER SWEEP", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }

            // Options on key cracked successfully
            crackedKeyResult?.let { key ->
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        viewModel.inputTagPayload = "Card: MIFARE Classic 1K - Decrypted Sector: $selectedSector Key: $key"
                        viewModel.emulatedPayload = "Decrypted Sector $selectedSector Key: $key"
                        viewModel.sendSystemNotification("Decryptor Transceiver Inject", "Injected Sector $selectedSector Password key $key successfully into your active Emulator payload!")
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GoldSector,
                        contentColor = Color.Black
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("inject_decrypted_payload_btn")
                ) {
                    Icon(imageVector = Icons.Default.QrCode, contentDescription = "Inject Key")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("INJECT KEY TO SIMULATION", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                }
            }
        }
    }
}


@Composable
fun NfcEasySetupCard(viewModel: NfcViewModel) {
    var selectedPresetIndex by remember { mutableStateOf(-1) }
    
    val presets = remember {
        listOf(
            PresetItem(
                id = "B4:CE:9F:8A",
                name = "Penthouse Suite Fob",
                payload = "MIFARE Classic 1K - Secure Sector 0xF3 - Levels: PH, 10, 12",
                sector = 3,
                frequency = 1320,
                icon = Icons.Default.Home,
                desc = "Standard residential elevator fob"
            ),
            PresetItem(
                id = "5A:80:C2:59",
                name = "Office Staff Badge",
                payload = "DESFire EV1 4K - Facility: 154 - ID: 22894 - Main Entrance",
                sector = 1,
                frequency = 1560,
                icon = Icons.Default.Work,
                desc = "Commercial office speed-gates"
            ),
            PresetItem(
                id = "22:99:AA:BB",
                name = "Parking Garage Gate",
                payload = "Legacy MIFARE Plus - Block 0x01 Decrypted UID code",
                sector = 0,
                frequency = 1100,
                icon = Icons.Default.Lock,
                desc = "Subterranean heavy gate sensor"
            ),
            PresetItem(
                id = "D3:E5:67:8B",
                name = "Wellness Club Ring",
                payload = "Ultralight C - Ring Serial UID for Locker & Turnstile",
                sector = 5,
                frequency = 1440,
                icon = Icons.Filled.Star,
                desc = "Active smart-ring key code"
            )
        )
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_easy_setup_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, LimeHighlight.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Easy Setup Header",
                    tint = LimeHighlight,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "1-CLICK QUICK PRESETS SETUP",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = LimeHighlight
                    )
                    Text(
                        text = "Load standard elevator and gate configs instantly",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(14.dp))
            
            Text(
                text = "Skip typing tedious hexadecimal inputs and sector keys. Tap a standard key signature to load it directly into HCE transceiver and inventory, or tap the cloud icon to save to your local database:",
                style = MaterialTheme.typography.bodySmall.copy(lineHeight = 16.sp),
                color = LightSageText.copy(alpha = 0.8f)
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            presets.forEachIndexed { index, preset ->
                val isSelected = selectedPresetIndex == index
                
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) GatorGreenPrimary.copy(alpha = 0.25f) else DeepSwampDark)
                        .border(
                            width = 1.dp, 
                            color = if (isSelected) LimeHighlight else GatorGreenPrimary.copy(alpha = 0.15f), 
                            shape = RoundedCornerShape(8.dp)
                        )
                        .clickable {
                            selectedPresetIndex = index
                            viewModel.applyPresetToInputs(
                                id = preset.id,
                                name = preset.name,
                                payload = preset.payload,
                                sector = preset.sector,
                                frequency = preset.frequency
                            )
                        }
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSelected) LimeHighlight.copy(alpha = 0.15f) else DarkGreenSurface)
                                .border(1.dp, if (isSelected) LimeHighlight.copy(alpha = 0.4f) else Color.Transparent, RoundedCornerShape(6.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = preset.icon,
                                contentDescription = preset.name,
                                tint = if (isSelected) LimeHighlight else LightSageText.copy(alpha = 0.7f),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        
                        Spacer(modifier = Modifier.width(12.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = preset.name,
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                color = if (isSelected) LimeHighlight else LightSageText
                            )
                            Text(
                                text = preset.desc,
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                                color = LightSageText.copy(alpha = 0.5f)
                            )
                        }
                        
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            IconButton(
                                onClick = {
                                    selectedPresetIndex = index
                                    viewModel.applyPresetToInputs(
                                        id = preset.id,
                                        name = preset.name,
                                        payload = preset.payload,
                                        sector = preset.sector,
                                        frequency = preset.frequency
                                    )
                                },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Edit,
                                    contentDescription = "Load Config",
                                    tint = if (isSelected) LimeHighlight else LightSageText.copy(alpha = 0.4f),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                            
                            IconButton(
                                onClick = {
                                    viewModel.importPresetToInventory(
                                        id = preset.id,
                                        name = preset.name,
                                        payload = preset.payload,
                                        sector = preset.sector
                                    )
                                },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CloudDownload,
                                    contentDescription = "Import to Inventory",
                                    tint = GoldSector,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = GatorGreenPrimary.copy(alpha = 0.2f))
            Spacer(modifier = Modifier.height(10.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Need a new custom card id?",
                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                    color = LightSageText.copy(alpha = 0.6f)
                )
                
                Button(
                    onClick = {
                        val randomHex = { (50..250).random().toString(16).uppercase().padStart(2, '0') }
                        val generatedId = "${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}"
                        viewModel.applyPresetToInputs(
                            id = generatedId,
                            name = "Random Generated Key",
                            payload = "NTAG215 - Secure Hash Code ${generatedId.replace(":", "")}",
                            sector = (1..15).random(),
                            frequency = (900..1800).random()
                        )
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = GatorGreenPrimary.copy(alpha = 0.3f),
                        contentColor = LimeHighlight
                    ),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier.height(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Randomize",
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "GENERATE UID",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 9.sp)
                    )
                }
            }
        }
    }
}

data class PresetItem(
    val id: String,
    val name: String,
    val payload: String,
    val sector: Int,
    val frequency: Int,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val desc: String
)

@Composable
fun FrequencySpectrumVisualizer(
    detected: Float,
    target: Float,
    offset: Float,
    isAlertTriggered: Boolean,
    isMonitoringActive: Boolean
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .background(DeepSwampDark, RoundedCornerShape(8.dp))
            .border(1.dp, if (isAlertTriggered && isMonitoringActive) CriticalRed.copy(alpha = 0.5f) else GatorGreenPrimary.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height
            val centerY = height / 2f
            
            // Draw secondary background noise floor sine wave if monitoring is active
            if (isMonitoringActive) {
                val wavePath = Path()
                wavePath.moveTo(0f, centerY)
                val segments = 100
                val frequency = 4f
                val amplitude = if (isAlertTriggered) 12.dp.toPx() else 4.dp.toPx()
                for (i in 0..segments) {
                    val x = (i.toFloat() / segments.toFloat()) * width
                    val angle = (i.toFloat() / segments.toFloat()) * Math.PI * 2 * frequency
                    val y = centerY + Math.sin(angle).toFloat() * amplitude
                    if (i == 0) wavePath.moveTo(x, y) else wavePath.lineTo(x, y)
                }
                drawPath(
                    path = wavePath,
                    color = if (isAlertTriggered) CriticalRed.copy(alpha = 0.15f) else LimeHighlight.copy(alpha = 0.08f),
                    style = Stroke(width = 1.5.dp.toPx())
                )
            }

            // Draw center baseline axis
            drawLine(
                color = LightSageText.copy(alpha = 0.15f),
                start = Offset(0f, centerY),
                end = Offset(width, centerY),
                strokeWidth = 1.dp.toPx()
            )

            // Define scale band +/- 2.5 MHz
            val range = 2.5f
            
            // Map frequencies to X points
            fun getXForFreq(f: Float): Float {
                val delta = f - target
                val pct = (delta / range) // from -1.0 to 1.0
                val clamped = pct.coerceIn(-1f, 1f)
                return (clamped + 1f) / 2f * width
            }

            // Draw safety green zone overlay
            val safetyMinX = getXForFreq(target - offset)
            val safetyMaxX = getXForFreq(target + offset)
            drawRect(
                color = if (isAlertTriggered && isMonitoringActive) WarningOrange.copy(alpha = 0.08f) else GatorGreenPrimary.copy(alpha = 0.12f),
                topLeft = Offset(safetyMinX, 2.dp.toPx()),
                size = Size(safetyMaxX - safetyMinX, height - 4.dp.toPx())
            )

            // Draw target authorized center mark dashed line
            val centerMarkX = getXForFreq(target)
            drawLine(
                color = LimeHighlight.copy(alpha = 0.5f),
                start = Offset(centerMarkX, 2.dp.toPx()),
                end = Offset(centerMarkX, height - 2.dp.toPx()),
                strokeWidth = 1.5.dp.toPx(),
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
            )

            // Draw detected carrier peak vertical line if active
            if (isMonitoringActive) {
                val detectedX = getXForFreq(detected)
                
                // Draw impulse line
                drawLine(
                    color = if (isAlertTriggered) CriticalRed else LimeHighlight,
                    start = Offset(detectedX, 2.dp.toPx()),
                    end = Offset(detectedX, height - 2.dp.toPx()),
                    strokeWidth = 3.dp.toPx()
                )

                // Glow circle backplate
                drawCircle(
                    color = if (isAlertTriggered) CriticalRed.copy(alpha = 0.4f) else LimeHighlight.copy(alpha = 0.4f),
                    radius = 6.dp.toPx(),
                    center = Offset(detectedX, centerY)
                )
            }
        }
    }
}

@Composable
fun NfcFrequencyMonitoringCard(viewModel: NfcViewModel) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_frequency_monitoring_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, if (viewModel.isFrequencyAlertTriggered && viewModel.isFrequencyMonitoringActive) CriticalRed.copy(alpha = 0.5f) else GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.GraphicEq,
                    contentDescription = "Spectrum Monitor",
                    tint = if (viewModel.isFrequencyAlertTriggered && viewModel.isFrequencyMonitoringActive) CriticalRed else LimeHighlight,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "COIL FREQUENCY MONITOR",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = if (viewModel.isFrequencyAlertTriggered && viewModel.isFrequencyMonitoringActive) CriticalRed else LimeHighlight
                    )
                    Text(
                        text = "Carrier Signal Spectrum & Shielding",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }

                // Alert switch
                Switch(
                    checked = viewModel.isFrequencyMonitoringActive,
                    onCheckedChange = { viewModel.toggleFrequencyMonitoring() },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = LimeHighlight,
                        checkedTrackColor = GatorGreenPrimary.copy(alpha = 0.5f),
                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                        uncheckedTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.scale(0.85f)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Sub Status Box
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepSwampDark, RoundedCornerShape(6.dp))
                    .padding(8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "CURRENT SIGNAL FREQUENCY",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 9.sp, fontWeight = FontWeight.Bold),
                        color = LightSageText.copy(alpha = 0.5f)
                    )
                    Text(
                        text = if (viewModel.isFrequencyMonitoringActive) "${viewModel.detectedFrequencyMHz} MHz" else "OFFLINE",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            color = if (!viewModel.isFrequencyMonitoringActive) LightSageText.copy(alpha = 0.4f)
                                   else if (viewModel.isFrequencyAlertTriggered) CriticalRed else LimeHighlight
                        )
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            if (!viewModel.isFrequencyMonitoringActive) DeepSwampDark
                            else if (viewModel.isFrequencyAlertTriggered) CriticalRed.copy(alpha = 0.15f)
                            else GatorGreenPrimary.copy(alpha = 0.15f)
                        )
                        .border(
                            1.dp,
                            if (!viewModel.isFrequencyMonitoringActive) Color.Transparent
                            else if (viewModel.isFrequencyAlertTriggered) CriticalRed.copy(alpha = 0.4f)
                            else GatorGreenPrimary.copy(alpha = 0.4f),
                            RoundedCornerShape(4.dp)
                        )
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (!viewModel.isFrequencyMonitoringActive) "MONITOR OFF"
                               else if (viewModel.isFrequencyAlertTriggered) "UNAUTHORIZED BREACH"
                               else "COIL ALIGNED",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 9.sp),
                        color = if (!viewModel.isFrequencyMonitoringActive) LightSageText.copy(alpha = 0.4f)
                               else if (viewModel.isFrequencyAlertTriggered) CriticalRed
                               else LimeHighlight
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Custom Spectral Visualizer Canvas!
            FrequencySpectrumVisualizer(
                detected = viewModel.detectedFrequencyMHz,
                target = viewModel.authorizedFrequencyMHz,
                offset = viewModel.allowedFrequencyOffsetMHz,
                isAlertTriggered = viewModel.isFrequencyAlertTriggered,
                isMonitoringActive = viewModel.isFrequencyMonitoringActive
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Config Controls Section
            Text(
                text = "SAFETY ENVELOPE CONFIGURATION",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                color = LimeHighlight.copy(alpha = 0.8f)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Target Authorized slider
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Authorized Target Freq",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                    Text(
                        text = "${viewModel.authorizedFrequencyMHz} MHz",
                        style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold),
                        color = LimeHighlight
                    )
                }
                Slider(
                    value = viewModel.authorizedFrequencyMHz,
                    onValueChange = { viewModel.setAuthorizedFrequency(it) },
                    valueRange = 10.0f..18.0f,
                    colors = SliderDefaults.colors(
                        thumbColor = LimeHighlight,
                        activeTrackColor = GatorGreenPrimary,
                        inactiveTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // Offset / Tolerance Deviation Slider
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Allowed Offset Limit",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                    Text(
                        text = "±${viewModel.allowedFrequencyOffsetMHz} MHz",
                        style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold),
                        color = LimeHighlight
                    )
                }
                Slider(
                    value = viewModel.allowedFrequencyOffsetMHz,
                    onValueChange = { viewModel.setFrequencyOffset(it) },
                    valueRange = 0.05f..1.50f,
                    colors = SliderDefaults.colors(
                        thumbColor = LimeHighlight,
                        activeTrackColor = GatorGreenPrimary,
                        inactiveTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Auto-Block Guard Switch Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(DeepSwampDark)
                    .border(0.5.dp, GatorGreenPrimary.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = "Shield Icon",
                        tint = if (viewModel.autoBlockUnauthorizedFrequencies) LimeHighlight else LightSageText.copy(alpha = 0.4f),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Auto-Block Threat Signals",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            color = LightSageText
                        )
                        Text(
                            text = "Interdict coils outside safety boundaries",
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                            color = LightSageText.copy(alpha = 0.5f)
                        )
                    }
                }
                Switch(
                    checked = viewModel.autoBlockUnauthorizedFrequencies,
                    onCheckedChange = { viewModel.autoBlockUnauthorizedFrequencies = it },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = LimeHighlight,
                        checkedTrackColor = GatorGreenPrimary.copy(alpha = 0.5f),
                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                        uncheckedTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.scale(0.8f)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Test Simulation Triggers Row
            Text(
                text = "TRIGGER TEST SIGNALS INJECTION",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp),
                color = LightSageText.copy(alpha = 0.5f)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                // 13.56 NFC Standard button
                Button(
                    onClick = {
                        viewModel.detectNewSignalFrequency(13.56f)
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = LightSageText
                    ),
                    border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                    modifier = Modifier.weight(1f).height(32.dp)
                ) {
                    Text("13.56 MHz\n(NFC)", style = MaterialTheme.typography.bodySmall.copy(fontSize = 9.sp, textAlign = TextAlign.Center, fontWeight = FontWeight.Bold))
                }

                // 13.88 Spoofer button
                Button(
                    onClick = {
                        viewModel.detectNewSignalFrequency(13.88f)
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = WarningOrange
                    ),
                    border = BorderStroke(1.dp, WarningOrange.copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                    modifier = Modifier.weight(1f).height(32.dp)
                ) {
                    Text("13.88 MHz\n(Spoofer)", style = MaterialTheme.typography.bodySmall.copy(fontSize = 9.sp, textAlign = TextAlign.Center, fontWeight = FontWeight.Bold))
                }

                // 16.50 High Frequency clone tag button
                Button(
                    onClick = {
                        viewModel.detectNewSignalFrequency(16.50f)
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = CriticalRed
                    ),
                    border = BorderStroke(1.dp, CriticalRed.copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                    modifier = Modifier.weight(1f).height(32.dp)
                ) {
                    Text("16.50 MHz\n(Threat)", style = MaterialTheme.typography.bodySmall.copy(fontSize = 9.sp, textAlign = TextAlign.Center, fontWeight = FontWeight.Bold))
                }
            }
        }
    }
}

@Composable
fun NfcFrequencyAlarmSettingsCard(viewModel: NfcViewModel) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("nfc_frequency_alarm_settings_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, if (viewModel.isAlarmCurrentlyRinging) CriticalRed.copy(alpha = 0.5f) else GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.NotificationsActive,
                    contentDescription = "Alarm Settings Header",
                    tint = if (viewModel.isAlarmCurrentlyRinging) CriticalRed else LimeHighlight,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "BREACH DETECTION SIREN",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 1.sp),
                        color = if (viewModel.isAlarmCurrentlyRinging) CriticalRed else LimeHighlight
                    )
                    Text(
                        text = "Visual & audio spectrum security systems",
                        style = MaterialTheme.typography.bodySmall.copy(color = LightSageText.copy(alpha = 0.6f))
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Alarm Sound Enabled Switch Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.VolumeUp,
                        contentDescription = "Sound Alert",
                        tint = if (viewModel.isAlarmSoundEnabled) LimeHighlight else LightSageText.copy(alpha = 0.4f),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Audio Alarm Echo",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            color = LightSageText
                        )
                        Text(
                            text = "Sound synthetics loop when breached",
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                            color = LightSageText.copy(alpha = 0.5f)
                        )
                    }
                }
                Switch(
                    checked = viewModel.isAlarmSoundEnabled,
                    onCheckedChange = { viewModel.updateAlarmSoundEnabled(it) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = LimeHighlight,
                        checkedTrackColor = GatorGreenPrimary.copy(alpha = 0.5f),
                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                        uncheckedTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.scale(0.8f).testTag("alarm_sound_switch")
                )
            }

            // Alarm Visual Glow Enabled Switch Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Lightbulb,
                        contentDescription = "Visual Alert",
                        tint = if (viewModel.isVisualAlarmEnabled) LimeHighlight else LightSageText.copy(alpha = 0.4f),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Visual Laser Strobe Alert",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            color = LightSageText
                        )
                        Text(
                            text = "Pulsing red screen glowing strobe borders",
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                            color = LightSageText.copy(alpha = 0.5f)
                        )
                    }
                }
                Switch(
                    checked = viewModel.isVisualAlarmEnabled,
                    onCheckedChange = { viewModel.updateVisualAlarmEnabled(it) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = LimeHighlight,
                        checkedTrackColor = GatorGreenPrimary.copy(alpha = 0.5f),
                        uncheckedThumbColor = LightSageText.copy(alpha = 0.5f),
                        uncheckedTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.scale(0.8f).testTag("alarm_visual_switch")
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            HorizontalDivider(color = GatorGreenPrimary.copy(alpha = 0.15f))
            Spacer(modifier = Modifier.height(10.dp))

            // Alarm Tone Type Selector Chips
            Text(
                text = "ALARM SIREN WAVE PATTERN",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp),
                color = LightSageText.copy(alpha = 0.5f)
            )
            Spacer(modifier = Modifier.height(6.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(
                    Pair("SIREN_PULSE", "Sweep Siren"),
                    Pair("FAST_BEEP", "Rapid Beep"),
                    Pair("STEADY_TONE", "Steady Ring")
                ).forEach { toneConfig ->
                    val isSelected = viewModel.alarmToneType == toneConfig.first
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isSelected) GatorGreenPrimary.copy(alpha = 0.25f) else DeepSwampDark)
                            .border(width = 0.5.dp, color = if (isSelected) LimeHighlight else GatorGreenPrimary.copy(alpha = 0.15f), shape = RoundedCornerShape(6.dp))
                            .clickable {
                                viewModel.updateAlarmToneType(toneConfig.first)
                            }
                            .padding(vertical = 8.dp)
                            .testTag("alarm_tone_" + toneConfig.first),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = toneConfig.second,
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, fontWeight = FontWeight.Bold),
                            color = if (isSelected) LimeHighlight else LightSageText.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Alarm Pitch Frequency Configuration
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Siren Pitch Key",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                    Text(
                        text = "${viewModel.alarmPitchConfigHz} Hz",
                        style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold),
                        color = LimeHighlight
                    )
                }
                Slider(
                    value = viewModel.alarmPitchConfigHz.toFloat(),
                    onValueChange = { viewModel.updateAlarmPitch(it) },
                    valueRange = 800f..3500f,
                    colors = SliderDefaults.colors(
                        thumbColor = LimeHighlight,
                        activeTrackColor = GatorGreenPrimary,
                        inactiveTrackColor = DeepSwampDark
                    ),
                    modifier = Modifier.fillMaxWidth().testTag("alarm_pitch_slider")
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Manual Siren Test Button Row
            if (viewModel.isAlarmCurrentlyRinging) {
                Button(
                    onClick = { viewModel.silenceAlarm() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CriticalRed,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth().testTag("manual_siren_silence_btn")
                ) {
                    Icon(imageVector = Icons.Default.VolumeOff, contentDescription = "Mute Siren")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("CEASE ALARM SIREN", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                }
            } else {
                Button(
                    onClick = { viewModel.triggerAlarmRinging() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DeepSwampDark,
                        contentColor = LimeHighlight
                    ),
                    border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth().testTag("manual_siren_test_btn")
                ) {
                    Icon(imageVector = Icons.Default.VolumeUp, contentDescription = "Test Siren")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("TRIGGER MANUAL SIREN TEST", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SecurePinEntryOverlay(
    viewModel: NfcViewModel
) {
    if (viewModel.pinDialogVisible) {
        AlertDialog(
            onDismissRequest = { 
                viewModel.pinDialogVisible = false 
                viewModel.enteredPinBuffer = ""
                viewModel.pinDialogErrorMsg = ""
            },
            properties = androidx.compose.ui.window.DialogProperties(usePlatformDefaultWidth = false)
        ) {
            Surface(
                modifier = Modifier
                    .padding(24.dp)
                    .fillMaxWidth()
                    .border(2.dp, LimeHighlight, RoundedCornerShape(24.dp))
                    .testTag("secure_pin_dialog"),
                shape = RoundedCornerShape(24.dp),
                color = DeepSwampDark,
                contentColor = LightSageText
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Lock Icon",
                        tint = LimeHighlight,
                        modifier = Modifier.size(40.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = viewModel.pinDialogTitle,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                        color = LimeHighlight
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = viewModel.pinDialogSubtext,
                        style = MaterialTheme.typography.bodyMedium.copy(textAlign = TextAlign.Center),
                        color = LightSageText.copy(alpha = 0.8f)
                    )
                    
                    Spacer(modifier = Modifier.height(20.dp))
                    
                    // Pin indicators (4 bubbles)
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        for (i in 0 until 4) {
                            val isEntered = i < viewModel.enteredPinBuffer.length
                            Box(
                                modifier = Modifier
                                    .size(18.dp)
                                    .clip(androidx.compose.foundation.shape.CircleShape)
                                    .background(
                                        if (isEntered) LimeHighlight else GatorGreenPrimary.copy(alpha = 0.3f)
                                    )
                                    .border(
                                        1.5.dp, 
                                        if (isEntered) LimeHighlight else LightSageText.copy(alpha = 0.3f),
                                        androidx.compose.foundation.shape.CircleShape
                                    )
                            )
                        }
                    }

                    if (viewModel.pinDialogErrorMsg.isNotBlank()) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = viewModel.pinDialogErrorMsg,
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = CriticalRed, 
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Tactical 3x4 layout of PIN input numbers
                    val numbers = listOf(
                        listOf("1", "2", "3"),
                        listOf("4", "5", "6"),
                        listOf("7", "8", "9"),
                        listOf("Cancel", "0", "⌫")
                    )

                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        numbers.forEach { row ->
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.fillMaxWidth(0.9f)
                            ) {
                                row.forEach { text ->
                                    val isSpecial = text == "Cancel" || text == "⌫"
                                    Button(
                                        onClick = {
                                            if (text == "Cancel") {
                                                viewModel.pinDialogVisible = false
                                                viewModel.enteredPinBuffer = ""
                                                viewModel.pinDialogErrorMsg = ""
                                            } else if (text == "⌫") {
                                                if (viewModel.enteredPinBuffer.isNotEmpty()) {
                                                    viewModel.enteredPinBuffer = viewModel.enteredPinBuffer.dropLast(1)
                                                }
                                            } else {
                                                if (viewModel.enteredPinBuffer.length < 4) {
                                                    viewModel.enteredPinBuffer += text
                                                }
                                                // Auto submit once 4 digits entered!
                                                if (viewModel.enteredPinBuffer.length == 4) {
                                                    viewModel.submitPin(viewModel.enteredPinBuffer)
                                                }
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (isSpecial) DarkGreenSurface else DeepSwampDark,
                                            contentColor = if (text == "Cancel") CriticalRed else if (text == "⌫") WarningOrange else LimeHighlight
                                        ),
                                        border = BorderStroke(
                                            1.dp, 
                                            if (isSpecial) GatorGreenPrimary.copy(alpha = 0.3f) else LimeHighlight.copy(alpha = 0.2f)
                                        ),
                                        shape = RoundedCornerShape(12.dp),
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(44.dp)
                                            .testTag("pin_btn_$text")
                                    ) {
                                        Text(
                                            text = text,
                                            style = MaterialTheme.typography.bodyMedium.copy(
                                                fontWeight = FontWeight.Bold,
                                                fontSize = if (isSpecial) 11.sp else 16.sp
                                            )
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun LockedLogsLedgerCard(
    onUnlockClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp)
            .testTag("locked_logs_ledger_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.LockOpen,
                contentDescription = "History Encrypted Lock",
                tint = WarningOrange,
                modifier = Modifier.size(36.dp)
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "ACCESS DECOMPILER HISTORY ENCRYPTED",
                style = MaterialTheme.typography.titleSmall.copy(
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                ),
                color = WarningOrange
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Handshake transactions and payload cache are PIN-protected.",
                style = MaterialTheme.typography.bodySmall.copy(
                    textAlign = TextAlign.Center,
                    color = LightSageText.copy(alpha = 0.6f)
                )
            )
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onUnlockClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = WarningOrange,
                    contentColor = DeepSwampDark
                ),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.testTag("unlock_history_btn")
            ) {
                Icon(imageVector = Icons.Default.VpnKey, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "UNLOCK SENSITIVE SCAN HISTORY",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}

@Composable
fun SecuritySettingsCard(
    viewModel: NfcViewModel
) {
    var newPinInput by remember { mutableStateOf("") }
    var updateStatusMessage by remember { mutableStateOf("") }
    var isEditingPin by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("security_settings_card"),
        colors = CardDefaults.cardColors(
            containerColor = DarkGreenSurface,
            contentColor = LightSageText
        ),
        border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = "Security Config",
                    tint = LimeHighlight,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "SECURITY AND PIN PREFERENCES",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    fontFamily = FontFamily.Monospace,
                    color = LimeHighlight
                )
            }
            Spacer(modifier = Modifier.height(12.dp))

            // Action: Lock history again
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "History Ledger Encryption",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                        color = LightSageText
                    )
                    Text(
                        text = if (viewModel.isHistoryUnlocked) "Status: Authenticated / Revealed" else "Status: Locked / Encrypted",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (viewModel.isHistoryUnlocked) LimeHighlight else WarningOrange
                    )
                }
                
                Button(
                    onClick = {
                        if (viewModel.isHistoryUnlocked) {
                            // Instantly lock
                            viewModel.isHistoryUnlocked = false
                            updateStatusMessage = "History successfully encrypted and locked!"
                        } else {
                            // Show PIN challenge
                            viewModel.requestPinRelease(
                                title = "LOCK SYSTEM AUTHENTICATION",
                                subtext = "Enter safety PIN to immediately reveal transaction history.",
                                onSuccess = {
                                    viewModel.isHistoryUnlocked = true
                                    updateStatusMessage = "History unlocked successfully."
                                }
                            )
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (viewModel.isHistoryUnlocked) CriticalRed else GatorGreenPrimary,
                        contentColor = LightSageText
                    ),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier.testTag("toggle_history_lock_btn")
                ) {
                    Icon(
                        imageVector = if (viewModel.isHistoryUnlocked) Icons.Default.Lock else Icons.Default.LockOpen,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (viewModel.isHistoryUnlocked) "Lock History" else "Unlock History",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = GatorGreenPrimary.copy(alpha = 0.2f))
            Spacer(modifier = Modifier.height(16.dp))

            // PIN configuration form
            Text(
                text = "Master Security PIN Definition",
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                color = LightSageText
            )
            
            Spacer(modifier = Modifier.height(6.dp))

            if (!isEditingPin) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Current PIN Protocol: •••• (4 Digits Configured)",
                        style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                        color = LightSageText.copy(alpha = 0.7f)
                    )
                    Text(
                        text = "Edit PIN code",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = LimeHighlight
                        ),
                        modifier = Modifier
                            .clickable { isEditingPin = true }
                            .padding(4.dp)
                    )
                }
            } else {
                Column {
                    Text(
                        text = "Set New 4-Digit Numeric PIN",
                        style = MaterialTheme.typography.bodySmall,
                        color = LightSageText.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = newPinInput,
                            onValueChange = { input ->
                                if (input.length <= 4 && input.all { it.isDigit() }) {
                                    newPinInput = input
                                }
                            },
                            modifier = Modifier
                                .weight(1f)
                                .testTag("update_pin_input"),
                            placeholder = { Text("e.g. 5678", color = LightSageText.copy(alpha = 0.3f)) },
                            singleLine = true,
                            textStyle = LocalTextStyle.current.copy(
                                fontFamily = FontFamily.Monospace,
                                color = LightSageText
                            ),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = LimeHighlight,
                                unfocusedBorderColor = GatorGreenPrimary.copy(alpha = 0.5f),
                                focusedContainerColor = DeepSwampDark,
                                unfocusedContainerColor = DeepSwampDark
                            )
                        )
                        
                        Button(
                            onClick = {
                                if (newPinInput.length == 4) {
                                    viewModel.securePin = newPinInput
                                    isEditingPin = false
                                    updateStatusMessage = "Access PIN updated successfully!"
                                    newPinInput = ""
                                } else {
                                    updateStatusMessage = "ERROR: PIN must be exactly 4 digits."
                                }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = LimeHighlight,
                                contentColor = DeepSwampDark
                            ),
                            shape = RoundedCornerShape(6.dp),
                            modifier = Modifier.testTag("save_new_pin_btn")
                        ) {
                            Text("Save", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                        }
                        
                        Button(
                            onClick = {
                                isEditingPin = false
                                newPinInput = ""
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = DeepSwampDark,
                                contentColor = LightSageText
                            ),
                            border = BorderStroke(1.dp, GatorGreenPrimary.copy(alpha = 0.3f)),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Cancel", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }

            if (updateStatusMessage.isNotBlank()) {
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = updateStatusMessage,
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontFamily = FontFamily.Monospace,
                        color = if (updateStatusMessage.startsWith("ERROR")) CriticalRed else LimeHighlight
                    )
                )
                
                LaunchedEffect(updateStatusMessage) {
                    delay(4000)
                    updateStatusMessage = ""
                }
            }
        }
    }
}


fun shareCsvData(context: android.content.Context, csvString: String) {
    try {
        val file = java.io.File(context.cacheDir, "nfc_scan_history_backup.csv")
        file.writeText(csvString)
        
        val uri: android.net.Uri = androidx.core.content.FileProvider.getUriForFile(
            context,
            "com.example.fileprovider",
            file
        )
        
        val intent = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
            type = "text/csv"
            putExtra(android.content.Intent.EXTRA_STREAM, uri)
            putExtra(android.content.Intent.EXTRA_SUBJECT, "RFID/NFC Scan History Secure Backup")
            putExtra(android.content.Intent.EXTRA_TEXT, "Secure backup CSV export of decrypted NFC/RFID transactions and signal events.")
            addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        
        context.startActivity(android.content.Intent.createChooser(intent, "Securely Export CSV Backup"))
    } catch (e: Exception) {
        android.util.Log.e("NfcMainScreen", "Export CSV failed, falling back to text stream", e)
        val intent = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(android.content.Intent.EXTRA_SUBJECT, "RFID/NFC Scan History Backup (TXT)")
            putExtra(android.content.Intent.EXTRA_TEXT, csvString)
        }
        context.startActivity(android.content.Intent.createChooser(intent, "Securely Share CSV Text"))
    }
}


