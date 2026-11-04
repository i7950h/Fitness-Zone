const navButtons = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");
const mainNav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");

function showPage(pageId) {
  pages.forEach(page => page.classList.toggle("active", page.id === pageId));
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.page === pageId));
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
navButtons.forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", event => {
  event.preventDefault();
  showPage(button.dataset.go);
}));
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Filtros de actividades
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    const filter = button.dataset.filter;
    document.querySelectorAll(".exercise-card").forEach(card => {
      card.classList.toggle("hidden-card", filter !== "todos" && card.dataset.type !== filter);
    });
  });
});

// Lista interactiva de hábitos
const habitChecks = [...document.querySelectorAll(".habit-check")];
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const progressMessage = document.getElementById("progressMessage");
document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(new Date());

function updateHabits() {
  const checked = habitChecks.filter(check => check.checked).length;
  progressText.textContent = `${checked} de ${habitChecks.length}`;
  progressFill.style.width = `${checked / habitChecks.length * 100}%`;
  const messages = [
    "Cada pequeño paso cuenta.",
    "¡Buen comienzo! Sigue a tu ritmo.",
    "Vas construyendo hábitos positivos.",
    "¡Muy bien! Estás dedicando tiempo a cuidarte.",
    "¡Excelente constancia! Ya casi terminas.",
    "¡Lista completada! Reconoce tu esfuerzo."
  ];
  progressMessage.textContent = messages[checked];
}
habitChecks.forEach(check => check.addEventListener("change", updateHabits));
document.getElementById("resetHabits").addEventListener("click", () => {
  habitChecks.forEach(check => check.checked = false);
  updateHabits();
});

// Mini quiz
const questions = [
  { question: "¿Qué actividad trabaja principalmente la resistencia cardiovascular?", answers: ["Caminar a paso ligero", "Leer sentado", "Permanecer acostado"], correct: 0, explanation: "Caminar a paso ligero puede elevar el ritmo cardíaco y trabajar la resistencia." },
  { question: "¿Por qué es importante dormir lo suficiente?", answers: ["Porque reemplaza la alimentación", "Porque ayuda a recuperar energía y concentrarse", "Porque evita necesitar actividad física"], correct: 1, explanation: "El descanso favorece la recuperación, el aprendizaje y la concentración." },
  { question: "¿Cuál es un ejemplo de ejercicio de flexibilidad?", answers: ["Estiramientos suaves", "Correr rápido", "Saltar una cuerda"], correct: 0, explanation: "Los estiramientos suaves ayudan a trabajar la movilidad y flexibilidad." },
  { question: "¿Qué significa tener una alimentación variada?", answers: ["Comer siempre lo mismo", "Evitar grupos completos de alimentos", "Incluir diferentes tipos de alimentos"], correct: 2, explanation: "Una alimentación variada ayuda a obtener distintos nutrientes que el cuerpo necesita." }
];
let questionIndex = 0;
let score = 0;
let selectedAnswer = null;
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const questionCount = document.getElementById("questionCount");
const quizProgress = document.getElementById("quizProgress");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");
const quizContent = document.getElementById("quizContent");
const quizResult = document.getElementById("quizResult");

function renderQuestion() {
  const current = questions[questionIndex];
  selectedAnswer = null;
  questionText.textContent = current.question;
  questionCount.textContent = `PREGUNTA ${questionIndex + 1} DE ${questions.length}`;
  quizProgress.style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  quizFeedback.textContent = "";
  nextQuestion.disabled = true;
  nextQuestion.textContent = "Comprobar respuesta";
  answerList.innerHTML = "";
  current.answers.forEach((answer, index) => {
    const option = document.createElement("button");
    option.className = "answer-option";
    option.type = "button";
    option.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    option.querySelector("span:last-child").textContent = answer;
    option.addEventListener("click", () => {
      if (selectedAnswer !== null) return;
      selectedAnswer = index;
      option.classList.add("selected");
      nextQuestion.disabled = false;
    });
    answerList.appendChild(option);
  });
}
nextQuestion.addEventListener("click", () => {
  const current = questions[questionIndex];
  if (nextQuestion.textContent === "Siguiente pregunta →") {
    questionIndex++;
    if (questionIndex < questions.length) renderQuestion();
    else showResult();
    return;
  }
  const options = [...answerList.querySelectorAll(".answer-option")];
  options[current.correct].classList.add("correct");
  if (selectedAnswer === current.correct) {
    score++;
    quizFeedback.textContent = `¡Correcto! ${current.explanation}`;
  } else {
    options[selectedAnswer].classList.add("wrong");
    quizFeedback.textContent = `La respuesta correcta está marcada. ${current.explanation}`;
  }
  nextQuestion.textContent = questionIndex === questions.length - 1 ? "Ver resultado →" : "Siguiente pregunta →";
});
function showResult() {
  quizContent.classList.add("hidden");
  quizResult.classList.remove("hidden");
  document.getElementById("resultTitle").textContent = score >= 3 ? "¡Buen trabajo!" : "¡Sigue aprendiendo!";
  document.getElementById("resultText").textContent = `Obtuviste ${score} de ${questions.length} respuestas correctas. Lo importante es aprender y seguir descubriendo formas de cuidar tu bienestar.`;
}
document.getElementById("restartQuiz").addEventListener("click", () => {
  questionIndex = 0;
  score = 0;
  quizContent.classList.remove("hidden");
  quizResult.classList.add("hidden");
  renderQuestion();
});
renderQuestion();
