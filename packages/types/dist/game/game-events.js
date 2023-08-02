"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEvent = void 0;
var GameEvent;
(function (GameEvent) {
    // Server -> Client
    GameEvent["GameStarted"] = "GAME_STARTED";
    GameEvent["GameStateUpdated"] = "GAME_STATE_UPDATED";
    GameEvent["GameEnded"] = "GAME_ENDED";
})(GameEvent || (exports.GameEvent = GameEvent = {}));
