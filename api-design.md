---
layout: docs
title: API Design & Development
permalink: /api-design/
---

# API Design & Development: 0 to 100

> A comprehensive guide to understanding, designing, and building APIs, from basic concepts to a full-scale Spotify-like system.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. Fundamentals

### What is an API?
**API (Application Programming Interface)** is a set of rules that allows different software entities to communicate with each other. It acts as a contract between a **Client** (who requests data) and a **Server** (who provides data).

### Client-Server Architecture
- **Client**: The frontend (Browser, Mobile App) or another service holding the interface.
- **Server**: The backend system that processes requests, talks to the database, and sends responses.
- **Database**: Stores the persistent data (Users, Songs, Playlists).

### HTTP Basics
APIs typically operate over **HTTP (Hypertext Transfer Protocol)**. 
- **Request**: Sent by the client (contains Method, URL, Headers, Body).
- **Response**: Sent by the server (contains Status Code, Headers, Body).

#### Common HTTP Methods

| Method | Description | Safe? | Idempotent? |
| :--- | :--- | :--- | :--- |
| **GET** | Retrieve a resource. Should not modify data. | ✅ | ✅ |
| **POST** | Create a new resource. | ❌ | ❌ |
| **PUT** | Update/Replace an existing resource entirely. | ❌ | ✅ |
| **PATCH** | Partially update a resource. | ❌ | ❌ |
| **DELETE** | Remove a resource. | ❌ | ✅ |

#### HTTP Status Codes (The "Traffic Lights")
- **2xx Success**: 
  - `200 OK`: Standard success.
  - `201 Created`: Resource created successfully.
- **3xx Redirection**:
  - `301 Moved Permanently`: Resource has a new URL.
- **4xx Client Error**:
  - `400 Bad Request`: Invalid input.
  - `401 Unauthorized`: Authentication required.
  - `403 Forbidden`: Authenticated, but no permission.
  - `404 Not Found`: Resource doesn't exist.
- **5xx Server Error**:
  - `500 Internal Server Error`: The server crashed or failed.

---

## 2. REST Architecture

**REST (Representational State Transfer)** is the most popular architectural style for web APIs.

### Key Principles
1.  **Stateless**: The server doesn't "remember" the client state between requests. Every request must contain all necessary info (e.g., auth tokens).
2.  **Resource-Based**: Everything is a "Resource" identified by a URI (Uniform Resource Identifier).
3.  **Uniform Interface**: Consistent usage of HTTP methods (GET for reading, POST for creating).

### Naming Conventions (Best Practices)
- Use **Nouns**, not Verbs.
- Use **Plurals** for collections.
- Use **Lower-case** with hyphens for readability.

**✅ Good:**
- `GET /users` (Get all users)
- `GET /users/123` (Get user with ID 123)
- `POST /songs` (Add a new song)
- `DELETE /playlists/456` (Delete playlist 456)

**❌ Bad:**
- `GET /getUsers` (RPC style, avoid)
- `POST /createSong` (Verbs are redundant with HTTP methods)
- `GET /users/123/songs` (Good: Sub-resources)

---

## 3. Implementation: Building a Simple API

We'll use **Node.js** and **Express** due to their simplicity and popularity.

### Setup
1.  Initialize project: `npm init -y`
2.  Install Express: `npm install express`

### Basic Server Code (`server.js`)
```javascript
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// 1. GET Request
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

---

## 4. Case Study: Spotify Clone API

Let's design a backend for a streaming service.

### Requirements
1.  **Browse Music**: songs, albums, artists.
2.  **Manage Playlists**: create playlists, add/remove songs.
3.  **User Profiles**: follow artists, like songs.

### Data Model (JSON Structure)

**Song Resource**
```json
{
  "id": "s101",
  "title": "Bohemian Rhapsody",
  "artist_id": "a001",
  "album_id": "al01",
  "duration_ms": 354000,
  "streams": 1500000000
}
```

**Playlist Resource**
```json
{
  "id": "p505",
  "name": "Rock Classics",
  "owner_id": "u99",
  "tracks": ["s101", "s102", "s105"],
  "is_private": false
}
```

### Endpoints Design

#### 1. Songs & Albums
- `GET /songs` -> List songs (supports pagination/search like `?q=queen`).
- `GET /songs/:id` -> Get details for a song.
- `GET /artists/:id/albums` -> Get albums by an artist.

#### 2. User Actions
- `POST /users/:id/likes` -> Like a song (Body: `{ "song_id": "s101" }`).
- `DELETE /users/:id/likes/:song_id` -> Unlike a song.

#### 3. Playlists (Complex Logic)
- `POST /playlists` -> Create new playlist.
- `GET /playlists/:id` -> View playlist.
- `POST /playlists/:id/tracks` -> Add song to playlist.
  - **Check**: Does playlist exist? Is user the owner? Does song exist?
- `DELETE /playlists/:id/tracks/:song_id` -> Remove song.

### Implementation Snippet

**Adding a Song to a Playlist**
```javascript
// Mock Database
const playlists = [
    { id: 'p1', name: 'My Jams', tracks: [] }
];

app.post('/playlists/:id/tracks', (req, res) => {
    const { id } = req.params;
    const { song_id } = req.body;

    // 1. Find Playlist
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    // 2. Add Song (Validation logic skipped for brevity)
    playlist.tracks.push(song_id);

    // 3. respond
    res.status(201).json({ 
        message: 'Track added successfully', 
        playlist: playlist 
    });
});
```

---

## 5. Advanced Topics

### Authentication vs Authorization
- **Authentication (AuthN)**: *Who are you?* (e.g., Login with Email/Password -> Receive JWT).
- **Authorization (AuthZ)**: *What can you do?* (e.g., Admin vs User).

### Status Codes for Auth
- **401 Unauthorized**: "I don't know who you are." (Missing/Invalid Token).
- **403 Forbidden**: "I know who you are, but you can't do this." (Scope mismatch).

### Pagination
Crucial for endpoints returning lists (like `/songs`).
- **Limit/Offset**: `GET /songs?limit=20&offset=0`
- **Cursor-based**: `GET /songs?limit=20&after_id=s100` (Better for infinite scroll).

### Rate Limiting
Prevent abuse by limiting requests per IP/User (e.g., 100 req/min). Returns `429 Too Many Requests`.

---

[Back to Top](#api-design--development-0-to-100) | [Home](/)
