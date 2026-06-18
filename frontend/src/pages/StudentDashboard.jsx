import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";  
import StudentAnalysis from "../pages/StudentAnalysis";  

function StudentDashboard() {

  const navigate = useNavigate();
  const [stats, setStats] = useState({
  attempts: 0,
  average_score: 0
});


  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {

    const response = await fetch(
      "http://localhost:5000/available-quizzes"
    );

    const data = await response.json();

    setQuizzes(data);
    const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const statsResponse =
  await fetch(
    `http://localhost:5000/student-stats/${user.id}`
  );

const statsData =
  await statsResponse.json();

setStats(statsData);
  };

  return (
  <div className="admin-wrapper">

    {/* SIDEBAR */}

    <div className="sidebar">

      <h2 className="logo">QuizMaster</h2>

      <p className="welcome">
        Welcome, Student
      </p>

      <button>
        🏠 Dashboard
      </button>

      <button   onClick={() =>
    navigate("/student-quizzes")
  }>
        📝 Available Quizzes
      </button>

      <button  onClick={() =>
    navigate("/student-results")
  }>
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
<div className="stats-container">

  <div className="card">

    <h3>Total Attempts</h3>

    <h1>{stats.attempts}</h1>

  </div>

  <div className="card">

    <h3>Average Score</h3>

    <h1>
      {stats.average_score}%
    </h1>

  </div>



    </div>
    <StudentAnalysis />
</div>
  </div>
);
}

export default StudentDashboard;