from backend.database import get_connection


def save_result(user_id, quiz_id, score, total_questions):

    percentage = (score / total_questions) * 100


    connection = get_connection()
    cursor = connection.cursor()


    query = """
    INSERT INTO Results
    (
        user_id,
        quiz_id,
        score,
        total_questions,
        percentage
    )
    VALUES (?, ?, ?, ?, ?)
    """


    cursor.execute(
        query,
        (
            user_id,
            quiz_id,
            score,
            total_questions,
            percentage
        )
    )


    connection.commit()

    cursor.close()
    connection.close()


    print("Result saved successfully!")

def complete_attempt(user_id, quiz_id):

    connection = get_connection()
    cursor = connection.cursor()


    query = """
    UPDATE Attempts
    SET 
        end_time = GETDATE(),
        status = 'completed'
    WHERE 
        user_id = ?
        AND quiz_id = ?
        AND status = 'started'
    """


    cursor.execute(
        query,
        (
            user_id,
            quiz_id
        )
    )


    connection.commit()

    cursor.close()
    connection.close()


    print("Attempt completed!")

def view_results(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
    SELECT
        r.quiz_id,
        q.title,
        r.score,
        r.total_questions,
        r.percentage,
        r.attempt_date
    FROM Results r
    JOIN Quizzes q
    ON r.quiz_id = q.quiz_id
    WHERE r.user_id = ?
    """

    cursor.execute(query, (user_id,))

    results = cursor.fetchall()

    if not results:
        print("No results available.")

    else:
        print("\nYour Results")

        for result in results:
            print("\n----------------")
            print("Quiz:", result[1])
            print("Score:", result[2], "/", result[3])
            print("Percentage:", result[4], "%")
            print("Date:", result[5])


    cursor.close()
    connection.close()