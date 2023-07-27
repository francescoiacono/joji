export interface SocketResponseBase {
  success: boolean;
}

export interface SocketErrorResponse extends SocketResponseBase {
  success: false;
  error: string;
}

export interface SocketSuccessResponse<T> extends SocketResponseBase {
  success: true;
  data: T;
}

export type SocketResponse<T> = SocketErrorResponse | SocketSuccessResponse<T>;
