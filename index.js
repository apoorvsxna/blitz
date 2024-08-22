import axios from 'axios';
import { parseTorrentFile } from './torrent-parser.js';
import { convertToEncodedFormat } from './url-encode.js';
import { decodePeers } from './peers.js';
import bencode from 'bencode';

// Configuration
const TRACKER_URL = 'http://p4p.arenabg.com:1337/announce';
const PEER_ID = '00112233445566778899';
const PORT = 6881;

// Helper function to build tracker URL
function buildTrackerUrl({ infoHash, length }) {
  const uploaded = 0;
  const downloaded = 0;
  const left = length;
  const compact = 1;
  
  const encodedInfoHash = convertToEncodedFormat(infoHash);
  return `${TRACKER_URL}?peer_id=${PEER_ID}&uploaded=${uploaded}&downloaded=${downloaded}&left=${left}&compact=${compact}&port=${PORT}&info_hash=${encodedInfoHash}`;
}

// Main function to fetch and decode peers
async function fetchPeers() {
  try {
    const content = await parseTorrentFile('test.torrent');
    const url = buildTrackerUrl({ infoHash: content.infoHash, length: content.length });

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const decodedData = bencode.decode(Buffer.from(response.data));
    const peers = decodePeers(decodedData.peers);
    
    console.log(peers);
  } catch (error) {
    console.error(`Got error: ${error.message}`);
  }
}

// Execute the main function
fetchPeers();
