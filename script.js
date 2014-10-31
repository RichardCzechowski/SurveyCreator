$(function() {
  console.log("Document Ready");
  Parse.initialize("It43BqxAW9BCoNjAKnGV9kKsQ4JRSZJfwTBxKMVn", "IT27sQWrzcw9V6M3IuEXrAA8gQ8a6yinpuwJDjdn");


  function addBusiness(email, target, problem, solution, cost, successCb){
    var Business = Parse.Object.extend("Business");
    var business = new Business();
    var parsePromise =  business.save({email: email, target: target, problem: problem, solution: solution, cost: cost })

    parsePromise.then(successCb, function(error){
      alert("Fail Motha Fucka");
    })

  }

  $("form").on("submit", function(){
    debugger;
    var email= $("input[name=email]").val();
    var target= $("input[name=target]").val();
    var problem= $("input[name=problem]").val();
    var solution= $("input[name=solution]").val();
    var cost= $("input[name=cost]").val();
    var onSuccess = function(){
      resetForm($("form")[0]);
      console.log("Hip Hip Hurray Mutha Fucka");
    }
    addBusiness(email, target, problem, solution, cost, onSuccess);
    return false;
  })

  function resetForm(formElement){
    formElement.reset();
  }


  var loadContacts = function(){
    console.log("loading from Parse");

    var contact = Parse.Object.extend("Contact");
    var query = new Parse.Query(contact);
    query.find({
      success: function(results) {
      var newLIs=results.map(function(element){
      return $("<li>",{text: element.attributes.name + ":" + element.attributes.email});
      });
      $("ul#list").html(newLIs);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  if ($("ul#list")[0]){
    loadContacts();
  }

});
