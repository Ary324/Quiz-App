/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM quizzes;`)
      .then(data => {
        const rows = data.rows;
        console.log(rows, 'hey im rows');
        res.json({ rows });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    let templateVars = {
      user: null
    };
    if (req.session.userID) {
      const user = req.session.userID;
      templateVars = {
        user
      };
    }
    res.render('index', templateVars);
  });

  router.get('/login', (req, res) => {
    const userID = req.session.userID;
    if (userID) {
      res.redirect('/your_quizzes');
    } else {
      res.render('login');
    }
  });

  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    let queryString = `
      SELECT * FROM users
    `;

    let queryParams = [email];

    db.query(queryString, queryParams)
      .then((data) => {
        if (bcrypt.compareSync(password, data.rows[0].password)) {
          req.session = {
            userID: data.rows[0].id,
            userEmail: data.rows[0].email,
            userName: data.rows[0].username
          };
          res.redirect('/your_quizzes');
        } else {
          res.status(403);
          res.send("Incorrect Email And/Or Password");
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/users/login');
  });

  router.get('/register', (req, res) => {
    const userID = req.session.userID;
    if (userID) {
      res.redirect('your_quizzes');
    } else {
      res.render('register');
    }
  });

  router.get('/quiz', (req, res) => {
    res.render("take_quiz");
  });

  router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    let selectString = `
      SELECT * FROM users
      WHERE username = $1 OR email = $2
    `;

    let insertString = `
      INSERT INTO users (username, email, password)0
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    let selectParams = [username, email];
    let insertParams = [username, email, bcrypt.hashSync(password, 10)];

    db.query(selectString, selectParams);
    if (username && email && password) {
      db.query(insertString, insertParams)
        .then((data) => {
          req.session = {
            userID: data.rows[0].id,
            userEmail: data.rows[0].email,
            userName: data.rows[0].username,
          };
          res.render('index', { user: req.session.userID });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ error: err.message });
        });
    } else {
      res.send("Please enter valid email and/or password");
      res.redirect('/users/register');
    }
  });

  return router;
};
