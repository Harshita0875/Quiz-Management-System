import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import ImportCSV from "../pages/ImportCSV";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
  localStorage.removeItem("user");   // remove login session
  navigate("/");                // redirect to login page
};

  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">QuizMaster</h2>

        <p className="welcome">Welcome, {user?.name || "Admin"}</p>

        <button onClick={() => navigate("/admin")}>🏠 Dashboard</button>

        <button onClick={() => navigate("/create-quiz")}>➕ Create Quiz</button>

        <button onClick={() => navigate("/quizzes")}>📋 View Quizzes</button>

            <button onClick={() => navigate("/admin-results")}>
          📊 View Results
        </button>

        <button className="logout" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        <h1 align="center">Admin Panel</h1>

        <p className="subtitle" align="center">
          Manage quizzes, questions, users and results
        </p>

        {/* CARDS */}
        <div className="card-container">
          <div className="card" onClick={() => navigate("/create-quiz")}>
            <h3>➕ Create Quiz</h3>
            <p>Add new quiz with timer settings</p>
          </div>

          <div className="card" onClick={() => navigate("/quizzes")}>
            <h3>📋 All Quizzes</h3>
            <p>View and manage quizzes and questions</p>
          </div>

      

          <div className="card" onClick={() => navigate("/admin-results")}>
            <h3>📊 Results</h3>
            <p>Check student performance</p>
          </div>

          <div className="card" onClick={() => navigate("/users")}>
            <h3>👤 Users</h3>
            <p>View all registered users</p>
          </div>
          <div className="admin-section">
  <ImportCSV />
</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
