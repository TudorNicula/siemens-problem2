let currentQuestion = 0;
let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let quizData = [];
let userName = "";
let selectedOption = "";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
const shuffleQuestions = () => {
  const questionAnswerPairs = quizData.map(({ id, question, answer, options }) => ({
    id,
    question,
    answer,
    options: [...options] 
  }));

  const shuffledPairs = shuffleArray(questionAnswerPairs);

  quizData.forEach((item, index) => {
    item.question = shuffledPairs[index].question;
    item.answer = shuffledPairs[index].answer;
    item.options = [...shuffledPairs[index].options]; 
  });
};

const loadQuizData = async () => {
  const res = await fetch("quizData.json");
  quizData = await res.json();
  shuffleQuestions();
  loadQuestion(); 
};

const loadQuestion = () => {
  const questionObj = quizData[currentQuestion];
  document.getElementById("question").innerText = questionObj.question;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.innerText = questionObj.options[i];
    btn.className = "option-btn";
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.cursor = "default";
  }
  document.getElementById("message").innerText = "";
  document.getElementById("next-btn").style.display = "none";
};

const startQuiz = () => {
  while (true) {
    userName = prompt("Enter your username");

    if (userName === null) {
      window.location.href = "index.html"; 
      return;
    } else if (userName.trim() === "") {
      alert("Please enter a username!");
    } else {
      document.getElementById("start-page").style.display = "none";
      document.getElementById("quiz-container").style.display = "block";
      loadQuizData();
      loadQuestion();
      break; 
    }
  }
};


const endQuiz = () => {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("score-container").style.display = "block";
  document.getElementById("final-score").innerText = score;
  const highScore = Math.max(...highScores.map((item) => item.score), score);
  document.getElementById("final-high-score").innerText = highScore;
  highScores.push({
    username: userName,
    score: score,
    date: new Date().toISOString(),
  });
  highScores.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("highScores", JSON.stringify(highScores));
};

const showHighscores = () => {
  document.getElementById("start-page").style.display = "none";
  document.getElementById("highscore-page").style.display = "block";
  document.getElementById("highscores").innerHTML = highScores
    .map(
      (item) =>
        `<p>${item.username}: ${item.score} (on ${new Date(
          item.date
        ).toLocaleDateString()} at ${new Date(
          item.date
        ).toLocaleTimeString()})</p>`
    )
    .join("");

  if (highScores.length == 0) {
    document.getElementById("highscores").innerHTML =
      "<h3>No Scores Yet!</h3><h4>Play the game to see your score's here.</h4>";
  }
};

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("highscore-btn").addEventListener("click", showHighscores);

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;
    document.getElementById("progress-bar-text").innerText = `${Math.round(
      progress
    )}%`;
  } else {
    endQuiz();
  }
});

for (let i = 0; i < 4; i++) {
  document.getElementById(`btn${i}`).addEventListener("click", (event) => {
    selectedOption = event.target;
    if (
      quizData[currentQuestion].options[i] === quizData[currentQuestion].answer
    ) {
      score++;
      document.getElementById("score").innerText = score;
      selectedOption.className = "option-btn correct";
      document.getElementById("message").innerText = "Correct Answer!";
    } else {
      selectedOption.className = "option-btn wrong";
      document.getElementById("message").innerText = "Wrong Answer!";
    }
    for (let j = 0; j < 4; j++) {
      document.getElementById(`btn${j}`).disabled = true;
      document.getElementById(`btn${j}`).style.cursor = "not-allowed";
      document.getElementById(`btn${j}`).style.opacity = 0.5;
    }
    selectedOption.style.opacity = 1;
    document.getElementById("next-btn").style.display = "block";
  });


const redirectToFrontPage = () => {
  window.location.href = "index.html";
};

document.getElementById("back-to-front-page-score").addEventListener("click", redirectToFrontPage);
document.getElementById("back-to-front-page-highscore").addEventListener("click", redirectToFrontPage);
}
