# Event Management System

## Overview

This is a simple event management system built using Node.js with Sequelize ORM and SQLite as the database. The application allows users to create, update, delete, and register for events. Admin users have the ability to perform CRUD operations on events, while regular users can register for events. Additionally, a notification email is sent to users upon successful registration.

## Features

- **User Management**: Register, login, and manage users with different roles (admin and regular users).
- **Event Management**: Admin users can create, update, and delete events.
- **Event Registration**: Regular users can register for events, and a notification email is sent to them upon successful registration.
- **Authentication**: Users authenticate using email and password with token-based sessions.
- **Email Notification**: An email is sent upon successful registration, event update, and event deletion.


## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/event-management-system.git
   cd event-management-system

2. **Install Dependencies**

   ```bash
   npm install

3. **Set Up Environment Variables**
    Add your Email and password in the .env file.

   ```bash
   EMAIL=EMAIL_ADDRESS
   PASSWORD=PASSWORD
    
    Do the following to get the password:

    1.Go to your Google account at https://myaccount.google.com/
    2.Go to Security
    3.Choose 2-Step Verification - here you have to verify yourself, in my case it was with phone number and a confirmation code send as text message. After that you will be able to enabled 2-Step Verification
    4.Visit https://myaccount.google.com/apppasswords to create your app.
    5.Put a name e.g. nodemailer to your app and create it.
    6.A modal dialog will appear with the password. Get that password and use it in your code

3. **Run the Application**

   ```bash
   node app.js


## API Endpoints

### User Management

- **Register User**
  - **Endpoint**: `POST /users/register`
  - **Body**:
    ```json
    {
      "name" : "test",
      "email": "user@example.com",
      "password": "password123",
      "role": "admin" 
    }
    ```
    possible values for role: 'admin' , 'user'

- **Login User**
  - **Endpoint**: `POST /users/login`
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**:
    ```json
    {
        "status": 200,
        "message": "Authencation Success",
        "token": "jwt-token"
    }
    ```

### Event Management (Admin Only)

- **Create Event**
  - **Endpoint**: `POST /events`
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Body**:
    ```json
    {
      "name": "Event Name",
      "date": "2024-08-01",
      "time": "15:00:00",
      "description": "Event Description"
    }
    ```

- **Update Event**
  - **Endpoint**: `PUT /events/:id`
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Body**:
    ```json
    {
      "name": "Updated Event Name",
      "date": "2024-08-01",
      "time": "15:00:00",
      "description": "Updated Description"
    }
    ```

- **Delete Event**
  - **Endpoint**: `DELETE /events/:id`
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```

- **Get Events**
  - **Endpoint**: `GET /events`
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```

### Event Registration

- **Register for Event**
  - **Endpoint**: `POST /events/:event_id/register`
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```



  - **Response**: A confirmation email will be sent to the user upon successful registration.

- **Get User Registrations**
  - **Endpoint**: `GET /events/`
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```

    **Response**: list of registered events

   