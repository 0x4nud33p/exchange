# **Social Media App API**

A **backend API** for a social media platform developed using the **Node.js stack** (MongoDB, Express.js, Node.js) with real-time capabilities powered by **WebSockets (Socket.io)**. This API supports essential features like user authentication, post creation, commenting, and real-time messages.

---

## **Features**

- User Authentication (JWT-based).
- CRUD operations for posts and comments.
- Real-time chat and notifications using WebSockets.
- MongoDB for database management.
- Cloud deployment for production readiness.

---

## **Requirements**

- Node.js
- MongoDB

---

## **Steps to Run Locally**

1. Clone the repository:

    ```bash
    git clone https://github.com/anudeep009/social-media-api
    ```

2. Navigate to the project directory:

    ```bash
    cd social-media-app
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and configure the following variables:

    ```env
    PORT=5000
    MONGO_USERNAME=your_mongo_username
    MONGO_PASSWORD=your_mongo_password
    JWT_SECRET=your_jwt_secret
    ```

5. Start the server:

    ```bash
    npm start
    ```

---

## **API Endpoints**

### **Authentication**

#### **1. Sign Up**

- **Endpoint**: `POST /api/v1/user/signup`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "securepassword"
    }
    ```
- **Response**:
    ```json
    {
      "message": "User created successfully",
      "user": {
        "id": "12345",
        "name": "John Doe",
        "email": "johndoe@example.com"
      }
    }
    ```

#### **2. Login**

- **Endpoint**: `POST /api/v1/user/signin`
- **Description**: Authenticates an existing user and returns a JWT token.
- **Request Body**:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "securepassword"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Login successful",
      "token": "your_jwt_token"
    }
    ```

---

### **Posts**

#### **1. Create Post**

- **Endpoint**: `POST /api/v1/user/posts`
- **Description**: Creates a new post.
- **Headers**:
    ```json
    {
      "Authorization": "Bearer your_jwt_token"
    }
    ```
- **Request Body**:
    ```json
    {
      "text": "This is my first post!",
      "mediaUrl": "https://example.com/image.png"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Post created successfully",
      "post": {
        "id": "67890",
        "text": "This is my first post!",
        "mediaUrl": "https://example.com/image.png",
        "timestamp": "2024-11-24T10:00:00.000Z"
      }
    }
    ```

#### **2. List Posts**

- **Endpoint**: `GET /api/v1/user/posts`
- **Description**: Fetches all posts.
- **Response**:
    ```json
    [
      {
        "id": "67890",
        "text": "This is my first post!",
        "mediaUrl": "https://example.com/image.png",
        "timestamp": "2024-11-24T10:00:00.000Z"
      }
    ]
    ```

---

### **Comments**

#### **1. Add Comment**

- **Endpoint**: `POST /api/v1/user/comments`
- **Description**: Adds a comment to a post.
- **Headers**:
    ```json
    {
      "Authorization": "Bearer your_jwt_token"
    }
    ```
- **Request Body**:
    ```json
    {
      "postId": "67890",
      "text": "Nice post!"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Comment added successfully",
      "comment": {
        "id": "54321",
        "postId": "67890",
        "text": "Nice post!",
        "timestamp": "2024-11-24T10:30:00.000Z"
      }
    }
    ```

---

### **Real-Time Chat**

#### **1. Connect WebSocket**

- **Description**: Connects to the WebSocket server for real-time notifications and chat.
- **URL**: `https://social-media-api-b2i6.onrender.com`
- **Events**:
    - **Send Message**:
        ```json
        {
          "type": "send_message",
          "data": {
            "toUserId": "12345",
            "message": "Hello!"
          }
        }
        ```
    - **Receive Message**:
        ```json
        {
          "type": "receive_message",
          "data": {
            "fromUserId": "67890",
            "message": "Hi there!"
          }
        }
        ```

---

## **Database Schema**

### **1. User**
| Field     | Type   | Description       |
|-----------|--------|-------------------|
| `id`      | String | Unique identifier |
| `name`    | String | User's name       |
| `email`   | String | User's email      |
| `password`| String | Hashed password   |

### **2. Post**
| Field       | Type   | Description                |
|-------------|--------|----------------------------|
| `id`        | String | Unique identifier          |
| `userId`    | String | Reference to the user      |
| `text`      | String | Post content               |
| `mediaUrl`  | String | URL of the attached media  |
| `timestamp` | Date   | Timestamp of the post      |

### **3. Comment**
| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| `id`        | String | Unique identifier            |
| `postId`    | String | Reference to the post        |
| `userId`    | String | Reference to the user        |
| `text`      | String | Comment content             |
| `timestamp` | Date   | Timestamp of the comment     |

---

## **Deployment**

The project has been deployed to a cloud platform for production readiness.  
- **Live Demo**: [[Insert Deployed Link Here]](https://social-media-api-b2i6.onrender.com)(#)

---

## **Contributing**

Contributions are welcome! Feel free to submit a pull request or raise an issue.

---

## **License**

This project is licensed under the MIT License.
