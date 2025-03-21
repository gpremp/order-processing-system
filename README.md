Below is a `README.md` file for your Node.js project. It includes instructions for setting up and running the project, as well as references to the Postman collection for API testing.

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

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or remotely)
- [Redis](https://redis.io/) (running locally or remotely)
- [AWS Account](https://aws.amazon.com/) (for SQS and SES)
- [Postman](https://www.postman.com/) (for API testing)

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/order-processing-system.git
   cd order-processing-system
   ```

2. **Install Dependencies**

   Run the following command to install all dependencies:

   ```bash
   npm install
   ```


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

1. Download the Postman collection file:
2. Open Postman and click on **Import**.
3. Upload the JSON file or paste the raw JSON content.

---

## Environment Variables

The following environment variables are required to run the project:

- **MongoDB**: `MONGO_URI`
- **Redis**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **JWT**: `JWT_SECRET`
- **AWS**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`

---


This `README.md` provides a comprehensive guide to setting up and running your Node.js project. It also includes references to the Postman collection for easy API testing.