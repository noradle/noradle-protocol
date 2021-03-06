"use strict";
module.exports = {
  REQ_END_MARK : '-- end of req --',

  ORACLE : 197610261,
  DISPATCHER : 197610262,
  CLIENT : 197610263,
  MONITOR : 197610264,

  /* typeof protocol send to and receive from oracle*/
  NORADLE : 0,
  HTTP : 1,
  SCGI : 2,
  FCGI : 3,

  CTL_FRAME : 0,
  ADD_SLOT : 1,
  DEL_SLOT : 2,
  SET_CONCURRENCY : 3,
  REQ_CLI_CFG : 4,
  RES_CLI_CFG : 5,
  RO_QUIT : 255,
  WC_QUIT : 255,

  HEAD_FRAME : 0,
  BODY_FRAME : 1,
  SESSION_FRAME : 2,
  STYLE_FRAME : 3,
  EMBED_FRAME : 4,
  HASH_FRAME : 5,
  PRE_HEAD : 253,
  ERROR_FRAME : 254,
  END_FRAME : 255,

  ORA_MAX_SLOTS : 1024,
  MAX_CLIENTS : 1024,
  CLI_MAX_SLOTS : 1024  /*65536*/
};