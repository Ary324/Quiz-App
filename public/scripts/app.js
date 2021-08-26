$(() => {
  $.ajax({
    method: "GET",
    url: "/users/quizzes"
  }).done((data) => {
    //console.log('data........',data);
    const quizzes = data.quizzes;
    //console.log('quizz........', quizzes);
    for(let quiz of quizzes){

      $('.content-table').append(`
      <tr>
          <td>${quiz.subject}</td>
          <td>${quiz.description}</td>
          <td><a class="table-link" href="/users/quiz/${quiz.id}">Take Quiz</a></td>
      </tr>
      `)
    }
  });
  });;
  // $(document).on("click", ".table-link", function (event) {
  //   console.log(event.currentTarget)
  // })

