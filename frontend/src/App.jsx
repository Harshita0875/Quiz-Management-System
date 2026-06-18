import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import QuizList from "./pages/QuizList";
import AddQuestions from "./pages/AddQuestions";
import ViewQuestions from "./pages/ViewQuestions";
import StudentDashboard from "./pages/StudentDashboard";
import AttemptQuiz from "./pages/AttemptQuiz";
import StudentResults from "./pages/StudentResults";
import StudentQuizzes from "./pages/StudentQuizzes";
import Users from "./pages/Users";
import AdminResults from "./pages/AdminResults";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/create-quiz"
          element={<CreateQuiz />}
        />
        <Route
          path="/quizzes"
          element={<QuizList />}
/>
<Route
  path="/add-questions/:quizId"
  element={<AddQuestions />}
/>
<Route
  path="/questions/:quizId"
  element={<ViewQuestions />}
/>
<Route path="/questions"
 element={<ViewQuestions />}
  />
<Route
 path="/student"
 element={<StudentDashboard />}
/>
<Route
  path="/attempt-quiz/:quizId"
  element={<AttemptQuiz />} 
/>
<Route
  path="/student-results"
  element={<StudentResults />}
/>
<Route
  path="/student-quizzes"
  element={<StudentQuizzes />}
/>
<Route
  path="/users"
  element={<Users />}
/>

<Route
  path="/admin-results"
  element={<AdminResults />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;