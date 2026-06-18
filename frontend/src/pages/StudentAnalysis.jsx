import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import "../styles/StudentAnalysis.css";


function StudentAnalysis() {

  const [analysis, setAnalysis] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {

    fetch(`http://localhost:5000/student-analysis/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setAnalysis(data);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);



  if (!analysis) {
    return <h3>Loading Analysis...</h3>;
  }


  // Performance calculation
  let performance;
  let performanceIcon;


  if (analysis.average_percentage > 80) {

    performance = "Excellent";
    performanceIcon = "🟢";

  } 
  else if (analysis.average_percentage >= 60) {

    performance = "Good";
    performanceIcon = "🟡";

  } 
  else {

    performance = "Needs Improvement";
    performanceIcon = "🔴";

  }



  return (

    <div className="analysis-section">


      <h1 className="analysis-title">
        Performance Analysis
      </h1>



      <div className="analysis-cards">


        <div className="analysis-box">

          <h2>
            {analysis.total_attempts}
          </h2>

          <p>
            Quizzes Attempted
          </p>

        </div>



        <div className="analysis-box">

          <h2>
            {analysis.average_percentage}%
          </h2>

          <p>
            Average Score
          </p>

        </div>



        <div className="analysis-box">

          <h2>
            {analysis.best_score}%
          </h2>

          <p>
            Best Score
          </p>

        </div>



        {/* Performance Badge */}

        <div className="analysis-box performance-card">

          <h2>
            {performanceIcon}
          </h2>

          <p>
            {performance}
          </p>

        </div>


      </div>





      <div className="chart-container">


        <h2>
          Quiz Performance
        </h2>



        <ResponsiveContainer width="100%" height={350}>


          <BarChart data={analysis.quiz_data}>


            <CartesianGrid stroke="rgba(255,255,255,0.2)" />


            <XAxis
              dataKey="quiz"
              tick={{ fill: "white" }}
            />


            <YAxis
              domain={[0,100]}
              tick={{ fill: "white" }}
            />


            <Tooltip
              contentStyle={{
                backgroundColor:"#111827",
                color:"white",
                border:"none"
              }}
            />


            <Bar
              dataKey="percentage"
            />


          </BarChart>


        </ResponsiveContainer>



      </div>



    </div>

  );


}


export default StudentAnalysis;