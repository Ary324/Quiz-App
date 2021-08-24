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
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
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

  return router;
};
