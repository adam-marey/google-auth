const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/arizona'
);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/api/notes', async (req, res, next) => {
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

const init = async () => {
  await client.connect();
  const SQL = `
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(255),
      lastname VARCHAR(255),
      occupation VARCHAR(255),
      service TEXT,
      website  VARCHAR(255),
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(15),
      photo_url VARCHAR(255)
    );
    INSERT INTO notes (firstname, lastname, occupation, service, website, email, phone, photo_url)
    VALUES ('John', 'Doe', 'Software Engineer', 'Google', 'www.google.com', 'john@gmail.com', '1234567890', 'https://imageio.forbes.com/specials-images/imageserve/64b5825a5b9b4d3225e9bd15/artificial-intelligence--ai/960x0.jpg?format=jpg&width=960');
  `;
  await client.query(SQL);
  console.log('data seeded');
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
