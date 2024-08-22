import parseTorrent from 'parse-torrent';
import fs from 'fs/promises';

export async function parseTorrentFile(torrentFilePath) {
  const fileContent = await fs.readFile(torrentFilePath);
  return parseTorrent(fileContent);
}
