---
layout: docs
title: Real-Time Communication
permalink: /real-time-guide/
---

# Real-Time: WebSockets & Event-Driven Apps

> Build chat apps, live notifications, and multiplayer games. Move beyond the "Request-Response" cycle.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. HTTP vs WebSockets

### HTTP (The Old Way)
-   **Request-Response**: Client asks, Server answers.
-   **Stateless**: Each request is independent.
-   **Polling**: Client asks every second "Any new messages?" (Inefficient).

### WebSockets (The Real-Time Way)
-   **Bi-Directional**: Server can push data to Client.
-   **Persistent Connection**: Connection stays open.
-   **Efficient**: Low latency, low overhead.

---

## 2. Setting up Socket.io (Node.js)

**Socket.io** is the most popular library for real-time web apps. It handles connection fallbacks (if WebSockets aren't supported) and reliability.

### Server Side (`server.js`)

```javascript
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for 'send_message' event
  socket.on('send_message', (data) => {
    // Broadcast message to all connected clients
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server running on 3001');
});
```

### Client Side (React Example)

```javascript
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input placeholder="Message..." onChange={(event) => {
        setMessage(event.target.value);
      }} />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message: {messageReceived}</h1>
    </div>
  );
}
```

---

## 3. WebSockets in Python (FastAPI)

FastAPI has built-in WebSocket support.

```python
from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
```

---

## 4. Advanced Concepts

### Rooms & Namespaces
-   **Namespaces**: Separate endpoints (e.g., `/admin` vs `/user`).
-   **Rooms**: Group users together (e.g., `room_id_123` for a specific chat group).
    ```javascript
    socket.join("room_123");
    io.to("room_123").emit("message", "Hello Room!");
    ```

### Acknowledgements
Verify that a message was received.
```javascript
// Server
socket.on("update", (arg1, callback) => {
  console.log(arg1); // "1"
  callback({
    status: "ok"
  });
});

// Client
socket.emit("update", "1", (response) => {
  console.log(response.status); // "ok"
});
```

### Scaling (Redis Adapter)
If you have multiple servers, a user connected to Server A won't get messages from Server B. 
**Solution**: Use Redis Adapter to pass messages between servers.

---

[Back to Top](#real-time-websockets--event-driven-apps) | [Home](/)
