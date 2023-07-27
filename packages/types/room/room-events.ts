export enum RoomEvent {
  // Client -> Server
  GetRooms = 'GET_ROOMS',
  GetRoomByJoinCode = 'GET_ROOM_BY_JOIN_CODE',
  CreateRoom = 'CREATE_ROOM',
  JoinRoom = 'JOIN_ROOM',
  LeaveRoom = 'LEAVE_ROOM',

  // Server -> Client
  RoomUpdated = 'ROOM_UPDATED'
}
