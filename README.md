# API-SpeechEase

The following APIs are designed for use within the SpeechEase app project. These APIs serve the following functions:
1. Managing user registration, login, and logout processes.
2. Handling user profile data within the app (retrieval, update, deletion).
3. Providing access to and managing exercise content data.
4. Processing user feedback via audio submissions to an ML model.

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
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string"
  }
}
```
Error:<br>
(400 - Bad Request)
```
{
  "error": true,
  "message": "Invalid email format."
}
```

### b) Login User
URL: /login<br>
Method: POST<br>
Request Body:
```
{
  "token": "string (Firebase ID Token)"
}
```
Response:<br>
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
Error:<br>
(401 - Unauthorized)
```
{
  "error": true,
  "message": "Invalid or expired token."
}
```

### c) Logout User
URL: /logout<br>
Method: POST<br>
Headers:
```
Authorization: Bearer <token>
```
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "User successfully logged out."
}
```
Error:<br>
(401 Unauthorized)
```
{
  "error": true,
  "message": "Invalid or missing authorization token."
```

### d) Get Specific User Data
URL: /user/:userId<br>
Method: GET<br>
Parameters: userId (path parameter, string, required)<br>
Response:<br>
Success (200 - OK):
```
{
  "error": false,
  "message": "User data retrieved successfully.",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string"
  }
}
```
Error:<br>
(404 - Not Found)
```
{
  "error": true,
  "message": "User not found!"
}
```

### e) Update Specific User Data
URL: /update/:userId<br>
Method: PUT<br>
Parameters: userId (path parameter, string, required)<br>
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
  "message": "User data successfully updated.",
  "data": {
    "userId": "string",
    "name": "string"
  }
}
```
Error:<br>
(400 - Bad Request)
```
{
  "error": true,
  "message": "Invalid input data."
}
```

(404 - Not Found)
```
{
  "error": true,
  "message": "User not found!"
}
```

### f) Delete Specific User Data
URL: /delete/:userId<br>
Method: DELETE<br>
Parameters: userId (path parameter, string, required)<br>
Response:<br>
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

### g) Get List of Exercise Content
URL: /content<br>
Method: GET<br>
Response:<br>
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
Error:<br>
(500 - Internal Server Error):
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
Response:<br>
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
Error:<br>
(400 - Bad Request):
```
{
  "error": true,
  "message": "Content ID is required!"
}
```
(404 - Not Found):
```
{
  "error": false,
  "message": "Content not found!"
}
```

### i) Submit Audio Feedback
URL: /feedback<br>
Method: POST<br>
Headers: Content-Type: multipart/form-data<br>
Request Body (file: Binary data of the audio file required)
```
{
  "file": "<binary_audio_file>"
}
```
Response:<br>
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
Error:<br>
(400 - Bad Request):
```
{
  "error": true,
  "message": "No file uploaded"
}
```
(500 - Internal Server Error):
```
{
  "error": false,
  "message": "Error processing audio. Please try again."
}
```
