---
layout: docs
title: Testing Strategies
permalink: /testing-guide/
---

# Testing Strategies: Zero to Hero

> "Code without tests is legacy code." — Michael Feathers. Learn to write bulletproof backend applications.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. Why Test?
-   **Confidence**: Refactor without fear of breaking things.
-   **Documentation**: Tests show exactly how your code is supposed to work.
-   **Bug Prevention**: Catch edge cases before deployment.

### Testing Pyramid
1.  **Unit Tests** (Base): Fast, isolated, test single functions. (70%)
2.  **Integration Tests** (Middle): Test how modules work together (API + DB). (20%)
3.  **E2E Tests** (Top): Test the full user flow/browser. (10%)

---

## 2. Unit Testing (Node.js + Jest)

**Unit Testing** focuses on testing individual components in isolation. Dependencies should be mocked.

### Setup
```bash
npm install --save-dev jest
```

### Example: Testing a Math Function

**math.js**
```javascript
function add(a, b) {
    return a + b;
}
module.exports = { add };
```

**math.test.js**
```javascript
const { add } = require('./math');

test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
});

test('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
});
```

### Mocking Dependencies
If your function calls a database, you don't actually want to hit the DB in a unit test.

**userService.js**
```javascript
const getUser = (id, db) => {
    return db.findUser(id);
};
```

**userService.test.js**
```javascript
test('gets user by id', () => {
    const mockDb = {
        findUser: jest.fn().mockReturnValue({ id: 1, name: 'Alice' })
    };
    
    const user = getUser(1, mockDb);
    expect(user.name).toBe('Alice');
    expect(mockDb.findUser).toHaveBeenCalledWith(1);
});
```

---

## 3. Integration Testing (Node.js + Supertest)

**Integration Testing** verifies that different parts of your application work together. For APIs, this usually means hitting the endpoints and checking the response.

### Setup
```bash
npm install --save-dev supertest
```

### Example: Testing an Express API

**app.test.js**
```javascript
const request = require('supertest');
const app = require('./app'); // Your Express App

describe('GET /api/users', () => {
    it('should return 200 and a list of users', async () => {
        const res = await request(app).get('/api/users');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
```

> **Note**: For integration tests, use a **Test Database** (e.g., SQLite in-memory or a separate Docker container) to avoid messing up production data.

---

## 4. Test-Driven Development (TDD)

TDD is a workflow where you write the test **before** the code.

### The Cycle: Red-Green-Refactor
1.  **Red**: Write a failing test for a new feature.
2.  **Green**: Write just enough code to pass the test.
3.  **Refactor**: Clean up the code while keeping the test passing.

---

## 5. Python Testing (PyTest)

For Python backends (FastAPI/Django), **PyTest** is the industry standard.

### Example
```python
# test_main.py

def add(x, y):
    return x + y

def test_add():
    assert add(1, 2) == 3
```

### Testing FastAPI
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
```

---

[Back to Top](#testing-strategies-zero-to-hero) | [Home](/)
