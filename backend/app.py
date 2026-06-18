from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection
from import_csv import import_bp



app = Flask(__name__)
CORS(app)
app.register_blueprint(import_bp)
# ---------------------------
# REGISTER API
# ---------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    print("🔥 RAW DATA:", request.data)
    print("🔥 JSON DATA:", data)
    print("DATA:", data)

    if not data:
        return jsonify({"error": "No data"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([name, email, password, role]):
        return jsonify({"error": "Missing fields"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Users WHERE email = ?", (email,))
    existing = cursor.fetchone()

    if existing:
        return jsonify({"message": "User already exists"}), 400

    cursor.execute("""
        INSERT INTO Users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    """, (name, email, password, role))

    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully"})

# ---------------------------
# LOGIN API
# ---------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT user_id, name, email, role
        FROM Users
        WHERE email = ? AND password = ?
    """, (email, password))

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "role": user[3]
        })

    return jsonify({"message": "Invalid credentials"}), 401


# ---------------------------
# CREATE QUIZ API
# ---------------------------
@app.route("/create-quiz", methods=["POST"])
def create_quiz():
    data = request.json

    title = data["title"]
    description = data["description"]
    timer_type = data["timer_type"]
    quiz_duration = data.get("quiz_duration")
    question_duration = data.get("question_duration")

    if timer_type == "quiz":
        question_duration = None

    if timer_type == "question":
        quiz_duration = None

    created_by = data["created_by"]

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Quizzes
        (title, description, timer_type, quiz_duration, question_duration, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, description, timer_type, quiz_duration, question_duration, created_by))

    conn.commit()

    cursor.execute("SELECT @@IDENTITY")
    quiz_id = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "message": "Quiz created successfully",
        "quiz_id": quiz_id
    })

@app.route("/admin-stats", methods=["GET"])
def admin_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Users")
    users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Quizzes")
    quizzes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Questions")
    questions = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Results")
    results = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "users": users,
        "quizzes": quizzes,
        "questions": questions,
        "results": results
    })

@app.route("/quizzes", methods=["GET"])
def get_quizzes():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            quiz_id,
            title,
            description,
            timer_type,
            quiz_duration,
            question_duration,
            created_at
        FROM Quizzes
        ORDER BY quiz_id DESC
    """)

    quizzes = cursor.fetchall()

    data = []

    for q in quizzes:
        data.append({
            "quiz_id": q[0],
            "title": q[1],
            "description": q[2],
            "timer_type": q[3],
            "quiz_duration": q[4],
            "question_duration": q[5],
            "created_at": str(q[6])
        })

    conn.close()

    return jsonify(data)

@app.route("/quiz/<int:quiz_id>", methods=["DELETE"])
def delete_quiz(quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM Questions WHERE quiz_id = ?",
        (quiz_id,)
    )

    cursor.execute(
        "DELETE FROM Quizzes WHERE quiz_id = ?",
        (quiz_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Quiz deleted successfully"
    })

@app.route("/add-question", methods=["POST"])
def add_question():

    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Questions
        (
            quiz_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["quiz_id"],
        data["question_text"],
        data["option_a"],
        data["option_b"],
        data["option_c"],
        data["option_d"],
        data["correct_option"]
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Question added successfully"
    })
@app.route("/questions/<int:quiz_id>", methods=["GET"])
def get_questions(quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            question_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        FROM Questions
        WHERE quiz_id = ?
    """, (quiz_id,))

    questions = cursor.fetchall()

    result = []

    for q in questions:
        result.append({
            "question_id": q[0],
            "question_text": q[1],
            "option_a": q[2],
            "option_b": q[3],
            "option_c": q[4],
            "option_d": q[5],
            "correct_option": q[6]
        })

    conn.close()

    return jsonify(result)

@app.route("/available-quizzes", methods=["GET"])
def available_quizzes():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            quiz_id,
            title,
            description,
            timer_type
        FROM Quizzes
        ORDER BY quiz_id DESC
    """)

    quizzes = cursor.fetchall()

    result = []

    for q in quizzes:
        result.append({
            "quiz_id": q[0],
            "title": q[1],
            "description": q[2],
            "timer_type": q[3]
        })

    conn.close()

    return jsonify(result)

@app.route("/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz_questions(quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            question_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d
        FROM Questions
        WHERE quiz_id = ?
    """, (quiz_id,))

    questions = cursor.fetchall()

    result = []

    for q in questions:
        result.append({
            "question_id": q[0],
            "question_text": q[1],
            "option_a": q[2],
            "option_b": q[3],
            "option_c": q[4],
            "option_d": q[5]
        })

    conn.close()

    return jsonify(result)

@app.route("/attempt-quiz/<int:quiz_id>", methods=["GET"])
def attempt_quiz_data(quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            timer_type,
            quiz_duration,
            question_duration
        FROM Quizzes
        WHERE quiz_id = ?
    """, (quiz_id,))

    quiz = cursor.fetchone()

    cursor.execute("""
        SELECT
            question_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        FROM Questions
        WHERE quiz_id = ?
    """, (quiz_id,))

    questions = cursor.fetchall()

    result = []

    for q in questions:
        result.append({
            "question_id": q[0],
            "question_text": q[1],
            "option_a": q[2],
            "option_b": q[3],
            "option_c": q[4],
            "option_d": q[5],
            "correct_option": q[6]
        })

    conn.close()

    return jsonify({ "timer_type": quiz[0],
        "quiz_duration": quiz[1],
        "question_duration": quiz[2],
        "questions": result
    })

@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():

    data = request.json

    user_id = data["user_id"]
    quiz_id = data["quiz_id"]
    answers = data["answers"]

    conn = get_connection()
    cursor = conn.cursor()

    score = 0

    for answer in answers:

        cursor.execute("""
            SELECT correct_option
            FROM Questions
            WHERE question_id = ?
        """, (answer["question_id"],))

        correct = cursor.fetchone()[0]

        if answer["selected_option"] == correct:
            score += 1

    cursor.execute("""
    SELECT COUNT(*)
    FROM Questions
    WHERE quiz_id = ?
""", (quiz_id,))

    total_questions = cursor.fetchone()[0]

    percentage = (
        score / total_questions * 100
        if total_questions > 0
        else 0
    )

    cursor.execute("""
        INSERT INTO Results
        (
            user_id,
            quiz_id,
            score,
            total_questions,
            percentage
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        user_id,
        quiz_id,
        score,
        total_questions,
        percentage
    ))
    cursor.execute("""
    INSERT INTO Attempts
    (
        user_id,
        quiz_id,
        end_time,
        status
    )
    VALUES (?, ?, GETDATE(), ?)
""", (
    user_id,
    quiz_id,
    "Completed"
))
    conn.commit()
    conn.close()

    return jsonify({
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage
    })

@app.route("/student-results/<int:user_id>", methods=["GET"])
def student_results(user_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            q.title,
            r.score,
            r.total_questions,
            r.percentage,
            r.attempt_date
        FROM Results r
        INNER JOIN Quizzes q
            ON q.quiz_id = r.quiz_id
        WHERE r.user_id = ?
        ORDER BY r.result_id DESC
    """, (user_id,))

    rows = cursor.fetchall()

    results = []

    for row in rows:

        results.append({
            "title": row[0],
            "score": row[1],
            "total_questions": row[2],
            "percentage": float(row[3]),
            "attempt_date": str(row[4])
        })

    conn.close()

    return jsonify(results)

@app.route("/student-stats/<int:user_id>", methods=["GET"])
def student_stats(user_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM Results
        WHERE user_id = ?
    """, (user_id,))

    attempts = cursor.fetchone()[0]

    cursor.execute("""
        SELECT ISNULL(AVG(percentage),0)
        FROM Results
        WHERE user_id = ?
    """, (user_id,))

    average_score = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "attempts": attempts,
        "average_score": round(float(average_score),2)
    })

@app.route("/users", methods=["GET"])
def get_users():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            user_id,
            name,
            email,
            role,
            created_at
        FROM Users
        ORDER BY user_id DESC
    """)

    rows = cursor.fetchall()

    users = []

    for row in rows:
        users.append({
            "user_id": row[0],
            "name": row[1],
            "email": row[2],
            "role": row[3],
            "created_at": str(row[4])
        })

    conn.close()

    return jsonify(users)

@app.route("/admin-results", methods=["GET"])
def admin_results():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            u.name,
            q.title,
            r.score,
            r.total_questions,
            r.percentage,
            r.attempt_date
        FROM Results r
        INNER JOIN Users u
            ON r.user_id = u.user_id
        INNER JOIN Quizzes q
            ON r.quiz_id = q.quiz_id
        ORDER BY r.result_id DESC
    """)

    rows = cursor.fetchall()

    results = []

    for row in rows:

        results.append({
            "student": row[0],
            "quiz": row[1],
            "score": row[2],
            "total_questions": row[3],
            "percentage": float(row[4]),
            "attempt_date": str(row[5])
        })

    conn.close()

    return jsonify(results)

@app.route("/student-analysis/<int:user_id>")
def student_analysis(user_id):

    conn = get_connection()
    cursor = conn.cursor()

    # Total quizzes attempted
    cursor.execute("""
        SELECT COUNT(*)
        FROM Results
        WHERE user_id = ?
    """, user_id)

    total_attempts = cursor.fetchone()[0]


    # Average percentage
    cursor.execute("""
        SELECT AVG(percentage)
        FROM Results
        WHERE user_id = ?
    """, user_id)

    avg_percentage = cursor.fetchone()[0] or 0


    # Best score
    cursor.execute("""
        SELECT MAX(percentage)
        FROM Results
        WHERE user_id = ?
    """, user_id)

    best_score = cursor.fetchone()[0] or 0


    # Quiz-wise performance
    cursor.execute("""
        SELECT 
            q.title,
            r.percentage
        FROM Results r
        JOIN Quizzes q
        ON r.quiz_id = q.quiz_id
        WHERE r.user_id = ?
    """, user_id)


    quiz_data = []

    for row in cursor.fetchall():

        quiz_data.append({
            "quiz": row[0],
            "percentage": float(row[1])
        })


    conn.close()


    return jsonify({

        "total_attempts": total_attempts,

        "average_percentage": round(float(avg_percentage), 2),

        "best_score": float(best_score),

        "quiz_data": quiz_data

    })
# ---------------------------
# RUN SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)