import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ViewQuestions.css";
const handleLogout = () => {
  localStorage.removeItem("user");   // remove login session
  navigate("/");                // redirect to login page
};

function ViewQuestions() {

  const navigate = useNavigate();
  const { quizId } = useParams();
console.log("quizId:", quizId);
  const [questions, setQuestions] = useState([]);
 useEffect(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, []);

 useEffect(() => {
  if (!quizId) return;
  fetchQuestions();
}, [quizId]);
  const fetchQuestions = async () => {
  try {
    if (!quizId) return;

    const response = await fetch(
      `http://localhost:5000/questions/${quizId}`
    );

    const data = await response.json();

    console.log("quizId:", quizId);
    console.log("data:", data);

    setQuestions(Array.isArray(data) ? data : []);
  } catch (error) {
    console.log(error);
  }

};

  return (
    <div className="admin-wrapper">

      <div className="sidebar">

        <h2 className="logo">QuizMaster</h2>

 <button onClick={() => navigate("/admin")}>🏠 Dashboard</button>

        <button onClick={() => navigate("/create-quiz")}>➕ Create Quiz</button>

        <button onClick={() => navigate("/quizzes")}>📋 View Quizzes</button>

        <button onClick={() => navigate("/questions")}>
          ❓ View Questions
        </button>

        <button onClick={() => navigate("/admin-results")}>
          📊 View Results
        </button>
         <button className="logout" onClick={handleLogout}>
          🚪 Logout
        </button>

      </div>

      <div className="main">

        <h1>Quiz Questions</h1>

        <table className="question-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
      <th>Option A</th>
      <th>Option B</th>
      <th>Option C</th>
      <th>Option D</th>
      <th>Correct</th>
            </tr>
          </thead>

          <tbody>

            {questions.map((question) => (

              <tr key={question.question_id}>

                <td>{question.question_id}</td>

                <td>{question.question_text}</td>

                 <td className={question.correct_option === "A" ? "correct" : ""}>
          {question.option_a}
        </td>

        <td className={question.correct_option === "B" ? "correct" : ""}>
          {question.option_b}
        </td>

        <td className={question.correct_option === "C" ? "correct" : ""}>
          {question.option_c}
        </td>

        <td className={question.correct_option=== "D" ? "correct" : ""}>
          {question.option_d}
        </td>

                <td>{question.correct_option}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ViewQuestions;