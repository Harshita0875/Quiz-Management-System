import React, { useState } from "react";
import axios from "axios";

function ImportCSV() {
  const [file, setFile] = useState(null);

  const uploadCSV = async () => {
    if (!file) {
      alert("Select CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/import-questions",
        formData
      );

      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="import-box">
      <h3>Import Questions (CSV)</h3>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadCSV}>Upload</button>
    </div>
  );
}

export default ImportCSV;