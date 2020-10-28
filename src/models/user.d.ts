import { ObjectID } from 'bson';

export interface User {
  _id: ObjectID;
  password: string;
  name: string;
  email: string;
}
