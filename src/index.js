'use strict';
import fs from 'fs';
import bencode from 'bencode';

const torrent = bencode.decode(fs.readFileSync('../wywh.torrent'));
console.log(Buffer.from(torrent.announce, 'hex').toString('utf8'));

console.log('testing');