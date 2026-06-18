import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuizList.css";
const handleLogout = () => {
  localStorage.removeItem("user");   // remove login session
  navigate("/");                // redirect to login page
};

function QuizList() {

  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {

    try {
      const response = await fetch(
        "http://localhost:5000/quizzes"
      );

      const data = await response.json();

      setQuizzes(data);

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

       
        <button onClick={() => navigate("/admin-results")}>
          📊 View Results
        </button>


         <button className="logout" onClick={handleLogout}>
          🚪 Logout
        </button>


      </div>

      <div className="main">

        <h1>All Quizzes</h1>

        <table className="quiz-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Timer Type</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {quizzes.map((quiz) => (

              <tr key={quiz.quiz_id}>

                <td>{quiz.quiz_id}</td>

                <td>{quiz.title}</td>

                <td>{quiz.description}</td>

                <td>{quiz.timer_type}</td>

                <td>{quiz.created_at}</td>

                <td>

                  <button
                    className="action-btn"
                     onClick={() =>
    navigate(`/add-questions/${quiz.quiz_id}`)
  }
                  >
                    Add Questions
                  </button>
                  </td>
                  <td>
                   <button
    className="action-btn"
    onClick={() =>
      navigate(`/questions/${quiz.quiz_id}`)
    }
  >
    View Questions
  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default QuizList;