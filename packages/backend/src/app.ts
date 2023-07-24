import dotenv from 'dotenv';
import { Server } from './services/server';

dotenv.config();

const server = new Server();
server.start();
