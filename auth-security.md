---
layout: docs
title: Authentication & Security
permalink: /auth-security/
---

# Authentication & Application Security

> Secure your applications properly. Learn the difference between AuthN and AuthZ, implement JWTs, understand OAuth 2.0, and lock down your APIs.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. AuthN vs AuthZ

### Authentication (AuthN)
**"Who are you?"**
- Verifying the identity of a user (e.g., Login with Email/Password).
- **Factors**: Something you know (Password), have (Phone), or are (Biometric).

### Authorization (AuthZ)
**"What can you do?"**
- Verifying if the authenticated user has permission to access a specific resource.
- **Roles**: Admin, Editor, Viewer.

---

## 2. Session vs Token (JWT)

### Session-Based Auth (Stateful)
1.  User logs in.
2.  Server creates a session, stores it in memory/DB, and sends a `Session-ID` cookie to client.
3.  Client sends cookie with every request.
4.  Server checks if Session ID is valid in its store.

- **Pros**: Easy revocation (just delete session).
- **Cons**: Harder to scale (sticky sessions or shared Redis needed).

### Token-Based Auth (Stateless - JWT)
**JSON Web Token (JWT)** is a compact URL-safe means of representing claims to be transferred between two parties.
1.  User logs in.
2.  Server signs a JSON object (Payload) with a secret key -> Token.
3.  Server sends Token to client.
4.  Client stores token (LocalStorage/Cookie) and sends it in `Authorization` header.
5.  Server verifies signature (Math!) -> **No DB lookup needed**.

- **Pros**: Scalable, mobile-friendly.
- **Cons**: Hard to revoke (blacklist/expiry needed).

#### JWT Structure
- **Header**: Algorithm & Type (`{"alg": "HS256", "typ": "JWT"}`)
- **Payload**: Data (`{"userId": "123", "role": "admin"}`)
- **Signature**: `HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`

> **Security Tip**: Never put sensitive data (passwords) in the Payload! It's just base64 encoded, anyone can decode it.

---

## 3. OAuth 2.0

Standard protocol for authorization. It allows a user to grant a third-party application access to their resources without sharing their password.

### The Flow (Authorization Code)
1.  **User** clicks "Login with Google".
2.  **App** redirects User to Google's Authorization Server.
3.  **User** grants permission.
4.  **Google** redirects back to App with a temporary **Code**.
5.  **App** exchanges Code for an **Access Token** (back-channel).
6.  **App** uses Access Token to fetch User Profile.

### Roles
- **Resource Owner**: The User.
- **Client**: Your App.
- **Authorization Server**: Google/GitHub/Facebook.
- **Resource Server**: The API hosting user data (Google Drive, etc).

---

## 4. Security Checklist

### 1. HTTPS (Transport Layer Security)
- **Problem**: HTTP sends data in plain text. Passwords can be sniffed on Wi-Fi.
- **Solution**: Encrypt traffic using SSL/TLS certificates (Let's Encrypt). Non-negotiable for Auth.

### 2. CORS (Cross-Origin Resource Sharing)
- **Problem**: A malicious site (`evil.com`) tries to make an AJAX request to your API (`api.yoursite.com`).
- **Solution**: Configure CORS headers on your server to only allow trusted domains.
  ```javascript
  // Express Example
  const cors = require('cors');
  app.use(cors({ origin: 'https://mysite.com' }));
  ```

### 3. CSRF (Cross-Site Request Forgery)
- **Problem**: `evil.com` has a hidden form that submits a request to `bank.com/transfer` using your existing session cookie.
- **Solution**: Use **CSRF Tokens** (random strings) that must be included in request bodies, or use `SameSite` cookies.

### 4. XSS (Cross-Site Scripting)
- **Problem**: Preventing malicious scripts from running in a victim's browser.
- **Solution**: Sanitize all user input. Escape HTML characters. Use Content Security Policy (CSP) headers.

### 5. SQL Injection
- **Problem**: `SELECT * FROM users WHERE name = 'user' OR '1'='1';`
- **Solution**: Use Parameterized Queries or an ORM/ODM (Sequelize, Mongoose) which handles escaping automatically.

---

[Back to Top](#authentication--application-security) | [Home](/)
