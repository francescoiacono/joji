"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEvent = void 0;
var RoomEvent;
(function (RoomEvent) {
    // Client -> Server
    RoomEvent["CreateRoom"] = "CREATE_ROOM";
    // Server -> Client
    RoomEvent["RoomCreated"] = "ROOM_CREATED";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
