---
layout: docs
title: GraphQL vs REST
permalink: /graphql-guide/
---

# GraphQL: Modern API Development

> "Ask for exactly what you need, get exactly that." Move beyond the limitations of REST endpoints.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. GraphQL vs REST

### REST (Representational State Transfer)
-   **Multiple Endpoints**: `/users/1`, `/users/1/posts`, `/posts/5`.
-   **Over-fetching**: Getting more data than you need (e.g., getting the whole User object when you just need the name).
-   **Under-fetching**: Making multiple requests to get related data (N+1 problem).

### GraphQL
-   **Single Endpoint**: Usually `/graphql`.
-   **Client-Driven**: The client specifies the data shape.
-   **Strongly Typed**: Schema serves as contract and documentation.

---

## 2. Core Concepts

### Schema Definition Language (SDL)
The blueprint of your API.

```graphql
type User {
  id: ID!
  name: String!
  email: String
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User!
}
```

### Query
Asking for data.

```graphql
query {
  user(id: "1") {
    name
    posts {
      title
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "name": "Alice",
      "posts": [
        { "title": "Hello World" }
      ]
    }
  }
}
```

### Mutation
Modifying data (Create, Update, Delete).

```graphql
mutation {
  createUser(name: "Bob", email: "bob@example.com") {
    id
    name
  }
}
```

---

## 3. Implementation (Node.js + Apollo Server)

**Apollo Server** is the most popular GraphQL server for Node.js.

### Setup
```bash
npm install apollo-server graphql
```

### Server Code (`index.js`)

```javascript
const { ApolloServer, gql } = require('apollo-server');

// 1. Define Schema
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

// 2. Define Resolvers (How to get the data)
const books = [
  { title: 'The Awakening', author: 'Kate Chopin' },
  { title: 'City of Glass', author: 'Paul Auster' },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

// 3. Create Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

---

## 4. Solving the N+1 Problem

In REST, to get users and their posts, you might:
1.  Fetch all users (1 request).
2.  Loop through users and fetch posts for each (N requests).

In GraphQL, resolvers execute for each field. Naively, this still causes N+1 DB calls.
**Solution**: **DataLoader**. It batches multiple requests into a single DB query.

---

[Back to Top](#graphql-modern-api-development) | [Home](/)
