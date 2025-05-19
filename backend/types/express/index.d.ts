import 'express';
import UserDto from '../../src/modules/auth/userDto';

declare module 'express-serve-static-core' {
  interface Request {
    language?: string;
    user?: UserDto;
  }
}