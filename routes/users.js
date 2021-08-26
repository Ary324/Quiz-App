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
    let templateVars = {
      user: null
    };
    if (req.session.userID) {
      const user = req.session.userID;
      templateVars = { user };
    }
    return res.render('index', templateVars);

  });

  router.get("/quizzes", (req, res) => {
    db.query(`SELECT * FROM quizzes;`)
      .then(data => {
        const quizzes = data.rows;
        return res.json({ quizzes });
      })
      .catch(err => {
        return res
          .status(500)
          .json({ error: err.message });
      });

  });
  router.get("/questions/:id", (req, res) => {
    db.query(`
    SELECT questions.*, quizzes.subject, quizzes.description, ARRAY_AGG(answer) answer
    FROM quizzes
    JOIN questions ON quizzes.id = questions.quiz_id
    JOIN answers ON questions.id = answers.question_id
    WHERE quizzes.id = ${req.params.id}
    GROUP BY questions.id, quizzes.subject, quizzes.description;`)
      .then(data => {

        const questions = data.rows;
        return res.json({ questions });
      })
      .catch(err => {
        return res
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

  router.get('/quiz/:id', (req, res) => {
    let templateVars = {
      user: null
    };
    if (req.session.userID) {
      const user = req.session.userID;
      templateVars = { user };
    }
    return res.render('take_quiz', templateVars);
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
