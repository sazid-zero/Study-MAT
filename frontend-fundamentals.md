---
layout: docs
title: Frontend Fundamentals
permalink: /frontend-fundamentals/
---

# Frontend for Backend Engineers

> "You can't build a great API if you don't know how it's consumed."

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. How the Web Works (The Critical Rendering Path)

When a user types `google.com`:
1.  **DNS Lookup**: Find IP address.
2.  **TCP Handshake**: Connect to server.
3.  **HTTP Request**: GET `/index.html`.
4.  **Parsing**: Browser parses HTML -> DOM Tree. Parsers CSS -> CSSOM Tree.
5.  **Render Tree**: DOM + CSSOM.
6.  **Layout (Reflow)**: Calculate geometry (width/height).
7.  **Paint**: Draw pixels.

---

## 2. Core Concepts

### DOM (Document Object Model)
The tree structure of objects that the browser creates to represent the page.
```javascript
// Manipulating the DOM
const btn = document.getElementById('myBtn');
btn.addEventListener('click', () => {
    document.body.style.backgroundColor = 'red';
});
```

### Event Loop (JavaScript Concurrency)
JS is **single-threaded**. How does it handle async?
1.  **Call Stack**: Sync code.
2.  **Web APIs**: `setTimeout`, `fetch` (Browser handles these).
3.  **Callback Queue**: Completed async tasks wait here.
4.  **Event Loop**: Checks "Is Stack empty? Push Queue to Stack."

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
console.log(3);
// Output: 1, 3, 2
```

---

## 3. CSS Layouts (Flexbox vs Grid)

### Flexbox (1-Dimensional)
Great for rows OR columns (navbars, centering).
```css
.container {
    display: flex;
    justify-content: center; /* Main Axis (Horizontal) */
    align-items: center;     /* Cross Axis (Vertical) */
}
```

### CSS Grid (2-Dimensional)
Great for page layouts (rows AND columns).
```css
.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr; /* 3 columns */
    gap: 10px;
}
```

---

## 4. React.js Crash Course

### Components (Props vs State)
-   **Props**: Read-only arguments passed *down* (Parent -> Child).
-   **State**: Private data managed *within* a component (can change strings).

### Hooks (Functional Components)

**1. useState**: managing state.
```javascript
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**2. useEffect**: Side effects (API calls, subscriptions).
Replaces `componentDidMount`, `componentDidUpdate`.
```javascript
import { useEffect, useState } from 'react';

function User({ id }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [id]); // Re-runs when 'id' changes

    if (!user) return <div>Loading...</div>;
    return <h1>{user.name}</h1>;
}
```

### The Virtual DOM
React keeps a lightweight copy of the DOM. When state changes:
1.  React updates Virtual DOM.
2.  Compares Virtual DOM vs Real DOM (Diffing).
3.  Updates *only* changed elements in Real DOM (Reconciliation).

---

[Back to Top](#frontend-for-backend-engineers) | [Home](/)
