import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/AttemptQuiz.css";

function AttemptQuiz() {

  const { quizId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]);

  const [timer, setTimer] = useState(0);
  const [questionDuration, setQuestionDuration] =
  useState(0);

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {

    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);

  }, [timer]);
 useEffect(() => {

  if (
    timer === 0 &&
    questionDuration > 0
  ) {

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        prev => prev + 1
      );

      setTimer(questionDuration);

    } else {

      submitQuiz();

    }
  }

}, [
  timer,
  questionDuration,
  currentQuestion,
  questions
]);

  const loadQuiz = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/attempt-quiz/${quizId}`
      );

      const data = await response.json();

     setQuestions(data.questions);

if (data.timer_type === "quiz") {

  setTimer(
    Number(data.quiz_duration) * 60
  );

}

if (data.timer_type === "question") {

  setQuestionDuration(
    Number(data.question_duration)
  );

  setTimer(
    Number(data.question_duration)
  );

}

    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswer = (option) => {

    const questionId =
      questions[currentQuestion].question_id;

    const filtered = answers.filter(
      a => a.question_id !== questionId
    );

    setAnswers([
      ...filtered,
      {
        question_id: questionId,
        selected_option: option
      }
    ]);
  };

  const getSelectedAnswer = () => {

    if (!questions.length) return "";

    const questionId =
      questions[currentQuestion].question_id;

    const found = answers.find(
      a => a.question_id === questionId
    );

    return found?.selected_option || "";
  };

  const nextQuestion = () => {

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  const previousQuestion = () => {

    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  const submitQuiz = async () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const response = await fetch(
      "http://localhost:5000/submit-quiz",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          user_id: user.id,
          quiz_id: quizId,
          answers
        })
      }
    );

    const data = await response.json();

    setResult(data);
  };

  if (!questions.length) {
    return <h2>Loading...</h2>;
  }

  if (result) {

    return (
      <div className="result-container">

        <div className="result-card">

          <h1>Quiz Completed 🎉</h1>

          <h2>
            Score:
            {" "}
            {result.score}
            /
            {result.total_questions}
          </h2>

          <h2>
            Percentage:
            {" "}
            {result.percentage.toFixed(2)}%
          </h2>

        </div>

      </div>
    );
  }

  const q = questions[currentQuestion];

  return (

    <div className="quiz-page">

      <div className="quiz-card">

        <div className="quiz-header">

          <div>
            Question {currentQuestion + 1}
            {" "}
            of
            {" "}
            {questions.length}
          </div>

         <div className="timer">
  ⏰ {timer}s
</div>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`
            }}
          />

        </div>

        <h2 className="question-text">
          {q.question_text}
        </h2>

        <div className="options">

          {["A", "B", "C", "D"].map(
            option => (

              <label
                key={option}
                className="option-card"
              >

                <input
                  type="radio"
                  checked={
                    getSelectedAnswer() ===
                    option
                  }
                  onChange={() =>
                    handleAnswer(option)
                  }
                />

                {
                  q[
                    `option_${option.toLowerCase()}`
                  ]
                }

              </label>
            )
          )}

        </div>

        <div className="quiz-buttons">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (

            <button
              className="submit-btn"
              onClick={submitQuiz}
            >
              Submit Quiz
            </button>

          ) : (

            <button onClick={nextQuestion}>
              Next
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default AttemptQuiz;