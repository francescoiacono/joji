import { UserClient } from '../user';
export interface SessionClient {
    id: string;
    user: UserClient | null;
}
