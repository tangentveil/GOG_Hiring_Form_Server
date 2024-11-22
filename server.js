require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a JWT client using environment variables
const client = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Ensure newline characters are handled correctly
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth: client });

// Google Sheet ID and range
const spreadsheetId = "1dgFKRJ7kvpWFlaenG7Za7QK8UoVaRD2gnbCBZc6PCiQ";
const range = "Sheet1!A1:Z1000"; // Adjust the range

// Endpoint to add data
app.post("/add-row", async (req, res) => {
  const { rowData } = req.body; // Expecting an array of values
  console.log(rowData);
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [rowData],
      },
    });
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
