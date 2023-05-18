






var $progressValue = 0;
var resultList=[];

const quizdata=[
      {
        question:"Welcher Satz є richtig?",
        options:["Peter kann nicht gut schwimmen", " Peter nicht gut schwimmen kann", "Peter schwimmt nicht gut kann", "Peter kann nicht schwimmen gut"],
        answer:"Peter kann nicht gut schwimmen",
        category:1
      },
      {
        question:"Welches Verb passt?",
        options:["Ich heißt Peter Müller.", "Ich hieße Peter Müller.", "Ich heiße Peter Müller.", "Ich heißen Peter Müller."],
        answer:"Ich heiße Peter Müller",
        category:3
      },
      {
        question:"Welches Wort ist richtig?",
        options:["Їх gehe nach Hause.", "Їх gehe von Hause.", "Їх gehe aus Hause.", "Їх gehe в Hause."],
        answer:"Їх gehe nach Hause.",
        category:1
      },
      {
        question:"Welches Wort ist falsch?",
        options:["Bücher", "Hefte", "Zeitschriften", "Stühler"],
        answer:"Stühler",
        category:4
      },
      {
        question:"Welches Wort passt?",
        options:["Hat eine Person für mich angerufen?", "Hat jemand mich angerufen?", "Hat ein Mensch für mich angerufen?", "Hat nirgendwer für mich angerufen?"],
        answer:"Hat jemand mich angerufen?",
        category:2
      },
      {
        question:"Welches Satzende ist korrekt? Wenn man in Berlin gut leben will,...",
        options:["darf man nicht reich sein.", "muss man nicht reich sein.", "soll man nicht reich sein.", "kann man nicht reich sein."],
        answer:"muss man nicht reich sein.",
        category:2
      },
      {
        question:"Welches Wort ist richtig? Weil der Film so langweilig war, bin ich im Kino ...",
        options:["eingeschlafen", "eingeschlaft", "einschlafen", "einschlaft"],
        answer:"eingeschlafen",
        category:1
      },
      {
        question:"Welches Satzende ist richtig? Ich lese gerne Bücher, ...",
        options:["aber ich gehe gerner in Kino.", "aber ich gehe mehr gern in Kino.", "aber ich gehe besser in Kino.", "aber ich gehe lieber ins Kino."],
        answer:"aber ich gehe lieber ins Kino.",
        category:4
      },
      {
        question:"Welches Satzende ist richtig? Paul und Petra sind seit fünf Jahren ein Paar, ...",
        options:["aber sie nicht heiraten wollen.", "aber sie wollen nicht heiraten.", "darum sie wollen nicht heiraten.", "darum sie nicht heiraten wollen."],
        answer:"aber sie wollen nicht heiraten.",
        category:2
      },
      {
        question:"Welches Satzende ist richtig? Um 10.00 Uhr beginnt der Unterricht,...",
        options:["aber ich habe keine Lust.", "oder wir lernen viel Deutsch.", "und ich gehe nach Hause.", "dann wir lernen viel Deutsch."],
        answer:"aber ich habe keine Lust.",
        category:1
      },
      {
        question:"Welche Lösung ist die beste?",
        options:[" Uns an Mittwoch zu 10:00 .", " Uns am Mittwoch für 10:00 .", " Uns um Mittwoch am 10:00 Uhr.ir treffen uns am Mittwoch um 10:00 Uhr."],
        answer:"Wir treffen uns um Mittwoch am 10:00 Uhr.",
        category:3
      },
      {
        question:"Welches Wort ist richtig?",
        options:["Kannst du ich bitte das Buch geben?", "Kannst du mich bitte das Buch geben?", "Kannst du mein bitte das Buch geben?", "Kannst du mir bitte das Buch geben?"],
        answer:"Kannst du mir bitte das Buch geben?",
        category:4
      }
    ];
/** Random shuffle questions **/
function shuffleArray(question){
   var shuffled=question.sort(function() {
    return .5 - Math.random();
 });
   return shuffled;
}

function shuffle(a) {
  for (var i = a.length; i; i--) {
    var j = Math.floor(Math.random() * i);
    var _ref = [a[j], a[i - 1]];
    a[i - 1] = _ref[0];
    a[j] = _ref[1];
  }
}

/*** Return shuffled question ***/
function generateQuestions(){
  var questions=shuffleArray(quizdata);    
  return questions;
}

/*** Return list of options ***/
function returnOptionList(opts, i){

  var optionHtml='<li class="myoptions">'+
    '<input value="'+opts+'" name="optRdBtn" type="radio" id="rd_'+i+'">'+
    '<label for="rd_'+i+'">'+opts+'</label>'+
    '<div class="bullet">'+
      '<div class="line zero"></div>'+
      '<div class="line one"></div>'+
      '<div class="line two"></div>'+
      '<div class="line three"></div>'+
      '<div class="line four"></div>'+
      '<div class="line five"></div>'+
      '<div class="line six"></div>'+
      '<div class="line seven"></div>'+
    '</div>'+
  '</li>';

  return optionHtml;
}

