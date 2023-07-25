export enum RoomEvent {
  // Client -> Server
  GetRoom = 'GET_ROOM',
  GetRoomByJoinCode = 'GET_ROOM_BY_JOIN_CODE',
  CreateRoom = 'CREATE_ROOM',
  JoinRoom = 'JOIN_ROOM',
  LeaveRoom = 'LEAVE_ROOM',

  // Server -> Client
  Room = 'ROOM',
  RoomCreated = 'ROOM_CREATED',
  RoomJoined = 'ROOM_JOINED',
  RoomLeft = 'ROOM_LEFT'
}
