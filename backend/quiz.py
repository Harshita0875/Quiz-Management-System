import time
from backend.database import get_connection


def get_questions(quiz_id):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
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
    """

    cursor.execute(query, (quiz_id,))

    questions = cursor.fetchall()

    cursor.close()
    connection.close()

    return questions


# ---------------- UPDATED FUNCTION ----------------

def attempt_quiz(quiz_id, question_duration=None):

    questions = get_questions(quiz_id)

    if not questions:
        print("No questions available.")
        return 0, 0

    score = 0
    total_questions = len(questions)

    print("\nStarting Quiz...\n")

    for index, question in enumerate(questions, start=1):

        print("\n----------------")
        print("Question", index)
        print(question[1])

        print("A.", question[2])
        print("B.", question[3])
        print("C.", question[4])
        print("D.", question[5])

        # Start timer only if question_duration is given
        start_time = time.time()

        answer = input(
            "Enter your answer (A/B/C/D): "
        ).upper()

        # TIMER CHECK
        if question_duration:

            time_taken = time.time() - start_time

            if time_taken > question_duration:
                print("⏰ Time over! Moving to next question.")
                continue

        if answer == question[6]:
            score += 1
            print("Correct!")

        else:
            print("Wrong!")

    print("\nQuiz Completed!")
    print("Score:", score, "/", total_questions)

    return score, total_questions