package com.example.utils

import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.sin

object SoundSynthesizer {
    /**
     * Synthesizes and plays a pure sine wave tone at the designated frequency in Hertz.
     * freqHz: frequency adjusted "Up" or "Down" (e.g., between 200Hz and 2000Hz).
     * durationMs: playback length.
     */
    suspend fun playBeep(freqHz: Int, durationMs: Int) = withContext(Dispatchers.IO) {
        try {
            val sampleRate = 8000
            val numSamples = (durationMs * sampleRate) / 1000
            val samples = DoubleArray(numSamples)
            val generatedSnd = ByteArray(2 * numSamples)

            // Calculate sine samples
            for (i in 0 until numSamples) {
                samples[i] = sin(2.0 * Math.PI * i / (sampleRate.toDouble() / freqHz))
            }

            // Convert to 16-bit PCM bytes (Little Endian)
            var idx = 0
            for (sample in samples) {
                val valShort = (sample * 32767).toInt().toShort()
                generatedSnd[idx++] = (valShort.toInt() and 0x00ff).toByte()
                generatedSnd[idx++] = ((valShort.toInt() and 0xff00) ushr 8).toByte()
            }

            // Instantiate static AudioTrack
            val audioTrack = AudioTrack(
                AudioManager.STREAM_MUSIC,
                sampleRate,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                generatedSnd.size,
                AudioTrack.MODE_STATIC
            )

            audioTrack.write(generatedSnd, 0, generatedSnd.size)
            audioTrack.play()

            // Wait until played
            Thread.sleep(durationMs.toLong() + 50)
            
            try {
                audioTrack.stop()
            } catch (e: Exception) {
                // Ignore transient stops
            }
            audioTrack.release()
        } catch (e: Exception) {
            Log.e("SoundSynthesizer", "Synthesizer playback error: ${e.message}")
        }
    }
}
