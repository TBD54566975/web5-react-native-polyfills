// @ts-nocheck

// C++ node crypto
// not putting behind a check because this is the best and only tool for the job
import crypto from 'crypto';

// webcrypto fulfilled by C++ node crypto
// not putting behind a check because this is the best and only tool for the job
import { Crypto } from '@peculiar/webcrypto';

// ffi node buffer
// not putting behind a check because this is the best and only tool for the job
import { Buffer } from 'buffer';

// add .stream() compatibility to blob
// add Uint8Array compatibility to blob constructor
import { polyfillBlob } from './blob-polyfill';

// js based TextDecoder
import { TextDecoder } from 'text-encoding';

// Hermes lacks AsyncIterator (fixed in upcoming versions)
// TODO: Remove when Hermes gets AsyncIterator
if (typeof Symbol.asyncIterator === 'undefined') {
  require('@azure/core-asynciterator-polyfill');
}

// achachingbrain relying on the Event API in it-modules
if (typeof EventTarget === 'undefined') {
  require('event-target-polyfill');
}

// hermes lacks URL in old hermes versions (fixed in upcoming Expo)
require('react-native-url-polyfill/auto');

if (!global.structuredClone) {
  global.structuredClone = require('realistic-structured-clone');
}

import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import * as secp from '@noble/secp256k1';
import * as ed from '@noble/ed25519';

global.TextDecoder = TextDecoder;
global.crypto = crypto;
global.crypto.subtle = new Crypto().subtle;
global.buffer = Buffer;

polyfillBlob();

// https://github.com/paulmillr/noble-ed25519/blob/6b218e41465971f1173178afbb0a2fe9c4bb77b5/README.md
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

// https://github.com/paulmillr/noble-secp256k1/blob/eeb3b069e50b53aee7042a8b83a99f56e213a2de/README.md
secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));
secp.etc.hmacSha256Async = (k, ...m) =>
  Promise.resolve(secp.etc.hmacSha256Sync(k, ...m));
