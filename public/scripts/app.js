$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((data) => {
    for(let row of data.rows){
      console.log(row);
      $('.content-table').append(`
      <tr>
          <td>${row.subject}</td>
          <td>${row.description}</td>
          <td><a href="/users/quiz">Take Quiz</a></td>
      </tr>
      `)
    }
  });;
});
