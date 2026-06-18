from backend.database import get_connection

def create_quiz(admin_id):
    title = input("Enter quiz title: ")
    description = input("Enter quiz description: ")

    print("\nChoose Timer Type:")
    print("1. Overall Quiz Timer")
    print("2. Question Timer")

    choice = input("Enter choice: ")

    if choice == "1":
        timer_type = "overall"
        quiz_duration = int(input("Enter total quiz duration (seconds): "))
        question_duration = None

    elif choice == "2":
        timer_type = "question"
        question_duration = int(input("Enter time per question (seconds): "))
        quiz_duration = None

    else:
        print("Invalid choice")
        return

    connection = get_connection()
    cursor = connection.cursor()

    query = """
INSERT INTO Quizzes
(title, description, timer_type, quiz_duration, question_duration, created_by)
VALUES (?, ?, ?, ?, ?, ?)
"""

    cursor.execute(
        query,
        (
            title,
            description,
            timer_type,
            quiz_duration,
            question_duration,
            admin_id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    print("Quiz created successfully!")


def add_question():
    print("\nAdd Question")

    quiz_id = int(input("Enter Quiz ID: "))

    question_text = input("Enter question: ")

    option_a = input("Enter Option A: ")
    option_b = input("Enter Option B: ")
    option_c = input("Enter Option C: ")
    option_d = input("Enter Option D: ")

    correct_option = input(
        "Enter correct option (A/B/C/D): "
    ).upper()

    if correct_option not in ["A", "B", "C", "D"]:
        print("Invalid correct option")
        return

    connection = get_connection()
    cursor = connection.cursor()

    query = """
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
    """

    cursor.execute(
        query,
        (
            quiz_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    print("Question added successfully!")


def view_quizzes():
    print("\nAvailable Quizzes")

    connection = get_connection()
    cursor = connection.cursor()

    query = """
    SELECT 
        quiz_id,
        title,
        description,
        timer_type,
        quiz_duration,
        question_duration
    FROM Quizzes
    """

    cursor.execute(query)

    quizzes = cursor.fetchall()

    if not quizzes:
        print("No quizzes available.")
    else:
        for quiz in quizzes:
            print("\n----------------------")
            print("Quiz ID:", quiz[0])
            print("Title:", quiz[1])
            print("Description:", quiz[2])
            print("Timer Type:", quiz[3])
            print("Quiz Duration:", quiz[4])
            print("Question Duration:", quiz[5])

    cursor.close()
    connection.close()


def update_quiz():

    print("\nUpdate Quiz")

    quiz_id = int(input("Enter Quiz ID: "))

    connection = get_connection()
    cursor = connection.cursor()

    print("\nWhat do you want to update?")
    print("1. Quiz Details (Title + Description)")
    print("2. Timer Settings")
    print("3. Delete Question")

    choice = input("Enter choice: ")

    # ---------------- OPTION 1 ----------------
    if choice == "1":

        title = input("Enter new title: ")
        description = input("Enter new description: ")

        query = """
        UPDATE Quizzes
        SET title = ?, description = ?
        WHERE quiz_id = ?
        """

        cursor.execute(query, (title, description, quiz_id))
        print("Quiz details updated successfully!")


    # ---------------- OPTION 2 ----------------
    elif choice == "2":

        print("\nTimer Type:")
        print("1. Overall Quiz Timer")
        print("2. Question Timer")

        timer_choice = input("Enter choice: ")

        if timer_choice == "1":

            timer_type = "overall"
            quiz_duration = int(input("Enter total quiz duration (seconds): "))
            question_duration = None

        elif timer_choice == "2":

            timer_type = "question"
            question_duration = int(input("Enter time per question (seconds): "))
            quiz_duration = None

        else:
            print("Invalid choice")
            cursor.close()
            connection.close()
            return


        query = """
        UPDATE Quizzes
        SET timer_type = ?,
            quiz_duration = ?,
            question_duration = ?
        WHERE quiz_id = ?
        """

        cursor.execute(
            query,
            (timer_type, quiz_duration, question_duration, quiz_id)
        )

        print("Timer updated successfully!")


    # ---------------- OPTION 3 ----------------
    elif choice == "3":

        query = """
        SELECT question_id, question_text
        FROM Questions
        WHERE quiz_id = ?
        """

        cursor.execute(query, (quiz_id,))
        questions = cursor.fetchall()

        if not questions:
            print("No questions found.")
            cursor.close()
            connection.close()
            return

        print("\nQuestions:")
        for q in questions:
            print(q[0], "-", q[1])

        qid = int(input("\nEnter Question ID to delete: "))

        cursor.execute(
            "DELETE FROM Questions WHERE question_id = ?",
            (qid,)
        )

        print("Question deleted successfully!")


    else:
        print("Invalid choice")
        cursor.close()
        connection.close()
        return


    connection.commit()
    cursor.close()
    connection.close()

def delete_quiz():
    print("\nDelete Quiz")

    quiz_id = int(input("Enter Quiz ID to delete: "))

    connection = get_connection()
    cursor = connection.cursor()

    # Delete related questions first
    delete_questions = """
    DELETE FROM Questions
    WHERE quiz_id = ?
    """

    cursor.execute(delete_questions, (quiz_id,))

    # Delete quiz
    delete_quiz_query = """
    DELETE FROM Quizzes
    WHERE quiz_id = ?
    """

    cursor.execute(delete_quiz_query, (quiz_id,))

    connection.commit()

    cursor.close()
    connection.close()

    print("Quiz deleted successfully!")