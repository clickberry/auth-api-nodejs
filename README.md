# Dockerized Auth API
Authentication micro-service on Node.js.

* [Environment Variables](#environment-variables)
* [Events](#events)
* [API](#api)

# Environment Variables
The service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
HOSTNAME | auth.clbr.ws | Callback hostname.
HOSTPORT | 80 | Callback host port.
MONGODB_CONNECTION | mongodb://mongo_host:mongo_port/mongo_db_name | MongoDB connection string.
TOKEN_ACCESSSECRET | MDdDRDhBOD*** | Access token secret.
TOKEN_REFRESHSECRET | NUQzNTYwND*** | Refresh token secret.
TWITTER_CONSUMERKEY | YOUGHA9Fk5*** | Twitter consumer key.
TWITTER_CONSUMERSECRET | XSAxmecNLh*** | Twitter consumer secret.
GOOGLE_CLIENTID | 1856830825*** | Google client id.
GOOGLE_CLIENTSECRET | KhFDFfy91k*** | Google client secret.
VK_CLIENTID | 503*** | VK client id.
VK_CLIENTSECRET | XIYUHNUZXX*** | VK client secret.
FACEBOOK_CLIENTID | 9357215664*** | Facebook client id.
FACEBOOK_CLIENTSECRET | 0dd6dd8d74*** | Facebook client secret.




# Events
The service generates events to the Bus (messaging service) in response to API requests.

# API

## POST /signup
Registers user by email.

### Request
| Param    | Description |
|----------|-------------|
| email    | Email       |
| password | Password    |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |


## POST /signin
Signs in user by email.

### Request
| Body Param    | Description |
|----------|-------------|
| email    | Email       |
| password | Password    |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |



### GET /auth/facebook
Registers or signs in user via Facebook.

#### Response
Facebook redirects to /auth/facebook/callback, that returns:

| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |


## GET /auth/twitter
Registers or signs in user via Twitter.

### Response
Twitter redirects to /auth/twitter/callback, that returns:

| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## GET /auth/google
Registers or signs in user via Google.

### Response
Google redirects to /auth/google/callback, that returns:

| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## GET /auth/vk
Registers or signs in user via Vk.

### Response
Vk redirects to /auth/vk/callback, that returns:

| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## GET /refresh
Updates access & refresh tokens.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [refreshToken]" |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

## DELETE /signout
Sign outs current user.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [refreshToken]" |

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |

## DELETE /signoutall
Deletes all sessions for current user.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [refreshToken]" |

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |

## POST /merge
Merges two accaunts.

### Request
| Param    | Description |
|----------|-------------|
| token1   | Access token first account |
| token2   | Access token second account |

## DELETE /unmerge
Unmerges social account.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |

| Param    | Description |
|----------|-------------|
| provider    | Provider name ('facebook', 'google', etc.) |
| id | Id from provider    |

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |

## GET /profile
Gets user info.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |
| Body       | { "id": *user_id*, "email": *user_email*, "memberships": [] } |

## DELETE /delete
Deletes user account.

### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [accessToken]" |

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |

