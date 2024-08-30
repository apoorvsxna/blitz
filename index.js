'use strict';
import fs from 'fs';
import bencode from 'bencode';

const torrent = bencode.decode(fs.readFileSync('test.torrent'));
console.log(torrent);