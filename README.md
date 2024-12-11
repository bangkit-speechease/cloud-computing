# Our Description
Designing and implementing a cloud architecture tailored to the application's needs, utilizing App Engine for backend services, Cloud Run for deploying machine learning models, Cloud Storage for storing assets, Firebase Authentication for user authentication, and Firebase Firestore for data storage. Conducting cost estimations for all required cloud services to ensure budget feasibility. Developing and building backend REST API services with ExpressJS Framework for Node.js to connect the mobile app with various cloud services, including a specific API for consuming machine learning models. Performing thorough testing on both APIs to ensure functionality and reliability. Creating and configuring the necessary cloud infrastructure as planned, followed by deploying the application according to the designed architecture, and managing the IAM & Admin service account.

## API-SpeechEase

The following APIs are designed for use within the SpeechEase app project. These APIs serve the following functions:
1. Managing user registration, login, and logout processes.
2. Handling user profile data within the app (retrieval, update, deletion).
3. Providing access to and managing exercise content data.
4. Processing user feedback via audio submissions to an ML model.
5. Managing user progress data, including retrieval, addition, and updates, to track and enhance the learning journey within the app.

## 1. List API

### a) Register User
URL: /register<br>
Method: POST<br>
Request Body:  
```
{
  "name": "string",
  "email": "string (must be unique and valid email format)",
  "password": "string (minimum 6 characters)"
}
```
Response:<br>
Success (201 - Created):
```
{
  "error": false,
  "message": "User registered successfully. Please verify your email.",
  "userId": "string"
  }
}
```
Error:<br>
1) (400 - Bad Request)
- Validation Error
```
{
  "error": true,
  "message": "Validation error message."
}
```
- Email Already Registered
```
{
  "error": true,
  "message": "Email is already registered."
}
```
2) (500 - Internal Server Error)
```
{
  "error": true,
  "message": "Error message."
}
```

### b) Login User
URL: /login<br>
Method: POST<br>
Request Body:
```
{
  "email": "string (valid email format)",
  "password": "string"
}
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "success",
  "loginResult": {
    "userId": "string",
    "name": "string",
    "token": "string (JWT Token)"
  }
}
```
Error:<br>
1) (401 - Unauthorized)
```
{
  "error": true,
  "message": "Invalid email or password."
}
```
2) (500 - Internal Server Error):
```
{
  "error": true,
  "message": "Internal server error."
}
```

### c) Logout User
URL: /logout<br>
Method: POST<br>
Headers:
```
Authorization: Bearer <JWT_Token>
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "User successfully logged out."
  "token": "string (expired token)"
}
```
Error:<br>
1) (400 - Bad Request)
- Token Missing
```
{
  "error": true,
  "message": "No token provided. Please log in first."
}
```
- Token Invalid or Expired
```
{
  "error": true,
  "message": "Invalid token or session expired."
}
```
2) (500 - Internal Server Error)
```
{
  "error": true,
  "message": "An unexpected error occurred. Please try again later."
}
```

### d) Get Specific User Data
URL: /user/:userId<br>
Method: GET<br>
Parameters: userId (path parameter, string, required)<br>
Headers:
```
Authorization: Bearer <JWT_Token>
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "User data retrieved successfully!",
  "user": {
    "userId": "string",
    "name": "string",
    "email": "string"
  }
}
```
Error:<br>
1) (404 - Not Found)
```
{
  "error": true,
  "message": "User data not found!"
}
```
2) (400 - Bad Request)
```
{
  "error": true,
  "message": "Error message."
}
```

