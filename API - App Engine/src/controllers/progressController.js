const { db, admin } = require("../services/fire.js");
const { v4: uuidv4 } = require('uuid');

// Controller to get progress data
const getProgress = async (req, res) => {
    try {
      const { userId } = req.params; // Get userId from URL params
      const { contentId } = req.query; // Get contentId from query parameters
  
      // Debugging log
      console.log(`Fetching progress for userId: ${userId}, contentId: ${contentId || "all"}`);
  
      // Build query
      let query = db.collection("progress").where("userId", "==", userId);
      if (contentId) {
        query = query.where("contentId", "==", contentId); // Add filter for contentId if provided
      }
  
      // Execute query
      const progressSnapshot = await query.get();
  
      // Check if progress data exists
      if (progressSnapshot.empty) {
        return res
          .status(404)
          .json({ error: "No progress data found for this user and content" });
      }
  
      // Map progress data to an array
      const progressData = progressSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).json({ progress: progressData });
    } catch (error) {
      console.error("Error fetching progress:", error.message);
      res.status(500).json({ error: `Error fetching progress data: ${error.message}` });
    }
  };  

// Controller to add new progress
const addProgress = async (req, res) => {
    try {
      const { userId, contentId, feedbackId } = req.body;
  
      // Validate required fields
      if (!userId || !contentId || !feedbackId) {
        return res.status(400).json({ error: "All fields are required!" });
      }
  
      // Validate user existence
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Validate content existence
      const contentDoc = await db.collection("exercises").doc(contentId).get();
      if (!contentDoc.exists) {
        return res.status(404).json({ error: "Content not found" });
      }
  
      // Validate feedback existence (using field instead of doc ID)
      const feedbackQuerySnapshot = await db
        .collection("feedbacks")
        .where("feedbackId", "==", feedbackId)
        .get();
  
      if (feedbackQuerySnapshot.empty) {
        return res.status(404).json({ error: "Feedback not found" });
      }
  
      // Generate a unique progressId
      const progressId = uuidv4();
  
      // Add new progress document
      const progressData = {
        progressId, // Include progressId
        userId,
        contentId,
        feedbackId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      await db.collection("progress").doc(progressId).set(progressData);
  
      res.status(201).json({
        message: "Progress added successfully",
        progressId,
      });
    } catch (error) {
      console.error("Error adding progress:", error);
      res.status(500).json({ error: "Error adding progress data" });
    }
  };

// Controller to update progress
const updateProgress = async (req, res) => {
    try {
      const { progressId } = req.params;
      const { feedbackId } = req.body;
  
      // Validate required fields
      if (!progressId || !feedbackId) {
        return res.status(400).json({ error: "Invalid data" });
      }
  
      // Get the progress document
      const progressRef = db.collection("progress").doc(progressId);
      const progressDoc = await progressRef.get();
  
      if (!progressDoc.exists) {
        return res.status(404).json({ error: "Progress not found" });
      }
  
      // Validate feedbackId if provided using a query
      const feedbackQuerySnapshot = await db
        .collection("feedbacks")
        .where("feedbackId", "==", feedbackId)
        .get();
  
      if (feedbackQuerySnapshot.empty) {
        console.log(`Feedback ID ${feedbackId} not found in feedbacks collection.`);
        return res.status(404).json({ error: "Feedback not found" });
      }
  
      // Update the progress document
      const updatedData = {
        feedbackId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      await progressRef.update(updatedData);

      const updatedProgressDoc = await progressRef.get();
      const updatedProgressData = updatedProgressDoc.data();
  
      res.status(200).json({
        message: "Progress updated successfully",
        updatedProgress: { id: progressId, ...updatedProgressData},
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Error updating progress data" });
    }
  };
  

module.exports = {
  getProgress,
  addProgress,
  updateProgress,
};
