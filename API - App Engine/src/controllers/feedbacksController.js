const { db, admin } = require("../services/fire.js");

// Library to send HTTP requests and handle responses (e.g., fetching or sending data).
const axios = require("axios");

// Library for creating and encoding form data to be sent with HTTP requests.
const FormData = require("form-data");

// Function to send audio to Flask API and save the result to Firebase
const getFeedback = async (req, res) => {
  try {
    // Ensure an audio file is provided
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Send the audio file to the Flask API
    const formData = new FormData();
    const audioFile = req.file;
    formData.append("file", audioFile.buffer, audioFile.originalname);

    const flaskResponse = await axios.post(
      "https://my-flask-app-950424434728.asia-southeast2.run.app/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const feedbackData = flaskResponse.data;
    const predictionScore = feedbackData.prediction_score;
    const predictedLabel = feedbackData.predicted_label;

    // Save the feedback data to Firebase
    const feedbackRef = await db.collection("feedbacksSimpleVers").doc();

    await feedbackRef.set({
      predictedLabel,
      predictionScore,
    });

    // Send the prediction result back to the client
    res.status(200).json({
      predictedLabel,
      predictionScore,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({
      error: "Error processing audio. Please try again.",
    });
  }
};

module.exports = {
  getFeedback,
};
