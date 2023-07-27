"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEvent = void 0;
var RoomEvent;
(function (RoomEvent) {
    // Client -> Server
    RoomEvent["GetRooms"] = "GET_ROOMS";
    RoomEvent["GetRoomByJoinCode"] = "GET_ROOM_BY_JOIN_CODE";
    RoomEvent["CreateRoom"] = "CREATE_ROOM";
    RoomEvent["JoinRoom"] = "JOIN_ROOM";
    RoomEvent["LeaveRoom"] = "LEAVE_ROOM";
    RoomEvent["SetGame"] = "SET_GAME";
    // Server -> Client
    RoomEvent["RoomUpdated"] = "ROOM_UPDATED";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
