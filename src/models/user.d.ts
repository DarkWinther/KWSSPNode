import { ObjectID } from "bson";

export class User {
  _id: ObjectID;
  password: string;
  name: string;
  email: string;
}
