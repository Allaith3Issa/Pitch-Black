package com.allaith.pitchblack.mediastore

import android.content.ContentUris
import android.content.Context
import android.database.Cursor
import android.provider.MediaStore

/** Every audio file that is at least `minDurationMs` long, as maps for JS. */
internal fun queryAudioFiles(context: Context, minDurationMs: Long): List<Map<String, Any?>> {
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
    MediaStore.Audio.Media.DATE_MODIFIED,
    MediaStore.Audio.Media.DISPLAY_NAME
  )

  // Like the WHERE part of an SQL query. The `?` is replaced by the value in `selectionArgs`.
  val selection = "${MediaStore.Audio.Media.DURATION} >= ?"
  val selectionArgs = arrayOf(minDurationMs.toString())

  val cursor = context.contentResolver.query(collection, columns, selection, selectionArgs, null)
    ?: throw MediaStoreQueryException(null)

  // `use` closes the cursor at the end, even if something fails.
  return cursor.use { rows ->
    // Find each column's position once, instead of once per row.
    val idColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
    val titleColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
    val artistColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
    val albumColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
    val albumIdColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)
    val durationColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
    val dateAddedColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)
    val dateModifiedColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_MODIFIED)
    val filenameColumn = rows.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME)

    val songs = ArrayList<Map<String, Any?>>(rows.count)
    while (rows.moveToNext()) {
      val id = rows.getLong(idColumn)
      songs.add(
        mapOf(
          "id" to id.toString(),
          // Playable address of the file, e.g. content://media/external/audio/media/123
          "uri" to ContentUris.withAppendedId(collection, id).toString(),
          "title" to rows.stringOrNull(titleColumn),
          "artist" to rows.stringOrNull(artistColumn),
          "album" to rows.stringOrNull(albumColumn),
          "albumId" to rows.longOrNull(albumIdColumn)?.toString(),
          // Already in milliseconds.
          "durationMs" to (rows.longOrNull(durationColumn) ?: 0L).toDouble(),
          // MediaStore stores seconds; JS uses milliseconds.
          "dateAdded" to ((rows.longOrNull(dateAddedColumn) ?: 0L) * 1000).toDouble(),
          "dateModified" to ((rows.longOrNull(dateModifiedColumn) ?: 0L) * 1000).toDouble(),
          "filename" to (rows.stringOrNull(filenameColumn) ?: "")
        )
      )
    }
    songs
  }
}

// Small helpers: read the value at a column index, or null when it is empty.
internal fun Cursor.stringOrNull(index: Int): String? = if (isNull(index)) null else getString(index)

internal fun Cursor.longOrNull(index: Int): Long? = if (isNull(index)) null else getLong(index)
