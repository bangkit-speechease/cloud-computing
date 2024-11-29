// Import the database instance from fire.js
const { db } = require("../../fire.js");

// Function to fetch the list of content from the "exercises" collection
const getContentList = async (req, res) => {
  try {
    // Query all documents in the "exercises" collection
    const contentQuery = await db.collection("exercises").get();

    // Return an empty array if no content is found
    if (contentQuery.empty) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No content found!",
      });
    }

    // Map through the documents and extract the required fields
    const contentList = contentQuery.docs.map((doc) => ({
      documentId: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      contentType: doc.data().contentType,
      imageUrl: doc.data().imageUrl,
      textPhrase: doc.data().textPhrase,
      audioGuideUrl: doc.data().audioGuideUrl,
      recordInstructionEndpoint: doc.data().recordInstructionEndpoint,
    }));

    res.status(200).json({
      status: "success",
      data: contentList,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      errorMessage: error.message,
    });
  }
};

// Function to fetch details of a specific content by its ID
const getContentDetails = async (req, res) => {
  try {
    const contentId = req.params.id;

    // Validate that the content ID is provided
    if (!contentId) {
      return res.status(400).json({
        status: "error",
        errorMessage: "Content ID is required!",
      });
    }

    // Query the "exercises" collection to find a document with the matching content ID
    const contentQuery = await db
      .collection("exercises")
      .where("contentId", "==", contentId)
      .get();

    // Return an error if no matching content is found
    if (contentQuery.empty) {
      return res.status(400).json({
        status: "error",
        errorMessage: "Content Not Found!",
      });
    }

    // Retrieve the first matching document and its data
    const contentDoc = contentQuery.docs[0];
    const contentData = contentDoc.data();

    res.status(200).json({
      status: "success",
      data: [
        {
          documentId: contentDoc.id,
          title: contentData.title,
          description: contentData.description,
          contentType: contentData.contentType,
          imageUrl: contentData.imageUrl,
          textPhrase: contentData.textPhrase,
          audioGuideUrl: contentData.audioGuideUrl,
          recordInstructionEndpoint: contentData.recordInstructionEndpoint,
        },
      ],
    });
  } catch (error) {
    if (error.message === "Unauthorized Access!") {
      return res.status(401).json({
        status: "error",
        errorMessage: "Unauthorized Access!",
      });
    }

    res.status(500).json({
      status: "error",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  getContentList,
  getContentDetails,
};
