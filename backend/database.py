import pyodbc

def get_connection():
    connection = pyodbc.connect(
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=localhost\\SQLEXPRESS;"
        "Database=QuizManagementSystem;"  
        "Trusted_Connection=yes;"   
    )

    return connection