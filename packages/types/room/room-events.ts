export enum RoomEvent {
  // Client -> Server
  CreateRoom = 'CREATE_ROOM',
  JoinRoom = 'JOIN_ROOM',
  LeaveRoom = 'LEAVE_ROOM',

  // Server -> Client
  RoomCreated = 'ROOM_CREATED',
  RoomJoined = 'ROOM_JOINED',
  RoomLeft = 'ROOM_LEFT'
}
