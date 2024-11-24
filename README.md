# API-SpeechEase

The following APIs are designed for use within the SpeechEase app project. These APIs serve the following functions:
1. Managing user registration and login processes
2. Handling user profile data within the app
3. ...

## 1. List API
### Register API
This API used to create users account

Method: POST
URL: /register
Body Request:  
```
{
  username,  
  email,  
  password  
}
```

Result:
1. Status Code: 201 (Created)
   Response Body:
   ```
   {
     "status": "success",  
     "message": "User successfully created",  
     "error": false  
   }
   ```
   
2. Status Code: 400 (Bad Request)
   Response Body:
   ```
   {
     "status": "fail",  
     "message": "Failed to create new user",  
     "error": true  
   }
   ```

### Login API
This API used to create users account

Method: POST
URL: /login
Body Request:
```
{
  email,
  password
}
```

Result:
1. Status Code: 200 (OK)
   Response Body:
   ```
   {
     "status": "success",
     "message": "{{email}} login success",
     "error": false
     "data": {
       "userId": "User Id",
       "name": "Username",
       "token": "Token"
     }
   }
   ```
   
3. Status Code: 400 (Bad Request)
   Response Body:
   ```
   {
     "status": "fail",
     "message": "Failed to login the app",
     "error": true
   }
   ```

### User Detail API
This API used to create user profile

Method: POST
URL: /add_user
Body Request:
```
{
  email,
  name,
  gender,
  country,
  address,
}
```

Result:
1. Status Code: 201 (Created)
   Response Body:
   ```
   {
     "status": "success",
     "message": "{{name}} data has been created",
     "error": false
   }
   ```
   
3. Status Code: 400 (Bad Request)
   Response Body:
   ```
   {
     "status": "fail",
     "message": "Failed to create user data",
     "error": true
   }
   ```

### User Data API
This API used to get user profile

Method: GET
URL: user_data/{{email}}

Result:
1. Status Code: 200 (OK)
   Response Body:
   ```
   {
     "status": "success",
     "message": "{{email}} found",
     "error": false
     "data":
       {
       "email": "user email",
       "name": "user fullname",
       "gender": "user gender",
       "country": "user country",
       "address": "user address",
      }
   }
   ```
   
3. Status Code: 400 (Bad Request)
   Response Body:
   ```
   {
     "status": "fail",
     "message": "Failed to create user data",
     "error": true
   }
   ```
