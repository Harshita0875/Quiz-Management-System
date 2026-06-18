from backend.database import get_connection



def get_quiz_duration(quiz_id):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
    SELECT question_duration
    FROM Quizzes
    WHERE quiz_id = ?
    """

    cursor.execute(query, (quiz_id,))

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    if result:
        return result[0]

    return None

def view_available_quizzes():

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
            print("\n----------------")
            print("Quiz ID:", quiz[0])
            print("Title:", quiz[1])
            print("Description:", quiz[2])
            print("Timer Type:", quiz[3])
            if quiz[3] == "overall":
             print("Quiz Duration:", quiz[4], "seconds")

            elif quiz[3] == "question":
             print("Time Per Question:", quiz[5], "seconds")


    cursor.close()
    connection.close()

def start_quiz(user_id):

    print("\nStart Quiz")

    quiz_id = int(input("Enter Quiz ID: "))

    connection = get_connection()
    cursor = connection.cursor()

    query = """
    INSERT INTO Attempts
    (user_id, quiz_id, status)
    VALUES (?, ?, ?)
    """

    cursor.execute(
        query,
        (
            user_id,
            quiz_id,
            "started"
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    print("Quiz started successfully!")