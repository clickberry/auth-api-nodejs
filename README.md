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
TOKEN_EXCHANGESECRET | RTgd5yeR*** | Exchange token secret.
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
PORT | 8080 | Container port.
ADMIN_EMAIL | email@mail.com | Admin email.
ADMIN_PASSWORD | p@ssword | Admin password.

# Events
The service generates events to the Bus (messaging service) in response to API requests.

## Send events
### Topics
#### account-creates
Creating new account event.
```
{
  id: "56aa4524de9e523c21b4205d",   // User id
  role: "user",                     // User role
  created: "2016-01-28T16:43:16Z",  //Date of user created
  membersip: {
    id: 1232334,                    // Inner provider id or user email
    provider: "vkontakte",          // Provider name
    email: "president@kremlin.com", // User email
    name: "Putin V.V."              // User name 
  }
}
```

#### account-deletes
User deleting account event.
```
{
  id: "56aa4524de9e523c21b4205d"  // User id
}
```

#### account-merges
User merging accounts event.
```
{
  toUserId: "56aa4524de9e523c21b4205d",   // User id merging to
  fromUserId: "56af511dae77431819981ba2"  // User id merging from
}
```

#### account-unmerges
User unmerging event.
```
{
  id: "56aa4524de9e523c21b4205d"  // User id 
  membership: {
    id: 123456,                   // Inner provider id or user email
    provider: "facebook"          // Provider name
  }
}
```

#### account-signins
User login event.
```
{
  {
  id: "56aa4524de9e523c21b4205d",   // User id
  role: "user",                     // User role
  created: "2016-01-28T16:43:16Z",  //Date of user created
  membersip: {
    id: 1232334,                    // Inner provider id or user email
    provider: "vkontakte",          // Provider name
    email: "president@kremlin.com", // User email
    name: "Putin V.V."              // User name 
  }
}
```

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

You should use *withCredentials: true* parameter with your Ajax request to allow browser set cookies.

### Request
| Body Param    | Description | Example | 
|----------|-------------|-------------|
| callbackUri    | Uri for redirect after OAuth signin      | http://yourdomain.com |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |


### GET /facebook
Registers or signs in user via Facebook.

#### Response
Facebook redirects to /facebook/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_token=*yJ0eXAiOiJKV1...***


## GET /twitter
Registers or signs in user via Twitter.

### Response
Twitter redirects to /twitter/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_token=*yJ0eXAiOiJKV1...***


## GET /google
Registers or signs in user via Google.

### Response
Google redirects to /google/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_token=*yJ0eXAiOiJKV1...***


## GET /vk
Registers or signs in user via Vk.

### Response
Vk redirects to /vk/callback, then auth-api redirects to *callbackUri* with query params:

**[*callbackUri*]?refresh_token=*ciOiJIU...*&access_token=*yJ0eXAiOiJKV1...***


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

### Response
| HTTP       | Value     |
|------------|-----------|
| StatusCode | 200       |


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
| Body       | { "id": *user_id*, "email": *user_email*, "memberships": [{id, provider, token, email, name}, ...] } |

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

## POST /exchange
Creates exchange token and set cookies for it.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [refreshToken]" |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Set-Cookie | exchangeTokenCookie=kJ936pY1CqQO2tNpPeRu... |
| Body       | {"exchangeToken": "eyJ0eXAiOiJKV1..."} |


## GET /exchange
Get new access & refresh tokens. Need cookies for verifying request. Clear *exchangeTokenCookie* after success request.

### Request
| Header   | Value |
|----------|-------------|
| Authorization     | "JWT [exchangeToken]" |
| Cookie | exchangeTokenCookie=kJ936pY1CqQO2tNpPeRu... |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                                |
| Body       | {"accessToken": "eyJ0eXAiOiJKV1...", "refreshToken": "ciOiJIU..."} |

# License
Source code is under GNU GPL v3 [license](LICENSE).
