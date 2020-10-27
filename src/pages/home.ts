import { Application } from "express";
import { MongoClient, ObjectID } from "mongodb";
import { usersCollection } from "../collections";
import { User } from "../models/user";

export const home = (app: Application, db: MongoClient) => {
  const dbo = db.db();
  const users = dbo.collection<User>(usersCollection);

  app.get("/", async (req, res) => {
    let nameWarning: string | undefined;
    let passWarning: string | undefined;
    let user: User | undefined;

    if (req.query.noName) {
      nameWarning = 'Indtast et brugernavn'
    }

    if (req.query.userExists) {
      nameWarning = 'Denne bruger eksisterer allerede';
    }

    if (req.query.noPass) {
      passWarning = "Indtast et kodeord";
    }

    if (req.session?.userId) {
      const result = await users.findOne({ _id: new ObjectID(req.session.userId) });
      if (result) {
        user = result;
      }
    }
    
    res.render("home.pug", {
      page: "home",
      nameWarning,
      passWarning,
      user
    });
  });
};
