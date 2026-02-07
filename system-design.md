---
layout: docs
title: System Design Guide
permalink: /system-design/
---

# System Design: The Complete Guide

> Master scalability, distributed systems, and architectural patterns. Essential for senior engineering interviews and building real-world applications.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. Core Concepts

### Scalability
The ability of a system to handle growing amounts of work.

#### Vertical Scaling (Scale Up)
- **Concept**: Add more power (CPU, RAM) to your existing server.
- **Pros**: Simple, no code changes required.
- **Cons**: Hardware limits, expensive, single point of failure.

#### Horizontal Scaling (Scale Out)
- **Concept**: Add more servers to the pool.
- **Pros**: Infinite scaling (theoretically), cheaper commodity hardware, redundancy.
- **Cons**: Complex complexity (requires Load Balancing, data consistency issues).

### Load Balancing
Distributes incoming network traffic across multiple servers.
- **Algorithms**: Round Robin, Least Connections, IP Hash.
- **Tools**: Nginx, HAProxy, AWS ELB.

### Caching
Storing copies of data in a temporary storage location for faster access.
- **Client-Side**: Browser cache, HTTP headers (`Cache-Control`).
- **CDN (Content Delivery Network)**: Caches static assets (images, CSS) closer to the user (e.g., Cloudflare).
- **Server-Side**: Redis, Memcached.
  - **Write-Through**: Write to DB and Cache simultaneously. (Slow writes, fast reads).
  - **Write-Back**: Write to Cache first, then DB async. (Fast writes, risk of data loss).

---

## 2. Database Strategies

### SQL vs NoSQL

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
| :--- | :--- | :--- |
| **Structure** | Tables, Rows, Fixed Schema | Documents, Key-Value, Flexible |
| **ACID** | Strict compliance (Safe) | Often BASE (Eventual Consistency) |
| **Scaling** | Vertical (mostly) | Horizontal (Built-in) |
| **Examples** | PostgreSQL, MySQL | MongoDB, Cassandra, Redis |

### Sharding (Data Partitioning)
Splitting a large database into smaller, faster, more manageable parts called shards.
- **Key Based**: `hash(user_id) % num_servers`.

### Replication
- **Master-Slave**: Master handles writes, Slaves handle reads.
- **Master-Master**: All nodes handle both (complex conflict resolution).

### CAP Theorem
In a distributed data store, you can only guarantee **two** of these three:
1.  **Consistency**: Every read receives the most recent write or an error.
2.  **Availability**: Every request receives a (non-error) response, without the guarantee that it contains the most recent write.
3.  **Partition Tolerance**: The system continues to operate despite an arbitrary number of messages being dropped/delayed by the network between nodes.

> **P** is mandatory in distributed systems. You choose **CP** (Consistency) or **AP** (Availability).

---

## 3. Microservices vs Monolith

### Monolith
- All code in one codebase, deployed together.
- **Pros**: Simple to develop/test/deploy initially.
- **Cons**: Hard to scale specific parts, tightly coupled, strict tech stack.

### Microservices
- Small, independent services communicating via APIs.
- **Pros**: Scale independently, mix tech stacks, fault isolation.
- **Cons**: Distributed complexity, network latency, difficult debugging.

**Communication Protocols**:
- **REST**: Standard HTTP (Text/JSON). Good for external APIs.
- **gRPC**: Protobuf (Binary). Fast, suited for internal service-to-service.
- **Message Queues**: RabbitMQ, Kafka. Async communication.

---

## 4. Case Study: Design a URL Shortener (TinyURL)

**Goal**: Convert `https://www.very-long.com/article/123` to `http://tiny.url/xyz`.

### Requirements
1.  **Functional**: Shorten URL, Redirect to original.
2.  **Non-Functional**: Highly available, low latency, unique aliases.

### Capacity Estimation
- **Traffic**: 10M new URLs/month.
- **Read/Write Ratio**: 10:1 (Read heavy).

