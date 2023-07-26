"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEvent = void 0;
var RoomEvent;
(function (RoomEvent) {
    // Client -> Server
    RoomEvent["GetRoomByJoinCode"] = "GET_ROOM_BY_JOIN_CODE";
    RoomEvent["CreateRoom"] = "CREATE_ROOM";
    RoomEvent["JoinRoom"] = "JOIN_ROOM";
    RoomEvent["LeaveRoom"] = "LEAVE_ROOM";
    // Server -> Client
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
