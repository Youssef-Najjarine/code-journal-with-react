require('dotenv/config');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const app = express();

const jsonMiddleware = express.json();

app.use(jsonMiddleware);
app.use(staticMiddleware);
app.use(errorMiddleware);

app.post('/api/users/sign-up', (req, res, next) => {
  const { firstName, lastName, email, password, birthday, gender } = req.body;
  if (!firstName || !lastName || !email || !password || !birthday || !gender) {
    throw new ClientError(400, 'Please enter a valid firstName, lastName, email, password, birthday, and gender.');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("firstName", "lastName", "email", "hashedPassword", "birthday", "gender")
        values ($1, $2, $3, $4, $5, $6)
        returning "userId", "firstName", "lastName", "createdAt"
      `;
      const params = [firstName, lastName, email, hashedPassword, birthday, gender];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/users/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword",
           "firstName",
           "lastName"
      from "users"
     where "email" = $1
  `;
  const params = [email];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword, firstName, lastName } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, fullName: firstName + ' ' + lastName };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});
app.use(authorizationMiddleware);
app.post('/api/users/entries', (req, res) => {
  const userId = req.user.userId;
  const { title, photoUrl, notes } = req.body;
  if (!title || !photoUrl || !notes) {
    throw new ClientError(400, 'Please enter a valid title, photo Url, and notes.');
  }
  const sql = `
    insert into "entries" ( "title", "photoUrl", "notes", "userId")
    values ($1, $2, $3, $4)
    returning *
  `;
  const params = [title, photoUrl, notes, userId];
  db.query(sql, params)
    .then(result => {
      const [entry] = result.rows;
      res.status(201).json(entry);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});
app.get('/api/users/:userId/entries', (req, res) => {
  const userId = req.user.userId;
  const sql = `
    select *
      from "entries"
      where "userId" = $1
     order by "entryId"

  `;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});
app.get('/api/entries/:entryId', (req, res) => {
  const entryId = parseInt(req.params.entryId, 10);
  const sql = `
    select *
      from "entries"
      WHERE "entryId"=$1
  `;
  const params = [entryId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});
app.patch('/api/entries/:entryId', (req, res) => {
  const { entryId } = req.params;
  const { title, photoUrl, notes } = req.body;
  if (!title || !photoUrl || !photoUrl || !notes) {
    throw new ClientError(400, 'please enter a valid meal title, photo URL, and notes.');
  }

  const sql = `
    update "entries"
       set "title" = $1,
           "photoUrl" = $2,
           "notes" = $3
     where "entryId" = $4
     returning *
  `;
  const params = [title, photoUrl, notes, entryId];
  db.query(sql, params)
    .then(result => {
      const [updatedEntry] = result.rows;
      if (!updatedEntry) {
        throw new ClientError(400, `cannot find entryId with entryId ${entryId}`);
      }
      res.json(updatedEntry);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.delete('/api/entries/:entryId', function (req, res) {
  let { entryId } = req.params;
  entryId = Number(entryId);

  const text = `DELETE FROM "entries"
              where "entryId"=$1
              RETURNING *`;
  const value = [entryId];
  db.query(text, value, (err, res2) => {
    if (err) {
      return res.status(500).send({ error: 'database querying failed.' });
    } else {
      return res.sendStatus(204);
    }
  });
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
