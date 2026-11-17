package com.allaith.pitchblack.mediastore

import android.content.ContentUris
import android.content.Context
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import java.io.File

/** Size, format, folder and bitrate of one audio file. Values are null when Android does not know them. */
internal fun queryAudioDetails(context: Context, id: Long): Map<String, Any?> {
  val uri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id)

  // RELATIVE_PATH (e.g. "Music/Downloads/") exists from Android 10, BITRATE from Android 11.
  // Older versions only have the full file path (DATA).
  val hasRelativePath = Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
  val hasBitrate = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
  @Suppress("DEPRECATION")
  val folderColumnName = if (hasRelativePath) MediaStore.Audio.Media.RELATIVE_PATH else MediaStore.Audio.Media.DATA
  val columns = listOfNotNull(
    MediaStore.Audio.Media.SIZE,
    MediaStore.Audio.Media.MIME_TYPE,
    folderColumnName,
    if (hasBitrate) MediaStore.Audio.Media.BITRATE else null
  ).toTypedArray()

  val cursor = context.contentResolver.query(uri, columns, null, null, null)
    ?: throw MediaStoreQueryException(null)

  return cursor.use { rows ->
    if (!rows.moveToFirst()) {
      throw AudioFileNotFoundException()
    }
    val folderValue = rows.stringOrNull(rows.getColumnIndexOrThrow(folderColumnName))
    val folder = if (hasRelativePath) folderValue?.trimEnd('/') else folderValue?.let { File(it).parent }
    val storedBitrate = if (hasBitrate) {
      rows.longOrNull(rows.getColumnIndexOrThrow(MediaStore.Audio.Media.BITRATE))
    } else {
      null
    }

    mapOf(
      "sizeBytes" to rows.longOrNull(rows.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE))?.toDouble(),
      "mimeType" to rows.stringOrNull(rows.getColumnIndexOrThrow(MediaStore.Audio.Media.MIME_TYPE)),
      "folder" to folder,
      // Bits per second. MediaStore often leaves it empty, so read it from the file then.
      "bitrate" to (storedBitrate?.takeIf { it > 0 } ?: readBitrateFromFile(context, uri))?.toDouble()
    )
  }
}

private fun readBitrateFromFile(context: Context, uri: Uri): Long? {
  val retriever = MediaMetadataRetriever()
  return try {
    retriever.setDataSource(context, uri)
    retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_BITRATE)?.toLongOrNull()
  } catch (error: RuntimeException) {
    // An unreadable file simply has no bitrate in the sheet.
    null
  } finally {
    retriever.release()
  }
}
