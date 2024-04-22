const express = require('express');
const router = express.Router();
const pg = require('pg');

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/arizona'
);

router.get('/notes', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from notes;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

router.get('/notes/:id', async (req, res, next) => {
  const { id } = req.params;
  const SQL = `SELECT * FROM notes WHERE id=$1;`;
  const values = [id];
  try {
    const data = await client.query(SQL, values);
    res.status(200).json({
      status: 'success',
      data: data.rows[0]
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.post('/notes', async (req, res, next) => {
  const {
    firstname,
    lastname,
    occupation,
    service,
    website,
    email,
    phone,
    photo_url
  } = req.body;
  const SQL = `
    INSERT INTO notes (firstname, lastname, occupation, service, website, email, phone, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    firstname,
    lastname,
    occupation,
    service,
    website,
    email,
    phone,
    photo_url
  ];
  try {
    const data = await client.query(SQL, values);
    res.status(201).json({
      status: 'success',
      data: data.rows[0]
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.delete('/notes/:id', async (req, res, next) => {
  const { id } = req.params;
  const SQL = `DELETE FROM notes WHERE id=$1;`;
  const values = [id];
  try {
    await client.query(SQL, values);
    res.status(204).end(); // No content to send back
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.put('/notes/:id', async (req, res, next) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    occupation,
    service,
    website,
    email,
    phone,
    photo_url
  } = req.body;
  const SQL = `
    UPDATE notes 
    SET firstname=$1, lastname=$2, occupation=$3, service=$4, website=$5, email=$6, phone=$7, photo_url=$8
    WHERE id=$9
    RETURNING *;
  `;
  const values = [
    firstname,
    lastname,
    occupation,
    service,
    website,
    email,
    phone,
    photo_url,
    id
  ];
  try {
    const data = await client.query(SQL, values);
    res.status(200).json({
      status: 'success',
      data: data.rows[0]
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

module.exports = { router, client };
