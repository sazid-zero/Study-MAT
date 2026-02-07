---
layout: docs
title: Backend Languages Guide
permalink: /backend-languages/
---

# Backend Development: Language & Frameworks

> A deep dive into the two most popular modern backend stacks: **Node.js with Express** and **Python with FastAPI**.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. Node.js & Express

**Node.js** is a runtime that lets you execute JavaScript on the server. **Express** is the de-facto standard framework for Node.js.

### Why Node.js?
- **Non-blocking I/O**: Great for high concurrency (chat apps, streaming).
- **Single Language**: Use JS/TS on both Frontend and Backend.
- **Huge Ecosystem**: npm has a package for everything.

### Quick Start Guide

#### 1. Setup
```bash
mkdir my-express-app
cd my-express-app
npm init -y
npm install express
```

#### 2. The "Hello World" Server
Create `index.js`:
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON body

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.post('/echo', (req, res) => {
  res.json({ message: 'You sent:', data: req.body });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

#### 3. Folder Structure (MVC Pattern)
For larger apps, organize your code:
```text
/src
  /controllers (Logic)
  /models      (Database Schemas)
  /routes      (API Endpoints)
  /middleware  (Auth, Logging)
  app.js       (Entry Point)
```

---

## 2. Python & FastAPI

**FastAPI** is a modern, high-performance web framework for building APIs with Python 3.6+ based on standard Python type hints.

### Why FastAPI?
- **Speed**: On par with Node.js and Go.
- **Developer Experience**: Great editor support, autocompletion.
- **Automatic Docs**: Generates Swagger UI (`/docs`) out of the box.
- **Async Support**: Native `async`/`await` support.

### Quick Start Guide

#### 1. Setup
```bash
pip install fastapi uvicorn
```

#### 2. The "Hello World" Server
Create `main.py`:
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/")
def read_root():
    return {"Hello": "FastAPI"}

@app.post("/items/")
async def create_item(item: Item):
    return {"name": item.name, "price": item.price, "tax": item.price * 0.1}

# Run with: uvicorn main:app --reload
```

#### 3. Automatic Documentation
Visit `http://localhost:8000/docs` to see the interactive Swagger UI.

---

## 3. Choosing Your Stack

| Feature | Node.js (Express) | Python (FastAPI) |
| :--- | :--- | :--- |
| **Performance** | High (Event Loop) | High (Starlette/Pydantic) |
| **Learning Curve** | Low (if you know JS) | Low (Python is readable) |
| **Use Case** | Real-time apps, Single Page Apps, MERN Stack | Data Science, ML integration, Microservices |
| **Typing** | Dynamic (TypeScript optional) | Strong (Type Hints) |
| **Blocking** | Good for I/O bound | Good for CPU bound (with multiprocessing) |

### Conclusion
- Choose **Node.js** if you are a frontend developer moved to fullstack, or building real-time apps.
- Choose **Python/FastAPI** if you are into Data Science, AI, or prefer clean, strictly typed code and auto-generated documentation.

---

[Back to Top](#backend-development-language--frameworks) | [Home](/)
