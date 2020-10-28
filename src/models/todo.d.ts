import { ObjectID } from 'mongodb';

export interface Todo {
  _id: ObjectID;
  userId: ObjectID;
  title: string;
  content: string;
  addedOn: Date;
  isDone?: boolean;
}
