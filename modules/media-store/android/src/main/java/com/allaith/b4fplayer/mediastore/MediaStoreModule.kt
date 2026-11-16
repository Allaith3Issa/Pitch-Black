package com.allaith.b4fplayer.mediastore

import android.Manifest
import android.content.ContentUris
import android.content.Context
import android.content.pm.PackageManager
import android.database.Cursor
import android.os.Build
import android.provider.MediaStore
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Errors sent to JavaScript. JS receives `error.code` (from the class name) and `error.message`.
class MissingAudioPermissionException :
  CodedException("The app does not have permission to read audio files.")

class MediaStoreQueryException(cause: Throwable?) :
  CodedException("Could not read the audio files on this device: ${cause?.message ?: "unknown error"}", cause)

class MediaStoreModule : Module() {
  // The Android app context. It is needed to talk to MediaStore.
  private val context: Context
    get() = appContext.reactContext ?: throw MediaStoreQueryException(null)

  override fun definition() = ModuleDefinition {
    // JS loads this module with requireNativeModule('MediaStore').
    Name("MediaStore")

    // Returns every audio file MediaStore knows about. Runs off the UI thread.
    AsyncFunction("getAudioFilesAsync") {
      if (!hasAudioPermission()) {
        throw MissingAudioPermissionException()
      }
      try {
        queryAudioFiles()
      } catch (error: SecurityException) {
        throw MissingAudioPermissionException()
      } catch (error: CodedException) {
        throw error
      } catch (error: Exception) {
        throw MediaStoreQueryException(error)
      }
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

  private fun queryAudioFiles(): List<Map<String, Any?>> {
    val collection = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI

    // The columns we want from MediaStore (like the SELECT part of an SQL query).
    val columns = arrayOf(
      MediaStore.Audio.Media._ID,
      MediaStore.Audio.Media.TITLE,
      MediaStore.Audio.Media.ARTIST,
      MediaStore.Audio.Media.ALBUM,
      MediaStore.Audio.Media.ALBUM_ID,
      MediaStore.Audio.Media.DURATION,
      MediaStore.Audio.Media.DATE_ADDED,
      MediaStore.Audio.Media.DISPLAY_NAME,
      MediaStore.Audio.Media.IS_MUSIC
    )

    val cursor = context.contentResolver.query(collection, columns, null, null, null)
      ?: throw MediaStoreQueryException(null)

    // `use` closes the cursor at the end, even if something fails.
    return cursor.use { rows ->
      val songs = ArrayList<Map<String, Any?>>(rows.count)
      while (rows.moveToNext()) {
        val id = rows.getLong(rows.getColumnIndexOrThrow(MediaStore.Audio.Media._ID))
        songs.add(
          mapOf(
            "id" to id.toString(),
            // Playable address of the file, e.g. content://media/external/audio/media/123
            "uri" to ContentUris.withAppendedId(collection, id).toString(),
            "title" to rows.stringOrNull(MediaStore.Audio.Media.TITLE),
            "artist" to rows.stringOrNull(MediaStore.Audio.Media.ARTIST),
            "album" to rows.stringOrNull(MediaStore.Audio.Media.ALBUM),
            "albumId" to rows.longOrNull(MediaStore.Audio.Media.ALBUM_ID)?.toString(),
            // Already in milliseconds.
            "durationMs" to (rows.longOrNull(MediaStore.Audio.Media.DURATION) ?: 0L).toDouble(),
            // MediaStore stores seconds; JS uses milliseconds.
            "dateAdded" to ((rows.longOrNull(MediaStore.Audio.Media.DATE_ADDED) ?: 0L) * 1000).toDouble(),
            "filename" to (rows.stringOrNull(MediaStore.Audio.Media.DISPLAY_NAME) ?: ""),
            "isMusic" to (rows.longOrNull(MediaStore.Audio.Media.IS_MUSIC) == 1L)
          )
        )
      }
      songs
    }
  }
}

// Small helpers: read a column, or null when the value is empty.
private fun Cursor.stringOrNull(column: String): String? {
  val index = getColumnIndexOrThrow(column)
  return if (isNull(index)) null else getString(index)
}

private fun Cursor.longOrNull(column: String): Long? {
  val index = getColumnIndexOrThrow(column)
  return if (isNull(index)) null else getLong(index)
}
