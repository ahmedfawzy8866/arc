package com.example.data

import kotlinx.coroutines.flow.Flow

class NfcRepository(private val nfcDao: NfcDao) {

    val allTagsFlow: Flow<List<NfcTag>> = nfcDao.getAllTagsFlow()
    val allEventsFlow: Flow<List<AccessEvent>> = nfcDao.getAllEventsFlow()

    suspend fun insertTag(tag: NfcTag) {
        nfcDao.insertTag(tag)
    }

    suspend fun deleteTag(tagId: String) {
        nfcDao.deleteTagById(tagId)
    }

    suspend fun getTagById(tagId: String): NfcTag? {
        return nfcDao.getTagById(tagId)
    }

    suspend fun logAccessEvent(event: AccessEvent) {
        nfcDao.insertEvent(event)
    }

    suspend fun updateNickname(tagId: String, nickname: String) {
        nfcDao.updateEventNicknameByTagId(tagId, nickname)
        nfcDao.updateTagNickname(tagId, nickname)
    }

    suspend fun updateEventNicknameById(id: Int, nickname: String) {
        nfcDao.updateEventNicknameById(id, nickname)
    }

    suspend fun clearLogHistory() {
        nfcDao.clearAllEvents()
    }
}
