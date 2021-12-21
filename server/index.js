require('dotenv/config');
const pg = require('pg');
// const jwt = require('jsonwebtoken');
// const argon2 = require('argon2');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
// const authorizationMiddleware = require('./authorization-middleware');
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

app.post('/api/users/entries', (req, res) => {
  const userId = 1;
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

  const sql = `
    select *
      from "entries"
     order by "entryId"
  `;

  db.query(sql)
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
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
