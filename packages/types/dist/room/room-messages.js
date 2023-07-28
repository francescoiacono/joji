"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMessage = void 0;
var RoomMessage;
(function (RoomMessage) {
    RoomMessage["DisplayNameRequired"] = "DISPLAY_NAME_REQUIRED";
    RoomMessage["DisplayNameTaken"] = "DISPLAY_NAME_TAKEN";
    RoomMessage["DisplayNameTooLong"] = "DISPLAY_NAME_TOO_LONG";
    RoomMessage["NotInRoom"] = "NOT_IN_ROOM";
    RoomMessage["AlreadyInRoom"] = "ALREADY_IN_ROOM";
    RoomMessage["RoomNotFound"] = "ROOM_NOT_FOUND";
    RoomMessage["GameNotFound"] = "GAME_NOT_FOUND";
    RoomMessage["GameInProgress"] = "GAME_IN_PROGRESS";
    RoomMessage["NoGame"] = "NO_GAME";
    RoomMessage["NotHost"] = "NOT_HOST";
    RoomMessage["InvalidGameOptions"] = "INVALID_GAME_OPTIONS";
})(RoomMessage || (exports.RoomMessage = RoomMessage = {}));
