# Dockerized Auth API
Authentication micro-service on Node.js.

## Environment Variables
The service should be properly configured with following environment variables.

## Events
The service generates events to the Bus (messaging service) in response to API requests.

## API

### POST /signup
User registration.

#### Request
| Param    | Description |
|----------|-------------|
| email    | Email       |
| password | Password    |

#### Response
| HTTP       |      Value                                                         |
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

## GET /auth/facebook
User login or registration through facebook.

### Response
Facebook redirect to /auth/facebook/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |


## GET /auth/twitter
User login or registration through twitter.

### Response
Twitter redirect to /auth/twitter/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## GET /auth/google
User login or registration through google.

### Response
Google redirect to /auth/google/callback, that return:

|            |      Value                                                              |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## GET /auth/vk
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

## POST /merge
Merge two accaunts.

### Request
| Param    | Description |
|----------|-------------|
| token1    | Access token first account |
| token2 | Access token second account    |

## DELETE /unmerge
Unmerge account.

### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [accessToken]" |

| Param    | Description |
|----------|-------------|
| provider    | Provider name ('facebook', 'google', etc.) |
| id | Id from provider    |
### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |

## GET /profile
Get user info.

### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [accessToken]" |

### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |

Return UserId, email(if exist), list of memberships(if exist).

## DELETE /delete
Delete user.

### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [accessToken]" |

### Response
|            | Value     |
|------------|-----------|
| StatusCode | 200       |

