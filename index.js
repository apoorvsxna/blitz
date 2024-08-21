import parseTorrent from 'parse-torrent';
import fs from 'fs';
import axios from 'axios';

async function parseTorrentFile(torrentFilePath) {
  const parsed = await parseTorrent(fs.readFileSync(torrentFilePath));
  return parsed;
}

const content = parseTorrentFile('test.torrent');

const peer_id = '00112233445566778899';
const uploaded = 0;
const downloaded = 0;
const left = content.length; // total size
const compact = 1; // use compact format
const port = 6881; // reserved ports 6881-6889
const info_hash = content.infoHash;

const url = 'http://p4p.arenabg.com:1337/announce';

const params = {
    peer_id: peer_id,
    uploaded: uploaded,
    downloaded: downloaded,
    left: left,
    compact: compact,
    port: port,
    info_hash: info_hash
  };

axios.get(url, { params })
.then(response => {
console.log(response.data);
})
.catch(error => {
console.error(`Got error: ${error.message}`);
});