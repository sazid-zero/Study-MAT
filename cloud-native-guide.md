---
layout: docs
title: Cloud Native & AWS
permalink: /cloud-native-guide/
---

# Cloud Native: Serverless & Microservices

> Stop managing servers. Focus on code. Learn the modern way to deploy applications on AWS.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 1. Cloud Concepts

### What is Cloud Native?
Building applications specifically designed to run in a cloud environment (AWS, Azure, Google Cloud).
-   **Microservices**: Breaking apps into small pieces.
-   **Containers**: Packaging code (Docker).
-   **Serverless**: Running code without provisioning servers.

### IaaS vs PaaS vs SaaS
-   **IaaS (Infrastructure)**: AWS EC2 (Virtual Machines). You manage OS updates.
-   **PaaS (Platform)**: Heroku, AWS Elastic Beanstalk. You manage code, they manage OS.
-   **SaaS (Software)**: Google Docs, Slack. You just use it.

---

## 2. AWS Core Services

### 1. AWS Lambda (Compute)
Run code without thinking about servers. You pay only for the compute time you consume.

**Example: A Simple Lambda Function (Node.js)**
```javascript
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
```

### 2. Amazon S3 (Storage)
**Simple Storage Service**. Object storage for files (images, videos, backups).
-   **Bucket**: Like a folder.
-   **Object**: The file itself.
-   **Infinite Scaling**: Store as much as you want.

### 3. Amazon RDS / DynamoDB (Database)
-   **RDS**: Managed Relational Service (MySQL, Postgres). AWS handles backups and patching.
-   **DynamoDB**: Managed NoSQL Database. Key-Value store. Single-digit millisecond latency.

---

## 3. Serverless Architecture

**The "Modern Stack":**
1.  **Frontend**: React App hosted on **S3** + **CloudFront** (CDN).
2.  **API**: **API Gateway** routes requests to **Lambda**.
3.  **Backend Logic**: **Lambda** functions handle business logic.
4.  **Database**: **DynamoDB** stores data.

**Pros:**
-   **Cost**: Zero cost when idle.
-   **Scale**: Automatically handles 1 request or 1 million requests.
-   **Maintenance**: No OS updates or security patches.

**Cons:**
-   **Cold Starts**: First request might be slow (container spinning up).
-   **Complexity**: Debugging distributed systems is hard.
-   **Vendor Lock-in**: Hard to move from AWS to Azure.

---

## 4. Infrastructure as Code (IaC)

Don't click around in the AWS Console. Define your infrastructure in code.

### Terraform Example
Define an S3 bucket in a `.tf` file:

```hcl
provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name"
  acl    = "private"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
```

Run `terraform apply`, and AWS creates the bucket for you!

---

[Back to Top](#cloud-native-serverless--microservices) | [Home](/)
