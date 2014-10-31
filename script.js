$(function() {
  console.log("Document Ready");
  Parse.initialize("It43BqxAW9BCoNjAKnGV9kKsQ4JRSZJfwTBxKMVn", "IT27sQWrzcw9V6M3IuEXrAA8gQ8a6yinpuwJDjdn");
  //Add a business idea to Parse
  function addBusiness(email, surveyName, target, problem, solution, cost, successCb){
    var Business = Parse.Object.extend("Business");
    var business = new Business();
    var parsePromise =  business.save({email: email, surveyName: surveyName, target: target, problem: problem, solution: solution, cost: cost })
    parsePromise.then(successCb, function(error){
      alert("Fail Motha Fucka");
    })
  }

  //business idea submit
  $("#businessIdea").on("submit", function(){
    var email= $("input[name=email]").val();
    var surveyName =$("input[name=surveyName]").val();
    var target= $("input[name=target]").val();
    var problem= $("input[name=problem]").val();
    var solution= $("input[name=solution]").val();
    var cost= $("input[name=cost]").val();
    var onSuccess = function(){
      resetForm($("form")[0]);
      console.log("Hip Hip Hurray Mutha Fucka");
    }
    addBusiness(email, surveyName, target, problem, solution, cost, onSuccess);
    return false;
  })

  //reset form on submit
  function resetForm(formElement){
    formElement.reset();
  }

  //fill survey page with data from parse
  var fillSurvey= function(surveyName){
    console.log("loading from Parse");
    var Business= Parse.Object.extend("Business");
    var query = new Parse.Query(Business);
    var object=[];
    query.equalTo("surveyName",surveyName);
    query.first({
      success: function(object) {
        $("h1").replaceWith("<h1 class='text-center'>"+surveyName+"</h1>");
        $("form").show();
        $("#surveyName").hide();
        var data=[object.attributes.target, object.attributes.problem, object.attributes.solution, object.attributes.cost]
        var label=["target","problem","solution","cost"]
        for (i=0; i<data.length;i++){
          console.log(data[i].toString());
          $("#"+label[i]+"Label > p span").text(data[i].toString());
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  $("#surveyName").on("submit", function(){
    var surveyName= $("input[name=surveyName]").val();
    if ($("title#survey").length){
      console.log(surveyName);
      fillSurvey(surveyName);
    }
      return false;
  });

});
