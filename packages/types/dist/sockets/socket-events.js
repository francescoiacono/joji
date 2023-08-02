"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvent = void 0;
var SocketEvent;
(function (SocketEvent) {
    // Server -> Client
    SocketEvent["Session"] = "SESSION";
    SocketEvent["Error"] = "ERROR";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
