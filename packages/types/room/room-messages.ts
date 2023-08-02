export enum RoomMessage {
  DisplayNameRequired = 'DISPLAY_NAME_REQUIRED',
  DisplayNameTaken = 'DISPLAY_NAME_TAKEN',
  DisplayNameTooLong = 'DISPLAY_NAME_TOO_LONG',
  NotInRoom = 'NOT_IN_ROOM',
  AlreadyInRoom = 'ALREADY_IN_ROOM',
  RoomNotFound = 'ROOM_NOT_FOUND',
  GameNotFound = 'GAME_NOT_FOUND',
  GameInProgress = 'GAME_IN_PROGRESS',
  NoGameSelected = 'NO_GAME_SELECTED',
  NotHost = 'NOT_HOST',
  UserNotFound = 'USER_NOT_FOUND',
  CannotKickSelf = 'CANNOT_KICK_SELF',
  RoomFull = 'ROOM_FULL',
  InvalidGameOptions = 'INVALID_GAME_OPTIONS',
  NotAllUsersReady = 'NOT_ALL_USERS_READY'
}
