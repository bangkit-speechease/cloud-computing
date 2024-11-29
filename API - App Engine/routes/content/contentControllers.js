const { db } = require("../../fire.js");

const getContentList = async (req, res) => {
  try {
    const contentQuery = await db.collection("exercises").get();
    if (contentQuery.empty) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No content found!",
      });
    }

    // Map through the documents and structure the response
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

    // Success Response
    res.status(200).json({
      status: "success",
      data: contentList,
    });
  } catch (error) {
    // Generic Error Response
    res.status(500).json({
      status: "error",
      errorMessage: error.message,
    });
  }
};

const getContentDetails = async (req, res) => {
  try {
    // Get Content ID from URL Params
    const contentId = req.params.id;

    if (!contentId) {
      return res.status(400).json({
        status: "error",
        errorMessage: "Content ID is required!",
      });
    }

    // Fetch Content Data from Firestore
    // const contentDoc = await db.collection("exercises").doc(contentId).get();
    const contentQuery = await db
      .collection("exercises")
      .where("contentId", "==", contentId)
      .get();

    if (contentQuery.empty) {
      return res.status(400).json({
        status: "error",
        errorMessage: "Content Not Found!",
      });
    }

    // const contentData = contentDoc.data();
    const contentDoc = contentQuery.docs[0];
    const contentData = contentDoc.data();

    // Success Response
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
    // Handle Unauthorized Error
    if (error.message === "Unauthorized Access!") {
      return res.status(401).json({
        status: "error",
        errorMessage: "Unauthorized Access!",
      });
    }

    // Generic Error Response
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