### High-Level Design
1.  **User** sends long URL -> **API Server**.
2.  **Server** generates hash -> Stores in **DB** -> Returns short URL.
3.  **User** accesses short URL -> **Server** looks up DB -> Redirects (301).

### Database Schema
- **Table**: `Urls`
  - `id`: Primary Key (Auto-inc)
  - `short_code`: String (Unique Index)
  - `long_url`: String
  - `created_at`: Timestamp

### Hashing Strategy (The "Secret Sauce")
How to generate `xyz`?
1.  **Base62 Encoding**: `[a-z, A-Z, 0-9]`.
2.  **Counter Approach**: Use a distributed ID generator (like Twitter Snowflake) to get a unique number, then Base62 encode it.

   - ID `10,000,000` -> Base62 -> `7Mq`
   - No collisions guaranteed.

### Scaling it Up
1.  **Cache**: Store `short_code -> long_url` in **Redis**. 90% of traffic handled here.
2.  **Load Balancer**: Distribute API requests.
3.  **Database**: Shard based on the first character of the hash? Or use NoSQL (Cassandra) for massive write scale.

---

[Back to Top](#system-design-the-complete-guide) | [Home](/)

---

## Junior System Design Cheat Sheet

### Key Concepts

1.  **Client-Server Architecture**
    -   **Request/Response**: Browser sends HTTP Request, Server processes and sends HTTP Response.
    -   **State**: HTTP is stateless. Use Cookies/Sessions/Tokens (JWT) to maintain state.

2.  **Databases (SQL vs NoSQL)**
    -   **SQL (Relational)**: Structured, tables, ACID (Atomicity, Consistency, Isolation, Durability). Good for financial data.
    -   **NoSQL (Non-Relational)**: Flexible, JSON-like, BASE (Basically Available, Soft state, Eventual consistency). Good for big data, real-time analytics.

3.  **Caching (Speed Layer)**
    -   **Why?**: Database calls are slow (disk I/O). Memory is fast.
    -   **Where?**: Browser Cache, CDN (Content Delivery Network), Server Cache (Redis/Memcached).
    -   **Invalidation**: Hard problem. TTL (Time To Live), Write-Through, Write-Back.

4.  **Load Balancing**
    -   Distributes traffic across multiple servers.
    -   **Algorithms**: Round Robin, Least Connections, IP Hash.
    -   **Health Checks**: Removes dead servers from rotation.

### Sample Question: Design a URL Shortener (TinyURL)

**1. Requirements**
-   **Functional**: Given a long URL, return a unique short URL. Clicking short URL redirects to long URL.
-   **Non-Functional**: High availability, low latency, scalable.

**2. API Design**
-   `POST /api/v1/urls`
    -   Request: `{ "longUrl": "https://google.com" }`
    -   Response: `{ "shortUrl": "http://tiny.url/abc12" }`
-   `GET /{shortCode}`
    -   Redirect (301 Permanent or 302 Temporary) to original URL.

**3. Database Schema**
-   Table `Urls`:
    -   `id`: Primary Key (Auto-increment)
    -   `shortCode`: String (Unique Index)
    -   `longUrl`: String
    -   `createdAt`: Timestamp

**4. Algorithm (Generating Short Code)**
-   **Base62 Encoding**: Use characters [a-z, A-Z, 0-9] (26+26+10 = 62).
-   Map the database ID to Base62.
    -   ID `125` -> `cb`
    -   ID `1000000000` -> `15FTGg`
-   **Collision**: Guaranteed unique because ID is unique.

**5. Scale**
-   **Cache**: Store popular `shortCode -> longUrl` mappings in Redis.
-   **Load Balancer**: Distribute requests.
-   **Database Sharding**: Split by ID range or hash of shortCode.

---

[Back to Top](#system-design-the-complete-guide) | [Home](/)
