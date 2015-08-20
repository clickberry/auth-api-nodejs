# auth-api-nodejs
Authentication micro-service on Node.js.
# API
## POST /signup
User registration.
### Request
| Param    | Description |
|----------|-------------|
| email    | Email       |
| password | Password    |
### Response
|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## POST /signin
User login.
### Request
| Body Param    | Description |
|----------|-------------|
| email    | Email       |
| password | Password    |
### Response
|            |  Value                                                                  |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                               |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## POST /auth/facebook
User login or registration through facebook.
### Response
Facebook redirect to /auth/facebook/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## POST /auth/twitter
User login or registration through twitter.
### Response
Twitter redirect to /auth/twitter/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## POST /auth/google
User login or registration through google.
### Response
Google redirect to /auth/google/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## POST /auth/vk
User login or registration through vk.
### Response
Vk redirect to /auth/vk/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## GET /refresh
Update access & refresh tokens.
### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [refreshToken]" |
### Response
|            |  Value                                                                  |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                               |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## DELETE /signout
User logout.
### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [refreshToken]" |
### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |

## DELETE /signoutall
Delete all sessions for user.
### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [refreshToken]" |
### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |
