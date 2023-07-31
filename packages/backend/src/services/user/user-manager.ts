import { v4 as uuidv4 } from 'uuid';
import { User } from './user';
import { Socket } from 'socket.io';

export class UserManager {
  /**
   * Creates a guest user
   */
  public createGuestUser(socketId: Socket['id']): User {
    return new User({
      id: this.generateGuestId(),
      socketId
    });
  }

  /**
   * Generates a guest user ID
   */
  private generateGuestId(): string {
    const id = `guest-${uuidv4()}`;
    return id;
  }
}
