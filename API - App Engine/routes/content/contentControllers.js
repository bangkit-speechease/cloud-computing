<<<<<<< HEAD
const { db } = require("../../fire.js");

const getContentList = async (req, res) => {
  try {
    const contentQuery = await db.collection("exercises").get();
=======
// Import the database instance from fire.js
const { db } = require("../../fire.js");

// Function to fetch the list of content from the "exercises" collection
const getContentList = async (req, res) => {
  try {
    // Query all documents in the "exercises" collection
    const contentQuery = await db.collection("exercises").get();

    // Return an empty array if no content is found
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    if (contentQuery.empty) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No content found!",
      });
    }

<<<<<<< HEAD
    // Map through the documents and structure the response
=======
    // Map through the documents and extract the required fields
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
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

<<<<<<< HEAD
    // Success Response
=======
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    res.status(200).json({
      status: "success",
      data: contentList,
    });
<<<<<<< HEAD
  } catch (error) {
    // Generic Error Response
=======
  } 
  catch (error) {
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    res.status(500).json({
      status: "error",
      errorMessage: error.message,
    });
<<<<<<< HEAD
  }
};

const getContentDetails = async (req, res) => {
  try {
    // Get Content ID from URL Params
    const contentId = req.params.id;

=======
  }      
}

// Function to fetch details of a specific content by its ID
const getContentDetails = async (req, res) => {
  try {
    const contentId = req.params.id;

    // Validate that the content ID is provided
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    if (!contentId) {
      return res.status(400).json({
        status: "error",
        errorMessage: "Content ID is required!",
      });
    }

<<<<<<< HEAD
    // Fetch Content Data from Firestore
    // const contentDoc = await db.collection("exercises").doc(contentId).get();
    const contentQuery = await db
      .collection("exercises")
      .where("contentId", "==", contentId)
      .get();

=======
    // Query the "exercises" collection to find a document with the matching content ID
    const contentQuery = await db.collection("exercises").where("contentId", "==", contentId).get();

    // Return an error if no matching content is found
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    if (contentQuery.empty) {
      return res.status(400).json({
        status: "error",
        errorMessage: "Content Not Found!",
      });
    }

<<<<<<< HEAD
    // const contentData = contentDoc.data();
    const contentDoc = contentQuery.docs[0];
    const contentData = contentDoc.data();

    // Success Response
=======
    // Retrieve the first matching document and its data
    const contentDoc = contentQuery.docs[0];
    const contentData = contentDoc.data();

>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
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
<<<<<<< HEAD
    // Handle Unauthorized Error
=======
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    if (error.message === "Unauthorized Access!") {
      return res.status(401).json({
        status: "error",
        errorMessage: "Unauthorized Access!",
      });
    }

<<<<<<< HEAD
    // Generic Error Response
=======
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
    res.status(500).json({
      status: "error",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  getContentList,
<<<<<<< HEAD
  getContentDetails,
=======
  getContentDetails
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a
};
