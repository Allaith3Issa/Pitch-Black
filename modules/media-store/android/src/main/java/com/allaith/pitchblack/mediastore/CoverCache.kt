package com.allaith.pitchblack.mediastore

import android.content.ContentUris
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.provider.MediaStore
import java.io.File

// JPEG quality of the cached covers (0–100).
private const val COVER_QUALITY = 85

/**
 * The embedded cover of one audio file, scaled to at most `sizePx` and cached as a JPEG in the app cache.
 * Returns the `file://` URI, or null when the file has no cover (or it could not be read right now).
 *
 * The cache file name contains the date the audio file was modified, so a re-tagged file gets its new cover.
 * A small ".none" file remembers files without a cover, so they are not read again.
 */
internal fun getCachedCover(context: Context, id: Long, dateModified: Long, sizePx: Int): String? {
  val folder = File(context.cacheDir, "covers").apply { mkdirs() }
  val name = "$id-$dateModified-$sizePx"
  val coverFile = File(folder, "$name.jpg")
  val noCoverFile = File(folder, "$name.none")

  if (coverFile.exists()) return Uri.fromFile(coverFile).toString()
  if (noCoverFile.exists()) return null

  val audioUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id)
  val picture = try {
    readEmbeddedPicture(context, audioUri)
  } catch (error: RuntimeException) {
    // Android could not open the file right now: no ".none" marker, so it is tried again next time.
    return null
  }
  val bitmap = picture?.let { decodeScaled(it, sizePx) }
  if (bitmap == null) {
    noCoverFile.createNewFile()
    return null
  }

  // Write to a temporary file first, so a half-written cover is never used.
  val tempFile = File(folder, "$name.tmp")
  val isWritten = try {
    tempFile.outputStream().use { bitmap.compress(Bitmap.CompressFormat.JPEG, COVER_QUALITY, it) } &&
      tempFile.renameTo(coverFile)
  } catch (error: java.io.IOException) {
    // E.g. the phone storage is full: no cover this time, tried again next time.
    false
  } finally {
    bitmap.recycle()
  }
  if (!isWritten) {
    tempFile.delete()
    return null
  }
  return Uri.fromFile(coverFile).toString()
}

/** The raw image bytes stored inside the audio file, or null when it has none. Throws when the file cannot be read. */
private fun readEmbeddedPicture(context: Context, uri: Uri): ByteArray? {
  val retriever = MediaMetadataRetriever()
  try {
    retriever.setDataSource(context, uri)
    return retriever.embeddedPicture
  } finally {
    retriever.release()
  }
}

/** Decodes the image at a size close to `sizePx` (decoding the full image first would waste memory). */
private fun decodeScaled(bytes: ByteArray, sizePx: Int): Bitmap? {
  // First read only the image size.
  val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
  BitmapFactory.decodeByteArray(bytes, 0, bytes.size, bounds)
  if (bounds.outWidth <= 0 || bounds.outHeight <= 0) return null

  // Then decode at the largest power-of-2 reduction that stays at least `sizePx`.
  var sampleSize = 1
  while (minOf(bounds.outWidth, bounds.outHeight) / (sampleSize * 2) >= sizePx) {
    sampleSize *= 2
  }
  val decoded = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, BitmapFactory.Options().apply {
    inSampleSize = sampleSize
  }) ?: return null

  // Finally scale exactly, so the shorter side is `sizePx` (never scale up).
  val scale = sizePx.toFloat() / minOf(decoded.width, decoded.height)
  if (scale >= 1f) return decoded
  val scaled = Bitmap.createScaledBitmap(
    decoded,
    (decoded.width * scale).toInt(),
    (decoded.height * scale).toInt(),
    true
  )
  if (scaled != decoded) decoded.recycle()
  return scaled
}
