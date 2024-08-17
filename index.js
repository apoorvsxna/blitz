'use strict';
import * as fs from 'fs'; // syntax for in-built modules
import bencode from 'bencode';
import { getPeers } from './tracker.js';

const fileContent = fs.readFileSync('test.torrent');
const torrent = bencode.decode(fileContent, 'utf8')

getPeers(torrent, peers => {
    console.log('list of peers: ', peers);
});