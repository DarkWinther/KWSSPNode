import express from 'express';
import https from 'https';
import fs from 'fs';
import pages from './pages';
import api from './controllers';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { MongoClient } from 'mongodb';

const secrets = JSON.parse(
  fs
    .readFileSync(
      __dirname + '\\secrets\\b2ae5d99-9bef-47db-bd60-fbf66e99c50c.json'
    )
    .toString()
);
const pfxCert = fs.readFileSync(__dirname + '\\secrets\\kwssp.pfx');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view-engine', 'pug');
app.set('views', 'src/views');

MongoClient.connect(
  'mongodb://localhost:27017/KWSSP',
  { useUnifiedTopology: true },
  (error, dbClient) => {
    if (error) console.error(error);

    const MongoStore = connectMongo(session);
    app.use(
      session({
        secret: secrets.session,
        store: new MongoStore({ client: dbClient, secret: secrets.store }),
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true, maxAge: 1000 * 60 },
      })
    );

    pages(app, dbClient);
    api(app, dbClient);

    https
      .createServer(
        {
          pfx: pfxCert,
          passphrase: secrets.certPass,
          requestCert: true,
          rejectUnauthorized: false,
        },
        app
      )
      .listen(443, () => {
        console.log('Listening on port 443');
      });
  }
);
