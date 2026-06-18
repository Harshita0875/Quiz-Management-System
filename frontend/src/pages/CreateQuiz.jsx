import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateQuiz.css";
const handleLogout = () => {
  localStorage.removeItem("user");   // remove login session
  navigate("/");                // redirect to login page
};

function CreateQuiz() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timer_type: "quiz",
    quiz_duration: "",
    question_duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveQuiz = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/create-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            created_by: user.id,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate("/admin");
    } 
    catch (error) {
      console.log(error);
      alert("Error creating quiz");
    }
  };

  return (
    <div className="admin-wrapper">

      <div className="sidebar">

        <h2 className="logo">QuizMaster</h2>

        <p className="welcome">
          Welcome, {user?.name || "Admin"}
        </p>

   <button onClick={() => navigate("/admin")}>🏠 Dashboard</button>

        <button onClick={() => navigate("/create-quiz")}>➕ Create Quiz</button>

        <button onClick={() => navigate("/quizzes")}>📋 View Quizzes</button>

        
        <button onClick={() => navigate("/admin-results")}>
          📊 View Results
        </button>

         <button className="logout" onClick={handleLogout}>
          🚪 Logout
        </button>

      </div>

      <div className="main">
       <div className="quiz-card">
        <h1>Create New Quiz</h1>

        <form className="quiz-form" onSubmit={saveQuiz}>

          <input
            type="text"
            name="title"
            placeholder="Quiz Title"
            required
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Quiz Description"
            rows="4"
            onChange={handleChange}
          />

          <select
            name="timer_type"
            value={formData.timer_type}
            onChange={handleChange}
          >
            <option value="quiz">Quiz Timer</option>
            <option value="question">Question Timer</option>
          </select>

          {formData.timer_type === "quiz" && (
            <input
              type="number"
              name="quiz_duration"
              placeholder="Quiz Duration (Minutes)"
              onChange={handleChange}
            />
          )}

          {formData.timer_type === "question" && (
            <input
              type="number"
              name="question_duration"
              placeholder="Question Duration (Seconds)"
              onChange={handleChange}
            />
          )}

          <button
            type="submit"
            className="save-btn"
          >
            Save Quiz
          </button>

        </form>

      </div>
</div>
    </div>
  );
}

export default CreateQuiz;