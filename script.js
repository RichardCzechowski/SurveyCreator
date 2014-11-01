$(function() {
  console.log("Document Ready");
  Parse.initialize("It43BqxAW9BCoNjAKnGV9kKsQ4JRSZJfwTBxKMVn", "IT27sQWrzcw9V6M3IuEXrAA8gQ8a6yinpuwJDjdn");
  //Add a business idea to Parse
  function addBusiness(email, surveyName, target, problem, solution, cost, successCb){
    var Business = Parse.Object.extend("Business");
    var business = new Business();
    var parsePromise =  business.save({email: email, surveyName: surveyName, target: target, problem: problem, solution: solution, cost: cost })
    parsePromise.then(successCb, function(error){
      alert("Failure to create business");
    })
  }

  function addResults(surveyName, target, problem, solution, cost, successCb){
    var Result = Parse.Object.extend("Result");
    var result= new Result();
    var parsePromise= result.save({surveyName: surveyName, target:target, problem: problem, solution: solution, cost: cost});
    parsePromise.then(successCb, function(error){
      alert("There was a problem saving your survey, please try again.");
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
  //On survey page, once name of survey is submitted- retrieve data.
  var surveyName="";
  $("#surveyName").on("submit", function(){
    surveyName= $("input[name=surveyName]").val();
    if ($("title#survey").length){
      console.log(surveyName);
      fillSurvey(surveyName);
    }
    return false;
  });
  //On survey page, once survey is completed- send data to parse
  $("#surveyResults").on("submit", function(){
    var target = $("input[name=target]:checked").val();
    var problem= $("input[name=problem]:checked").val();
    var solution= $("input[name=solution]:checked").val();
    var cost= $("input[name=cost]:checked").val();
    var successCb= function(){
      $("#surveyResults").hide();
      $("h2").replaceWith("<h2 class='text-center'>Survey completed! Thank you!</h2>");
    };
    addResults(surveyName, target, problem, solution, cost, successCb);

    return false;
  })
  //results page- on enter email, get name of business
  $("#getSurvey").on("submit", function(){
    var email=$("input[name=email]").val();
    var Business = Parse.Object.extend("Business");
    var query= new Parse.Query(Business);
    query.equalTo("email" , email);
    query.first({
      success: function(result){
        var surveyResults= result.get("surveyName");
        //use business name to get results
        var Result = Parse.Object.extend("Result");
        var query= new Parse.Query(Result);
        query.equalTo("surveyName", surveyResults);
        query.find({
          success: function (result){
            var totalResult= targetResult= problemResult= solutionResult= costResult=0;
            totalResult=result.length;
            for (i=0; i<result.length; i++){
            targetResult+= parseInt(result[i].get("target"));
            problemResult += parseInt(result[i].get("problem"));
            solutionResult += parseInt(result[i].get("solution"));
            costResult += parseInt(result[i].get("cost"));
          }
          console.log(targetResult);
            fillResults(totalResult, targetResult, problemResult, solutionResult, costResult, surveyResults);
          },
          error: function (error){
            alert("Error: " + error.message);
          }
        })
      },
      error: function(error){
        alert("Error: " + error.message);
      }
    });

    return false;
  })

  function fillResults(total, target, problem, solution, cost, surveyName){
    $("h1").text(surveyName)
    $("#getSurvey").hide();
    console.log(target);
    target= Math.floor(100*(target/total), -2);
    problem= Math.floor( target* (problem/total), -2);
    solution= Math.floor( target* (solution/total),-2);
    cost= Math.floor(target* (cost/total), -2);
$("#target>div").append(target);
$("#problem>div").append(problem);
$("#solution>div").append(solution);
$("#cost>div").append(cost);
 $('#target>div').css('width', target+"%").attr('aria-valuenow', target); 
 $('#problem>div').css('width', problem+"%").attr('aria-valuenow', problem); 
 $('#solution>div').css('width', solution+"%").attr('aria-valuenow',solution); 
 $('#cost>div').css('width', cost+"%").attr('aria-valuenow', cost); 
  }

});
