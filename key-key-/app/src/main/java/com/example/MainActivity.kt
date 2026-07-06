package com.example

import android.app.PendingIntent
import android.content.Intent
import android.content.IntentFilter
import android.nfc.NdefMessage
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import com.example.ui.NfcMainScreen
import com.example.ui.NfcViewModel
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

    private var nfcAdapter: NfcAdapter? = null
    private var pendingIntent: PendingIntent? = null

    // Instantiate our active state manager ViewModel via Android ViewModel Factory
    private val viewModel: NfcViewModel by viewModels {
        NfcViewModel.Factory(application)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize NFC Hardware Adapter
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC hardware is not available on this device.", Toast.LENGTH_LONG).show()
        }

        // Initialize PendingIntent for foreground NFC dispatch redirection
        val intent = Intent(this, javaClass).apply {
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }
        pendingIntent = PendingIntent.getActivity(this, 0, intent, flags)

        setContent {
            MyApplicationTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    NfcMainScreen(
                        viewModel = viewModel,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }

        // Parse startup intent in case app was launched directly by scanning as per OS rules
        intent?.let { handleNfcIntent(it) }
    }

    override fun onResume() {
        super.onResume()
        // Bind foreground dispatch while activity is visible to capture broadcasts
        nfcAdapter?.let { adapter ->
            val ndefFilter = IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED).apply {
                try {
                    addDataType("text/plain")
                } catch (e: Exception) {
                    // Ignore transient mime fails
                }
            }
            val tagFilter = IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED)
            val techFilter = IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED)
            val filters = arrayOf(ndefFilter, tagFilter, techFilter)

            adapter.enableForegroundDispatch(this, pendingIntent, filters, null)
        }
    }

    override fun onPause() {
        super.onPause()
        // Release dispatch to allow background OS routines when user leaves
        nfcAdapter?.disableForegroundDispatch(this)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleNfcIntent(intent)
    }

    /**
     * Extracts tag hardware metadata, parses NDEF payload strings, and reports to the ViewModel.
     */
    private fun handleNfcIntent(intent: Intent) {
        val action = intent.action
        if (NfcAdapter.ACTION_NDEF_DISCOVERED == action ||
            NfcAdapter.ACTION_TAG_DISCOVERED == action ||
            NfcAdapter.ACTION_TECH_DISCOVERED == action
        ) {
            val tag: Tag? = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG)
            val uid = tag?.id?.joinToString(":") { String.format("%02X", it) } ?: "UNKNOWN_TAG"
            
            // Decode NDEF payload contents
            var textPayload = ""
            val rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES)
            if (rawMsgs != null && rawMsgs.isNotEmpty()) {
                val message = rawMsgs[0] as? NdefMessage
                if (message != null && message.records.isNotEmpty()) {
                    val record = message.records[0]
                    val payloadBytes = record.payload
                    if (payloadBytes.isNotEmpty()) {
                        val statusByte = payloadBytes[0].toInt()
                        val languageCodeLength = statusByte and 0x3F
                        val encoding = if ((statusByte and 0x100) == 0) "UTF-8" else "UTF-16"
                        try {
                            if (payloadBytes.size > languageCodeLength + 1) {
                                textPayload = String(
                                    payloadBytes,
                                    languageCodeLength + 1,
                                    payloadBytes.size - languageCodeLength - 1,
                                    charset(encoding)
                                )
                            }
                        } catch (e: Exception) {
                            textPayload = "Unreadable NDEF data encoding"
                        }
                    }
                }
            }

            val techString = tag?.techList?.joinToString { it.substringAfterLast(".") } ?: "NfcA/NDEF"

            // Fallback to descriptive technology lists if plain text payloads are absent
            if (textPayload.isBlank()) {
                textPayload = "Unformatted Gator tag ($techString)"
            }

            // Notify ViewModel to record event, play chime alert, check safety frequency tolerances and cache asset
            viewModel.onTagScannedWithFrequency(
                id = uid,
                payload = textPayload,
                typeName = "Physical Tag Scan Event",
                carrierFreq = 13.56f, // Baseline physical NFC frequency in MHz
                tagType = techString,
                isSimulated = false
            )
        }
    }
}
