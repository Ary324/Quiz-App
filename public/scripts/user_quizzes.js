$(() => {
  $.ajax({
    method: "GET",
    url: "/user/user-quizzes"
  }).done((data) => {
    const quizzes = data.quizzes;
    for (let quiz of quizzes) {

      $('.content-table').append(`
      <tr>
          <td>${quiz.subject}</td>
          <td>${quiz.description}</td>
          <td><a class="table-link" href="/users/quiz/${quiz.id}">Take Quiz</a></td>
      </tr>
      `)
    }
  });;
});
