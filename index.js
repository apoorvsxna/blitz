'use strict';
import * as fs from 'fs'; // syntax for in-built modules
import bencode from 'bencode'
const fileContent = fs.readFileSync('test.torrent');
const torrent = bencode.decode(fileContent, 'utf8')
console.log(torrent.announce.toString('utf8'));