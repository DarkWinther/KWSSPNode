import { Application } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import { todosCollection } from '../collections';
import { Todo } from '../models/todo';

export const todosController = (app: Application, db: MongoClient) => {
  const dbo = db.db();
  const todos = dbo.collection<Todo>(todosCollection);

  app.post('/api/todos', async (req, res) => {
    const { title, content } = req.body || {};
    if (
      typeof title === 'string' &&
      typeof content === 'string' &&
      req.session?.userId
    ) {
      await todos.insertOne({
        title,
        content,
        addedOn: new Date(Date.now()),
        userId: new ObjectID(req.session.userId),
      });
    }
    return res.redirect('/');
  });
};
