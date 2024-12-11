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
Headers: 
```
Content-Type: multipart/form-data
```
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