/** Render Options **/
function renderOptions(optionList){
  var ulContainer=$('<ul>').attr('id','optionList');
  for (var i = 0, len = optionList.length; i < len; i++) {
    var optionContainer=returnOptionList(optionList[i], i)
    ulContainer.append(optionContainer);
  }
  $(".answerOptions").html('').append(ulContainer);
}

/** Render question **/
function renderQuestion(question){
  $(".question").html("<h1>"+question+"</h1>");
}

/** Render quiz :: Question and option **/
function renderQuiz(questions, index){ 
  var currentQuest=questions[index];  
  renderQuestion(currentQuest.question); 
  renderOptions(currentQuest.options); 
  console.log("Question");
  console.log(questions[index]);
}

/** Return correct answer of a question ***/
function getCorrectAnswer(questions, index){
  return questions[index].answer;
}

/** pushanswers in array **/
function correctAnswerArray(resultByCat){
  var arrayForChart=[];
  for(var i=0; i<resultByCat.length;i++){
   arrayForChart.push(resultByCat[i].correctanswer);
  }

  return arrayForChart;
}



/** Generate array for percentage calculation **/
function genResultArray(results, wrong){
  var resultByCat = resultByCategory(results);
  var arrayForChart=correctAnswerArray(resultByCat);
  arrayForChart.push(wrong);
  return arrayForChart
}

/** percentage Calculation **/
function percentCalculation(array, total){
  var percent = array.map(function (d, i) {
    return (100 * d / total).toFixed(2);
  });
  return percent;
}

/*** Get percentage for chart **/
function getPercentage(resultByCat, wrong){
  var totalNumber=resultList.length;
  var wrongAnwer=wrong;
  //var arrayForChart=genResultArray(resultByCat, wrong);
  //return percentCalculation(arrayForChart, totalNumber);
}

/** count right and wrong answer number **/
function countAnswers(results){

  var countCorrect=0, countWrong=0;

  for(var i=0;i<results.length;i++){
    if(results[i].iscorrect==true)  
        countCorrect++;
    else countWrong++;
  }

  return [countCorrect, countWrong];
}

/**** Categorize result *****/
function resultByCategory(results){

  var categoryCount = [];
  var ctArray=results.reduce(function (res, value) {
    if (!res[value.category]) {
        res[value.category] = {
            category: value.category,
            correctanswer: 0           
        };
        categoryCount.push(res[value.category])
    }
    var val=(value.iscorrect==true)?1:0;
    res[value.category].correctanswer += val; 
    return res;
  }, {});

  categoryCount.sort(function(a,b) {
    return a.category - b.category;
  });

  return categoryCount;
}


/** Total score pie chart**/
function totalPieChart(_upto, _cir_progress_id, _correct, _incorrect) {

   $("#"+_cir_progress_id).find("._text_incor").html("Incorrect : "+_incorrect);
   $("#"+_cir_progress_id).find("._text_cor").html("Correct : "+_correct);

   var unchnagedPer=_upto;
   
    _upto = (_upto > 100) ? 100 : ((_upto < 0) ? 0 : _upto);

    var _progress = 0;

    var _cir_progress = $("#"+_cir_progress_id).find("._cir_P_y");
    var _text_percentage = $("#"+_cir_progress_id).find("._cir_Per");

    var _input_percentage;
    var _percentage;

    var _sleep = setInterval(_animateCircle, 25);

    function _animateCircle() {
      //2*pi*r == 753.6 +xxx=764
        _input_percentage = (_upto / 100) * 764;
        _percentage = (_progress / 100) * 764;

        _text_percentage.html(_progress + '%');

        if (_percentage >= _input_percentage) {
             _text_percentage.html('<tspan x="50%" dy="0em">'+unchnagedPer + '% </tspan><tspan  x="50%" dy="1.9em">Your Score</tspan>');
            clearInterval(_sleep);
        } else {

            _progress++;

            _cir_progress.attr("stroke-dasharray",_percentage + ',764');
        }
    }
}

function renderBriefChart(correct, total, incorrect){
  var percent=(100 * correct / total);
  if(Math.round(percent) !== percent) {
          percent = percent.toFixed(2);
  }

 totalPieChart(percent, '_cir_progress', correct, incorrect)
   
}
/*** render chart for result **/
function renderChart(data){
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
    labels: [ "Verbal communication", 
              "Non-verbal communication", 
              "Written communication", 
              "Incorrect"
            ],
    datasets: [
                {
                 
                  data: data,
                  backgroundColor: [  '#e6ded4',
                                      '#968089',
                                      '#e3c3d4',
                                      '#ab4e6b'
                                    ],
                  borderColor: [  'rgba(239, 239, 81, 1)',
                                  '#8e3407',
                                  'rgba((239, 239, 81, 1)',
                                  '#000000'
                                ],
                  borderWidth: 1
                }
              ]
    },
    options: {
         pieceLabel: {
          render: 'percentage',
          fontColor: 'black',
          precision: 2
        }
      }
    
  });
}

