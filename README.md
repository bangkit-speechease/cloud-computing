# API-SpeechEase

The following APIs are designed for use within the SpeechEase app project. These APIs serve the following functions:
1. Managing user registration, login, and logout processes.
2. Handling user profile data within the app (retrieval, update, deletion).
3. Providing access to and managing exercise content data.
4. Processing user feedback via audio submissions to an ML model.

## 1. List API

### Register User
URL: /register
Method: POST
Request Body:  
```
{
  "name": "string",
  "email": "string (must be unique and valid email format)",
  "password": "string (minimum 6 characters)"
}
```
Response: 
Success (201 - Created):
```
{
  "error": false,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
  }
}
```
Error:
(400 - Bad Request)
```
{
  "error": true,
  "message": "Invalid email format.",
  "details": null
}
```

### Login User
URL: /login
Method: POST
Request Body:
```
{
  "token": "string (Firebase ID Token)"
}
```
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "User successfully logged in!",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```
Error:
(401 - Unauthorized)
```
{
  "error": true,
  "message": "Invalid or expired token.",
}
```

### Logout User
URL: /logout
Method: POST
Headers:
```
Authorization: Bearer <token>
```
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "User successfully logged out."
}
```
Error:
(401 Unauthorized)
```
{
  "error": true,
  "message": "Invalid or missing authorization token.",
}
```

### Get Specific User Data
URL: /user/:userId
Method: GET
Parameters: userId (path parameter, string, required)
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "User data retrieved successfully.",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
  }
}
```
Error:
(404 - Not Found)
```
{
  "error": true,
  "message": "User not found!",
}
```

### Update Specific User Data
URL: /update/:userId
Method: PUT
Parameters: userId (path parameter, string, required)
Request Body:
```
{
  "name": "string (new name of the user)"
}

```
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "User data successfully updated.",
  "data": {
    "userId": "string",
    "name": "string",
  }
}
```
Error:
(400 - Bad Request)
```
{
  "error": true,
  "message": "Invalid input data.",
}
```

(404 - Not Found)
```
{
  "error": true,
  "message": "User not found!",
}
```

### Delete Specific User Data
URL: /delete/:userId
Method: DELETE
Parameters: userId (path parameter, string, required)
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "User successfully deleted!"
}
```
Error:
(404 - Not Found):
```
{
  "error": true,
  "message": "User not found!"
}
```

### Get List of Exercise Content
URL: /content
Method: GET
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "Content list retrieved successfully.",
  "data": [
    {
      "documentId": "string",
      "title": "string",
      "description": "string",
      "contentType": "string",
      "imageUrl": "string",
      "textPhrase": "string",
      "audioGuideUrl": "string",
      "recordInstructionEndpoint": "string"
    }
  ]
}
```
or
```
{
  "error": false,
  "message": "No content found!"
}
```
Error:
(500 - Internal Server Error):
```
{
  "error": true,
  "message": "Failed to retrieve content list.",
}
```

### Get Details of Specific Exercise Content
URL: /content/:id
Method: GET
Parameters: id: Path parameter (string, required)
Headers: None
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "Content details retrieved successfully.",
  "data": [
    {
      "documentId": "string",
      "title": "string",
      "description": "string",
      "contentType": "string",
      "imageUrl": "string",
      "textPhrase": "string",
      "audioGuideUrl": "string",
      "recordInstructionEndpoint": "string"
    }
  ]
}
```
Error:
(400 - Bad Request):
```
{
  "error": true,
  "message": "Content ID is required!",
}
```
(404 - Not Found):
```
{
  "error": false,
  "message": "Content not found!"
}
```

### Submit Audio Feedback
URL: /feedback
Method: POST
Headers: Content-Type: multipart/form-data
Request Body (file: Binary data of the audio file required)
```
{
  "file": "<binary_audio_file>"
}
```
Response:
Success (200 - OK):
```
{
  "error": false,
  "message": "Audio processed successfully!",
  "data": {
    "prediction_score": "number (confidence score of the ML prediction)",
    "predicted_label": "string (classification result)"
  }
}
```
Error:
(400 - Bad Request):
```
{
  "error": true,
  "message": "No file uploaded",
}
```
(500 - Internal Server Error):
```
{
  "error": false,
  "message": "Error processing audio. Please try again.",
}
```
