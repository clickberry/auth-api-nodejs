# auth-api-nodejs
Authentication micro-service on nodejs
# API
## /signup
User registration
### Request
| Param    | Description |
|----------|-------------|
| email    | Email       |
| password | Password    |
### Response
|            |                                                                    |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |
