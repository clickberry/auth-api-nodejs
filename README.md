# Dockerized Auth API
Authentication micro-service on Node.js.

* [Architecture](#architecture)
* [Technologies](#technologies)
* [Environment Variables](#environment-variables)
* [Events](#events)
* [Encryption](#encryption)
* [API](#api)
* [License](#license)

# Architecture
The application is a REST API service with database and messaging service (Bus) dependencies.

# Technologies
* Node.js
* MongoDB/Mongoose
* Express.js
* Passport.js
* Official nsqjs driver for NSQ messaging service

# Environment Variables
The service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
HOST_NAME | auth.yourdomain.com | Callback hostname.
HOST_PORT | 80 | Callback host port.
MONGODB_CONNECTION | mongodb://mongo_host:mongo_port/auth | MongoDB connection string.
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
NSQD_ADDRESS | bus.yourdomain.com | A hostname or an IP address of the NSQD running instance.
NSQD_PORT | 4150 | A TCP port number of the NSQD running instance to publish events.




# Events
The service generates events to the Bus (messaging service) in response to API requests.

## Send events

Topic | Message | Description
:-- | :-- | :--
registrations | { id: *user_id*, email: *user_provided_email*, membership: { id: *id*, provider: *facebook*, token: *social_token*, name: *user_name* } } | User social and email registrations.
logins | { id: *user_id*, email: *user_provided_email*, membership: { id: *id*, provider: *facebook*, token: *social_token*, name: *user_name* } } | Social and email/password logins.
account-merges | { id: *user_id*, fromUserId: *from_user_id* } | Account merges.
account-unmerges | { id: *user_id*, provider: *social_provider*, socialId: *social_id* } | Social account deletes.
account-deletes | { id: *user_id* } | Account deletes.


# Encryption
See on [http://passportjs.org](http://passportjs.org)

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


## POST /social
Set cookie with callback uri.

### Request
| Body Param    | Description |
|----------|-------------|
| callbackUri    | Uri for redirect after OAuth signin      |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |


### GET /facebook
Registers or signs in user via Facebook.

#### Response
Facebook redirects to /facebook/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_tokene=*yJ0eXAiOiJKV1...***


## GET /twitter
Registers or signs in user via Twitter.

### Response
Twitter redirects to /twitter/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_tokene=*yJ0eXAiOiJKV1...***


## GET /google
Registers or signs in user via Google.

### Response
Google redirects to /google/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_tokene=*yJ0eXAiOiJKV1...***


## GET /vk
Registers or signs in user via Vk.

### Response
Vk redirects to /vk/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_tokene=*yJ0eXAiOiJKV1...***


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
Signs out current user.

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

## GET /account
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

## DELETE /account
Deletes user account.

### Request
| Header   | Value |
|----------|-------------|
| authorization     | "JWT [accessToken]" |

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |

# License
Source code is under GNU GPL v3 [license](LICENSE).
