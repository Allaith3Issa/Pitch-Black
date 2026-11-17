package com.allaith.pitchblack.mediastore

import android.Manifest
import android.content.ClipData
import android.content.ContentUris
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.provider.MediaStore
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// Errors sent to JavaScript. JS receives `error.code` (from the class name) and `error.message`.
class MissingAudioPermissionException :
  CodedException("The app does not have permission to read audio files.")

class MediaStoreQueryException(cause: Throwable?) :
  CodedException("Could not read the audio files on this device: ${cause?.message ?: "unknown error"}", cause)

class AudioFileNotFoundException :
  CodedException("This audio file is no longer on the device.")

class MediaStoreModule : Module() {
  // The Android app context. It is needed to talk to MediaStore.
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    // JS loads this module with requireNativeModule('MediaStore').
    Name("MediaStore")

    // Returns every audio file that is at least `minDurationMs` long. Runs off the UI thread.
    AsyncFunction("getAudioFilesAsync") { minDurationMs: Long ->
      withMediaStoreErrors { queryAudioFiles(context, minDurationMs) }
    }

    // Size, format, folder and bitrate of one audio file (for the Song info sheet).
    AsyncFunction("getAudioDetailsAsync") { id: String ->
      withMediaStoreErrors { queryAudioDetails(context, id.toLong()) }
    }

    // The embedded cover of one audio file, as a cached JPEG `file://` URI, or null when it has none.
    // Runs on the IO thread pool: plain AsyncFunctions of all Expo modules share one thread, so covers
    // read there would wait for each other and delay other calls (e.g. a library rescan).
    AsyncFunction("getCoverAsync") Coroutine { id: String, dateModified: Long, sizePx: Int ->
      withContext(Dispatchers.IO) {
        withMediaStoreErrors { getCachedCover(context, id.toLong(), dateModified, sizePx) }
      }
    }

    // Opens the Android share sheet with the audio file itself.
    AsyncFunction("shareAudioAsync") { id: String, title: String ->
      val activity = appContext.currentActivity ?: throw Exceptions.MissingActivity()
      val uri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id.toLong())
      val send = Intent(Intent.ACTION_SEND).apply {
        type = "audio/*"
        putExtra(Intent.EXTRA_STREAM, uri)
        // ClipData + the flag let the receiving app read this one file (and nothing else).
        clipData = ClipData.newRawUri(title, uri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      }
      activity.startActivity(Intent.createChooser(send, title))
    }.runOnQueue(Queues.MAIN)
  }

  /** Runs `block` with the audio permission checked, and turns unexpected errors into errors JS understands. */
  private fun <T> withMediaStoreErrors(block: () -> T): T {
    if (!hasAudioPermission()) {
      throw MissingAudioPermissionException()
    }
    try {
      return block()
    } catch (error: SecurityException) {
      throw MissingAudioPermissionException()
    } catch (error: CodedException) {
      throw error
    } catch (error: Exception) {
      throw MediaStoreQueryException(error)
    }
  }

  // Android 13+ uses READ_MEDIA_AUDIO; older versions use READ_EXTERNAL_STORAGE.
  private fun hasAudioPermission(): Boolean {
    val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      Manifest.permission.READ_MEDIA_AUDIO
    } else {
      Manifest.permission.READ_EXTERNAL_STORAGE
    }
    return context.checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED
  }
}
