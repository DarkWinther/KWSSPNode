import { Application } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import { todosCollection } from '../collections';
import { Todo } from '../models/todo';
import { protect, unProtect } from '../utils/cipher-protection';

export const todosController = (app: Application, db: MongoClient) => {
  const dbo = db.db();
  const todos = dbo.collection<Todo>(todosCollection);

  app
    .post('/api/todos', async (req, res) => {
      const { title, content } = req.body || {};
      if (
        typeof title === 'string' &&
        typeof content === 'string' &&
        req.session?.userId
      ) {
        const [pTitle, pContent] = await Promise.all([
          protect(title),
          protect(content),
        ]);
        todos.insertOne({
          title: pTitle,
          content: pContent,
          addedOn: new Date(Date.now()),
          userId: new ObjectID(req.session.userId),
        });
      }
      return res.redirect('/');
    })
    .post('/api/todos/patch', (req, res) => {
      const { todoId, isDone } = req.body;
      if (ObjectID.isValid(todoId)) {
        todos.updateOne(
          { _id: new ObjectID(todoId) },
          { $set: { isDone: !!isDone } }
        );
      }
      return res.redirect('/');
    });
};