/** List question and your answer and correct answer  

*****/
function getAllAnswer(results){

    var innerhtml="";
    for(var i=0;i<results.length;i++){

      var _class=((results[i].iscorrect)?"item-correct":"item-incorrect");
       var _classH=((results[i].iscorrect)?"h-correct":"h-incorrect");
      

      var _html='<div class="_resultboard '+_class+'">'+
                  '<div class="_header">'+results[i].question+'</div>'+
                  '<div class="_yourans '+_classH+'">'+results[i].clicked+'</div>';

        var html="";
       if(!results[i].iscorrect)
        html='<div class="_correct">'+results[i].answer+'</div>';
       _html=(_html+html)+'</div>';
       innerhtml+=_html;
     
    }

  $(".allAnswerBox").html('').append(innerhtml);

}
/** render  Brief Result **/
function renderResult(resultList){ 
  
  var results=resultList;
  
  var countCorrect=countAnswers(results)[0], 
  countWrong=countAnswers(results)[1];
  
  
  renderBriefChart(countCorrect, resultList.length, countWrong);
}

function renderChartResult(){
   var results=resultList; 
  var countCorrect=countAnswers(results)[0], 
  countWrong=countAnswers(results)[1];
  var dataForChart=genResultArray(resultList, countWrong);
  renderChart(dataForChart);
}

/** Insert progress bar in html **/
function getProgressindicator(length){
  var progressbarhtml=" ";
  for(var i=0;i<length;i++){
    progressbarhtml+='<div class="my-progress-indicator progress_'+(i+1)+' '+((i==0)?"active":"")+'"></div>';
  }
  $(progressbarhtml).insertAfter(".my-progress-bar");
} 

/*** change progress bar when next button is clicked ***/
function changeProgressValue(){
  $progressValue+= 9;
  if ($progressValue >= 100) {
    
  } else {
    if($progressValue==99) $progressValue=100;
    $('.my-progress')
      .find('.my-progress-indicator.active')
      .next('.my-progress-indicator')
      .addClass('active');      
    $('progress').val($progressValue);
  }
  $('.js-my-progress-completion').html($('progress').val() + '% complete');

}   
function addClickedAnswerToResult(questions,presentIndex,clicked ){
  var correct=getCorrectAnswer(questions, presentIndex);
    var result={
      index:presentIndex,
      question:questions[presentIndex].question, 
      clicked:clicked,
      iscorrect:(clicked==correct)?true:false,
      answer:correct, 
      category:questions[presentIndex].category
    }
    resultList.push(result);

    console.log("result");
   
      
}

function nextNum(){


    var computerScore = document.getElementById('progressnum');
    var number = computerScore.innerHTML;
    
    number++;

    computerScore.innerHTML = number;
}






$(document).ready(function() {
  
  var presentIndex=0;
   var clicked=0;

  var questions=generateQuestions();
  renderQuiz(questions, presentIndex);
  getProgressindicator(questions.length);

  $(".answerOptions ").on('click','.myoptions>input', function(e){
    clicked=$(this).val();   

    if(questions.length==(presentIndex+1)){
      $("#submit").removeClass('hidden');
      $("#next").addClass("hidden");
    }
    else{

      $("#next").removeClass("hidden");
    }

     
  
  });



  $("#next").on('click',function(e){
    e.preventDefault();
    addClickedAnswerToResult(questions,presentIndex,clicked);

    $(this).addClass("hidden");
    
    presentIndex++;
    renderQuiz(questions, presentIndex);
    changeProgressValue();
  });

  $("#submit").on('click',function(e){
     addClickedAnswerToResult(questions,presentIndex,clicked);
    $('.multipleChoiceQues').hide();
    $(".resultArea").show();
    renderResult(resultList);

  });

  
  

   $(".resultArea").on('click','.viewchart',function(){
      $(".resultPage2").show();
       $(".resultPage1").hide();
       $(".resultPage3").hide();
       renderChartResult();
   });

    $(".resultArea").on('click','.backBtn',function(){
      $(".resultPage1").show();
       $(".resultPage2").hide();
       $(".resultPage3").hide();
        renderResult(resultList);
   });

    $(".resultArea").on('click','.viewanswer',function(){
      $(".resultPage3").show();
       $(".resultPage2").hide();
       $(".resultPage1").hide();
        getAllAnswer(resultList);
   });

  $(".resultArea").on('click','.replay',function(){
    window.location.reload(true);
  });

});

