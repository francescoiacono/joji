export enum GameEvent {
  // Client -> Server
  StartGame = 'START_GAME',

  // Server -> Client
  GameStarted = 'GAME_STARTED',
  GameStateUpdated = 'GAME_STATE_UPDATED',
  GameEnded = 'GAME_ENDED'
}
