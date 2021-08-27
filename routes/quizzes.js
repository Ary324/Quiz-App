// const express = require('express');
// const router = express.Router();
// module.exports = (db) => {
// // creating a quiz page
// router.get("/createquiz", (req, res) => {
//   console.log("req.session.userID",req.session.userID);
//       let templateVar = { userID: req.session.userID };
//       res.render('createquiz', templateVar);
// });

// // storing the quiz into the database
// router.post("/createquiz", (req, res) => {
//   console.log("req.body", req.body);
//   console.log("req.session.userID",req.session.userID);
//   const userID = req.session.userID;
//   const subject = req.body.subject;
//   const description = req.body.description;
//   const isPrivate = req.body.available_to_public;
//   const query = `INSERT INTO quizzes (user_id, subject, description, available_to_public) VALUES ($1, $2, $3, $4) RETURNING id`;
//   const values = [userID, subject, description, isPrivate];
//   let quizid;
//   db.query(query, values)
//     .then(data => {
//       const quiz = data.rows;
//       quizid = data.rows[0].id;
//       return quizid;
//     })
//     .then(data => {
//       const quizid = data;
//       const question = req.body.question;
//       const query1 =  `INSERT INTO questions (quiz_id, question) VALUES ($1, $2) RETURNING *`;
//       const values = [quizid, question];
//       return db.query(query1, values);
//     })
//     .then(data => {
//       const checkCorrectAnswers = ( answer) => {
//         if (!answer) {
//           return false;
//         }
//         return true;
//       };
//       const answers = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4];
//       const questionid = data.rows[0].id;
//       const isCorrect = [checkCorrectAnswers(req.body.is_correct1), checkCorrectAnswers(req.body.is_correct2), checkCorrectAnswers(req.body.is_correct3), checkCorrectAnswers(req.body.is_correct4)];
//       const query2 = `INSERT INTO answers (question_id, answer, is_correct) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12) RETURNING *`;
//       const values = [
//         questionid, answers[0], isCorrect[0],
//         questionid, answers[1], isCorrect[1],
//         questionid, answers[2], isCorrect[2],
//         questionid, answers[3], isCorrect[3],
//       ];
//       return db.query(query2, values);
//       })
//       .then(data => {

//         res.redirect(`/quiz/${quizid}`);
//       })
//     .catch(error => console.log(error))
// });
// return router;
// };
