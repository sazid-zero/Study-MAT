---
layout: docs
title: DevOps Basics
permalink: /devops/
---

# DevOps: Docker, CI/CD & Deployment

> Bridge the gap between coding and operations. Learn to containerize applications, automate workflows with GitHub Actions, and deploy to the cloud.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. Docker (Containerization)

**Docker** packages your application and its dependencies into a "container" that runs consistently on any environment (Dev, Stage, Prod).

### Key Concepts
- **Image**: The blueprint/template (read-only). Built from a `Dockerfile`.
- **Container**: A running instance of an Image.
- **Dockerfile**: A script containing instructions to build the image.

### Hands-on: Dockerizing a Node.js App

1.  **Create `Dockerfile`** in your project root:
    ```dockerfile
    # Base Image
    FROM node:18-alpine

    # Work Directory
    WORKDIR /app

    # Copy package.json and install dependencies
    COPY package*.json ./
    RUN npm install

    # Copy source code
    COPY . .

    # Expose port
    EXPOSE 3000

    # Start command
    CMD ["npm", "start"]
    ```

2.  **Build the Image**:
    ```bash
    docker build -t my-node-app .
    ```

3.  **Run the Container**:
    ```bash
    docker run -p 3000:3000 my-node-app
    ```

### Docker Compose
Manages multi-container applications (e.g., App + Database). defined in `docker-compose.yml`.

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  redis:
    image: "redis:alpine"
```

---

## 2. CI/CD with GitHub Actions

**Continuous Integration (CI)**: Automatically building and testing code changes.
**Continuous Deployment (CD)**: Automatically releasing code to production.

### Setting up a Workflow
Create `.github/workflows/main.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'

    - name: Install dependencies
      run: npm install

    - name: Run Tests
      run: npm test

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to Production
        run: echo "Simulating deployment to AWS/Heroku..."
        # Add actual deployment scripts here (e.g., AWS CLI, Heroku CLI)
```

**What this does:**
1.  Triggers on push to `main`.
2.  Spins up a Linux VM.
3.  Installs Node & deps.
4.  Runs tests.
5.  If tests pass -> Deploys!

---

## 3. Deployment Strategies

### 1. Traditional VPS (Virtual Private Server)
- **Providers**: DigitalOcean, Linode, AWS EC2.
- **Process**: SSH into server, pull git repo, run `npm start` (usually with PM2 process manager).
- **Pros**: Full control, cheap.
- **Cons**: Manual maintenance (updates, security patches).

### 2. PaaS (Platform as a Service)
- **Providers**: Heroku, Render, Railway, Fly.io.
- **Process**: Push to Git -> Magic happens.
- **Pros**: Zero config, auto-scaling, easy HTTPS.
- **Cons**: More expensive at scale.

### 3. Serverless
- **Providers**: AWS Lambda, Vercel Functions, Cloudflare Workers.
- **Process**: Upload just the function code.
- **Pros**: Pay-per-use, infinite scaling.
- **Cons**: Cold starts, stateless limitations.

---

[Back to Top](#devops-docker-cicd--deployment) | [Home](/)
