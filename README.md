Here’s the updated `README.md` file tailored to your GitHub repository and `.env` file configuration:

---

# Node.js Order Processing System

This is a **Node.js** application for an **Order Processing System**. It includes features like user authentication, order management, inventory validation, asynchronous order processing with AWS SQS, caching with Redis, and email notifications with AWS SES.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Postman Collection](#postman-collection)
7. [Environment Variables](#environment-variables)
8. [Contributing](#contributing)

---

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens.
- **Order Management**: Create and retrieve orders with inventory validation.
- **Inventory Management**: Manage product stock levels.
- **Asynchronous Processing**: Orders are processed asynchronously using AWS SQS.
- **Caching**: Order details are cached in Redis for quick retrieval.
- **Email Notifications**: Send email notifications using AWS SES when an order is processed.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or remotely)
- [Redis](https://redis.io/) (running locally or remotely)
- [AWS Account](https://aws.amazon.com/) (for SQS and SES)
- [Postman](https://www.postman.com/) (for API testing)

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/gpremp/order-processing-system.git
   cd order-processing-system
   ```

2. **Install Dependencies**

   Run the following command to install all dependencies:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   # MongoDB Configuration
   MONGO_URI=your-mongodb-connection-string

   # CORS Configuration
   CORS_ORIGIN=*

   # JWT Configuration
   ACCESS_TOKEN_SECRET=jwt-access-token-secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=jwt-refresh-token-secret
   REFRESH_TOKEN_EXPIRY=10d

   # Redis Configuration
   REDIS_USERNAME=your-redis-username
   REDIS_HOST=your-redis-host
   REDIS_PASSWORD=your-redis-password
   REDIS_PORT=your-redis-port

   # AWS Configuration
   REGION=your-aws-region
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_QUEUE_URL=your-aws-sqs-queue-url
   SES_SENDER_EMAIL=your-ses-sender-email
   ```

4. **Start MongoDB and Redis**

   Ensure that MongoDB and Redis are running on your machine. You can start them using the following commands:

   - For MongoDB:
     ```bash
     mongod
     ```

   - For Redis:
     ```bash
     redis-server
     ```

---

## Running the Application

To start the server, run the following command:

```bash
npm start
```

The server will start on `http://localhost:5000`.

---

## API Endpoints

### Authentication

- **User Registration**: `POST /api/auth/register`
  - Request Body:
    ```json
    {
      "name": "prem",
      "email": "gprmp@gmail.com",
      "password": "12345678"
    }
    ```

- **User Login**: `POST /api/auth/login`
  - Request Body:
    ```json
    {
      "email": "gpremp7736@gmail.com",
      "password": "12345678"
    }
    ```

- **Refresh Token**: `POST /api/auth/refresh-token`
  - Request Body:
    ```json
    {
      "refreshToken": "your-refresh-token"
    }
    ```

### Order Management

- **Create Order**: `POST /api/orders`
  - Request Body:
    ```json
    {
      "userId": "67dd24162b9a0873f14655af",
      "items": [
        {
          "productId": "12",
          "quantity": 2
        },
        {
          "productId": "123",
          "quantity": 1
        }
      ]
    }
    ```

- **Get All Orders**: `GET /api/orders`
  - Requires authentication.

- **Get Order by ID**: `GET /api/orders/:id`
  - Example: `GET /api/orders/ORD-1742468558137-884`
  - Requires authentication.

### Inventory Management

- **Create Inventory**: `POST /api/inventory`
  - Request Body:
    ```json
    {
      "productId": "1",
      "name": "apple",
      "stock": 10,
      "price": 200
    }
    ```

---

## Postman Collection

You can import the provided Postman collection to test the API endpoints. The collection includes examples for all the endpoints mentioned above.

1. Download the Postman collection file: [OrderProcessingSystem.postman_collection.json](./postman/OrderProcessingSystem.postman_collection.json).
2. Open Postman and click on **Import**.
3. Upload the JSON file or paste the raw JSON content.

---

## Environment Variables

The following environment variables are required to run the project:

- **MongoDB**: `MONGO_URI`
- **CORS**: `CORS_ORIGIN`
- **JWT**: `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRY`
- **Redis**: `REDIS_USERNAME`, `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`
- **AWS**: `REGION`, `AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_QUEUE_URL`, `SES_SENDER_EMAIL`

---


---


This `README.md` provides a comprehensive guide to setting up and running your Node.js project. It also includes references to the Postman collection for easy API testing.