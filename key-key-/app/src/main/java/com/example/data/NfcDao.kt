package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface NfcDao {
    // ---- Tags ----
    @Query("SELECT * FROM nfc_tags ORDER BY createdTimestamp DESC")
    fun getAllTagsFlow(): Flow<List<NfcTag>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTag(tag: NfcTag)

    @Query("DELETE FROM nfc_tags WHERE tagId = :tagId")
    suspend fun deleteTagById(tagId: String)

    @Query("SELECT * FROM nfc_tags WHERE tagId = :tagId LIMIT 1")
    suspend fun getTagById(tagId: String): NfcTag?

    // ---- Access Events Logs ----
    @Query("SELECT * FROM access_events ORDER BY timestamp DESC")
    fun getAllEventsFlow(): Flow<List<AccessEvent>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: AccessEvent)

    @Query("UPDATE access_events SET tagName = :nickname WHERE tagId = :tagId")
    suspend fun updateEventNicknameByTagId(tagId: String, nickname: String)

    @Query("UPDATE access_events SET tagName = :nickname WHERE id = :id")
    suspend fun updateEventNicknameById(id: Int, nickname: String)

    @Query("UPDATE nfc_tags SET name = :nickname WHERE tagId = :tagId")
    suspend fun updateTagNickname(tagId: String, nickname: String)

    @Query("DELETE FROM access_events")
    suspend fun clearAllEvents()
}
