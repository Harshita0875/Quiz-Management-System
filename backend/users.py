from backend.database import get_connection


def register_user():
   name = input("Enter name: ")
   email = input("Enter email: ")
   password = input("Enter password: ")
   role = input("Enter role (admin/student): ")

   connection = get_connection()
   cursor = connection.cursor()

   query = """
   INSERT INTO Users (name, email, password, role)
    VALUES (?, ?, ?, ?)
    """

   cursor.execute(query, (name, email, password, role))

   connection.commit()

   cursor.close()
   connection.close()

   print("User registered successfully!")


def login_user():
    email = input("Enter email: ")
    password = input("Enter password: ")

    connection = get_connection()
    cursor = connection.cursor()

    query = """
    SELECT user_id, name, role
    FROM Users
    WHERE email = ? AND password = ?
    """

    cursor.execute(query, (email, password))

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user:
        print("Login successful!")
        print("Welcome", user[1])
        print("Role:", user[2])

        return user
    else:
        print("Invalid email or password")
        return None