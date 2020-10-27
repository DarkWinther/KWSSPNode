import { ObjectID } from "mongodb";

declare global {
  namespace Express {
    interface SessionData {
      userId?: ObjectID | string;
    }
  }
}
