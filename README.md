# auth-api-nodejs
Authentication micro-service on nodejs
# API
## POST /signup
User registration
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
User login
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

## GET /refresh
Update access & refresh tokens
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
User logout
### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [refreshToken]" |
### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |

## DELETE /signoutall
Delete all sessions for user
### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [refreshToken]" |
### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |
