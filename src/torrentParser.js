'use strict';

import fs from 'fs';
import bencode from 'bencode';
import * as big from 'bigint-buffer';

// open torrent file and decode contents
export function open(filePath) {
    console.log(`Opening the torrent file...`);
    return bencode.decode(fs.readFileSync(filePath));
}

// compute total size
export function size(torrent) {
    const size = torrent.info.files
    ? torrent.info.files
        .map((file) => file.length)
        .reduce((acc, curr) => acc + curr, 0)
        : torrent.info.length;

    // file size may be greater than 32-bit integer
    return big.toBufferBE(BigInt(size), 8);
}

export function infoHash(torrent) {
    const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
}

// 16 KB block size
export const BLOCK_LENGTH = Math.pow(2, 14);

export function pieceLen(torrent, pieceIndex) {
    const totalLength = Number(big.toBigIntBE(size(torrent)));
    const pieceLength = torrent.info['piece length'];
    console.log(`length info - ${totalLength, pieceLength}`);

    const lastPieceLength = totalLength % pieceLength;
    const lastPieceIndex = Math.floor(totalLength/pieceLength);
    console.log(`last piece info - ${lastPieceIndex, lastPieceLength}`);

    return lastPieceIndex === pieceIndex ? lastPieceLength : pieceLength;
}

export function blocksPerPiece(torrent, pieceIndex) {
    const pieceLength = pieceLen(torrent, pieceIndex);
    return Math.ceil(pieceLength / BLOCK_LENGTH); // partial block should also count as full block.
}

export function blockLen(torrent, pieceIndex, blockIndex) {
    const pieceLength = pieceLen(torrent, pieceIndex);
    const lastBlockLength = pieceLength % BLOCK_LENGTH;
    const lastBlockIndex = Math.floor(pieceLength / BLOCK_LENGTH);
    return blockIndex === lastBlockIndex ? lastBlockLength : BLOCK_LENGTH;
}