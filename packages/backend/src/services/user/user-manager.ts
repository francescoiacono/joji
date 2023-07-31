import { v4 as uuidv4 } from 'uuid';
import { User } from './user';

export class UserManager {
  /**
   * Creates a guest user
   */
  public createGuestUser(): User {
    return new User({
      id: this.generateGuestId()
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
