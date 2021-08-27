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

  router.get('/user-quizzes', (req, res) => {
    db.query(`
    SELECT *
    FROM quizzes
    JOIN questions ON quizzes.id = questions.quiz_id
    JOIN answers ON questions.id = answers.question_id
    WHERE users.id = ${req.session.id}
    GROUP BY quizzes.subject;`)
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

  router.get('/your_quizzes'), (req, res) => {
    let templateVars = {
      user: null
    };
    if (req.session.userID) {
      const user = req.session.userID;
      templateVars = { user };
    }
    return res.render('your_quizzes', templateVars);
  };

  router.get('/score', (req, res) => {
    db.query(`
    SELECT *
    FROM quizzes
    JOIN questions ON quizzes.id = questions.quiz_id
    JOIN answers ON questions.id = answers.question_id
    WHERE users.id = ${req.session.id};
    `)
      .then(data => {

        const score = data.rows;
        return res.json({ score });
      })
      .catch(err => {
        return res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/result', (req, res) => {
    let templateVars = {
      user: null
    };
    if (req.session.userID) {
      const user = req.session.userID;
      templateVars = { user };
    }
    return res.render('result', templateVars);
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

  router.get("/createquiz", (req, res) => {
    console.log("req.session.userID", req.session.userID);
    let templateVar = { userID: req.session.userID };
    res.render('createquiz', templateVar);
  });

  // storing the quiz into the database
  router.post("/createquiz", (req, res) => {
    console.log("req.body", req.body);
    console.log("req.session.userID", req.session.userID);
    const userID = req.session.userID;
    const subject = req.body.subject;
    const description = req.body.description;
    const isPrivate = req.body.available_to_public;
    const query = `INSERT INTO quizzes (user_id, subject, description, available_to_public) VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [userID, subject, description, isPrivate];
    let quizid;
    db.query(query, values)
      .then(data => {
        const quiz = data.rows;
        quizid = data.rows[0].id;
        return quizid;
      })
      .then(data => {
        const quizid = data;
        const question = req.body.question;
        const query1 = `INSERT INTO questions (quiz_id, question) VALUES ($1, $2) RETURNING *`;
        const values = [quizid, question];
        return db.query(query1, values);
      })
      .then(data => {
        const checkCorrectAnswers = (answer) => {
          if (!answer) {
            return false;
          }
          return true;
        };
        const answers = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4];
        const questionid = data.rows[0].id;
        const isCorrect = [checkCorrectAnswers(req.body.is_correct1), checkCorrectAnswers(req.body.is_correct2), checkCorrectAnswers(req.body.is_correct3), checkCorrectAnswers(req.body.is_correct4)];
        const query2 = `INSERT INTO answers (question_id, answer, is_correct) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12) RETURNING *`;
        const values = [
          questionid, answers[0], isCorrect[0],
          questionid, answers[1], isCorrect[1],
          questionid, answers[2], isCorrect[2],
          questionid, answers[3], isCorrect[3],
        ];
        return db.query(query2, values);
      })
      .then(data => {

        res.redirect(`/quiz/${quizid}`);
      })
      .catch(error => console.log(error));
  });

  return router;
};
