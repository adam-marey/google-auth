const express = require('express');
const router = express.Router();
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

router.get('/users', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from users;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

router.get('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  const SQL = `SELECT * FROM users WHERE id=$1;`;
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

router.post('/users', async (req, res, next) => {
  const {
    firstname,
    lastname,
    occupation,
    company,
    website,
    email,
    phone,
    photo_url
  } = req.body;
  const SQL = `
    INSERT INTO users (firstname, lastname, occupation, company, website, email, phone, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    firstname,
    lastname,
    occupation,
    company,
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

router.delete('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  const SQL = `DELETE FROM users WHERE id=$1;`;
  const values = [id];
  try {
    await client.query(SQL, values);
    res.status(204).end(); // No content to send back
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.put('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    occupation,
    company,
    website,
    email,
    phone,
    photo_url
  } = req.body;
  const SQL = `
    UPDATE users 
    SET firstname=$1, lastname=$2, occupation=$3, company=$4, website=$5, email=$6, phone=$7, photo_url=$8
    WHERE id=$9
    RETURNING *;
  `;
  const values = [
    firstname,
    lastname,
    occupation,
    company,
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
