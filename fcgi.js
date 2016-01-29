/**
 * Created by cuccpkfs on 16-1-27.
 */
"use strict";
/*
typedef struct {
  unsigned char version;
  unsigned char type;
  unsigned char requestIdB1;
  unsigned char requestIdB0;
  unsigned char contentLengthB1;
  unsigned char contentLengthB0;
  unsigned char paddingLength;
  unsigned char reserved;
  unsigned char contentData[contentLength];
  unsigned char paddingData[paddingLength];
} FCGI_Record;
*/

var debug = require('debug')('dispatcher:FCGI')
  ;

exports.BEGIN = 1;
exports.ABORT = 2;
exports.END = 3;
exports.PARAMS = 4;
exports.STDIN = 5;
exports.STDOUT = 6;
exports.STDERR = 7;
exports.DATA = 8;
exports.GET = 9;
exports.RESULT = 10;
exports.UNKNOWN = 11;

exports.parseFrameStream = function(c, listener){
  var check = false, head, slotID, type, flag, len, body;

  c.on('readable', parseFCGI);
  if (listener) {
    c.on('frame', listener);
    debug('registered on.frame');
  }

  var head, type, reqID, cLen, pLen, bLen, body;

  function parseFCGI(trigger){

    trigger || debug('on readable');
    if (!head) {
      head = c.read(8);
      if (!head) return;
      debug(head);
      type = head[1];
      reqID = head[2] * 256 + head[3];
      cLen = head[4] * 256 + head[5];
      pLen = head[6];
      bLen = cLen + pLen;
      debug('head: type=%d, reqID=%d, cLen=%d, pLen=%d, bLen=%d', type, reqID, cLen, pLen, bLen);
    }
    if (!body && bLen) {
      body = c.read(bLen);
      debug('body: len=%d', body.length);
      if (!body) return;
      if (type === exports.PARAMS) {
        debug('body: %s', body.slice(0, cLen).toString());
      } else {
        debug('body: ', body);
      }
    }
    debug('read frame complete');
    c.emit('frame', head, reqID, type, null, bLen, body);
    head = body = undefined;
    parseFCGI(true);
  }

  return function release(){
    if (listener) {
      c.removeListener('frame', listener);
    }
    c.removeListener('readable', parse);
  }
};

exports.makeFrameHead = function(head, type, reqID, cLen, pLen){
  // debug('before write frame', slotID, type, flag);
  head.writeUInt8(1, 0);
  head.writeUInt8(type, 1);
  head.writeInt16BE(reqID, 2);
  head.writeInt16BE(cLen, 4);
  head.writeUInt8(pLen, 6);
  head.writeUInt8(0, 7);
};




