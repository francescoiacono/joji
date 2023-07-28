export enum RoomEvent {
  // Client -> Server
  GetRooms = 'GET_ROOMS',
  GetRoomByJoinCode = 'GET_ROOM_BY_JOIN_CODE',
  CreateRoom = 'CREATE_ROOM',
  JoinRoom = 'JOIN_ROOM',
  LeaveRoom = 'LEAVE_ROOM',
  SetGame = 'SET_GAME',

  // Server -> Client
  RoomUpdated = 'ROOM_UPDATED'
}
