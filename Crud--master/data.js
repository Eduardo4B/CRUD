var url= 'http://localhost:8080/employees';
var nexId = 10006;
var first;
var next;
var prev;
var last;
var response=null;

$(document).ready(function () {

  chiamataServer(url);

  var id;
  $("body").on("click", "#btn-delete", function () {
    $(this).parents("tr").fadeOut("fast");
    var td = $(this).parent("td");
    var id = td.data("id");
    $.ajax({
      url: url+'/'+id,
      type: "delete",
      success: function(data){
        displayTable(url+"?page="+dati['page']['number']+"&size=20");}
  })

  });

  $("body").on("click", "#btn-add", function () {
    var firstName = $('#firstName').val();
    console.log(firstName);
    var lastname = $('#lastname').val();
    console.log(lastname);

    var nuovo = {
      "id": nexId,
      "firstName": firstName,
      "lastName": lastname,
      "gender": "M",

    }
    $.ajax({
      type: "POST",
      url: url,

      data: JSON.stringify({
          birthDate: "",
          firstName: firstName,
          gender: "M",
          hireDate: "",
          lastName: lastname,
      }),

      contentType: "application/json",
      dataType: 'json',

      success: function () {
          var last = response["_links"]["last"]["href"];
          console.log(last);
          chiamataServer(last);
      }
  });
    

    var modal= $('#exampleModal');
    modal.modal("hide");

  });


  $("#confirm-modifica").click(function () {

    var data = {
      "id": id,
      "firstName": $("#nome-m").val(),
      "lastName": $("#cognome-m").val(),
      "gender": "M"
    }

    $.ajax({
      type: "PUT",
      url: 'http://localhost:8080/employees/'+id,
      data : JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function(data){
          chiamataServer(url);
 
        }
    })

    var modal= $('#modalmodifica');
    modal.modal("hide");
  
  });


  $("body").on("click", "#btn-modifica", function () {

    $(this).parents("tr").fadeOut("fast");
    var td = $(this).parent("td");
    id = td.data("id");
    
    $.get('http://localhost:8080/employees/' + id, function(data) {

      $("#nome-m").val(data.firstName);
      $("#cognome-m").val(data.lastName);

    });

  });
  
});

function chiamataServer(link) {
  $.ajax({
    url: link,
    success: function( responseData ) {
      response=responseData;
      displayTable(response["_embedded"]["employees"]);
      console.log(response)
      if(response["page"]["number"]!=response["page"]["totalPages"]-1){
        next = response['_links']['next']['href']
      }
      last=response['_links']['last']['href']
      prev=response['_links']['prev']['href']
      first=response['_links']['first']['href']
      
    },
    dataType: 'json'
  });

}

$('#next').click(function(){
  console.log(next);
  chiamataServer(next);
});

$('#last').click(function(){
  console.log(last);
  chiamataServer(last);
});

$('#prev').click(function(){
  console.log("prev:"+prev);
  chiamataServer(prev);
});

$('#first').click(function(){
  console.log(first);
  chiamataServer(first);
});

function displayTable(dati) {
  var r = '';
  $.each(dati, function (id, value) {
    r += '<tr>';
    r += '<td>' + value.id + '</td>';
    r += '<td>' + value.firstName + '</td>';
    r += '<td>' + value.lastName + '</td>';
    r += '<td data-id=' + value.id + '> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalmodifica" id="btn-modifica">Modifica</button>' + '</td>';
    r += '<td data-id=' + value.id + '> <button type="button" class="btn btn-danger" id="btn-delete">Elimina</button>' + '</td>';
    r += '<tr>' + '</tr>';
  });
  $("tbody").html(r);
}