import React, { useEffect, useState } from "react";
import "../styles/StudentResults.css";
function StudentResults() {

  const [results, setResults] = useState([]);

  useEffect(() => {

    loadResults();

  }, []);

  const loadResults = async () => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    const response = await fetch(
      `http://localhost:5000/student-results/${user.id}`
    );

    const data = await response.json();

    setResults(data);
  };

  if (results.length === 0) {
    return (
      <div className="main">
        <h1 className="results-title">My Results</h1>
        <p className="no-results">No quiz attempts yet.</p>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="results-title">My Results</h1>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Score</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={index}>
              <td>{r.title}</td>
              <td>
                {r.score}/{r.total_questions}
              </td>
              <td>{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentResults;