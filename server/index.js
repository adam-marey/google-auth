const express = require('express');
const app = express();
const path = require('path');
const { router, client } = require('./routes');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use('/api', router);

const init = async () => {
  await client.connect();
  const SQL = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(255),
      lastname VARCHAR(255),
      occupation VARCHAR(255),
      company TEXT,
      website VARCHAR(255),
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(15),
      photo_url VARCHAR(255)
    );

    INSERT INTO users (firstname, lastname, occupation, company, website, email, phone, photo_url)
    VALUES 
      ('Adam', 'Marey', 'Software Engineer', 'Google', 'www.google.com', 'john@google.com', '1234567890', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'),
      ('William', 'Smith', 'Data Analyst', 'Facebook', 'www.facebook.com', 'alice@facebook.com', '9876543210', 'https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png'),
      ('Andrew', 'Johnson', 'Web Developer', 'Amazon', 'www.amazon.com', 'bob@amazon.com', '5556667777', 'https://i.pinimg.com/736x/0a/06/60/0a06600cc3cedeb49280b54114c88ce6.jpg');
  `;

  await client.query(SQL);
  console.log('data seeded');

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
