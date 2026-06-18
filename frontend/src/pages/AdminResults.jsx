import React, { useEffect, useState } from "react";
import "../styles/AdminTables.css";
function AdminResults() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {

    const response = await fetch(
      "http://localhost:5000/admin-results"
    );

    const data = await response.json();

    setResults(data);
  };

  return (

    <div className="main">

      <h1 className="results-title">
        All Results
      </h1>

      <table className="quiz-table">

        <thead>

          <tr>
            <th>Student</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Percentage</th>
          </tr>

        </thead>

        <tbody>

          {results.map((result, index) => (

            <tr key={index}>

              <td>{result.student}</td>

              <td>{result.quiz}</td>

              <td>
                {result.score}/
                {result.total_questions}
              </td>

              <td>
                {result.percentage}%
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default AdminResults;