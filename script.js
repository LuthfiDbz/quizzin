const container = $('.container')
const header = $('#header')
const quizContent = $('.quizContent')
const btnChoice = $('.btnChoice')
const footer = $('.footer')
const amountQuestions = $('.amount')
const answerLabel = $('.answer')
const btnStart = $('#btnStart')
const btnNext = $('#btnNext')
const loader =$('.loading')

let score = 0
let index = 0
let choosenAnswer = null
let choosenLabel = null
let correctAnswer = null

let second = 0
const countdownTimer = (s,data) => {
  // ? x = setInterval per 1000
  second = s
  
  x = setInterval(() => {
    console.log(second)
    // reduce Second
    if(second > 0) {
      second--
      // render Timer 
      $('.timer').text(`${second}s`)
    }
    if(second == 0) {
      
      console.log('Masook');
      if(choosenAnswer == null) {
        choosenAnswer = ''
      }
      checkAnswer(data)
    }
  },1000)
}

// Score Page
const renderScorePage = () => {
  if(score == 10) {
    quizContent.html(`
      <div class="scorePage">
        <h1 class="resultText">Perfect!</h1>
        <h2>Your Score</h2>
        <h1 class="score true perfect">${score*10}</h1>
      </div>
    `)
  } else if(score >= 8) {
    quizContent.html(`
      <div class="scorePage">
        <h1 class="resultText">Congratulations!</h1>
        <h2>Your Score</h2>
        <h1 class="score true">${score*10}</h1>
      </div>
    `)
  } else if (score >= 6) {
    quizContent.html(`
      <div class="scorePage">
        <h1 class="resultText">Nice!</h1>
        <h2>Your Score</h2>
        <h1 class="score min">${score*10}</h1>
      </div>
    `)
  } else {
    quizContent.html(`
      <div class="scorePage">
        <h1 class="resultText">Sorry!</h1>
        <h2>Your Score</h2>
        <h1 class="score false">${score*10}</h1>
      </div>
    `)
  }
}

// checkAnswer
const checkAnswer = (data) => {
  console.log(choosenAnswer);
  if(choosenAnswer == null) {
    // $('Choose Answer!').insertAfter('.question')
    const question =$('.question')
    $('.alert').remove()
    $('<h4 class="alert" style="color:red;margin-top:-18px;margin-bottom:5px;">Choose answer!</h4>').insertAfter(question)
    return
  } else if(choosenAnswer === correctAnswer) {
    score++
    answerLabel.addClass('true').text('True!')
    choosenLabel.classList.add('btnTrue')
  } else if (choosenAnswer === '') {
    answerLabel.addClass('false').text('Time Out!')
    $.each($('label'), (x,y) => {
      if(y.textContent === correctAnswer) {
        y.classList.add('btnTrue')
      }
    })
  } else {
    answerLabel.addClass('false').text('False!')
    choosenLabel.classList.add('btnFalse')
    $.each($('label'), (x,y) => {
      if(y.textContent === correctAnswer) {
        y.classList.add('btnTrue')
      }
    })
  }

  btnNext.unbind()

  clearInterval(x)

  setTimeout(() => {
    quizContent.html('')
    answerLabel.removeClass('false').removeClass('true').text('')
  }, 3000);

  setTimeout(() => {
    index++
    if(index > 9) {
      index = 0
      header.removeClass('headerQuiz').addClass('headerHome')
      $('#header h3').remove()
      $('#header h5').remove()
      btnNext.css('display','none')
      amountQuestions.html('')

      // Render Score Page
      renderScorePage()

      // Event back to home page
      btnStart.unbind().text('Restart Quiz').css('display', 'block').click(()=>{
        score = 0
        getDataCategories()
      })
      
    } else {
      // Render next question
      choosenAnswer = null
      choosenLabel = null
      correctAnswer = null
      renderQuizPage(data)
      console.log(`Score: ${score}`);
    }
  }, 4000);
}

// countdownTimer 



// renderQuiz 
const renderQuizPage = (data) => {
  let dataValue = data[index]

  // Create random index for choices
  let randomIndex = [0,1,2,3]
  randomIndex = randomIndex.sort(() => Math.random() - 0.5)

  // Get array of 4 choices
  correctAnswer = dataValue.correctAnswer
  const [incorrectAnswer1,incorrectAnswer2,incorrectAnswer3] = dataValue.incorrectAnswers
  const choicesAnswer = [correctAnswer,incorrectAnswer1,incorrectAnswer2,incorrectAnswer3]

  // Render Quiz
  quizContent.html(`
    <h2 class="question">${dataValue.question}</h2>
    <button class="btnChoice">
      <h4>${choicesAnswer[randomIndex[0]]}</h4>
      <input type="radio" name="choice" id="choiceA" class="inputChoice" value="${choicesAnswer[randomIndex[0]]}">
      <label for="choiceA">${choicesAnswer[randomIndex[0]]}</label>
    </button> <br>
    <button class="btnChoice">
      <h4>${choicesAnswer[randomIndex[1]]}</h4>
      <input type="radio" name="choice" id="choiceB" class="inputChoice" value="${choicesAnswer[randomIndex[1]]}">
      <label for="choiceB">${choicesAnswer[randomIndex[1]]}</label>
    </button> <br>
    <button class="btnChoice">
      <h4>${choicesAnswer[randomIndex[2]]}</h4>
      <input type="radio" name="choice" id="choiceC" class="inputChoice" value="${choicesAnswer[randomIndex[2]]}">
      <label for="choiceC">${choicesAnswer[randomIndex[2]]}</label>
    </button> <br>
    <button class="btnChoice">
      <h4>${choicesAnswer[randomIndex[3]]}</h4>
      <input type="radio" name="choice" id="choiceD" class="inputChoice" value="${choicesAnswer[randomIndex[3]]}">
      <label for="choiceD">${choicesAnswer[randomIndex[3]]}</label>
    </button>
  `)

  // btnNext display block
  btnNext.css('display','block')

  
  
  // Show index of questions
  amountQuestions.html(`${index+1} of 10 Questions`)

  // Choices event
  $('label').click(e => {
    choosenAnswer = e.target.textContent;
    choosenLabel = e.target
    console.log(choosenAnswer);
  })

  // countdown situation
  countdownTimer(30,data)
  
  // Next questions after click btnNext
  btnNext.click(() => {  
   
    checkAnswer(data)
  })
  
}
// ! getDataQuiz
const getDataQuiz = (category,level) => {
  // change header
  header.removeClass('headerHome').addClass('headerQuiz').append('<h3>Time left:  <span class="timer">30s</span></h3>')

  // btnStart display none
  btnStart.css('display','none')

  // loading screen while fetching
  quizContent.html('<h2>Now loading...</h2>')

  // ajax get quiz
  $.ajax({
    type:"GET",
    url: "https://the-trivia-api.com/api/questions?",
    data: {
      'categories' : `${category}`,
      'limit' : '10',
      'region' : 'ID',
      'difficulty' : `${level}`
    },
    success: (data) => {
    // if success
      console.log(data);

      // Confirmation screen
      let a = 6
      const confirmPage = () => {
        timer = setInterval(() => {
          a--
          quizContent.html(`
            <div class="countdownPage">
              <h2>Quiz will start in</h2>
              <h1 class="false">${a}</h1>
            </div>
          `)
        }, 1000)
      }

      confirmPage()

      // renderQuiz(data)
      setTimeout(() => {
        if(a <= 0) {
          clearInterval(timer)
          // show category and level to header
          $('.title').after(`<h5>${category} <br> Level: ${level}</h5>`)
          renderQuizPage(data);
        }
      },6000)
      

      
    },
    error: (error) => {
    // if error -> status error
    console.log(error.statusText);
      container.html(`<h1>${error.status} ${error.statusText}</h1>`)
    }
  })
}

// getDataCategories
const getDataCategories = () => {
  // ajax get categories
  $.ajax({
    type:"GET",
    url: "https://the-trivia-api.com/api/categories",
    success: (data) => {
    // if succes -> append categories element
      quizContent.html(`
        <h2 class="welcomeText">Welcome to Quizzin App</h2>
        <form action="#" class="formData">
          <label>Categories :</label>
          <select name="categories" id="categories" required>
            <option value="" selected disabled>Choose Categories</option>
          </select>
          <label>Level :</label>
          <select name="level" id="level" required>
            <option value="" selected disabled>Choose Level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </form>
        <section class="rules">
          <h3>Quizzin Rules :</h3>
          <ol>
            <li>1. Attempt 10 total questions.</li>
            <li>2. Every questions have 30 seconds limit.</li>
            <li>3. After next questions, back to previous questions is not allowed.</li>
          </ol>
        </section>
      `)
      $.each(data, (i) => {
        $('#categories').append(`<option value="${i}" id="option">${i}</option>`)
      })

      btnStart.text('Start Quiz').css('display','block')
    },
    error: (error) => {
    // if error -> append status error
      console.log(error.statusText);
      container.html(`<h1>${error.status} ${error.statusText}</h1>`)
    }
  })
  // btnStart onclick
  btnStart.unbind().css('display','none').click(() => {
    // Get category and level choosen value
    const category =  $('#categories').val();
    const level = $('#level').val()

    // Validate value
    if(category == null) {
      alert('Choose Categories')
    } else if(level == null) {
      alert('Choose Level')
    } else {
      // Get Data
      getDataQuiz(category,level)
    }
  })
}

getDataCategories()
