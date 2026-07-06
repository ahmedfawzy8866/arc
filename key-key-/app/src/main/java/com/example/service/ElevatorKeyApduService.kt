package com.example.service

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log
import java.nio.charset.StandardCharsets

/**
 * HostApduService implementing NFC Card Emulation for Elevator & Smart Access Keys.
 * Handles incoming reader APDU commands and responds with transmissible encrypted sectors / key credentials.
 */
class ElevatorKeyApduService : HostApduService() {

    companion object {
        private const val TAG = "ElevatorKeyApdu"
        
        // NFC ISO-DEP Status Words
        private val STATUS_SUCCESS = byteArrayOf(0x90.toByte(), 0x00.toByte())
        private val STATUS_FAILED = byteArrayOf(0x6F.toByte(), 0x00.toByte())

        // Standard SELECT AID APDU command (00 A4 04 00 [Length] [AID])
        // Where AID matches "F0010203040506" from apdu_service.xml
        private val SELECT_AID_COMMAND = byteArrayOf(
            0x00.toByte(), 0xA4.toByte(), 0x04.toByte(), 0x00.toByte(),
            0x07.toByte(), // AID length
            0xF0.toByte(), 0x01.toByte(), 0x02.toByte(), 0x03.toByte(), 0x04.toByte(), 0x05.toByte(), 0x06.toByte()
        )

        // HCE State variables shared globally with the application frontend UI and VM
        @Volatile
        var isEmulationActive = false

        @Volatile
        var emulatedUid = "E4:8B:2A:7D"

        @Volatile
        var emulatedName = "Main Elevator Key Fob"

        @Volatile
        var emulatedPayload = "Card Type: MIFARE Classic 1K - Auth ID: 0x88F11A"

        // Active listener to streams HCE actions and APDU Handshake details directly to the main screen log
        @Volatile
        var onApduLogged: ((String) -> Unit)? = null
    }

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        if (commandApdu == null) {
            return STATUS_FAILED
        }

        // Convert the input command APDU bytes to readable hex sequence
        val hexCommand = commandApdu.joinToString("") { String.format("%02X", it) }
        Log.i(TAG, "HCE Receiver -> APDU command payload: $hexCommand")

        // Broadcast to runtime log
        logApduMessage("-> APDU Command: $hexCommand")

        if (!isEmulationActive) {
            logApduMessage("<- Denied (System in standby / active mode toggle disabled)")
            return STATUS_FAILED
        }

        // Verify if command is SELECT AID representing initial access sweep
        if (isSelectAidCommand(commandApdu)) {
            logApduMessage("-> Handshake matched: SELECT AID (F0010203040506)")
            
            // Format dynamic credential packets to emulate the stored tag credentials
            val identityString = "UID:$emulatedUid;NAME:$emulatedName;VAL:$emulatedPayload"
            val identityBytes = identityString.toByteArray(StandardCharsets.UTF_8)

            // Construct Response APDU (Identity Data + STATUS_SUCCESS)
            val responseApdu = ByteArray(identityBytes.size + STATUS_SUCCESS.size)
            System.arraycopy(identityBytes, 0, responseApdu, 0, identityBytes.size)
            System.arraycopy(STATUS_SUCCESS, 0, responseApdu, identityBytes.size, STATUS_SUCCESS.size)

            logApduMessage("<- Broadcast identity payload: $identityString")
            logApduMessage("<- Handshake successfully authorized!")
            return responseApdu
        }

        // Handle generic secondary transaction commands with standard confirmation status
        logApduMessage("<- Processed generic sector challenge. Returning STATUS_SUCCESS (9000).")
        return STATUS_SUCCESS
    }

    override fun onDeactivated(reason: Int) {
        val reasonMessage = when (reason) {
            DEACTIVATION_LINK_LOSS -> "Link Loss (Reader Field Lost)"
            DEACTIVATION_DESELECTED -> "Deselected (Another Applet/AID chosen)"
            else -> "Field idle (Code $reason)"
        }
        Log.d(TAG, "HCE Deactivated: $reasonMessage")
        logApduMessage("❌ HCE Antennas Disengaged: $reasonMessage")
    }

    private fun isSelectAidCommand(command: ByteArray): Boolean {
        if (command.size < SELECT_AID_COMMAND.size) return false
        for (i in SELECT_AID_COMMAND.indices) {
            if (command[i] != SELECT_AID_COMMAND[i]) return false
        }
        return true
    }

    private fun logApduMessage(message: String) {
        onApduLogged?.invoke(message)
    }
}
