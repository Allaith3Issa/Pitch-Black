type ParsedFilename = {
  title: string;
  artist: string | null;
};

const SEPARATOR = ' - ';

/**
 * Guesses title and artist from a filename.
 * "Artist - Title.mp3" → { artist: "Artist", title: "Title" }
 * "Title.mp3"          → { artist: null, title: "Title" }
 */
export function parseSongFilename(filename: string): ParsedFilename {
  const dotIndex = filename.lastIndexOf('.');
  const name = (dotIndex > 0 ? filename.slice(0, dotIndex) : filename).trim();

  const separatorIndex = name.indexOf(SEPARATOR);
  if (separatorIndex === -1) {
    return { title: name, artist: null };
  }

  const artist = name.slice(0, separatorIndex).trim();
  const title = name.slice(separatorIndex + SEPARATOR.length).trim();

  // "Artist - " or " - Title" are not a real split: keep the whole name as the title.
  if (artist === '' || title === '') {
    return { title: name, artist: null };
  }

  return { title, artist };
}
