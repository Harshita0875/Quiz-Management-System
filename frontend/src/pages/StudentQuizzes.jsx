import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";

function StudentQuizzes() {

  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/available-quizzes"
      );

      const data = await response.json();

      setQuizzes(data);

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="admin-wrapper">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2 className="logo">QuizMaster</h2>

        <p className="welcome">
          Welcome, Student
        </p>

        <button
          onClick={() => navigate("/student")}
        >
          🏠 Dashboard
        </button>

        <button>
          📝 Available Quizzes
        </button>

        <button
          onClick={() =>
            navigate("/student-results")
          }
        >
          📊 My Results
        </button>

        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          🚪 Logout
        </button>

      </div>

      {/* MAIN */}

      <div className="main">

        <h1 className="dashboard-title">
          Available Quizzes
        </h1>

        <div className="card-container">

          {quizzes.map((quiz) => (

            <div
              key={quiz.quiz_id}
              className="card"
            >

              <h3>{quiz.title}</h3>

              <p>{quiz.description}</p>

              <button
                className="start-btn"
                onClick={() =>
                  navigate(
                    `/attempt-quiz/${quiz.quiz_id}`
                  )
                }
              >
                Start Quiz
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default StudentQuizzes;