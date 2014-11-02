$(function() {
  console.log("Document Ready");
  $.fn.serializeObject = function()
  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
  Parse.initialize("It43BqxAW9BCoNjAKnGV9kKsQ4JRSZJfwTBxKMVn", "IT27sQWrzcw9V6M3IuEXrAA8gQ8a6yinpuwJDjdn");
  //Add a business idea to Parse
  function addBusiness(form, successCb){
    debugger;
    console.log(form.surveyName);
    //check to see if business exists, if not, create
    var Business = Parse.Object.extend("Business");
    var query = new Parse.Query(Business);
    query.equalTo("surveyName", form.surveyName);
    query.count({
      success: function(count){
        if (count!=0){
          console.log(count);
          alert("A survey with the name '"+form.surveyName+"' already exists! Please choose another.");
        }
        else{
          var business = new Business();
          var parsePromise =  business.save({surveyName: form.surveyName, email: form.email, target: form.target, problem: form.problem, solution: form.solution, cost: form.cost })
          parsePromise.then(successCb, function(error){
            alert("Failure to create business");
          })
        }
      },
      error: function(error){
      }
    })
  }

  function addResults(form, successCb){
    var Result = Parse.Object.extend("Result");
    var result= new Result();
    var parsePromise= result.save({surveyName: surveyName, target: form.target, problem: form.problem, solution: form.solution, cost: form.cost});
    parsePromise.then(successCb, function(error){
      alert("There was a problem saving your survey, please try again.");
    })
  }

  //business idea submit
  $("#businessIdea").on("submit", function(){
    debugger;
    var formObject = $(this).serializeObject();
    formObject= objLowerCase(formObject);
    var onSuccess = function(){
      alert("Survey Created!");
      resetForm($("form")[0]);
    }
    addBusiness(formObject, onSuccess);
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
        if(object.id!=undefined){
          $("h1").replaceWith("<h1 class='text-center'>"+surveyName.toUpperCase()+"</h1>");
          $("form").show();
          $("#surveyName").hide();
          var data=[object.attributes.target, object.attributes.problem, object.attributes.solution, object.attributes.cost]
          var label=["target","problem","solution","cost"]
          for (i=0; i<data.length;i++){
            console.log(data[i].toString());
            $("#"+label[i]+"Label > p span").text(data[i].toString());
          }
        }
        else
          alert(surveyName + " does not seem to be a valid survey name, please try again.");
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
  //On survey page, once name of survey is submitted- retrieve data.
  $("#surveyName").on("submit", function(){
    surveyName= $("input[name=surveyName]").val().toLowerCase();;
    if ($("title#survey").length){
      console.log(surveyName);
      fillSurvey(surveyName);
    }
    return false;
  });
  //On survey page, once survey is completed- send data to parse
  $("#surveyResults").on("submit", function(){
    var formObject = $(this).serializeObject();
    console.log(formObject);
    formObject= objLowerCase(formObject);
    var successCb= function(){
      $("#surveyResults").hide();
      $("h2").replaceWith("<h2 class='text-center'>Survey completed! Thank you!</h2>");
    };
    addResults(formObject, successCb);

    return false;
  })
  //results page- on enter email, get name of business
  $("#getSurvey").on("submit", function(){
    var email=$("input[name=email]").val().toLowerCase();;
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
    $("h1").text(surveyName.toUpperCase())
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

  function objLowerCase(obj){
    $.each(obj, function(key,value) {if(typeof value==='string')
             {obj[key]=value.toLowerCase()}});
           return(obj);
  };
});
