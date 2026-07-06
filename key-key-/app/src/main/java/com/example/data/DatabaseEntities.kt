package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "nfc_tags")
data class NfcTag(
    @PrimaryKey val tagId: String,
    val name: String,
    val textPayload: String,
    val encryptionKey: Int = 1, // Can be adjusted up or down (e.g. 0-16)
    val tagType: String = "NfcA/NDEF",
    val createdTimestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "access_events")
data class AccessEvent(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val tagId: String,
    val tagName: String,
    val textPayload: String,
    val eventType: String, // "SCAN_PHYSICAL", "SCAN_SIMULATED", "CLONED", "WRITTEN"
    val alertToneFreqHz: Int, // The sound pitch frequency factor adjusted up/down
    val alertTriggeredText: String, // Custom alert notification text
    val timestamp: Long = System.currentTimeMillis()
)
