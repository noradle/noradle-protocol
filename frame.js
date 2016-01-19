/**
 * Created by cuccpkfs on 15-5-13.
 * wrap a readable/writable stream lik TCP/UNIX socket to became a frame emitter
 * change readable.on(readable) to emit(frame)
 */
"use strict";
var debug = require('debug')('noradle:frame')
  , bytes4 = new Buffer(4)
  ;

exports.makeFrameHead = function(slotID, type, flag, len){
  // debug('before write frame', slotID, type, flag);
  var head = new Buffer(8);
  head.writeInt16BE(slotID, 0);
  head.writeUInt8(type, 2);
  head.writeUInt8(flag, 3);
  head.writeInt32BE(len, 4);
  return head;
};

exports.writeFrame = function(stream, slotID, type, flag, body){
  // debug('before write frame', slotID, type, flag);
  var head = new Buffer(8), w1, w2;
  head.writeInt16BE(slotID, 0);
  head.writeUInt8(type, 2);
  head.writeUInt8(flag, 3);
  if (body) {
    head.writeInt32BE(body.length, 4);
    w1 = stream.write(head);
    w2 = stream.write(body);
    debug('write frame', slotID, type, flag, body.length, w1, w2);
  } else {
    head.writeInt32BE(0, 4);
    w1 = stream.write(head);
    debug('write frame', slotID, type, flag, 0, w1);
  }
};

/**
 * receive and parse the arriving frame
 * and make frame event to listener
 * @param c the stream/socket/connection that's just connected
 * @param listener accept whole frame data, with head parsed
 */
exports.parseFrameStream = function(c, listener){
  var check = false, head, slotID, type, flag, len, body;

  c.on('readable', parse);
  if (listener) {
    c.on('frame', listener);
    debug('registered on.frame');
  }

  function parse(){
    var data;

    if (!head) {
      head = c.read(8);
      if (head === null) return;
      slotID = head.readUInt16BE(0);
      type = head.readUInt8(2);
      flag = head.readUInt8(3);
      len = head.readInt32BE(4);
    }

    if (len > 0 && !body) {
      body = c.read(len);
      if (body === null) return;
    }

    debug('read frame', head, slotID, type, flag, len);
    c.emit('frame', head, slotID, type, flag, len, body);
    debug('emited frame');
    head = body = undefined;
    parse();
  }

  return function release(){
    if (listener) {
      c.removeListener('frame', listener);
    }
    c.removeListener('readable', parse);
  }
};
