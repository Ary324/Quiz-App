$(() => {
  $.ajax({
    method: "GET",
    url: `/users/score`
  }).done((data) => {
    console.log('data........', data);
    // const quizzes = data.questions;
    const dd = [
      {
        subject: "Maths",
        description: "Factorization",
        score: 1
      },
      {
        subject: "Science",
        description: "Dna",
        score: 4
      }
    ];


    for (let quiz of dd) {

      $('main').append(`
      <div class="box">

        <div class='quiz-description'>
            <p>${quiz.subject}</p>
            <p>${quiz.description}</p>
            <p>${quiz.score}+"/5"</p>
        </div>

      </div>
      `)
    }
  });;
});
