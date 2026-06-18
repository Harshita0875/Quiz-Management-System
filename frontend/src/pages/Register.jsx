import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

import "../styles/Register.css";
import quizImage from "../assets/quizmaster.png";

function Register() {

  // ✅ form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  // ✅ register handler
  const handleRegister = async () => {
    try {
      await registerUser({
        name,
        email,
        password,
        role
      });

      alert("Registered successfully");

      // redirect to login
      navigate("/");

    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }
  };

  return (

    <div className="register-page">

      {/* Left Section */}
      <div className="register-left">

        <h1>
          QuizMaster
        </h1>

        <h3>
          Start Your Learning Journey
        </h3>

        <p>
          Create your account and participate in
          interactive quizzes, track your progress
          and improve your knowledge.
        </p>

        <img
          src={quizImage}
          alt="Quiz illustration"
        />

        <div className="register-trust">
          Trusted by students | Learn | Practice | Grow
        </div>

      </div>

      {/* Register Card */}
      <div className="register-card">

        <h2>
          Create Account ✨
        </h2>

        <p>
          Join QuizMaster today
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister}>
          Register
        </button>

        <span>
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </span>

      </div>

    </div>

  );
}

export default Register;