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
          <td><a href="">Take Quiz</a></td>
      </tr>
      `)
    }
  });;
});
