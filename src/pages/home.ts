import { Application } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import { todosCollection, usersCollection } from '../collections';
import { Todo } from '../models/todo';
import { User } from '../models/user';
import { unProtect } from '../utils/cipher-protection';

export const home = (app: Application, db: MongoClient) => {
  const dbo = db.db();
  const users = dbo.collection<User>(usersCollection);
  const todos = dbo.collection<Todo>(todosCollection);

  app.get('/', async (req, res) => {
    let nameWarning: string | undefined;
    let passWarning: string | undefined;
    let user: User | undefined;
    let userTodos: Todo[] | undefined;

    if (req.query.noName) {
      nameWarning = 'Indtast et brugernavn';
    }

    if (req.query.userExists) {
      nameWarning = 'Denne bruger eksisterer allerede';
    }

    if (req.query.noPass) {
      passWarning = 'Indtast et kodeord';
    }

    if (req.session?.userId) {
      const [userResult, todosResult] = await Promise.all([
        users.findOne({
          _id: new ObjectID(req.session.userId),
        }),
        todos.find({ userId: new ObjectID(req.session.userId) }).toArray(),
      ]);
      if (userResult) {
        user = userResult;
      }
      if (todosResult?.length) {
        const returnUnprotected = async ({
          title,
          content,
          ...rest
        }: Todo): Promise<Todo> => {
          const [uTitle, uContent] = await Promise.all([
            unProtect(title),
            unProtect(content),
          ]);
          return { title: uTitle, content: uContent, ...rest };
        };

        userTodos = await Promise.all(
          todosResult.map(t => returnUnprotected(t))
        );
      }
    }

    res.render('home.pug', {
      page: 'home',
      nameWarning,
      passWarning,
      user,
      todos: userTodos,
    });
  });
};
