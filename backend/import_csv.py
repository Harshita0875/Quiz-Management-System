from flask import Blueprint, request, jsonify
import pandas as pd
from database import get_connection

import_bp = Blueprint("import_bp", __name__)

@import_bp.route("/import-questions", methods=["POST"])
def import_questions():
    file = request.files["file"]

    df = pd.read_csv(file)
    print(df)
    print(df.dtypes)


    conn = get_connection()
    cursor = conn.cursor()
    df["quiz_id"] = df["quiz_id"].astype(int)
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO Questions 
            (quiz_id,question_text, option_a, option_b, option_c, option_d, correct_option)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        int(row["quiz_id"]),
    str(row["question_text"]),
    str(row["option_a"]),
    str(row["option_b"]),
    str(row["option_c"]),
    str(row["option_d"]),
    str(row["correct_option"])
        )

    conn.commit()
    conn.close()

    return jsonify({"message": "CSV Imported Successfully"})