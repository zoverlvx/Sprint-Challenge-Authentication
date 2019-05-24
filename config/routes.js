const axios = require('axios');
const bcrypt = require("bcryptjs");

const { authenticate } = require('../auth/authenticate');
const tokenService = require("./tokenService");
const Users = require("./model")("users");

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(saved => res.status(201).json(saved))
        .catch(error => res.status(500).json(error));
}

function login(req, res) {
    const {username, password} = req.body;

    Users.findBy({username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = tokenService.generateToken(user);
                res.status(200).json({
                    success: true,
                    token
                });
            }
            if (!user || !bcrypt.compareSync(password, user.password)) {
                res.status(401).json({success: false, message: "Invalid credentials"});
            }
        })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
