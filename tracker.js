'use strict';
import * as dgram from 'dgram';
import { Buffer } from 'buffer';
import { parse as urlParse} from 'url';
import * as crypto from 'crypto';

export const getPeers = (torrent, callback) => {
    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf8');

    udpSend(socket, buildConnReq(), url);

    socket.on('message', response => {
        if(respType(response) === 'connect') {
            // parse connect response
            const connResp = parseConnResp(response);
            // send announce request
            const announceReq = buildAnnounceReq(connResp.connectionId);
            udpSend(socket, announceReq, url);
        }

        else if(respType(response) === 'announce') {
            // parse announce response
            const announceResp = parseAnnounceResp(response);
            // pass peers to callback
            callback(announceResp.peers);
        }
    });
};

// convenience function to set offset and length arguments (since we always send the whole buffer)
function udpSend(socket, message, rawUrl, callback = () => {}) {
    const url = urlParse(rawUrl);
    socket.send(message, 0, message.length, url.port, url.host, callback);
}

// check if response is for connect or announce
function respType(resp) {

}

// build connect request
function buildConnReq() {
    const buf = Buffer.alloc(16);

    // connection id, should always be 0x41727101980
    // done in two 4-byte chunks because there is no method to write 64-bit integers in node.js
    buf.writeUInt32BE(0x417, 0); // arguments - value, offset
    buf.writeUInt32BE(0x27101980, 4);

    buf.writeUInt32BE(0, 8);

    crypto.randomBytes(4).copy(buf, 12);

    return buf;
}

// parse connect response
function parseConnResp(resp) {
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8)
    }
}

// build announce request
function buildAnnounceReq(connId) {

}

// parse announce response
function parseAnnounceResp(resp) {

}