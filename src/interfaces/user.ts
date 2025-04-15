import { Direction } from './direction';
import { Study } from './study';

export interface AuthUser {
  email: string;
  password?: string;
}

export interface User extends AuthUser {
  id?: string;
  role: string;
  studies: Study[];
  directions: Direction[];
}
