import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CreateQuiz.css";

function AddQuestions() {

  const { quizId } = useParams();

  const [formData, setFormData] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveQuestion = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/add-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            quiz_id: quizId,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      setFormData({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
      });

    } catch (error) {
      console.log(error);
      alert("Error saving question");
    }
  };

  return (
    <div className="main">

      <h1>Add Question</h1>

      <form
        className="quiz-form"
        onSubmit={saveQuestion}
      >

        <textarea
          name="question_text"
          placeholder="Question"
          value={formData.question_text}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="option_a"
          placeholder="Option A"
          value={formData.option_a}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="option_b"
          placeholder="Option B"
          value={formData.option_b}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="option_c"
          placeholder="Option C"
          value={formData.option_c}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="option_d"
          placeholder="Option D"
          value={formData.option_d}
          onChange={handleChange}
          required
        />

        <select
          name="correct_option"
          value={formData.correct_option}
          onChange={handleChange}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <button
          type="submit"
          className="save-btn"
        >
          Save Question
        </button>

      </form>

    </div>
  );
}

export default AddQuestions;