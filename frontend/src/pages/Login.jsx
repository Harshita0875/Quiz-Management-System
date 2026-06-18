import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

import "../styles/Login.css";
import quizImage from "../assets/quizmaster.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ added state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ✅ login handler
  const handleLogin = async () => {
    try {
      const res = await loginUser({
        email,
        password
      });

      const user = res.data;

      // store user session
      localStorage.setItem("user", JSON.stringify(user));

      // role-based redirect
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (err) {
      alert("Invalid email or password");
      console.log(err);
    }
  };

  return (

    <div className="login-page">

      <div className="left-section">

        <h1>
          QuizMaster
        </h1>

        <h3>
          Learn. Challenge. Achieve.
        </h3>

        <p className="description">
          An interactive platform to test your knowledge,
          track your progress and improve your skills.
        </p>

        <div className="features">

          <div className="feature-card">
            🎯
            <span>
              Interactive Quizzes
            </span>
          </div>

          <div className="feature-card">
            📊
            <span>
              Track Progress
            </span>
          </div>

          <div className="feature-card">
            🏆
            <span>
              Earn Achievements
            </span>
          </div>

        </div>

        <img
          src={quizImage}
          alt="Quiz illustration"
        />

        <div className="floating-card card-two">

          <h4>SQL stands for?</h4>
          <p>✓ Structured Query Language</p>

        </div>

        <div className="trust-text">

          Trusted by students | Practice | Improve | Achieve

        </div>

      </div>

      {/* RIGHT SECTION (ONLY LOGIC ADDED) */}
      <div className="login-card">

        <h2>
          Welcome Back 👋
        </h2>

        <p>
          Login to continue your quiz journey
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <button onClick={handleLogin}>
          Login
        </button>

        <span>
          New user?{" "}
          <Link to="/register">
            Register
          </Link>
        </span>

      </div>

    </div>

  );
}

export default Login;