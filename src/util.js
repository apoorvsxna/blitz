'use strict';

import crypto from 'crypto';

var id = null;

export function generateId() {
    // generate unique id for bittorrent client
    // generate 20 random bytes and prefix it with a standard name by replacing the first few bytes
    // generates id only once and returns the same id every time within the same runtime

    if(!id) {
        id = crypto.randomBytes(20);
        Buffer.from(`-BLITZ`).copy(id, 0);
    }
    return id;
}