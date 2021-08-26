$(() => {
  $.ajax({
    method: "GET",
    url: `/users/questions/${window.location.pathname.split("/")[3]}`
  }).done((data) => {
    console.log('data........', data);
    const quizzes = data.questions;
    //console.log('quizz........', quizzes);
    //console.log('this is quizzes',quizzes)

    for (let quiz of quizzes) {

      $('main').append(`
      <div class="box">

        <div class='quiz-description'>
            <p>${quiz.subject}</p>
            <p>${quiz.question}</p>
        </div>

        <div class="answers">
            <p>question 1</p>
            <button class="myButton quiz" type="button">${quiz.answer[0]}</button>
            <button class="myButton quiz" type="button">${quiz.answer[1]}</button>
            <button class="myButton quiz" type="button">${quiz.answer[2]}</button>
            <button class="myButton quiz" type="button">${quiz.answer[3]}</button>
        </div>

      </div>
      `)
    }
  });;
  // $(document).on("click", ".table-link", function (event) {
  //   console.log(event.currentTarget)
  // })
});
