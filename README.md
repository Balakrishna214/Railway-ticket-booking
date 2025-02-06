Here’s a comprehensive **README.md** file for your project. It includes instructions for setting up the project, installing dependencies, and details about all the routes and APIs.

---

# **Train Ticket Booking Backend project**

This is a **Train Booking Project** built using **Node.js**, **Express**, **MongoDB**, and **Mongoose**. It allows users to book and cancel train tickets, search for trains, and manage train data (for admins).

---

## **Table of Contents**

1. [Installation](#installation)
2. [Running the Project](#running-the-project)
3. [API Documentation](#api-documentation)
   - [Auth Routes](#auth-routes)
   - [Train Routes](#train-routes)
   - [Booking Routes](#booking-routes)
4. [Folder Structure](#folder-structure)
5. [Technologies Used](#technologies-used)
6. [Contributing](#contributing)
7. [License](#license)

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/train-booking-system.git
   cd train-booking-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     MONGO_URI=mongodb+srv://balakrishna:balakrishnaerotu@cluster0.4rtz1.mongodb.net/
     PORT=3009
      
     ```

4. Start the server:
   ```bash
   npm start
   ```

---

## **Running the Project**

1. Ensure MongoDB is running locally or update the `MONGO_URI` in `.env` to point to your MongoDB instance.
2. Use **Postman** or any API testing tool to test the endpoints.
3. For cookie-based authentication, ensure cookies are enabled in your API testing tool.

---

## **API Documentation**

### **Auth Routes**

#### **1. Signup**
- **URL**: `POST /api/auth/signup`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "Amurtha",
    "email": "amurtha@example.com",
    "password": "amurtha123",
    "role": "user" // Optional, default is "user"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User created successfully"
  }
  ```

#### **2. Login**
- **URL**: `POST /api/auth/login`
- **Description**: Log in a user and return a JWT token.
- **Request Body**:
  ```json
  {
    "name": "Balakrishna",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### **Train Routes**

#### **1. Add a Train (Admin Only)**
- **URL**: `POST /api/trains/addtrain`
- **Description**: Add a new train.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "trainName": "RGUKT EXPRESS",
    "departureTime": "08:00",
    "arrivalTime": "15:00",
    "source": "Vijayanagram",
    "destination": "Nuzvidu",
    "totalSeats": 500,
    "availableSeats": 490,
    "status": "Active"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "67a071a6dcf64730f7fe6952",
    "trainName": "RGUKT EXPRESS",
    "departureTime": "08:00",
    "arrivalTime": "15:00",
    "source": "Vijayanagram",
    "destination": "Nuzvidu",
    "totalSeats": 500,
    "availableSeats": 490,
    "status": "Active"
  }
  ```

#### **2. Get All Trains**
- **URL**: `GET /api/trains`
- **Description**: Fetch all trains.
- **Response**:
  ```json
  [
    {
      "_id": "67a071a6dcf64730f7fe6952",
      "trainName": "RGUKT EXPRESS",
      "departureTime": "08:00",
      "arrivalTime": "15:00",
      "source": "Vijayanagram",
      "destination": "Nuzvidu",
      "totalSeats": 500,
      "availableSeats": 490,
      "status": "Active"
    }
  ]
  ```

#### **3. Search Trains**
- **URL**: `GET /api/trains/search?from=Vijayanagram&to=Nuzvidu`
- **Description**: Search trains by source and destination.
- **Response**:
  ```json
  [
    {
      "_id": "67a071a6dcf64730f7fe6952",
      "trainName": "RGUKT EXPRESS",
      "departureTime": "08:00",
      "arrivalTime": "15:00",
      "source": "Vijayanagram",
      "destination": "Nuzvidu",
      "totalSeats": 500,
      "availableSeats": 490,
      "status": "Active"
    }
  ]
  ```

---

### **Booking Routes**

#### **1. Book a Ticket**
- **URL**: `POST /api/bookings`
- **Description**: Book a ticket for a specific train.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "trainId": "67a071a6dcf64730f7fe6952",
    "seatsBooked": 2
  }
  ```
- **Response**:
  ```json
  {
    "message": "Ticket booked successfully",
    "user": {
      "name": "Madan",
      "email": "madan@example.com"
    },
    "train": {
      "trainName": "RGUKT EXPRESS",
      "source": "Vijayanagram",
      "destination": "Nuzvidu",
      "departureTime": "08:00",
      "arrivalTime": "15:00"
    },
    "booking": {
      "bookingId": "67a071a6dcf64730f7fe6953",
      "seatsBooked": 2,
      "status": "Booked"
    }
  }
  ```

#### **2. Cancel a Ticket**
- **URL**: `PUT /api/bookings/:id/cancel`
- **Description**: Cancel a booked ticket.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Ticket cancelled successfully",
    "user": {
      "name": "Madan",
      "email": "madan@example.com"
    },
    "train": {
      "trainName": "RGUKT EXPRESS",
      "source": "Vijayanagram",
      "destination": "Nuzvidu",
      "departureTime": "08:00",
      "arrivalTime": "15:00"
    },
    "booking": {
      "bookingId": "67a071a6dcf64730f7fe6953",
      "seatsBooked": 2,
      "status": "Cancelled"
    }
  }
  ```

---

## **Folder Structure**

```
train-booking-system/
├── models/
│   ├── User.js
│   ├── Train.js
│   ├── Booking.js
├── routes/
│   ├── authRoutes.js
│   ├── trainRoutes.js
│   ├── bookingRoutes.js
├── middleware/
│   ├── authMiddleware.js
├── .env
├── app.js
├── server.js
├── package.json
├── README.md
```

---

## **Technologies Used**

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API Testing**: Postman

---

 
