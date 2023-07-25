"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEvent = void 0;
var RoomEvent;
(function (RoomEvent) {
    // Client -> Server
    RoomEvent["GetRoom"] = "GET_ROOM";
    RoomEvent["GetRoomByJoinCode"] = "GET_ROOM_BY_JOIN_CODE";
    RoomEvent["CreateRoom"] = "CREATE_ROOM";
    RoomEvent["JoinRoom"] = "JOIN_ROOM";
    RoomEvent["LeaveRoom"] = "LEAVE_ROOM";
    // Server -> Client
    RoomEvent["Room"] = "ROOM";
    RoomEvent["RoomCreated"] = "ROOM_CREATED";
    RoomEvent["RoomJoined"] = "ROOM_JOINED";
    RoomEvent["RoomLeft"] = "ROOM_LEFT";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
