// Import required libraries
const admin = require("firebase-admin");
// const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin SDK
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "speechease-storage", // Replace with your Cloud Storage bucket name
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Paths to Cloud Storage folders
const audioFolder = "Audio/";
const imageFolder = "Image/";
const textFile = "Text/textspeechease.json";

// Upload data to Firestore
const uploadDataToFirestore = async () => {
  try {
    // Fetch the text JSON file
    const textFileContents = await bucket.file(textFile).download();
    const textData = JSON.parse(textFileContents.toString());

    // Get audio and image files from Cloud Storage
    const [audioFiles] = await bucket.getFiles({ prefix: audioFolder });
    const [imageFiles] = await bucket.getFiles({ prefix: imageFolder });

    // Sort audio and image files by file name to ensure proper ordering
    const sortedAudioFiles = audioFiles.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    );
    const sortedImageFiles = imageFiles.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    );

    // Iterate over 60 items
    for (let i = 0; i < 60; i++) {
      const audioFile = sortedAudioFiles[i+1];
      const imageFile = sortedImageFiles[i+1];

      // Get download URLs for audio and image
      const audioUrl = `https://storage.googleapis.com/${bucket.name}/${audioFile.name}`;
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFile.name}`;

      // Adjust index for textPhrase and title to match the correct order
      const textPhrase = i < 20
        ? textData["Latihan 1"][i]
        : i < 40
        ? textData["Latihan 2"][i - 20]
        : textData["Latihan 3"][i - 40];

      // Ensure title matches the correct index for the exercise
      const title = `Latihan ${i + 1}`; // Ensure title is correctly indexed

      // // Create Firestore document
      // const documentId = uuidv4(); // Generate unique ID
      // await db.collection("exercises").doc(documentId).set({
      //   contentId: documentId,
      //   audioGuideUrl: audioUrl,
      //   imageUrl: imageUrl,
      //   textPhrase: textPhrase,
      //   contentType: "exercise", // Adjust as needed
      //   title: title,
      // });

      const generateSequentialId = (index) => {
        return `exercise-${String(index).padStart(3, '0')}`;
      };
      
      // Ganti UUID dengan ID berurutan
      const documentId = generateSequentialId(i + 1);
      await db.collection("exercises").doc(documentId).set({
        contentId: documentId,
        audioGuideUrl: audioUrl,
        imageUrl: imageUrl,
        textPhrase: textPhrase,
        contentType: "exercise",
        title: title,
      });

      console.log(`Uploaded Exercise ${i + 1}`);
    }

    console.log("All data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

// Start the upload process
uploadDataToFirestore();
