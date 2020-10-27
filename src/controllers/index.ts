import { Application } from "express";
import { MongoClient } from "mongodb";
import { usersCollection } from "../collections";
import { authController } from "./auth.controller";
import { usersController } from "./users.controller";

const initCollections = (db: MongoClient) => {
  const dbo = db.db();

  dbo.listCollections({ name: usersCollection }).next((error, collInfo) => {
    if (error) throw error;
    if (!collInfo) {
      dbo.createCollection(usersCollection);
    }
  });
}

export default (app: Application, db: MongoClient) => {
  initCollections(db);

  usersController(app, db);
  authController(app, db);
};
