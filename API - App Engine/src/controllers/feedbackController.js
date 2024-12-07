const { db, admin } = require("../services/fire.js");

const { v4: uuidv4 } = require("uuid"); // Import uuid library

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

    const { userId, contentId } = req.body; // Extract userID and contentID

    // Validate userID and contentID
    if (!userId || !contentId) {
      return res.status(400).json({ error: "userID and contentID are required!" });
    }

     // Check if userID exists in the Firestore 'users' collection
     const userDoc = await db.collection("users").doc(userId).get();
     if (!userDoc.exists) {
       return res.status(404).json({ error: "User not found" });
     }
 
     // Check if contentID exists in the Firestore 'exercises' collection
     const contentDoc = await db.collection("exercises").doc(contentId).get();
     if (!contentDoc.exists) {
       return res.status(404).json({ error: "Content not found" });
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

    // Calculate star score based on predicted label and prediction score
    let starScore;

    const feedbackData = flaskResponse.data;
    const predictionScore = feedbackData.prediction_score;
    const predictedLabel = feedbackData.predicted_label;

    if (predictedLabel === "Masih Salah, Coba Lagi") {
      // Always assign 1 star for incorrect predictions
      starScore = 1;
    } else if (predictedLabel === "Bagus, Mari Lanjutkan") {
      // Assign stars based on prediction score for correct predictions
      if (predictionScore < 0.2) {
        starScore = 1;
      } else if (predictionScore < 0.4) {
        starScore = 2;
      } else if (predictionScore < 0.6) {
        starScore = 3;
      } else if (predictionScore < 0.8) {
        starScore = 4;
      } else {
        starScore = 5;
      }
    } else {
      // Fallback case (should not happen if Flask API is consistent)
      starScore = 1;
    }

    // Generate a unique feedback ID
    const feedbackId = uuidv4();

    // Save the feedback data to Firebase
    const feedbackRef = await db.collection("feedbacks").doc();

    await feedbackRef.set({
      feedbackId: feedbackId,
      userId: userId, // Store userID
      contentId: contentId, // Store contentID
      predictionScore: predictionScore,
      predictedLabel: predictedLabel,
      starScore: starScore,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send the prediction result back to the client
    res.status(200).json({
      message: "Audio processed successfully!",
      feedback: {
        feedbackId: feedbackId,
        predictionScore: predictionScore,
        predictedLabel: predictedLabel,
        starScore: starScore,
      },
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
