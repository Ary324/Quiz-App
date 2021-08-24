/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

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
  });

  router.get('/login', (req, res) => {
    const userID = req.session.userID;
    if (userID) {
      res.redirect('/your_quizzes');
    } else {
      res.render('login');
    }
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