### e) Update Specific User Data
URL: /update/:userId<br>
Method: PUT<br>
Parameters: userId (path parameter, string, required)<br>
Headers:
```
Authorization: Bearer <JWT_Token>
```
Request Body:
```
{
  "name": "string (new name of the user)"
}

```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "User data successfully updated!",
  "data": {
    "userId": "string",
    "name": "string"
  }
}
```
Error:<br>
1) (400 - Bad Request)
- Validation Error
```
{
  "error": true,
  "message": "Validation error message."
}
```
- General Error
```
{
  "error": true,
  "message": "Error message"
}
```

### f) Delete Specific User Data
URL: /delete/:userId<br>
Method: DELETE<br>
Parameters: userId (path parameter, string, required)<br>
Headers:
```
Authorization: Bearer <JWT_Token>
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "User successfully deleted!"
}
```
Error:
1) (400 - Bad Request):
```
{
  "error": true,
  "message": "Error message"
}
```
2) (404 - Not Found):
```
{
  "error": true,
  "message": "User data not found!"
}
```

### g) Get List of Exercise Content
URL: /content<br>
Method: GET<br>
Headers:
```
Authorization: Bearer <JWT_Token>
```
Response:<br>
Success (200 - OK):
```
{
  "status": "success",
  "message": "Content list retrieved successfully.",
  "data": [
    {
      "contentId": "string",
      "title": "string",
      "contentType": "string",
      "imageUrl": "string",
      "textPhrase": "string",
      "audioGuideUrl": "string",
    }
  ]
}
```
or
```
{
  "status": "success",
  "data:": [],
  "message": "No content found!"
}
```
Error:<br>
1) (500 - Internal Server Error):
```
{
  "error": true,
  "message": "Failed to retrieve content list."
}
```

### h) Get Details of Specific Exercise Content
URL: /content/:id<br>
Method: GET<br>
Parameters: id: Path parameter (string, required)<br>
Headers:
```
Authorization: Bearer <JWT_Token>
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "Content details retrieved successfully.",
  "data": [
    {
      "contentId": "string",
      "title": "string",
      "contentType": "string",
      "imageUrl": "string",
      "textPhrase": "string",
      "audioGuideUrl": "string"
    }
  ]
}
```
Error:<br>
1) (400 - Bad Request):
```
{
  "error": true,
  "message": "Content ID is required!"
}
```
2) (404 - Not Found):
```
{
  "error": false,
  "message": "Content not found!"
}
```
3) (500 - Internal Server Error):
```
(500 - Internal Server Error):
{
  "status": "error",
  "errorMessage": "Failed to retrieve content details."
}
```

### i) Submit Audio Feedback
URL: /feedback<br>
Method: POST<br>
Headers: 
```
Authorization: Bearer <JWT_Token>
Content-Type: multipart/form-data
```
Request Body (file: Binary data of the audio file required)
```
{
  "file": "<binary_audio_file>",
  "userId": "string",
  "contentId": "string"
}
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "Audio processed successfully!",
  "feedback": {
    "feedbackId": "string",
    "predictionScore": "number (confidence score of the ML prediction)",
    "predictedLabel": "string (classification result)",
    "starScore": "number (1-5 stars based on prediction score)"
  }
}
```
Error:<br>
1) (400 - Bad Request):
```
{
  "error": true,
  "message": "No file uploaded"
}
```
2) (500 - Internal Server Error):
```
{
  "error": false,
  "message": "Error processing audio. Please try again."
}
```

### j) Get Progress
URL: /progress/:userId<br>
Method: GET<br>
Parameters: id: Path parameter (string, required)<br>
Headers: 
```
Authorization: Bearer <JWT_Token>
```
Response:<br>
Success (200 - OK):
```
{
  "progress": [
    {
      "id": "string",
      "userId": "string",
      "contentId": "string",
      "feedbackId": "string",
      "timestamp": "timestamp"
    }
  ]
}
```
Error:<br>
1) (404 - Not Found):
```
{
  "error": true,
  "message": "No progress data found for this user and content"
}
```
2) (500 - Internal Server Error):
```
{
  "error": true,
  "message": "Error fetching progress data: <error_message>"
}
```

### k) Add Progress
URL: /progress<br>
Method: POST<br>
Headers: 
```
Authorization: Bearer <JWT_Token>
Content-Type: application/json
```
Request Body:
```
{
  "userId": "string",
  "contentId": "string",
  "feedbackId": "string"
}
```
Response:<br>
Success (201 - Created):
```
{
  "message": "Progress added successfully",
  "progressId": "string"
}
```
Error:<br>
1) (400 - Bad Request):
```
{
  "error": true,
  "message": "All fields are required!"
}
```
2) (404 - Not Found):
```
{
  "error": true,
  "message": "User not found"
}
```
3) (500 - Internal Server Error):
```
{
  "error": true,
  "message": "Error adding progress data"
}
```

### l) Update Progress
URL: /progress/:progressId<br>
Method: PUT<br>
Headers: 
```
Authorization: Bearer <JWT_Token>
Content-Type: application/json
```
Request Body:
```
{
  "feedbackId": "string"
}
```
Response:<br>
Success (200 - OK):
```
{
  "message": "Progress updated successfully",
  "updatedProgress": {
    "id": "string",
    "userId": "string",
    "contentId": "string",
    "feedbackId": "string",
    "timestamp": "timestamp",
    "updatedAt": "timestamp"
  }
}
```
Error:<br>
1) (400 - Bad Request):
```
{
  "error": true,
  "message": "Invalid data"
}
```
2) (404 - Not Found):
```
{
  "error": true,
  "message": "Progress not found"
}
```
3) (500 - Internal Server Error):
```
{
  "error": true,
  "message": "Error updating progress data"
}
```

## 2. Cloud Architecture Design
<img src="Photos/SpeechEase Cloud Architecture.png" width="auto" height="auto" alt="Cloud Architecture" />
The SpeechEase application leverages Google Cloud Platform (GCP) to create a robust and scalable architecture hosted in the asia-southeast2 region. The architecture includes the following components:

- Android Application: Serves as the user interface, interacting with backend services.
- SpeechEase-Backend: Hosted on App Engine, this component acts as the central service layer, handling business logic and communication between other cloud services.
- SpeechEase-ML-Model: Deployed on Cloud Run, it processes speech data using machine learning models to detect and analyze speech patterns.
- Database: Firestore is used as the primary database to store user data, contents, feedbacks, progress tracking in a scalable and serverless manner.
- Cloud Storage: Stores voice, image, and file JSON required for practice section.
This architecture ensures efficient interaction between components while providing scalability, reliability, and low-latency performance.

## 3. Database Design
<img src="Photos/SpeechEase Database Design (Final).png" width="auto" height="auto" alt="Database Design" />
The database design consists of four main tables: User, Content, Progress, and Feedback, with relationships defined among them to track user activities, content details, and feedback.


1) User Table:
- This table stores user information, including userId (primary key), username, email, password, dateOfBirth, and createdAt.
- It uniquely identifies each user and serves as a reference in related tables.
2) Content Table:
- Contains details about content, with contentId as the primary key.
- Attributes include title, contentType, imageUrl, audioGuideUrl, and textPhrase for storing different types of content information.
3) Feedback Table:
- Captures user feedback with feedbackId as the primary key.<br>
- Includes foreign keys (userId and contentId) for identifying which user provided feedback on specific content.
- Additional fields include predictedLabel, predictedScore, starScore, and timeStamp for rating and analysis purposes.
4) Progress Table:
- Tracks the progress of users for specific content, using progressId as the primary key.
- It includes foreign keys (userId, contentId, and feedbackId) linking users, content, and feedback.
- The timeStamp column records the date of progress.

