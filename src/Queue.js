'use strict';

import * as torrentParser from './torrentParser.js';

// note: "_" prefix indicates private variables.

export default class Queue {
    constructor(torrent) {
        // private  i
        this._torrent = torrent;
        
        // private
        this._queue = []; // list to store all the pieces a peer has.
        
        // public
        this.choked = true;
    }

    queue(pieceIndex) {
        const nBlocks = torrentParser.blocksPerPiece(this._torrent, pieceIndex);
        
        for(let i=0; i<nBlocks; i++) {
            const pieceBlock = {
                index: pieceIndex,
                begin: i*torrentParser.BLOCK_LENGTH,
                length: torrentParser.blockLen(this._torrent, pieceIndex, i)
            };
            this._queue.push(pieceBlock);
        }
    }

    deque() {
        return this._queue.push(pieceBlock);
    }

    peek() {
        return this._queue[0];
    }

    length() {
        return this._queue.length;
    }
}