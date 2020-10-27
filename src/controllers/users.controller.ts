import { Application } from "express";
import { MongoClient } from "mongodb";
import { User } from "../models/user";
import url from "url";
import { hashPassword } from "../utils/password-encryption";
import { usersCollection } from "../collections";

export const usersController = (app: Application, db: MongoClient) => {
  const dbo = db.db();
  const users = dbo.collection<User>(usersCollection);

  app.post("/api/users", async (req, res) => {
    const { username, password, email } = req.body || {};
    try {
      const user = await users.findOne({ name: username });
      if (user) {
        return res.redirect(
          url.format({
            pathname: "/",
            query: {
              userExists: true,
            },
          })
        );
      }
  
      const hashedPwd = hashPassword(password);
      const newUser = await users.insertOne({
        name: username,
        password: hashedPwd,
        email,
      });
  
      if (req.session) {
        req.session.userId = newUser.insertedId;
      }
    } catch (error) {
      console.error(error);
      return res.redirect('/', 503);
    }

    return res.redirect("/");
  });
};
