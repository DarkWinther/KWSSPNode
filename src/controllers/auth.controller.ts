import { Application } from "express";
import { MongoClient } from "mongodb";
import { User } from "../models/user";
import { verifyPassword } from "../utils/password-encryption";
import url from 'url';

export const authController = (app: Application, db: MongoClient) => {
  const dbo = db.db();
  const users = dbo.collection<User>("users");

  app
    .post("/api/login", async (req, res) => {
      const { username, password } = req.body || {};
      if (!username || !password) {
        return res.redirect(url.format({
          pathname: '/',
          query: {
            noPass: !password,
            noName: !username
          }
        }));
      }

      const user = await users.findOne({ name: username });

      if (user?.password && verifyPassword(password, user.password) && req.session) {
        req.session.userId = user._id;
      }

      return res.redirect("/");
    })
    .post("/api/logout", (req, res) => {
      if (req.session) {
        delete req.session.userId;
        return res.redirect('/');
      }
      return res.sendStatus(503);
    });
};
