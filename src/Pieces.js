'use strict'

import * as torrentParser from './torrentParser.js';

export default class Pieces {
    constructor(torrent) {
        function calculateTotalPieces() {
            let totalPieces = 0;
            const nFiles = torrent.info.files.length;
    
            for(let i=0; i<nFiles; i++) {
                const fileLength = torrent.info.files[i].length;
                const piecesInFile = Math.ceil(
                    fileLength
                );
                totalPieces += piecesInFile;
            }
            return totalPieces;
        }

        // Create an array to track the status of each block in every piece
        function buildPiecesArray() {
            // torrent.info.pieces is a buffer that contains 20-byte SHA-1 hash of each piece,
            // and the length gives the total number of bytes in the buffer.
            const nPieces = calculateTotalPieces(); // torrent.info.pieces.length/20;
            const arr = new Array(nPieces).fill(null);
            return arr.map((_, i) =>
                new Array(torrentParser.blocksPerPiece(torrent, i)).fill(false)
            );
        }

        this._requested = buildPiecesArray();
        this._received = buildPiecesArray();

        this.totalBlocks = this._requested
            .map((piece) => {
                return piece.reduce((count, _) => count + 1, 0);
            })
            .reduce((acc, curr) => acc + curr, 0);
        this.totalReceivedBlocks = 0;
    }

    addRequested(pieceBlock) {
        const blockIndex = pieceBlock.begin / torrentParser.BLOCK_LENGTH;
        this._requested[pieceBlock.index][blockIndex] = true;
    }

    addReceived(pieceBlock) {
        const blockIndex = pieceBlock.begin/torrentParser.BLOCK_LENGTH;
        this._received[pieceBlock.index][blockIndex] = true;
        this.totalReceivedBlocks = this.totalReceivedBlocks + 1;
    }

    needed(pieceBlock) {
        // verify if every block has been requested once
        if(this._requested.every((blocks) => blocks.every((i) => i))) {
            // then copy received to requested
            // using slice() here to return a copy of an array
            this._requested = this._received.map((blocks) => blocks.slice());
        }

        const blockIndex = pieceBlock.begin / torrentParser.BLOCK_LENGTH;
        return !this._requested[pieceBlock.index][blockIndex];
    }

    isDone() {
        return this._received.every((blocks) => blocks.every((i) => i));
    }

    isPieceComplete(piecesIndex) {
        return this._received[pieceIndex].every((block) => block);
    }
}