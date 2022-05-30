const express = require('express');
const axios = require('axios');
const cors = require('cors');
const userRouter = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use(cors({ credentials: true, origin: true }));

app.get('/home', (req, res) => {
  res.send('Heloooo');
});

app.get('/github', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

app.get('/callback', (req, res) => {
  axios({
    method: 'POST',
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.query.code}`,
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      console.log(response.data);
      res.redirect(
        `http://localhost:5000?access_token=${response.data.access_token}`
      );
    })
    .catch((err) => console.log('Error:', err));
});


module.exports = app;
