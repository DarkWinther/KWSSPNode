import { Application } from "express";
import { MongoClient } from "mongodb";
import { home } from "./home";

export default (app: Application, db: MongoClient) => {
  home(app, db);
};
