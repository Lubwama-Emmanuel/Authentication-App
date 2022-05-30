const mongoose = require('mongoose');
const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const colors = require('colors')

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

const db = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(db).then(() => {
    console.log('DATABASE CONNECTED SUCCESSFULLY..'.yellow)
}).catch(err => console.log('Oooops DATABASE NOT CONNECTED'.red, err))


app.listen(port, () => {
  console.log(`App is listening to port: ${port}`);
});
