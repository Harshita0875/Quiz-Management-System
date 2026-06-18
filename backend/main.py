from backend.users import  register_user,login_user

from backend.admin import (
    create_quiz,
    add_question,
    view_quizzes,
    update_quiz,
    delete_quiz
)

from backend.student import (
    view_available_quizzes,
    start_quiz
)

from backend.quiz import attempt_quiz

from backend.result import (
    save_result,
    complete_attempt,
    view_results
)


# ---------------- ADMIN PANEL ----------------

def admin_panel(admin_id):

    while True:

        print("\n===== Admin Panel =====")
        print("1. Create Quiz")
        print("2. Add Question")
        print("3. View Quizzes")
        print("4. Update Quiz")
        print("5. Delete Quiz")
        print("6. Logout")

        choice = input("Enter choice: ")


        if choice == "1":

            create_quiz(admin_id)


        elif choice == "2":

            add_question()


        elif choice == "3":

            view_quizzes()


        elif choice == "4":

            update_quiz()


        elif choice == "5":

            delete_quiz()


        elif choice == "6":

            print("Admin logged out")
            break


        else:

            print("Invalid choice")



# ---------------- STUDENT PANEL ----------------

def student_panel(user_id):

    while True:

        print("\n===== Student Panel =====")
        print("1. View Available Quizzes")
        print("2. Start Quiz")
        print("3. View Results")
        print("4. Logout")

        choice = input("Enter choice: ")

        if choice == "1":

            view_available_quizzes()



        elif choice == "2":

            quiz_id = int(
                input("Enter Quiz ID: ")
            )

            # Create attempt
            start_quiz(user_id)


            # Conduct quiz
            from backend.student import get_quiz_duration
            duration = get_quiz_duration(quiz_id)
            score, total = attempt_quiz(quiz_id, duration)


            # Save result
            save_result(
                user_id,
                quiz_id,
                score,
                total
            )


            # Complete attempt
            complete_attempt(
                user_id,
                quiz_id
            )



        elif choice == "3":

            view_results(user_id)



        elif choice == "4":

            print("Student logged out")
            break



        else:

            print("Invalid choice")



# ---------------- MAIN PROGRAM ----------------

def main():

    while True:

        print("\n===== Quiz Management System =====")
        print("1. Register")
        print("2. Login")
        print("3. Exit")

        choice = input("Enter choice: ")


        if choice == "1":

            register_user()


        elif choice == "2":

            user = login_user()

            if user:

                user_id = user[0]
                name = user[1]
                role = user[2]


                print(f"\nWelcome {name}")


                if role == "admin":

                    admin_panel(user_id)


                elif role == "student":

                    student_panel(user_id)


                else:

                    print("Invalid role")



        elif choice == "3":

            print("Thank you!")
            break


        else:

            print("Invalid choice")

if __name__ == "__main__":
    main()